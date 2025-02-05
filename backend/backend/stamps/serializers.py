# from rest_framework import serializers
# from .models import Stamp


# class StampSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Stamp
#         fields = '__all__'
from rest_framework import serializers
from .models import Stamp

class StampSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stamp
        fields = ['id', 'user', 'name', 'shape', 'text', 'created_at']
        read_only_fields = ['user', 'created_at']
