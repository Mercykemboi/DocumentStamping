

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from django.http import JsonResponse
# from django.core.files.base import ContentFile
# import json
# import base64
# from .models import Stamp
# from .serializers import StampSerializer


# class StampListCreateView(APIView):
#     permission_classes = [AllowAny]  # Allow anyone to fetch or create stamps

#     def get(self, request):
#         """Fetch all saved stamps"""
#         stamps = Stamp.objects.all()
#         serializer = StampSerializer(stamps, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def post(self, request):
#         """Save a new stamp"""
#         serializer = StampSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class StampDetailView(APIView):
#     permission_classes = [IsAuthenticated]  # Requires authentication for individual stamp operations

#     def get(self, request, pk):
#         """Fetch a single stamp"""
#         try:
#             stamp = Stamp.objects.get(pk=pk)
#             serializer = StampSerializer(stamp)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except Stamp.DoesNotExist:
#             return Response({"error": "Stamp not found"}, status=status.HTTP_404_NOT_FOUND)

#     def put(self, request, pk):
#         """Update an existing stamp"""
#         try:
#             stamp = Stamp.objects.get(pk=pk)
#             serializer = StampSerializer(stamp, data=request.data)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response(serializer.data, status=status.HTTP_200_OK)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         except Stamp.DoesNotExist:
#             return Response({"error": "Stamp not found"}, status=status.HTTP_404_NOT_FOUND)

#     def delete(self, request, pk):
#         """Delete a stamp"""
#         try:
#             stamp = Stamp.objects.get(pk=pk)
#             stamp.delete()
#             return Response({"message": "Stamp deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
#         except Stamp.DoesNotExist:
#             return Response({"error": "Stamp not found"}, status=status.HTTP_404_NOT_FOUND)


# # @method_decorator(csrf_exempt, name="dispatch")
# class SaveStampView(APIView):
#     print("logging")
#     permission_classes = [AllowAny]  # Allow users to upload stamps without authentication

#     def post(self, request):
#         """Save an uploaded stamp from base64"""
#         try:
#             data = json.loads(request.body)
#             image_data = data.get("image")

#             if not image_data:
#                 return JsonResponse({"error": "No image data provided"}, status=400)

#             # Decode base64
#             format, imgstr = image_data.split(";base64,")
#             ext = format.split("/")[-1]
#             image_file = ContentFile(base64.b64decode(imgstr), name=f"stamp.{ext}")

#             # Save Stamp
#             stamp = Stamp(image=image_file)
#             stamp.save()

#             return JsonResponse({"imageUrl": stamp.image.url}, status=201)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=400)


# class GetStampsView(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request):
#         """Retrieve all saved stamps"""
#         stamps = Stamp.objects.all()
#         return JsonResponse([{"imageUrl": stamp.image.url} for stamp in stamps], safe=False, status=200)
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Stamp
from .serializers import StampSerializer

class CreateStampView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StampSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ListStampsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StampSerializer

    def get_queryset(self):
        return Stamp.objects.filter(user=self.request.user)
