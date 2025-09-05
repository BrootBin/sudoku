from django.db import models

class SudokuGame(models.Model):
    DIFFICULTY_CHOICES = [
        ("easy", "Easy"),
		  ("normal", "Normal"),        
        ("medium", "Medium"),
        ("hard", "Hard"),
        ("death", "Death"),

        
    ]

    size = models.IntegerField(default=9, choices=[(9, "9x9"), (16, "16x16")])
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default="normal")
    puzzle = models.JSONField()
    solution = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sudoku {self.size}x{self.size} ({self.difficulty})"
