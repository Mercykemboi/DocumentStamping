from django.urls import path
from .views import StampListCreateView, StampDetailView

urlpatterns = [
    path('stamps/', StampListCreateView.as_view(), name='stamp-list-create'),
    path('stamps/<int:pk>/', StampDetailView.as_view(), name='stamp-detail'),
]
