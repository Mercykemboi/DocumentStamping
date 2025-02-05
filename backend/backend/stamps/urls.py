from django.urls import path
from .views import (
    StampListCreateView,
    StampDetailView,
    SaveStampView,  # Function-based view for saving stamps
    GetStampsView   # Function-based view for fetching stamps
)

urlpatterns = [
    path("stamps/", StampListCreateView.as_view(), name="stamp-list-create"),
    path("stamps/<int:pk>/", StampDetailView.as_view(), name="stamp-detail"),
    path("stamps/save/", SaveStampView.as_view(), name="save-stamp"),  # Save a new stamp
    path("stamps/all/", GetStampsView.as_view(), name="get-stamps"),  # Get all stamps as JSON
]
