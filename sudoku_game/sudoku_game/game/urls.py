from django.urls import path
from .views import index, new_game

urlpatterns = [
    path("", index, name="index"),
    path("new-game/", new_game, name="new_game"),
]
