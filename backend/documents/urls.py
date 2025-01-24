from django.urls import path


from .views import UploadDocumentView, DocumentDetailView, StampDocumentView, UserDocumentsView

urlpatterns = [
    path('documents/', UploadDocumentView.as_view(), name='upload_document'),
    path('viewDocuments/', UserDocumentsView.as_view(), name='user-documents'), 
    path('documents/<int:pk>/', DocumentDetailView.as_view(), name='document_detail'),
    path('documents/<int:pk>/stamp/', StampDocumentView.as_view(), name='stamp_document'),
]


