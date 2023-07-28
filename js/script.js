const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const score = document.querySelector('.score--value');
const finalScore = document.querySelector('.final-score > span');
const menu = document.querySelector('.menu-screen');
const buttonPlay = document.querySelector('.btn-play');

const size = 30;

const initialPosition = {x: 270, y: 240};

let snake = [initialPosition];

const incrementScore = () => {
    score.innerText = +score.innerText + 10;
};

const audio = new Audio('../assets/audio.mp3');

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
};

const randomColor = () => {
    const red = randomNumber(30, 255);
    const green = randomNumber(30, 255);
    const blue = randomNumber(30, 255);

    return `rgb(${red}, ${green}, ${blue})`;
};

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
};

let direction, loopId;
let rodaJogo = true;

const drawFood = () => {
    const {x, y, color} = food;

    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd";
    
    snake.forEach((position, index)=>{

        if(index == snake.length-1){
            ctx.fillStyle = "#fff";
        }
        ctx.fillRect(position.x, position.y, size,size);
    });
};

const moveSnake = () => {
    if(!direction) return

    const head = snake[snake.length-1];

    snake.shift()

    if(direction === 'right'){
        snake.push({x: head.x + size, y: head.y});
    }
    if(direction === 'left'){
        snake.push({x: head.x - size, y: head.y});
    }
    if(direction === 'down'){
        snake.push({x: head.x, y: head.y + size});
    }
    if(direction === 'up'){
        snake.push({x: head.x, y: head.y - size});
    }
};

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#191919';

    for(let i=30; i<canvas.width; i+=30){
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    };
};

const checkEat = () => {
    const head = snake[snake.length - 1];

    if(food.x === head.x && food.y === head.y){
        incrementScore();
        audio.play();
        snake.push(head);

        let x = randomPosition();
        let y = randomPosition();

        while(snake.find((position) => position.x === x && position.y === y)){
            x = randomPosition();
            y = randomPosition();
        }
        food.x = x;
        food.y = y;
        food.color = randomColor();
    };
};

const checkCollision = () => {
    const head = snake[snake.length-1];
    const canvasLimit = canvas.width - size;
    const wallCollision = 
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollission = 
        snake.find((position, index) => {
            return index < snake.length - 2 && position.x === head.x && position.y === head.y;
        });
        
    if(wallCollision || selfCollission){
        gameOver();
    }
};

const gameOver = () => {
    rodaJogo = false;
    direction = undefined;

    menu.style.display = 'flex';
    finalScore.innerText = score.innerText;
    canvas.style.filter = 'blur(2px)';
};

const gameLoop = () => {
    clearInterval(loopId);

    ctx.clearRect(0,0,600,600);
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout(()=>{
        gameLoop();
    }, 120);
};

gameLoop();

document.addEventListener('keydown', ({key}) => {
    if((key === 'w' || key === 'ArrowUp') && direction !== 'down' && rodaJogo){
        direction = 'up';
    };
    if((key === 'a' || key === 'ArrowLeft') && direction !== 'right' && rodaJogo){
        direction = 'left';
    };
    if((key === 's' || key === 'ArrowDown') && direction !== 'up' && rodaJogo){
        direction = 'down';
    };
    if((key === 'd' || key === 'ArrowRight') && direction !== 'left' && rodaJogo){
        direction = 'right';
    };
});

const up = document.querySelector('.up');
const left = document.querySelector('.left');
const down = document.querySelector('.down');
const right = document.querySelector('.right');

up.addEventListener('click', ()=> {
    if(direction !== 'down' && rodaJogo){
        direction = 'up';
    };
});
left.addEventListener('click', ()=> {
    if(direction !== 'right' && rodaJogo){
        direction = 'left';
    };
});
down.addEventListener('click', ()=> {
    if(direction !== 'up' && rodaJogo){
        direction = 'down';
    };
});
right.addEventListener('click', ()=> {
    if(direction !== 'left' && rodaJogo){
        direction = 'right';
    };
});

buttonPlay.addEventListener('click', ()=>{
    rodaJogo = true;
    score.innerText = '00';
    menu.style.display = 'none';
    canvas.style.filter = 'none';

    snake = [initialPosition];

    food.x = randomPosition();
    food.y = randomPosition();
    food.color = randomColor();
    drawFood();
})