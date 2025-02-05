from rest_framework import serializers
from .models import Stamp

class StampSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stamp
        fields = ['name', 'shape', 'text', 'text_x', 'text_y', 'image']
        read_only_fields = ['user']  # User is set automatically
