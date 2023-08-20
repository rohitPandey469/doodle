// board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

// doodler
let doodlerWidth = 42;
let doodlerHeight = 46;
let doodlerX = boardWidth / 2 - doodlerWidth / 2;
let doodlerY = (boardHeight * 7) / 8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
  img: null,
  x: doodlerX,
  y: doodlerY,
  width: doodlerWidth,
  height: doodlerHeight,
};
// physics
let velocityX = 0;
let velocityY = 0;
let initialVelcoityY = -8;
let gravity = 0.4;

// platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

// score
let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); // to draw on the board

  //   draw doodler
  //   context.fillStyle = "green";
  //   context.fillRect(doodler.x, doodler.y, doodler.width, doodler.height);

  //   load images
  doodlerRightImg = new Image();
  doodlerRightImg.src = "./assets/doodler-right.png";
  doodler.img = doodlerRightImg;
  doodlerRightImg.onload = function () {
    context.drawImage(
      doodler.img,
      doodler.x,
      doodler.y,
      doodler.width,
      doodler.height
    );
  };

  doodlerLeftImg = new Image();
  doodlerLeftImg.src = "./assets/doodler-left.png";

  platformImg = new Image();
  platformImg.src = "./assets/platform.png";

  velocityY = initialVelcoityY;
  placePlatforms();
  requestAnimationFrame(update);
  document.addEventListener("keydown", moveDoodler);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) return;

  //   clear the canvas
  context.clearRect(0, 0, boardWidth, boardHeight);

  //   doodler
  doodler.x += velocityX;
  if (doodler.x > boardWidth) doodler.x = 0;
  if (doodler.x + doodler.width < 0) doodler.x = board.width;
  velocityY += gravity;
  doodler.y += velocityY;
  if (doodler.y > boardHeight) gameOver = true;
  context.drawImage(
    doodler.img,
    doodler.x,
    doodler.y,
    doodler.width,
    doodler.height
  );

  //  platforms
  for (let i = 0; i < platformArray.length; i++) {
    let platform = platformArray[i];
    if (velocityY < 0 && doodler.y < (boardHeight * 3) / 4) {
      platform.y -= initialVelcoityY; // slide platform down
    }
    if (detectCollision(doodler, platform) && velocityY >= 0) {
      velocityY = initialVelcoityY;
    }
    context.drawImage(
      platform.img,
      platform.x,
      platform.y,
      platform.width,
      platform.height
    );
  }

  //   clear platforms and add new platforms
  while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
    platformArray.shift(); // removes first element from the array
    newPlatform();
  }

  //   score
  updateScore();
  context.fillStyle = "black";
  context.font = "16px sans-serif";
  context.fillText(score, 5, 20);
  if (gameOver) {
    context.fillText(
      "Game Over: Press 'Space' to restart",
      boardWidth / 7,
      (boardHeight * 7) / 8
    );
  }
}

function moveDoodler(e) {
  if (e.code == "ArrowRight" || e.code == "KeyD") {
    velocityX = 4;
    doodler.img = doodlerRightImg;
  } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
    velocityX = -4;
    doodler.img = doodlerLeftImg;
  } else if (e.code == "Space" && gameOver) {
    // reset
    doodler = {
      img: doodlerRightImg,
      x: doodlerX,
      y: doodlerY,
      width: doodlerWidth,
      height: doodlerHeight,
    };
    velocityX = 0;
    velocityY = initialVelcoityY;
    score = 0;
    maxScore = 0;
    gameOver = false;
    placePlatforms();
  }
}

function placePlatforms() {
  platformArray = []; //clear

  // starting platforms
  let platform = {
    img: platformImg,
    x: boardWidth / 2,
    y: boardHeight - 50,
    width: platformWidth,
    height: platformHeight,
  };

  platformArray.push(platform);

  for (let i = 0; i < 6; i++) {
    let randomX = Math.floor((Math.random() * boardWidth * 3) / 4);
    let platform = {
      img: platformImg,
      x: randomX,
      y: boardHeight - 150 - 75 * i,
      width: platformWidth,
      height: platformHeight,
    };
    platformArray.push(platform);
  }
}

function newPlatform() {
  let randomX = Math.floor((Math.random() * boardWidth * 3) / 4);
  let platform = {
    img: platformImg,
    x: randomX,
    y: -platformHeight,
    width: platformWidth,
    height: platformHeight,
  };
  platformArray.push(platform);
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top left corner
    a.x + a.width > b.x && //a's top right corner passes b's top left corner
    a.y < b.y + b.width && //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y
  ); //a's bottom left corner passes b's top left corner
}

function updateScore() {
  let points = Math.floor(50 * Math.random());
  if (velocityY < 0) {
    maxScore += points;
    score = Math.max(score, maxScore);
  } else {
    maxScore -= points;
  }
}
