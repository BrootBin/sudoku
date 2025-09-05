import random

def is_valid(grid, row, col, num, size):
    box_size = int(size ** 0.5)
    for i in range(size):
        if grid[row][i] == num or grid[i][col] == num:
            return False
    start_row, start_col = (row // box_size) * box_size, (col // box_size) * box_size
    for i in range(start_row, start_row + box_size):
        for j in range(start_col, start_col + box_size):
            if grid[i][j] == num:
                return False
    return True

def solve(grid, size):
    for row in range(size):
        for col in range(size):
            if grid[row][col] == 0:
                for num in random.sample(range(1, size+1), size):
                    if is_valid(grid, row, col, num, size):
                        grid[row][col] = num
                        if solve(grid, size):
                            return True
                        grid[row][col] = 0
                return False
    return True

def generate_full_grid(size=9):
    grid = [[0] * size for _ in range(size)]
    solve(grid, size)
    return grid

def make_puzzle(grid, difficulty="easy"):
    size = len(grid)
    box_size = int(size ** 0.5)
    puzzle = [row[:] for row in grid]

    if difficulty == "easy":
        min_numbers = 6
        for box_row in range(0, size, box_size):
            for box_col in range(0, size, box_size):
                cells = [(r, c) for r in range(box_row, box_row + box_size)
                                  for c in range(box_col, box_col + box_size)]
                random.shuffle(cells)
                for r, c in cells[min_numbers:]:
                    puzzle[r][c] = 0

    elif difficulty == "medium":  # найважчий рівень
        for box_row in range(0, size, box_size):
            for box_col in range(0, size, box_size):
                # у кожному 4x4 кубі рандомно від 2 до 4 заповнених клітин
                min_numbers = random.randint(3, 5)
                cells = [(r, c) for r in range(box_row, box_row + box_size)
                                  for c in range(box_col, box_col + box_size)]
                random.shuffle(cells)
                for r, c in cells[min_numbers:]:
                    puzzle[r][c] = 0

    elif difficulty == "normal":
        min_numbers = 4
        for box_row in range(0, size, box_size):
            for box_col in range(0, size, box_size):
                cells = [(r, c) for r in range(box_row, box_row + box_size)
                                  for c in range(box_col, box_col + box_size)]
                random.shuffle(cells)
                for r, c in cells[min_numbers:]:
                    puzzle[r][c] = 0
                    
    elif difficulty == "hard":  # найважчий рівень
        for box_row in range(0, size, box_size):
            for box_col in range(0, size, box_size):
                # у кожному 4x4 кубі рандомно від 2 до 4 заповнених клітин
                min_numbers = random.randint(2, 4)
                cells = [(r, c) for r in range(box_row, box_row + box_size)
                                  for c in range(box_col, box_col + box_size)]
                random.shuffle(cells)
                for r, c in cells[min_numbers:]:
                    puzzle[r][c] = 0            
	                           
    elif difficulty == "death":  # найважчий рівень
        for box_row in range(0, size, box_size):
            for box_col in range(0, size, box_size):
                # у кожному 4x4 кубі рандомно від 2 до 4 заповнених клітин
                min_numbers = random.randint(2, 3)
                cells = [(r, c) for r in range(box_row, box_row + box_size)
                                  for c in range(box_col, box_col + box_size)]
                random.shuffle(cells)
                for r, c in cells[min_numbers:]:
                    puzzle[r][c] = 0

    return puzzle
