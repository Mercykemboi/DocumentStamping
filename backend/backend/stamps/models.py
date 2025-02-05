# # Create your models here.
# from django.db import models


# class Stamp(models.Model):
#     name = models.CharField(max_length=255)
#     description = models.TextField(blank=True, null=True)
#     price = models.DecimalField(max_digits=10, decimal_places=2)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     image = models.ImageField(upload_to='stamps/', default='stamps/default.png')

#     def __str__(self):
#         return self.name
from django.db import models
from django.conf import settings

class Stamp(models.Model):
    SHAPE_CHOICES = [
        ('circle', 'Circle'),
        ('rectangle', 'Rectangle'),
        ('oval', 'Oval'),
        ('square', 'Square'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=255)
    shape = models.CharField(max_length=20, choices=SHAPE_CHOICES, default='circle')
    text = models.TextField(blank=True, null=True)  # Text inside stamp
    text_x = models.IntegerField(default=0)  # X position of text
    text_y = models.IntegerField(default=0)  # Y position of text
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='stamps/', default='stamps/default.png', blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.shape})"

class QRCode(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stamp = models.ForeignKey(Stamp, on_delete=models.CASCADE, related_name="qrcode")
    qr_data = models.TextField()  # Data encoded in the QR code
    qr_code_image = models.ImageField(upload_to='qrcodes/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"QR Code for {self.stamp.name}"
