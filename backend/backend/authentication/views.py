# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
import random
import logging

User = get_user_model()

logger = logging.getLogger(__name__)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Assign user type (Company or Individual)
            user.user_type = request.data.get("user_type", "individual")
            user.is_verified = False
            user.otp_verified = False
            user.otp_code = str(random.randint(100000, 999999))  # Generate OTP
            user.save()

            # Send OTP via Email
            send_mail(
                subject="Verify Your Account",
                message=f"Your OTP is: {user.otp_code}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

            return Response({
                "message": "OTP sent. Please verify.",
                "user": {"id": user.id, "email": user.email}
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)

            if user.is_verified:
                return Response({"message": "Email already verified."}, status=status.HTTP_200_OK)

            user.is_verified = True
            user.save()
            return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)




class OTPVerificationView(APIView):
    permission_classes = [AllowAny]  # ✅ Allow all users to verify OTP

    def post(self, request):
        user_id = request.data.get("user_id")
        otp_code = request.data.get("otp_code")

        try:
            user = User.objects.get(id=user_id)
            if user.otp_code == otp_code:
                user.is_verified = True  # ✅ Mark user as verified
                user.otp_verified = True
                user.otp_code = None  # ✅ Clear OTP after verification
                user.save()
                return Response({"message": "OTP verified successfully!"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)

            if user:
                if not user.is_verified:
                    return Response({"error": "Email not verified"}, status=status.HTTP_403_FORBIDDEN)

                if not user.otp_verified:
                    return Response({"error": "OTP not verified"}, status=status.HTTP_403_FORBIDDEN)

                refresh = RefreshToken.for_user(user)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": UserSerializer(user).data
                })

            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        
class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.data.get("user_id")

        try:
            user = User.objects.get(id=user_id)

            # Generate a new OTP
            user.otp_code = str(random.randint(100000, 999999))
            user.save()

            # Send new OTP
            send_mail(
                subject="Your New OTP Code",
                message=f"Your new OTP code is: {user.otp_code}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

            return Response({"message": "New OTP sent."}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

