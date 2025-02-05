from django.urls import path
from .views import (
    RegisterView, 
    LoginView, 
    LogoutView, 
    VerifyEmailView, 
    OTPVerificationView,
    ResendOTPView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email/<int:user_id>/', VerifyEmailView.as_view(), name='verify-email'),
    path('verify-otp/', OTPVerificationView.as_view(), name='verify-otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend-otp'),
]
