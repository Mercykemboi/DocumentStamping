from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('individual', 'Individual'),
        ('company', 'Company'),
    )

    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='individual')
    is_verified = models.BooleanField(default=False)  # Email verification
    otp_verified = models.BooleanField(default=False)  # OTP for stamp creation
    otp_code = models.CharField(max_length=6, blank=True, null=True)  # Store OTP
    

    def __str__(self):
        return self.username
