from django.urls import path
from . import views

urlpatterns = [   
    path('', views.game, name='game'),
    path('login/', views.login, name='login'),
    path('sendScore/', views.sendScore, name='sendScore')
]
