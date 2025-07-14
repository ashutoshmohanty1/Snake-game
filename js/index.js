//Game constants & variables
let animationId = null;
let inputDir = {x:0 ,y:0};
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('bgmusic.mp3');
/**********************/
const difficultySelect = document.getElementById('difficulty');
let speed = ++difficultySelect.value;

difficultySelect.addEventListener('change', () => {
    speed = ++difficultySelect.value;
});

let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    {x:13 , y:15}
]
food = {x:6 , y:7};

// Get scoreboard elements
let scoreBox = document.getElementById('scoreBox');
let hiscoreBox = document.getElementById('hiscoreBox');
let hiscore = localStorage.getItem('hiscore') || 0;
hiscoreBox.innerText = `High Score: ${hiscore}`;

//for mobile
document.getElementById('up').addEventListener('click', () => inputDir = { x: 0, y: -1 });
document.getElementById('down').addEventListener('click', () => inputDir = { x: 0, y: 1 });
document.getElementById('left').addEventListener('click', () => inputDir = { x: -1, y: 0 });
document.getElementById('right').addEventListener('click', () => inputDir = { x: 1, y: 0 });

//Game functions

function main(ctime) {
    animationId = window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

function startGame() {
    snakeArr = [{ x: 13, y: 15 }];
    food = { x: 6, y: 7 };
    score = 0;
    inputDir = { x: 0, y: 0 };
    scoreBox.innerText = `Score: ${score}`;
    musicSound.currentTime = 0;
    musicSound.play();
    lastPaintTime = 0;
    document.getElementById('gameOverMessage').style.display = 'none';
    document.getElementById('startBtn').style.display = 'none';
    window.requestAnimationFrame(main);
}

document.getElementById('restartBtn').addEventListener('click', startGame);
document.getElementById('startBtn').addEventListener('click', startGame);


function isCollide(snake) {
    // If head touches body
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    // If head hits wall
    return (
        snake[0].x <= 0 ||
        snake[0].x > 18 ||
        snake[0].y <= 0 ||
        snake[0].y > 18
    );
}

function gameEngine(){
    //part 1 : Updating snake array & Food
    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        inputDir = {x:0 , y:0};
        alert("💀 Game Over! Press any key to restart.");
        snakeArr = [{x:13 , y:15}];
        score = 0;
        scoreBox.innerText = `Score: ${score}`;
        musicSound.currentTime = 0;
        musicSound.play();
        /*document.getElementById('startBtn').style.display = 'inline-block';
        cancelAnimationFrame(animationId);*/

    }

    //if food is eaten

    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score++;
        if (score > hiscore) {
            hiscore = score;
            localStorage.setItem('hiscore', hiscore);
            hiscoreBox.innerText = `High Score: ${hiscore}`;
        }
        scoreBox.innerText = `Score: ${score}`;
        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y,
        });

        food = {
            x: Math.floor(Math.random() * 17) + 1,
            y: Math.floor(Math.random() * 17) + 1,
        };
    }

    //moving the snake

    for (let i = snakeArr.length - 2; i>=0; i--) {
        snakeArr[i+1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Render board
    const board = document.getElementById('board');
    board.innerHTML = '';

    snakeArr.forEach((e, index) => {
        const element = document.createElement('div');
        element.style.gridRowStart = e.y;
        element.style.gridColumnStart = e.x;

        if (index === 0) {
            element.classList.add('head');
            element.innerText = '😈'; // Snake face
        } else {
            element.classList.add('snake');
        }

        board.appendChild(element);
    });

    // Render food
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

//main logic start here
window.requestAnimationFrame(main);
window.addEventListener('keydown', e =>{
    inputDir = {x: 0 , y: 1}  //start the game.
    moveSound.play();
    switch (e.key) {
        case 'ArrowUp':
            inputDir = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            inputDir = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            inputDir = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            inputDir = { x: 1, y: 0 };
            break;
    }
});