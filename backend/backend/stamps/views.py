# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Stamp
from .serializers import StampSerializer
from rest_framework.permissions import AllowAny


class StampListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        stamps = Stamp.objects.all()
        serializer = StampSerializer(stamps, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = StampSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StampDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            stamp = Stamp.objects.get(pk=pk)
            serializer = StampSerializer(stamp)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Stamp.DoesNotExist:
            return Response({"error": "Stamp not found"},
                            status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            stamp = Stamp.objects.get(pk=pk)
            serializer = StampSerializer(stamp, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        except Stamp.DoesNotExist:
            return Response({"error": "Stamp not found"},
                            status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            stamp = Stamp.objects.get(pk=pk)
            stamp.delete()
            return Response({"message": "Stamp deleted successfully"},
                            status=status.HTTP_204_NO_CONTENT)
        except Stamp.DoesNotExist:
            return Response({"error": "Stamp not found"},
                            status=status.HTTP_404_NOT_FOUND)
