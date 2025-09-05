from django.contrib import admin
from .models import Product, Order, OrderItem, CartItem, UserProfile


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    list_display = ("id", "user", "status", "total_amount", "created_at")
    list_filter = ("status", "created_at")


admin.site.register(Product)
admin.site.register(CartItem)
admin.site.register(UserProfile)

from django.contrib import admin

# Register your models here.
