document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('current-score');
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const restartButton = document.getElementById('restart-button');
    const winOverlay = document.getElementById('win-overlay');
    const continueButton = document.getElementById('continue-button');
    const newGameButton = document.getElementById('new-game-button');
    const gridSize = 4;
    let grid = [];
    let score = 0;
    let hasWon = false;

    // Initialize the game
    function init() {
        grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
        score = 0;
        hasWon = false;
        updateScore();
        gameOverOverlay.classList.remove('visible');
        winOverlay.classList.remove('visible');
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
            checkGameOver();
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

    // --- Touch Input Handling ---
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    gameBoard.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });

    gameBoard.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const swipeThreshold = 50; // Minimum distance for a swipe

        let moved = false;

        if (Math.abs(deltaX) > Math.abs(deltaY)) { // Horizontal swipe
            if (Math.abs(deltaX) > swipeThreshold) {
                if (deltaX > 0) {
                    moved = moveRight();
                } else {
                    moved = moveLeft();
                }
            }
        } else { // Vertical swipe
            if (Math.abs(deltaY) > swipeThreshold) {
                if (deltaY > 0) {
                    moved = moveDown();
                } else {
                    moved = moveUp();
                }
            }
        }

        if (moved) {
            addRandomTile();
            drawBoard();
            checkGameOver();
            checkWinCondition();
        }
    }

    // --- Game Over Logic ---
    function checkGameOver() {
        if (isGameOver()) {
            gameOverOverlay.classList.add('visible');
        }
    }

    function isGameOver() {
        // Check for empty cells
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] === 0) {
                    return false; // Not over if there is an empty cell
                }
            }
        }

        // Check for possible merges
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const current = grid[r][c];
                // Check right
                if (c < gridSize - 1 && current === grid[r][c + 1]) {
                    return false;
                }
                // Check down
                if (r < gridSize - 1 && current === grid[r + 1][c]) {
                    return false;
                }
            }
        }

        return true; // It's game over
    }

    // --- Win Condition Logic ---
    function checkWinCondition() {
        if (hasWon) return; // Don't check again if already won

        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] === 2048) {
                    hasWon = true;
                    winOverlay.classList.add('visible');
                    return; // Found 2048, no need to check further
                }
            }
        }
    }

    restartButton.addEventListener('click', init);
    continueButton.addEventListener('click', () => {
        winOverlay.classList.remove('visible');
    });
    newGameButton.addEventListener('click', init);
    document.addEventListener('keydown', handleInput);
    init();
});
