from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Add any additional fields here if needed
   # phone_number = models.CharField(max_length=15, blank=True, null=True)
   # address = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.username
