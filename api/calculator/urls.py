from django.urls import path
from . import views

urlpatterns = [
    path('integrate_trapezoid/', views.integrate_trapezoid),
    path('integrate_romberg/', views.integrate_romberg),
    path('integrate_gauss/', views.integrate_gauss),
    path('integrate_gauss_weight/', views.integrate_gauss_weight),
    path('des_runge_kutta/1/', views.des_runge_kutta1),
    path('des_runge_kutta/2/', views.des_runge_kutta2),
    path('indefinite_integration/', views.indefinite_integration),
    path('graph/', views.graph),
]