const assert = require('assert');

// Re-create the necessary parts of the game logic for testing
const gridSize = 4;
let score = 0;

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
    return row;
}

function runTest(name, testFunction) {
    try {
        testFunction();
        console.log(`✔ ${name}`);
    } catch (error) {
        console.error(`✖ ${name}`);
        console.error(error);
        process.exit(1);
    }
}

// --- Test Cases ---

runTest('should merge two adjacent tiles', () => {
    score = 0;
    const result = slide([2, 2, 0, 0]);
    assert.deepStrictEqual(result, [4, 0, 0, 0]);
    assert.strictEqual(score, 4);
});

runTest('should merge tiles with an empty cell between them', () => {
    score = 0;
    const result = slide([2, 0, 2, 0]);
    assert.deepStrictEqual(result, [4, 0, 0, 0]);
    assert.strictEqual(score, 4);
});

runTest('should perform two merges in one row', () => {
    score = 0;
    const result = slide([2, 2, 2, 2]);
    assert.deepStrictEqual(result, [4, 4, 0, 0]);
    assert.strictEqual(score, 8);
});

runTest('should not merge different tiles', () => {
    score = 0;
    const result = slide([2, 4, 2, 4]);
    assert.deepStrictEqual(result, [2, 4, 2, 4]);
    assert.strictEqual(score, 0);
});

runTest('should slide tiles to the beginning of the row', () => {
    score = 0;
    const result = slide([0, 0, 2, 2]);
    assert.deepStrictEqual(result, [4, 0, 0, 0]);
    assert.strictEqual(score, 4);
});

runTest('should handle a full row with no merges', () => {
    score = 0;
    const result = slide([2, 4, 8, 16]);
    assert.deepStrictEqual(result, [2, 4, 8, 16]);
    assert.strictEqual(score, 0);
});

console.log('\nAll slide logic tests passed!');

// --- Swipe Handling Tests ---

// Mock the movement functions
let lastMoveCalled = null;
const moveUp = () => { lastMoveCalled = 'up'; return true; };
const moveDown = () => { lastMoveCalled = 'down'; return true; };
const moveLeft = () => { lastMoveCalled = 'left'; return true; };
const moveRight = () => { lastMoveCalled = 'right'; return true; };

function handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY) {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const swipeThreshold = 50; // Minimum distance for a swipe

    let moved = false;
    lastMoveCalled = null;

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
    return moved;
}

runTest('should detect a swipe right', () => {
    handleSwipe(100, 100, 200, 100);
    assert.strictEqual(lastMoveCalled, 'right');
});

runTest('should detect a swipe left', () => {
    handleSwipe(200, 100, 100, 100);
    assert.strictEqual(lastMoveCalled, 'left');
});

runTest('should detect a swipe up', () => {
    handleSwipe(100, 200, 100, 100);
    assert.strictEqual(lastMoveCalled, 'up');
});

runTest('should detect a swipe down', () => {
    handleSwipe(100, 100, 100, 200);
    assert.strictEqual(lastMoveCalled, 'down');
});

runTest('should ignore a swipe that is too short', () => {
    handleSwipe(100, 100, 110, 110);
    assert.strictEqual(lastMoveCalled, null);
});

runTest('should ignore a diagonal swipe that is too short', () => {
    handleSwipe(100, 100, 140, 140); // deltaX=40, deltaY=40
    assert.strictEqual(lastMoveCalled, null);
});

console.log('\nAll swipe handling tests passed!');

// --- Game Over Logic Tests ---

let grid = [];

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

runTest('should not be game over when the board is not full', () => {
    grid = [
        [2, 4, 8, 16],
        [4, 8, 16, 32],
        [8, 16, 32, 64],
        [16, 32, 64, 0] // One empty cell
    ];
    assert.strictEqual(isGameOver(), false);
});

runTest('should not be game over when a horizontal merge is possible', () => {
    grid = [
        [2, 4, 8, 16],
        [4, 8, 16, 32],
        [8, 16, 32, 64],
        [16, 32, 64, 64] // Horizontal merge possible
    ];
    assert.strictEqual(isGameOver(), false);
});

runTest('should not be game over when a vertical merge is possible', () => {
    grid = [
        [2, 4, 8, 16],
        [4, 8, 16, 32],
        [8, 16, 32, 64],
        [2, 4, 8, 64] // Vertical merge possible with the 64 above
    ];
    assert.strictEqual(isGameOver(), false);
});

runTest('should be game over when the board is full and no merges are possible', () => {
    grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2048, 4096],
        [2, 4, 8, 16]
    ];
    assert.strictEqual(isGameOver(), true);
});

console.log('\nAll game over logic tests passed!');

// --- Win Condition Logic Tests ---

let hasWon = false;

// Mock winOverlay for testing
const winOverlay = {
    classList: {
        add: () => {},
        remove: () => {},
    },
};

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

runTest('should not trigger win condition if 2048 tile is not present', () => {
    grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 0, 4096],
        [2, 4, 8, 16]
    ];
    hasWon = false;
    checkWinCondition();
    assert.strictEqual(hasWon, false);
});

