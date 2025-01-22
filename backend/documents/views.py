
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Document
from .serializers import DocumentSerializer
from rest_framework.permissions import AllowAny
class UploadDocumentView(APIView):
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
        

class DocumentDetailView(APIView):
    def get(self, request, pk):
        try:
            # Retrieve the document by ID (pk) for the authenticated user
            document = Document.objects.get(pk=pk, user=request.user)
            serializer = DocumentSerializer(document)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            document = Document.objects.get(pk=pk, user=request.user)
            document.delete()
            return Response({"message": "Document deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)


class StampDocumentView(APIView):
    #permission_classes = [AllowAny]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            document = Document.objects.get(pk=pk, user=request.user)
            if document.stamped:
                return Response({"error": "Document already stamped"}, status=status.HTTP_400_BAD_REQUEST)
            document.stamped = True
            document.metadata = {
                **(document.metadata or {}),
                "stamped_at": str(document.updated_at),
                "stamped_by": request.user.username,
            }
            document.save()
            serializer = DocumentSerializer(document)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)
