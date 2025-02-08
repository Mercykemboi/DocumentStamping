# from django.urls import path
# from .views import (
#     StampListCreateView,
#     StampDetailView,
#     SaveStampView,  # Function-based view for saving stamps
#     GetStampsView   # Function-based view for fetching stamps
from django.urls import path
from .views import CreateStampView, ListStampsView,GenerateOTPView,VerifyOTPView,StampDocumentView

urlpatterns = [
    path('stamps/create/', CreateStampView.as_view(), name='create-stamp'),
    path('stamps/', ListStampsView.as_view(), name='list-stamps'),
    path('generate/', GenerateOTPView.as_view(), name='generate-otp'),
    path('verify/', VerifyOTPView.as_view(), name='verify-otp'),
     path("stamp/", StampDocumentView.as_view(), name="stamp-document")
]
