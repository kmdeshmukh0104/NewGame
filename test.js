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

console.log('\nAll logic tests passed!');
