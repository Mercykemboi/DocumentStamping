from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'user', 'file', 'stamped', 'metadata', 'created_at', 'updated_at']
        read_only_fields = ['user', 'stamped', 'created_at', 'updated_at']


# from rest_framework.exceptions import ValidationError

# class DocumentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Document
#         fields = ['id', 'user', 'file', 'stamped', 'metadata', 'created_at', 'updated_at']
#         read_only_fields = ['user', 'stamped', 'created_at', 'updated_at']

#     def validate_file(self, value):
#         if not value.name.endswith(('.pdf', '.docx', '.jpg')):  # Allowed extensions
#             raise ValidationError("Unsupported file format. Please upload a valid file.")
#         return value
    
class StampDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['stamped']

