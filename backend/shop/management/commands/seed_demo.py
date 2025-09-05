from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from shop.models import Product


class Command(BaseCommand):
    help = "Seed demo products and create an admin user"

    def handle(self, *args, **options):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            self.stdout.write(self.style.SUCCESS('Created admin user admin/admin123'))
        else:
            self.stdout.write('Admin user already exists')

        demo = [
            {
                'name': 'Wireless Headphones',
                'description': 'Noise-cancelling over-ear headphones with 30h battery.',
                'price': 129.99,
                'image_url': '',
                'stock': 50,
            },
            {
                'name': 'Smart Watch',
                'description': 'Fitness tracking and notifications on your wrist.',
                'price': 89.99,
                'image_url': '',
                'stock': 80,
            },
            {
                'name': 'Bluetooth Speaker',
                'description': 'Portable speaker with rich bass and crisp highs.',
                'price': 59.99,
                'image_url': '',
                'stock': 100,
            },
        ]

        for d in demo:
            obj, created = Product.objects.get_or_create(name=d['name'], defaults=d)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created product: {obj.name}"))
            else:
                # Update image to a more relatable one if different
                changed = False
                if obj.image_url != d['image_url']:
                    obj.image_url = d['image_url']
                    changed = True
                if changed:
                    obj.save(update_fields=['image_url'])
                    self.stdout.write(self.style.SUCCESS(f"Updated image for: {obj.name}"))
                else:
                    self.stdout.write(f"Product exists: {obj.name}")

        self.stdout.write(self.style.SUCCESS('Seeding complete.'))


