from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
import random
import string
import fitz  # PyMuPDF for PDF handling
from io import BytesIO
from django.core.files.base import ContentFile
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Stamp
from .serializers import StampSerializer
from django.core.files.storage import default_storage
from urllib.parse import urlparse
import os
from PIL import Image as PILImage
from datetime import datetime
from PIL import ImageDraw, ImageFont

# Temporary storage for OTPs (you can use Redis or a model in production)
OTP_STORAGE = {}

class CreateStampView(APIView):
    permission_classes = [AllowAny]

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
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        stamps = Stamp.objects.all()  # You can filter based on the user if needed
        serializer = StampSerializer(stamps, many=True, context={'request': request})
        return Response(serializer.data)


class GenerateOTPView(APIView):
    """Generates and sends an OTP to the user before stamping."""

    permission_classes = [AllowAny]

    def post(self, request):
        user = request.user
        otp = ''.join(random.choices(string.digits, k=6))  # Generate 6-digit OTP
        OTP_STORAGE[user.id] = otp  # Store OTP temporarily

        # Simulating sending OTP via email (replace this with actual email sending)
        send_mail(
            "Your Document Stamping OTP",
            f"Your OTP for stamping the document is: {otp}",
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

        return Response({"message": "OTP sent successfully!"}, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    """Verifies OTP before allowing stamping."""

    permission_classes = [AllowAny]  # Adjust if needed

    def post(self, request):
        user = request.user

        if not user or not user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        otp_received = request.data.get("otp")

        print(f"Stored OTP for user {user.id}: {OTP_STORAGE.get(user.id)}")
        print(f"Received OTP: {otp_received}")

        # Validate OTP
        if OTP_STORAGE.get(user.id) != otp_received:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "OTP verified successfully! Proceed to stamping."}, status=status.HTTP_200_OK)


