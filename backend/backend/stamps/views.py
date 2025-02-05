from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Stamp
from .serializers import StampSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

class CreateStampView(APIView):
    permission_classes = [AllowAny]
    print('creating')
    def post(self, request):
        print("Files in request:", request.FILES)
        print("Data in request:", request.data)
        print("User in request:", request.user)
        request_data = request.data.copy()
        request_data['user'] = request.user.id  # Assign the logged-in user

        serializer = StampSerializer(data=request_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListStampsView(APIView):
    # Assuming you have an ImageField for the image in your model
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        stamps = Stamp.objects.all()  # You can filter based on the user if needed
        serializer = StampSerializer(stamps, many=True, context={'request': request})
        return Response(serializer.data)
