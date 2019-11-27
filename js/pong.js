const canvas = document.getElementById("pong");

const ctx = canvas.getContext('2d');


// load sounds
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

// Ball object
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
}

// User Paddle
const user = {
    x : (canvas.width -100)/2,
    y : 0,
    width : 100,
    height : 10,
    score : 0,
    color : "WHITE"
}

// Com Paddle
const com = {
    x : (canvas.width - 100) / 2,
    y : canvas.height - 10,
    width: 100,
    height : 10,
    score : 0,
    color:"white"
}

const net = {
    y : (canvas.height - 2)/2,
    x : 0,
    width : 10,
    height : 2,
    color : "WHITE"
}

// draw a rectangle
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1.0;
    
}
// draw circle, will be used to draw the ball
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// draw the net
function drawNet(){
    for(let i = 0; i <= canvas.width; i+=15){
        drawRect(net.x + i, net.y, net.width, net.height, net.color)
    }
}

// draw text
function drawText(text , x, y){
    ctx.fillStyle = "#FFF";
    ctx.font = "45px fantasy";
    ctx.fillText(text, x, y);
}

// listening to the mouse
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    user.x = evt.clientX - rect.left - user.width/2;
}

// when COM or USER scores, we reset the ball
function resetBall(){
    ball.y = canvas.width/2;
    ball.x = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}
// collision detection
function collision(b,p){
    p.top = p.x;
    p.bottom = p.x + p.width;
    p.left = p.y;
    p.right = p.y + p.height;
    
    b.top = b.x - b.radius;
    b.bottom = b.x + b.radius;
    b.left = b.y - b.radius;
    b.right = b.y + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}
// update function, the function that does all calculations
function update(){
    if(ball.y - ball.radius < 0){
        com.score++;
        comScore.play();
        resetBall();
    } else if(ball.y + ball.radius > canvas.height){
        user.score++;
        comScore.play();
        resetBall();
    }

    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // computer plays for itself, and we must be able to beat it
    // simple AI
    com.x += ((ball.x - (com.x + com.width/2)))*0.1;

    // when the ball collides with bottom and top walls we inverse the X velocity.
    if(ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width){
        ball.velocityX = -ball.velocityX;
        wall.play();
    }

    // we check if the paddle hit the user or the com paddle
    let player = (ball.y + ball.radius < canvas.height/2) ? user : com;

    // if the ball hits a paddle
    if(collision(ball,player)){
        // play sound
        hit.play();
        // we check where the ball hits the paddle
        let collidePoint = (ball.x - (player.x + player.width/2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.width/2);
        
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI/4) * collidePoint;
        
        // change the X and Y velocity direction
        let direction = (ball.y + ball.radius < canvas.height/2) ? 1 : -1;
        ball.velocityY = direction * ball.speed * Math.cos(angleRad);
        ball.velocityX = ball.speed * Math.sin(angleRad);
        
        // speed up the ball everytime a paddle hits it.
        ball.speed += 0.1;
    }



}
function render (){
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "rgba(33, 33, 33, .5)");

    // draw the user score to the left
    drawText(user.score,7*canvas.width/8,2*canvas.height/5);
    
    // draw the COM score to the right
    drawText(com.score,7*canvas.width/8, (4*canvas.height/6));

     // draw the net
     drawNet();
    
     // draw the user's paddle
     drawRect(user.x, user.y, user.width, user.height, user.color);
     
     // draw the COM's paddle
     drawRect(com.x, com.y, com.width, com.height, com.color);
     
     // draw the ball
     drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function game(){
    update();
    render();
}

// number of frames per second
let framePerSecond = 50;

//call the game function 50 times every 1 Sec
let loop = setInterval(game,1000/framePerSecond);