from rest_framework import serializers
from .models import Document
from django.conf import settings


class DocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    print(file_url)

    class Meta:
        model = Document
        fields = ['id', 'user', 'file', 'file_url',
                  'stamped', 'metadata',
                  'created_at', 'updated_at']
        read_only_fields = ['user', 'stamped', 'created_at', 'updated_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(
                settings.MEDIA_URL + str(obj.file))
        return settings.MEDIA_URL + str(obj.file)


class StampDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['stamped']