runTest('should trigger win condition if 2048 tile is present', () => {
    grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2048, 4096],
        [2, 4, 8, 16]
    ];
    hasWon = false;
    checkWinCondition();
    assert.strictEqual(hasWon, true);
});

console.log('\nAll win condition logic tests passed!');

// --- User Registration Tests ---

// Mock localStorage
const mockLocalStorage = (() => {
    let store = {};
    return {
        getItem: function(key) {
            return store[key] || null;
        },
        setItem: function(key, value) {
            store[key] = value.toString();
        },
        clear: function() {
            store = {};
        },
        removeItem: function(key) {
            delete store[key];
        }
    };
})();

// Mock window object for redirection
const mockWindow = {
    location: {
        href: ''
    }
};

// Mock error message div
const mockErrorMessageDiv = {
    textContent: ''
};

// Import the handleSignup function (assuming it's exported or globally available)
// For Node.js, we need to manually expose it if it's not exported.
// Since it's not exported, I'll copy the function here for testing purposes.
// In a real project, you'd use module.exports or import/export.

// Copied handleSignup function from signup.js for testing
function handleSignup(usernameValue, emailValue, passwordValue, errorMessageElement, localStorageMock, windowMock) {
    errorMessageElement.textContent = ''; // Clear previous error messages

    // Password validation: min 8 chars, 1 uppercase, 1 number
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    if (!passwordRegex.test(passwordValue)) {
        errorMessageElement.textContent = 'Password must be at least 8 characters long, contain at least one uppercase letter and one number.';
        return false;
    }

    // Check for existing username
    const users = JSON.parse(localStorageMock.getItem('users')) || [];
    const usernameExists = users.some(user => user.username === usernameValue);

    if (usernameExists) {
        errorMessageElement.textContent = 'Username already taken. Please choose a different one.';
        return false;
    }

    // Store new user
    const newUser = { username: usernameValue, email: emailValue, password: passwordValue }; // In a real app, hash the password!
    users.push(newUser);
    localStorageMock.setItem('users', JSON.stringify(users));

    windowMock.location.href = 'index.html'; // Redirect to main game page or login page
    return true;
}


runTest('should register a new user successfully', () => {
    mockLocalStorage.clear(); // Clear localStorage before each test
    mockErrorMessageDiv.textContent = '';
    mockWindow.location.href = '';

    const result = handleSignup('testuser', 'test@example.com', 'Password123', mockErrorMessageDiv, mockLocalStorage, mockWindow);
    assert.strictEqual(result, true);
    assert.strictEqual(mockErrorMessageDiv.textContent, '');
    assert.strictEqual(mockWindow.location.href, 'index.html');
    const users = JSON.parse(mockLocalStorage.getItem('users'));
    assert.strictEqual(users.length, 1);
    assert.strictEqual(users[0].username, 'testuser');
});

runTest('should not register with an existing username', () => {
    mockLocalStorage.clear();
    mockLocalStorage.setItem('users', JSON.stringify([{ username: 'existinguser', email: 'e@e.com', password: 'Password123' }]));
    mockErrorMessageDiv.textContent = '';
    mockWindow.location.href = '';

    const result = handleSignup('existinguser', 'new@example.com', 'NewPassword123', mockErrorMessageDiv, mockLocalStorage, mockWindow);
    assert.strictEqual(result, false);
    assert.strictEqual(mockErrorMessageDiv.textContent, 'Username already taken. Please choose a different one.');
    assert.strictEqual(mockWindow.location.href, ''); // Should not redirect
});

runTest('should not register with a password too short', () => {
    mockLocalStorage.clear();
    mockErrorMessageDiv.textContent = '';
    mockWindow.location.href = '';

    const result = handleSignup('user1', 'user1@example.com', 'Pass1', mockErrorMessageDiv, mockLocalStorage, mockWindow);
    assert.strictEqual(result, false);
    assert.strictEqual(mockErrorMessageDiv.textContent, 'Password must be at least 8 characters long, contain at least one uppercase letter and one number.');
    assert.strictEqual(mockWindow.location.href, '');
});

runTest('should not register with a password without uppercase', () => {
    mockLocalStorage.clear();
    mockErrorMessageDiv.textContent = '';
    mockWindow.location.href = '';

    const result = handleSignup('user2', 'user2@example.com', 'password123', mockErrorMessageDiv, mockLocalStorage, mockWindow);
    assert.strictEqual(result, false);
    assert.strictEqual(mockErrorMessageDiv.textContent, 'Password must be at least 8 characters long, contain at least one uppercase letter and one number.');
    assert.strictEqual(mockWindow.location.href, '');
});

runTest('should not register with a password without number', () => {
    mockLocalStorage.clear();
    mockErrorMessageDiv.textContent = '';
    mockWindow.location.href = '';

    const result = handleSignup('user3', 'user3@example.com', 'PasswordABC', mockErrorMessageDiv, mockLocalStorage, mockWindow);
    assert.strictEqual(result, false);
    assert.strictEqual(mockErrorMessageDiv.textContent, 'Password must be at least 8 characters long, contain at least one uppercase letter and one number.');
    assert.strictEqual(mockWindow.location.href, '');
});

console.log('\nAll user registration tests passed!');

console.log('\nAll tests passed successfully!');
process.exit(0);
