from django.urls import path
from . import views

urlpatterns = [
    path('trapezoid_quadrature_01/', views.trapezoid_quadrature_01),
    path('romberg_quadrature_01/', views.romberg_quadrature_01),
    path('des_runge_kutta/', views.des_runge_kutta),
    path('graph/', views.graph),
]