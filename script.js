document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('current-score');
    const gridSize = 4;
    let grid = [];
    let score = 0;

    // Initialize the game
    function init() {
        grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
        score = 0;
        updateScore();
        addRandomTile();
        addRandomTile();
        drawBoard();
    }

    // Draw the board based on the grid state
    function drawBoard() {
        gameBoard.innerHTML = '';
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                const tileValue = grid[r][c];
                if (tileValue !== 0) {
                    const tile = document.createElement('div');
                    tile.classList.add('tile');
                    tile.classList.add(`tile-${tileValue}`);
                    tile.textContent = tileValue;
                    cell.appendChild(tile);
                }
                gameBoard.appendChild(cell);
            }
        }
    }

    // Add a random tile (2 or 4) to an empty cell
    function addRandomTile() {
        let emptyCells = [];
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }

        if (emptyCells.length > 0) {
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    // Handle key presses
    function handleInput(e) {
        let moved = false;
        switch (e.key) {
            case 'ArrowUp':
                moved = moveUp();
                break;
            case 'ArrowDown':
                moved = moveDown();
                break;
            case 'ArrowLeft':
                moved = moveLeft();
                break;
            case 'ArrowRight':
                moved = moveRight();
                break;
        }

        if (moved) {
            addRandomTile();
            drawBoard();
            // Check for game over
        }
    }

    // --- Movement Logic ---

    function moveUp() {
        let moved = false;
        for (let c = 0; c < gridSize; c++) {
            let column = [];
            for (let r = 0; r < gridSize; r++) {
                column.push(grid[r][c]);
            }
            const newColumn = slide(column);
            for (let r = 0; r < gridSize; r++) {
                if (grid[r][c] !== newColumn[r]) {
                    moved = true;
                }
                grid[r][c] = newColumn[r];
            }
        }
        return moved;
    }

    function moveDown() {
        let moved = false;
        for (let c = 0; c < gridSize; c++) {
            let column = [];
            for (let r = 0; r < gridSize; r++) {
                column.push(grid[r][c]);
            }
            const newColumn = slide(column.reverse()).reverse();
            for (let r = 0; r < gridSize; r++) {
                if (grid[r][c] !== newColumn[r]) {
                    moved = true;
                }
                grid[r][c] = newColumn[r];
            }
        }
        return moved;
    }

    function moveLeft() {
        let moved = false;
        for (let r = 0; r < gridSize; r++) {
            const row = grid[r];
            const newRow = slide(row);
            if (grid[r].join(',') !== newRow.join(',')) {
                moved = true;
            }
            grid[r] = newRow;
        }
        return moved;
    }

    function moveRight() {
        let moved = false;
        for (let r = 0; r < gridSize; r++) {
            const row = grid[r].reverse();
            const newRow = slide(row).reverse();
            if (grid[r].reverse().join(',') !== newRow.join(',')) {
                moved = true;
            }
            grid[r] = newRow;
        }
        return moved;
    }

    // Slide tiles in a row/column
    function slide(row) {
        row = row.filter(val => val);
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i + 1]) {
                row[i] *= 2;
                score += row[i];
                row.splice(i + 1, 1);
            }
        }
        while (row.length < gridSize) {
            row.push(0);
        }
        updateScore();
        return row;
    }

    function updateScore() {
        scoreElement.textContent = score;
    }

    document.addEventListener('keydown', handleInput);
    init();
});
