from rest_framework import serializers
from .models import GalleryEntry

class GalleryEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryEntry
        fields = '__all__'
