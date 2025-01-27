from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Document
from django.http import FileResponse
from .serializers import DocumentSerializer
from rest_framework.permissions import AllowAny
from django.core.files.base import ContentFile
from django.utils.timezone import now
import io
from django.http import HttpResponse
from PIL import Image, ImageDraw, ImageFont
from pdf2image import convert_from_path
from io import BytesIO
from .models import Document
from django.conf import settings
import os

class UploadDocumentView(APIView):
    print("uploading")
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def post(self, request):
        # Check if a file is included in the request
        print("Files in request:", request.FILES)
        print("Data in request:", request.data)
        print("User in request:", request.user)

        if 'file' not in request.FILES:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = DocumentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDocumentsView(APIView):
    permission_classes = [AllowAny]  # Only authenticated users can access

    def get(self, request):
        try:
            # Retrieve all documents for the authenticated user
            documents = Document.objects.filter(user=request.user)
            serializer = DocumentSerializer(documents, many=True)  # Serialize multiple documents
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "An error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DocumentDetailView(APIView):
    permission_classes = [AllowAny]  # Adjust based on your authentication needs

    def get(self, request, pk):
        try:
            document = Document.objects.get(pk=pk, user=request.user)
            # Get the URL for the file
            document_url = document.file.url  # This gives the relative URL of the file
            print('document', document_url)
            # Return the file URL in the response
            return Response({"file_url": document_url}, status=200)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=404)

    def delete(self, request, pk):
        try:
            document = Document.objects.get(pk=pk, user=request.user)
            document.delete()
            return Response({"message": "Document deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)


class StampDocumentView(APIView):
    permission_classes = [AllowAny]  # Adjust this based on your requirements

    def post(self, request, pk):
        try:
            document = Document.objects.get(pk=pk, user=request.user)

            if document.stamped:
                return Response({"error": "Document already stamped"}, status=status.HTTP_400_BAD_REQUEST)

            # Apply the stamp to the document and get the stamped file
            stamped_file = self.create_stamped_image(document)

            # Save the stamped file to the document or elsewhere
            stamped_file_path = self.save_stamped_file(stamped_file, document)

            # Update document metadata and save
            document.stamped = True
            document.file = stamped_file_path
            document.metadata = {
                **(document.metadata or {}),
                "stamped_at": str(document.updated_at),
                "stamped_by": request.user.username,
                "file_url": stamped_file_path
            }
            document.save()
            print(stamped_file_path)

            # Return the stamped document data in the response
            return Response({
                "file_url": f"{settings.MEDIA_URL}{stamped_file_path}"
            }, status=status.HTTP_200_OK)

        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

    def create_stamped_image(self, document):
        # Open the document file (assuming it's an image for this example)
        image = Image.open(document.file.path)

        # Create a drawing context on the image
        draw = ImageDraw.Draw(image)
        stamp_text = "STAMP"
        font = ImageFont.load_default()

        # Get text bounding box
        bbox = draw.textbbox((0, 0), stamp_text, font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        # Position the stamp at the bottom-right corner
        width, height = image.size
        position = (width - text_width - 10, height - text_height - 10)

        # Draw the stamp
        draw.text(position, stamp_text, font=font, fill="red")

        return image

    def save_stamped_file(self, stamped_image, document):
        # Ensure the path is under MEDIA_ROOT
        stamped_file_path = os.path.join('stamped_documents', f"{document.id}_stamped.png")

        # Ensure the directory exists
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'stamped_documents'), exist_ok=True)

        # Save the stamped image to the file system
        stamped_image.save(os.path.join(settings.MEDIA_ROOT, stamped_file_path))

        return stamped_file_path
