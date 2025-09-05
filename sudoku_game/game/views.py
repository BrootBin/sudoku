from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import SudokuGame
from .utils import generate_full_grid, make_puzzle
from django.shortcuts import render

@api_view(["GET"])
def new_game(request):
    size = int(request.GET.get("size", 9))
    difficulty = request.GET.get("difficulty", "easy")

    full = generate_full_grid(size)
    puzzle = make_puzzle(full, difficulty)

    game = SudokuGame.objects.create(
        size=size,
        difficulty=difficulty,
        puzzle=puzzle,
        solution=full
    )

    return Response({
        "id": game.id,
        "size": size,
        "difficulty": difficulty,
        "puzzle": puzzle,
        "solution": full
    })



def index(request):
    return render(request, "game/index.html")