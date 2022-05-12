from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_gallery_elements),
    path('create/', views.create_gallery_element),
    path('random/<str:pk>', views.get_random_gallery_elements)
]