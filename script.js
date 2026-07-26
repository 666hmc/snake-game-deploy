const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const speedRange = document.getElementById('speedRange');
const speedValue = document.getElementById('speedValue');

const GRID_SIZE = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let snake = [
    { x: 10, y: 10 }
];
let food = generateFood();
let dx = 0;
let dy = 0;
let score = 0;
let highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
let gameLoop = null;
let isPaused = false;
let gameStarted = false;

highScoreElement.textContent = highScore;

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
            y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE))
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function drawGame() {
    ctx.fillStyle = '#0f0f1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(food.x * GRID_SIZE + GRID_SIZE / 2, food.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    snake.forEach((segment, index) => {
        const gradient = ctx.createLinearGradient(
            segment.x * GRID_SIZE, segment.y * GRID_SIZE,
            (segment.x + 1) * GRID_SIZE, (segment.y + 1) * GRID_SIZE
        );
        if (index === 0) {
            gradient.addColorStop(0, '#4ade80');
            gradient.addColorStop(1, '#22c55e');
        } else {
            gradient.addColorStop(0, '#86efac');
            gradient.addColorStop(1, '#4ade80');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(
            segment.x * GRID_SIZE + 1,
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );
    });
}

function updateGame() {
    if (isPaused || !gameStarted) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x < 0 || head.x >= CANVAS_WIDTH / GRID_SIZE ||
        head.y < 0 || head.y >= CANVAS_HEIGHT / GRID_SIZE) {
        gameOver();
        return;
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        food = generateFood();
    } else {
        snake.pop();
    }

    drawGame();
}

function gameOver() {
    clearInterval(gameLoop);
    gameStarted = false;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore.toString());
        highScoreElement.textContent = highScore;
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

    ctx.font = '20px Arial';
    ctx.fillText(`得分: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
}

function getSpeed() {
    const speed = parseInt(speedRange.value);
    return 200 - speed * 18;
}

function updateSpeedLabel() {
    const speed = parseInt(speedRange.value);
    const labels = ['很慢', '慢', '偏慢', '稍慢', '中等', '稍快', '偏快', '快', '很快', '极速'];
    speedValue.textContent = labels[speed - 1];
}

function startGame() {
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    dx = 1;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    isPaused = false;
    gameStarted = true;

    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, getSpeed());
    drawGame();
}

function togglePause() {
    if (!gameStarted) return;
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '继续游戏' : '暂停游戏';

    if (!isPaused) {
        drawGame();
    } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('暂停中', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
}

document.addEventListener('keydown', (e) => {
    if (!gameStarted || isPaused) {
        if (e.key === ' ' || e.key === 'Enter') {
            startGame();
        }
        return;
    }

    switch (e.key) {
        case 'ArrowUp':
            if (dy === 0) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = 1;
                dy = 0;
            }
            break;
        case ' ':
            togglePause();
            break;
    }
});

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);

upBtn.addEventListener('click', () => {
    if (!gameStarted || isPaused) return;
    if (dy === 0) {
        dx = 0;
        dy = -1;
    }
});

downBtn.addEventListener('click', () => {
    if (!gameStarted || isPaused) return;
    if (dy === 0) {
        dx = 0;
        dy = 1;
    }
});

leftBtn.addEventListener('click', () => {
    if (!gameStarted || isPaused) return;
    if (dx === 0) {
        dx = -1;
        dy = 0;
    }
});

rightBtn.addEventListener('click', () => {
    if (!gameStarted || isPaused) return;
    if (dx === 0) {
        dx = 1;
        dy = 0;
    }
});

speedRange.addEventListener('input', () => {
    updateSpeedLabel();
    if (gameStarted && !isPaused) {
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, getSpeed());
    }
});

updateSpeedLabel();
drawGame();