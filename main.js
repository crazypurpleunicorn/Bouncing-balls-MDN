const canvas = document.querySelector("canvas");
const ctx=canvas.getContext("2d");

const width=canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const totalBalls=35;

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
  }





















  class Ball{
    constructor(x,y,velX,velY,color,size){
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
        this.conunter = 0;

    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle=this.color;
        ctx.arc(this.x,this.y, this.size, 0, 2*Math.PI);
        ctx.fill();
    }
    update() {
      if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
      }
    
      if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
      }
    
      if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
      }
    
      if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
      }
    
      this.x += this.velX;
      this.y += this.velY;
    }

    //collision detect function, this function will tell me wether this ball has collided with an
    //other given ball or not
    collisonDetectBetweenBall(ball){
      //there will be a collision if the radius of the other ball comes into our radius
      const horizontalDistanceBetweenBalls=this.x-ball.x;
      const verticalDistanceBetweenBalls=this.y-ball.y
      const distanceBetweenTheBallsCentres=Math.sqrt(horizontalDistanceBetweenBalls*horizontalDistanceBetweenBalls+verticalDistanceBetweenBalls*verticalDistanceBetweenBalls);

      if (distanceBetweenTheBallsCentres <= this.size + ball.size){
        // if a collision occurrs change the color of our colliding balls
        ball.this = this.color = randomRGB();
      }
    }

    collisionDetectAllBalls(){
      //iterate over all all balls
      for(const ball of balls){
        //only other ball, not ourselves
        if( this !== ball ){
          this.collisonDetectBetweenBall(ball)
        }
      
    }

    

    
  }
}


const balls = [];

while (balls.length < 15) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
}

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  //MDN Code
  /*for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetectAllBalls()
  }*/
  //My code: In the previous code the collsion happens for the 1st ball between the 'future' and the past,
  //since the 1st ball position has been actualized only and takes the position of the rest of the balls 
  //from the previous frame, so I think that to actualize all balls before calculating collisions would 
  //make for a more realistic scenario. So let us draw the balls from the actual frame first, then update all the
  //balls, and calculate wether there will be collision.
  
  for (const ball of balls) {
    ball.draw();
  }

  for (const ball of balls) {
    ball.update();
  }
  // other problem with the MDN code is that for a pair of conflicting balls the color will change
  //twice and not once, since it will run two times when ball A detects conflict with ball B, and when 
  //ball B detects conflict with ball A
  
  for (const ball of balls) {
    ball.collisionDetectAllBalls()
  }
  

  requestAnimationFrame(loop);
}

loop();
  
  