let currentPuzzle = [];
let currentSolution = [];
let size = 9;
let difficulty = "easy";

// Функція малювання сітки
function drawGrid(puzzle, size) {
    const sudokuDiv = document.getElementById("sudoku");
    const blockSize = Math.sqrt(size);
    sudokuDiv.innerHTML = "";

    puzzle.forEach((row, rowIndex) => {
        row.forEach((num, colIndex) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            const input = document.createElement("input");
            input.classList.add("cell-input");
            input.type = "text";
            input.maxLength = 2;
            input.value = num !== 0 ? num : "";
            if (num !== 0) {
                input.disabled = true;
                input.style.fontWeight = "bold";
            }
            cell.appendChild(input);

            // товсті межі блоків
            if (colIndex % blockSize === 0) cell.style.borderLeft = "2px solid black";
            if ((colIndex + 1) % blockSize === 0) cell.style.borderRight = "2px solid black";
            if (rowIndex % blockSize === 0) cell.style.borderTop = "2px solid black";
            if ((rowIndex + 1) % blockSize === 0) cell.style.borderBottom = "2px solid black";

            // зовнішня рамка
            if (colIndex === size - 1) cell.style.borderRight = "2px solid black";
            if (rowIndex === size - 1) cell.style.borderBottom = "2px solid black";

            // підсвічування при наведенні
            cell.onmouseenter = () => highlightCell(rowIndex, colIndex);
            cell.onmouseleave = () => clearHighlight();

            sudokuDiv.appendChild(cell);
        });
    });

    adjustGridSize(); // підлаштування під екран
}

// підсвічування ряду та стовпця
function highlightCell(row, col) {
    const cells = document.querySelectorAll("#sudoku .cell");
    const size = Math.sqrt(cells.length);
    cells.forEach((cell, index) => {
        const r = Math.floor(index / size);
        const c = index % size;
        if (r === row || c === col) cell.classList.add("highlight");
    });
}

function clearHighlight() {
    document.querySelectorAll("#sudoku .cell.highlight").forEach(cell => {
        cell.classList.remove("highlight");
    });
}

// Адаптивне підлаштування розміру клітинок
function adjustGridSize() {
    const sudokuDiv = document.getElementById("sudoku");
    const screenWidth = window.innerWidth;
    let cellSize = 40; // базовий розмір

    if (screenWidth <= 600) cellSize = 30;
    if (screenWidth <= 400) cellSize = 25;

    sudokuDiv.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
    sudokuDiv.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`;

    document.querySelectorAll(".cell").forEach(cell => {
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.lineHeight = `${cellSize}px`;
        const input = cell.querySelector("input");
        if (input) input.style.fontSize = `${cellSize * 0.45}px`;
    });
}

// Створення нової гри
async function newGame() {
    const sizeSelect = document.getElementById("size");
    const difficultySelect = document.getElementById("difficulty");

    size = sizeSelect ? parseInt(sizeSelect.value) : 9;
    difficulty = difficultySelect ? difficultySelect.value : "easy";

    const res = await fetch(`/new-game/?size=${size}&difficulty=${difficulty}`);
    const data = await res.json();

    currentPuzzle = data.puzzle.map(row => row.map(Number));
    currentSolution = data.solution.map(row => row.map(Number));

    drawGrid(currentPuzzle, size);
    hideModal();
}

// Показ модального вікна
function showModal(message, correct = false) {
    const modal = document.getElementById("message-modal");
    const text = document.getElementById("message-text");
    const btn = document.getElementById("modal-btn");

    text.textContent = message;

    if (correct) {
        btn.textContent = "Нова гра";
        btn.onclick = () => {
            hideModal();
            newGame();
        };
    } else {
        btn.textContent = "Спробувати ще раз";
        btn.onclick = () => hideModal();
    }

    modal.style.display = "flex";
}

function hideModal() {
    const modal = document.getElementById("message-modal");
    modal.style.display = "none";
}

// Перевірка гри
function checkGame() {
    if (!currentPuzzle.length || !currentSolution.length) {
        alert("Спершу натисни 'Нова гра'!");
        return;
    }

    const inputs = document.querySelectorAll("#sudoku .cell-input");
    let allCorrect = true;

    inputs.forEach((input, index) => {
        const row = Math.floor(index / currentPuzzle.length);
        const col = index % currentPuzzle.length;

        const val = input.value.trim() === "" ? null : parseInt(input.value);
        const solutionVal = currentSolution[row][col];

        if (val === null || val !== solutionVal) {
            allCorrect = false;
        }
    });

    if (allCorrect) {
        const msgs = [
            "Ухти пухти! Яка молодчинка!",
            "От це ти супер, юху!",
            "Ухх, яка красотка!"
        ];
        showModal(msgs[Math.floor(Math.random() * msgs.length)], true);
    } else {
        const msgs = [
            "Ну бліннн, постарайся ще!",
            "От халепа, щось накосячила!",
            "Майже, спробуй ще!"
        ];
        showModal(msgs[Math.floor(Math.random() * msgs.length)], false);
    }
}

// Прив’язка кнопок
window.onload = () => {
    document.getElementById("new-game-btn").onclick = newGame;
    document.getElementById("check-btn").onclick = checkGame;
};

// Адаптація при зміні розміру екрану
window.addEventListener("resize", adjustGridSize);
