# from django.urls import path
# from .views import (
#     StampListCreateView,
#     StampDetailView,
#     SaveStampView,  # Function-based view for saving stamps
#     GetStampsView   # Function-based view for fetching stamps
from django.urls import path
from .views import CreateStampView, ListStampsView

urlpatterns = [
    path('stamps/create/', CreateStampView.as_view(), name='create-stamp'),
    path('stamps/', ListStampsView.as_view(), name='list-stamps'),
]
