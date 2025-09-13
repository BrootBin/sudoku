let currentPuzzle = [];
let currentSolution = [];
let size = 9;
let difficulty = "easy";
let highlightTimeout = null;

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

            // Анімація при введенні числа
            input.addEventListener("input", () => {
                input.classList.remove("entered");
                void input.offsetWidth; // тригер перезапуску анімації
                input.classList.add("entered");
            });

            cell.appendChild(input);

            // товсті межі блоків
            if (colIndex % blockSize === 0) cell.style.borderLeft = "2px solid black";
            if ((colIndex + 1) % blockSize === 0) cell.style.borderRight = "2px solid black";
            if (rowIndex % blockSize === 0) cell.style.borderTop = "2px solid black";
            if ((rowIndex + 1) % blockSize === 0) cell.style.borderBottom = "2px solid black";

            if (colIndex === size - 1) cell.style.borderRight = "2px solid black";
            if (rowIndex === size - 1) cell.style.borderBottom = "2px solid black";

            // підсвічування при наведенні (ПК) та при торканні (мобільні)
            cell.onmouseenter = () => highlightCell(rowIndex, colIndex);
            cell.onmouseleave = () => clearHighlight();
            cell.onclick = () => {
                highlightCell(rowIndex, colIndex);
                if (window.innerWidth <= 768) { // мобільні
                    clearTimeout(highlightTimeout);
                    highlightTimeout = setTimeout(clearHighlight, 800);
                }
            };

            sudokuDiv.appendChild(cell);
        });
    });

    adjustGridSize();
}

// підсвічування ряду та стовпця
function highlightCell(row, col) {
    clearHighlight();
    const cells = document.querySelectorAll("#sudoku .cell");
    const gridSize = Math.sqrt(cells.length);
    cells.forEach((cell, index) => {
        const r = Math.floor(index / gridSize);
        const c = index % gridSize;
        if (r === row || c === col) cell.classList.add("highlight");
    });

    if (window.innerWidth <= 768) {
        setTimeout(() => {
            document.querySelectorAll("#sudoku .cell.highlight").forEach(cell => {
                cell.classList.add("fade");
            });
        }, 700); // через 0.7с починає затемнюватися
    }
}

function clearHighlight() {
    document.querySelectorAll("#sudoku .cell.highlight").forEach(cell => {
        cell.classList.remove("highlight", "fade");
    });
}


// Адаптивне підлаштування розміру клітинок
function adjustGridSize() {
    const sudokuDiv = document.getElementById("sudoku");
    const screenWidth = window.innerWidth * 0.95;
    const screenHeight = window.innerHeight * 0.7; // залишаємо місце для контролів

    // вибираємо мінімальний розмір клітинки між шириною та висотою
    let cellSize = Math.floor(Math.min(screenWidth / size, screenHeight / size));

    sudokuDiv.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
    sudokuDiv.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`;

    document.querySelectorAll(".cell").forEach(cell => {
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.lineHeight = `${cellSize}px`;
        const input = cell.querySelector("input");
        if (input) input.style.fontSize = `${cellSize * 0.5}px`;
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

// Модальне вікно
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
            "Ухх, яка красотка!",
            "Вау, ти геній!",
            "Браво! Так тримати!",
            "Ти просто космос!",
            "Ай ти моє сонечко!",
            "Фантастика! Вітаю!"
        ];
        showModal(msgs[Math.floor(Math.random() * msgs.length)], true);
    } else {
        const msgs = [
            "Ну бліннн, постарайся ще!",
            "От халепа, щось накосячила!",
            "Майже, спробуй ще!",
            "Не здавайся, ти зможеш!",
            "Ти на вірному шляху, продовжуй!",
            "Ойойой, не все так просто!",
            "Ти майже дійшла до мети!",
            "Не впадай у відчай, вперед!"
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
