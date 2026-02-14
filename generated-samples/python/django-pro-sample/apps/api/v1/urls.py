from django.urls import path, include

from apps.api.v1.endpoints import health

urlpatterns = [
    path('health/', health.health_check, name='health_check'),
]
