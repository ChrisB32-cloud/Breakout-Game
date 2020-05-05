// 1 start
const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
// 3 bring in canvas
const canvas = document.getElementById('canvas');
// 4 ctx means context
const ctx = canvas.getContext('2d');
// <------------------------
// Adding a start button

const startBtn = document.getElementById('start-btn');

// <------------------------

// 14 var with let so it can change
let score = 0;

// 15
const brickRowCount = 9;
const brickColumnCount = 5;

// 5 create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  // direction on x axis
  dx: 4,
  dy: -4
};

// 8 Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
  // Only moving along the x-axis
};

// 16 create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
};

// 17 Create bricks, creating an array of columns with bricks inside
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// console.log(bricks);

// 6 Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

// 9 Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

// 18 Draw bricks on canvas
function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
}

// 13 Draw score on canvas
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// 24 Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  // 25 wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// 30 Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // 31 wall collision (right/ left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // ball.dx = ball.dx * -1
  }

  // 32 wall collision (Top/ bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }
  // console.log(ball.x, ball.y);
  // 33 paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // 34 Brick collision
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check)
        ) {
          ball.dy *= -1;
          brick.visible = false;

          // 35 call increase score
          increaseScore();
        }
      }
    });
  });

  // 39 Hit bottom wall - Lose
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

// 36 Increase score
function increaseScore() {
  score++;
  if (score % (brickRowCount * brickRowCount) === 0) {
    // 37 call show all bricks
    showAllBricks();
  }
}

// 38 Make all bricks appear
function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
}

// 11 Draw everything
function draw() {
  // 28 clear canvas, should have done earlier
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw ball and draw paddle were made first and then put into draw
  // function to take out of global scope
  // 7 call draw ball
  drawBall();
  //10 call draw paddle
  drawPaddle();
  // 15 call draw score
  drawScore();
  // 19 call draw bricks
  drawBricks();
}

// 20 update canvas drawing and animation, call draw was created first
function update() {
  // 22
  movePaddle();
  // 12 call draw
  draw();

  // 21
  requestAnimationFrame(update);

  // 29 call move ball
  moveBall();
}

// // 23
// update();

// <-------------------------------
function beginGame() {
  update();
}
// <-------------------------------

// 27 keydown event
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
}

// 28
function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.dx = 0;
  }
}

// 26 Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// 2 Rules and close event handelers
rulesBtn.addEventListener('click', () => {
  rules.classList.add('show');
});

closeBtn.addEventListener('click', () => {
  rules.classList.remove('show');
});

// <---------------------------
// Adding event listener to button

startBtn.addEventListener('click', beginGame);

// <----------------------------
