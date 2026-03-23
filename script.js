const eatSound = new Audio('eating.mp3');
const gameOverSound = new Audio('gameOver.mp3');
const bgMusic = new Audio('background.mp3');
bgMusic.loop = true;


let gameStarted = false;
const startBtn = document.getElementById('startBtn');
const scoreBar = document.getElementById('scoreBar');




const canvas =
document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = 20;

let snake = [{x: 10, y: 10}];
let direction = 'RIGHT';
let food = {x: 15, y: 10};
let score = 0;
let gameSpeed = 200;

function draw() {
  // Clear canvas
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake (green)
  ctx.fillStyle = '#00FF00';
  snake.forEach(segment => {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  });

  // Draw food (red)
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(
    food.x * gridSize,
    food.y * gridSize,
    gridSize - 2,
    gridSize - 2
  );
}


function move(){
  let head = {
    x: snake[0].x,
    y: snake[0].y
  };

  if(direction === 'UP') head.y--;
  if(direction === 'DOWN') head.y++;
  if(direction === 'LEFT') head.x--;
  if(direction === 'RIGHT') head.x++;

  snake.unshift(head);

  if(head.x === food.x && head.y === food.y){
    score++;
    eatSound.play();
    placeFood();
    scoreBar.textContent = 'Score: ' + score;
  } else {
    snake.pop();
  }
}



// step 5
document.addEventListener('keydown', changeDirection);

function changeDirection(event){
  const key = event.key;

  if(key === 'ArrowUp' && direction !== 'DOWN')
    direction = 'UP';

  if(key === 'ArrowDown' && direction !== 'UP')
    direction = 'DOWN';

  if(key === 'ArrowLeft' && direction !== 'RIGHT')
    direction = 'LEFT';

  if(key === 'ArrowRight' && direction !== 'LEFT')
    direction = 'RIGHT';
}


// step 6

function checkCollision(){
  const head = snake[0];

  // wall collision
  if(
    head.x < 0 || 
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount
  ){
    return true;
  }

  // self collision
  for(let i = 1; i < snake.length; i++){
    if(head.x === snake[i].x &&
       head.y === snake[i].y){
      return true;
    }
  }

  return false;
}


function placeFood(){
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
}


// step 7


function gameLoop(){
  // update game state

  move();

  // check if game is over

  if(checkCollision()){
    gameOverSound.play();
    bgMusic.pause();
    bgMusic.currentTime = 0;
    alert('Game Over ! Score :'
      +score
    );

    // Reset game

    snake = [{x:10, y : 10}];
    direction = 'RIGHT';
    score = 0;
    scoreBar.textContent = 'Score: 0';
    placeFood();
  }

  // Draw everything
  draw();

  // schedule next frame
  setTimeout(gameLoop,gameSpeed);

}

// start the game
placeFood();
// gameLoop();


startBtn.addEventListener('click', function(){
  if(!gameStarted){
    gameStarted = true;
    gameLoop();
    bgMusic.play();
    startBtn.style.display = "none";
  }
});
