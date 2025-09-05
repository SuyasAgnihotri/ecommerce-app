from django.db import transaction
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Product, CartItem, Order, OrderItem, UserProfile
from .serializers import (
    ProductSerializer,
    CartItemSerializer,
    OrderSerializer,
    UserSerializer,
    RegisterSerializer,
    UserProfileSerializer,
)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def random(self, request):
        # Return a random list of products. Optional ?limit= parameter (default 8, max 50)
        limit_raw = request.query_params.get('limit', '8')
        try:
            limit = max(1, min(int(limit_raw), 50))
        except (TypeError, ValueError):
            limit = 8
        products = Product.objects.order_by('?')[:limit]
        return Response(self.get_serializer(products, many=True).data)


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user).select_related('product')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def clear(self, request):
        self.get_queryset().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__product')

    @action(detail=False, methods=['post'])
    def checkout(self, request):
        user = request.user
        cart_items = CartItem.objects.filter(user=user).select_related('product')
        if not cart_items.exists():
            return Response({'detail': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        # Pre-validate stock to avoid partial writes and 500 errors
        for item in cart_items:
            if item.product.stock < item.quantity:
                return Response(
                    {'detail': f'Insufficient stock for {item.product.name}'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        with transaction.atomic():
            order = Order.objects.create(user=user, status='pending', total_amount=0)
            total = 0
            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    unit_price=item.product.price,
                )
                item.product.stock -= item.quantity
                item.product.save(update_fields=['stock'])
                total += item.quantity * item.product.price
            order.total_amount = total
            order.status = 'paid'
            order.save(update_fields=['total_amount', 'status'])
            cart_items.delete()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class ProfileViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        user = request.user
        return Response(UserSerializer(user).data)

    def update(self, request):
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)
        serializer = UserProfileSerializer(instance=profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(user).data)


class RegisterViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

from django.shortcuts import render

# Create your views here.