class StampDocumentView(APIView):
    """Applies a stamp to the document only if OTP was already verified."""
    permission_classes = [AllowAny]

    def post(self, request):
        user = request.user
        print("👤 User:", user, "Authenticated:", user.is_authenticated)

        # Ensure user is authenticated
        if not user or not user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        # Check OTP verification
        if user.id not in OTP_STORAGE:
            print("❌ OTP not verified for user:", user.id)
            return Response({"error": "OTP not verified. Please verify OTP first."}, status=status.HTTP_400_BAD_REQUEST)
        print("✅ OTP verified for user:", user.id)

        stamp_id = request.data.get("stamp_id")
        document_url = request.data.get("document_url")
        position_x = int(request.data.get("x", 100))
        position_y = int(request.data.get("y", 100))

        print("🔖 Stamp ID:", stamp_id, "📄 Document URL:", document_url)

        try:
            stamp = Stamp.objects.get(id=stamp_id)
            print("✅ Stamp found:", stamp)
        except Stamp.DoesNotExist:
            print(f"❌ Stamp with ID {stamp_id} not found for user {user.id}")
            return Response({"error": "Stamp not found"}, status=status.HTTP_404_NOT_FOUND)

        # Ensure document exists
        parsed_url = urlparse(document_url)
        document_path = parsed_url.path.lstrip('/')
        if document_path.startswith('media/'):
            document_path = document_path[len('media/'):]

        file_path = os.path.join(settings.MEDIA_ROOT, document_path)
        print("Direct File Path:", file_path)

        if not os.path.exists(file_path):
            print("❌ Document not found at path:", file_path)
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

        print("📄 Document exists at path:", file_path)

        # Call the apply_stamp function for PDF or image
        try:
            # Generate serial number
            serial_number = self.generate_serial_number()

            # Apply stamp to document
            stamped_document = self.apply_stamp(document_url, stamp.image.path, position_x, position_y, user, serial_number)
            return Response(stamped_document, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"❌ Error during stamping: {e}")
            return Response({"error": "Error during stamping"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def apply_stamp(self, document_url, stamp_image_path, position_x, position_y, user, serial_number):
        """Apply stamp to either a PDF or image document."""
        if document_url.lower().endswith('.pdf'):
            return self.stamp_pdf(document_url, stamp_image_path, position_x, position_y, user, serial_number)
        else:
            return self.stamp_image(document_url, stamp_image_path, position_x, position_y, user, serial_number)

    def stamp_pdf(self, document_url, stamp_image_path, position_x, position_y, user, serial_number):
        """Stamp a PDF document."""
        # Load the PDF
        parsed_url = urlparse(document_url)
        document_path = os.path.join(settings.MEDIA_ROOT, parsed_url.path)

        with default_storage.open(document_path, "rb") as doc_file:
            pdf_bytes = BytesIO(doc_file.read())

        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")

        # Load the stamp image
        with default_storage.open(stamp_image_path, 'rb') as stamp_file:
            stamp_image_bytes = BytesIO(stamp_file.read())

        # Apply stamp to the first page
        page = pdf_document[0]
        page.insert_image(fitz.Rect(position_x, position_y, position_x + 150, position_y + 150), stream=stamp_image_bytes)

        # Save the stamped document
        stamped_pdf_bytes = BytesIO()
        pdf_document.save(stamped_pdf_bytes)
        pdf_document.close()

        stamped_pdf_bytes.seek(0)
        stamped_file = ContentFile(stamped_pdf_bytes.read(), name=f"stamped_document_{serial_number}.pdf")

        # Save to storage
        stamped_pdf_path = f"stamped_documents/stamped_document_{serial_number}.pdf"
        saved_path = default_storage.save(stamped_pdf_path, stamped_file)

        stamped_url = default_storage.url(saved_path)
        return {"message": "Document stamped successfully!", "stamped_url": stamped_url, "serial_number": serial_number}

    def stamp_image(self, document_url, stamp_image_path, position_x, position_y, user, serial_number):
        """Stamp an image document and add the serial number at the bottom."""
        parsed_url = urlparse(document_url)
        document_path = parsed_url.path.lstrip('/')
        if document_path.startswith('media/'):
            document_path = document_path[len('media/'):]

        print("🚀 Starting image stamping process...")

        try:
            print("🔍 Opening document image...")
            # Read the document image into memory
            with default_storage.open(document_path, 'rb') as doc_file:
                doc_image_bytes = doc_file.read()
                img = PILImage.open(BytesIO(doc_image_bytes))

            # Read the stamp image into memory
            with default_storage.open(stamp_image_path, 'rb') as stamp_file:
                stamp_image_bytes = stamp_file.read()
                stamp_img = PILImage.open(BytesIO(stamp_image_bytes))

            print("🔍 Opening stamp image...")

            # Ensure stamp image has RGBA mode for transparency handling
            stamp_img = stamp_img.convert("RGBA")

            # 🟢 Apply Stamp Image
            img.paste(stamp_img, (position_x, position_y), stamp_img.convert("RGBA").split()[3])

            # 🟢 Embed Serial Number in Image
            draw = ImageDraw.Draw(img)

            # Load a proper font (ensure Arial is available, otherwise fallback)
            try:
                font = ImageFont.truetype("arial.ttf", 30)  # Use Arial if available
            except IOError:
                font = ImageFont.load_default()  # Fallback font

            print("✅ Stamp applied!")

            # Get the bounding box of the text
            text = f"Serial Number: {serial_number}"
            print("🔢 Serial Number:", text)
            text_bbox = draw.textbbox((0, 0), text, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_height = text_bbox[3] - text_bbox[1]

            # Draw the serial number text at the bottom
            draw.text(
                ((img.width - text_width) / 2, img.height - text_height - 10),
                text, font=font, fill=(0, 0, 0)
            )

            # Save and return the stamped image
            stamped_image_bytes = BytesIO()
            img.save(stamped_image_bytes, format='PNG')
            stamped_image_bytes.seek(0)

            stamped_file = ContentFile(stamped_image_bytes.read(), name=f"stamped_document_{serial_number}.png")
            stamped_image_path = f"stamped_documents/stamped_document_{serial_number}.png"
            saved_path = default_storage.save(stamped_image_path, stamped_file)

            stamped_image_url = f"http://127.0.0.1:8000/media/{saved_path}"
            return {"message": "Image stamped successfully!", "stamped_url": stamped_image_url, "serial_number": serial_number}

        except Exception as e:
            print("❌ Error during image stamping:", e)
            raise e

    def generate_serial_number(self):
        """Generate a unique serial number."""
        return datetime.now().strftime("%Y%m%d%H%M%S") + ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
