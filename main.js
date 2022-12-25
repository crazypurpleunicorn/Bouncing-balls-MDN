const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("second canvas");
const ctx2 = canvas2.getContext("2d")

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
canvas2.width = width;
canvas2.height = height;


let conflictingBalls = [];


function random(
  min, 
  max
  ) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}





















class Ball {
  // we are going to add some mass to the balls, proportional to the area of the circle
  constructor(
    x, 
    y, 
    velX, 
    velY, 
    color, 
    size
    ) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.mass = Math.floor(Math.PI * size * size);
    this.InConflict = false;
    this.pairOfConflictingBallsAdded = false;

  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  drawSmiley() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
    //paint eyes

    //paint right eye
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(this.x + this.size / 4, this.y - this.size / 4, this.size / 6, 0, 2 * Math.PI);
    ctx.fill();

    //paint left eye
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(this.x - this.size / 4, this.y - this.size / 4, this.size / 6, 0, 2 * Math.PI);
    ctx.fill();

    //paint smiley
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(this.x, this.y, this.size / 2, 0, -Math.PI);
    ctx.fill()


  }


  /// I want my balls to have the option of draw a smiley
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
  /*If a collision is detected I would like my balls to bounce off.
  Inelastic collisions will be considered; that is an scenerio where no kinetic 
  energy is lost. Applying the first law of conservation of linear momentum
  and the conservation of kinetic energy...Given the mass, and velocity of the colliding balls
  we can calculate the new velocities of the ball (there will be a change in velocity only
    in its projection along the line that unites both centres). The formula is the following:

    v01 =(v1(m1 − m2) + 2m2v2/ m1 + m2). Where v01 is the new velocity along the axis between the 
    two centers and v1 is the initial velocity along this same axis(v2 is the initial velocity of the other ball)
    along this axis*/
  bounce(ball) {
    //First of all, I would like  to calculate the vector between this ball and the other ball.

    //x and y components of the vector going from this ball's center to the other ball's center
    let horizontalDistanceBetweenBalls = ball.x - this.x;
    let verticalDistanceBetweenBalls = ball.y - this.y;

    //let us calculate too the distance of this uniting vector(should be the sum of both radius)
    let distanceBetweenTheBallsCentres = Math.sqrt(horizontalDistanceBetweenBalls * horizontalDistanceBetweenBalls + verticalDistanceBetweenBalls * verticalDistanceBetweenBalls);

    //if we divide the vector by its module we obtain the unitary vector, with the following components:
    let unitaryX = horizontalDistanceBetweenBalls / distanceBetweenTheBallsCentres;
    let unitaryY = verticalDistanceBetweenBalls / distanceBetweenTheBallsCentres;

    //we will use this unitary vector to calculate how much of our ball's velocity (as well as the other ball) it's projected
    //into the center-center axis. We will do this with a dot product:
    //Velocity . Unitary Vector = vx*unitaryX+vy*unitaryY.

    let projectionOfThisBallsVelocityIntoAxis = this.velX * unitaryX + this.velY * unitaryY;
    let projectionOfOtherBallsVelocityIntoAxis = ball.velX * unitaryX + ball.velY * unitaryY;

    //follow the above formula. This is the new velocity along the axis, from this ball. Take into account that 
    //the component of velocity perpendicular to the center_center axis will not change. So the new velocity
    //vector from this ball will be [x, y](perpendicular component to center-center axis, from this ball's velocity)
    //+ [x,y], new velocity along  center_center axis

    let newVelocityOfThisBallIntoAxis = ((projectionOfThisBallsVelocityIntoAxis * (this.mass - ball.mass) + 2 * ball.mass * projectionOfOtherBallsVelocityIntoAxis) / (this.mass + ball.mass))
    //(v1(m1 − m2) + 2m2v2/ m1 + m2)
    // the vector in x, y coordinates will be expressed as scaling unit vector from center_center axis:

    let newVelocityOfThisBallIntoAxisX = unitaryX * newVelocityOfThisBallIntoAxis;
    let newVelocityOfThisBallIntoAxisY = unitaryY * newVelocityOfThisBallIntoAxis;

    //the perpendicular unit vector is:

    let unitaryXPerpendicular = -unitaryY;
    let unitaryYPerpendicular = unitaryX;


    //and the unchanged perpendicular projection of the velocity is:

    let VelocityOfThisBallPerpendiculartoAxis = unitaryXPerpendicular * this.velX + unitaryYPerpendicular * this.velY;
    // the vector in x, y coordinates will be expressed as scaling perpendicular unit vector:

    let VelocityOfThisBallPerpendiculartoAxisX = unitaryXPerpendicular * VelocityOfThisBallPerpendiculartoAxis;
    let VelocityOfThisBallPerpendiculartoAxisY = unitaryYPerpendicular * VelocityOfThisBallPerpendiculartoAxis;

    //Finally we will assign the new velocity vector to our ball:

    this.velX = VelocityOfThisBallPerpendiculartoAxisX + newVelocityOfThisBallIntoAxisX;
    this.velY = VelocityOfThisBallPerpendiculartoAxisY + newVelocityOfThisBallIntoAxisY;





  }




  //collision detect function, this function will tell me wether this ball has collided with an
  //other given ball or not
  collisonDetectBetweenBall(ball) {
    //there will be a collision if the radius of the other ball comes into our radius
    const horizontalDistanceBetweenBalls = -this.x + ball.x;
    const verticalDistanceBetweenBalls = -this.y + ball.y
    const distanceBetweenTheBallsCentres = Math.sqrt(horizontalDistanceBetweenBalls * horizontalDistanceBetweenBalls + verticalDistanceBetweenBalls * verticalDistanceBetweenBalls);

    if (distanceBetweenTheBallsCentres <= this.size + ball.size) {
      // if a collision occurrs change the color of our colliding balls
      /*ball.this = this.color = randomRGB();*/
      return true;
    }
    else {
      return false;
    }
  }

  collisionDetectAllBalls() {
    //iterate over all all balls
    for (const ball of balls) {
      //only other ball, not ourselves
      if (this !== ball) {
        let thereIsCollision = this.collisonDetectBetweenBall(ball);
        if (thereIsCollision && !this.InConflict) {

          //if there is a collision I want the balls to bounce
          this.bounce(ball)

          //Once the balls bounce, I will stop the bouncing between them untill the invasive
          //ball is out of this ball's radius, I will trigger a flag in both balls(since each 
          //ball compares against the rest, the other conflicting ball will eventually pass throug
          // InConflict = true):

          this.InConflict = true;

          //Then we need to run a function that will track the conflict between these 2 balls,
          //and deactivate the flags when they do no touch each other anymore .

          //add conflicting ball to array of conflicting balls
          if (!this.pairOfConflictingBallsAdded) {// by doing this we achieve that our pair of conflicting balls is just added once to the conflictingBalls list
            let pairOfConflictingBalls = [this, ball];
            ball.pairOfConflictingBallsAdded = true;
            this.pairOfConflictingBallsAdded = true;
            conflictingBalls.push(pairOfConflictingBalls)

          }



        }

      }

    }



  }
}
function IsconflictBetweenGivenBalls(
  ball1, 
  ball2
  ) {
  const horizontalDistanceBetweenBalls = -ball1.x + ball2.x;
  const verticalDistanceBetweenBalls = -ball1.y + ball2.y
  const distanceBetweenTheBallsCentres = Math.sqrt(horizontalDistanceBetweenBalls * horizontalDistanceBetweenBalls + verticalDistanceBetweenBalls * verticalDistanceBetweenBalls);

  if (distanceBetweenTheBallsCentres <= ball1.size + ball2.size) {
    return true;
  }
  else {
    return false;
  }

}
function trackConflict() {
  for (const pairOfBalls of conflictingBalls) {
    let ball1 = pairOfBalls[0];
    let ball2 = pairOfBalls[1];
    let IsConflict = IsconflictBetweenGivenBalls(ball1, ball2);

    if (IsConflict) {
      // keep conflicting balls in the list and dont put there IsConflict flags to false
    }
    else {
      //get conflicting balls out of the list and put there IsConflict flags to false
      ball1.InConflict = false;
      ball2.InConflict = false;

      conflictingBalls.splice(conflictingBalls.indexOf(pairOfBalls), 1);
      ball1.pairOfConflictingBallsAdded = false;
      ball2.pairOfConflictingBallsAdded = false;


    }


  }
}
function calculateTotalKineticEnergyOfTheSystem(balls) {
  let totalKineticEnergy = 0;
  for (const ball of balls) {
    let mass = ball.mass;
    let speed = Math.sqrt(ball.velX * ball.velX + ball.velY * ball.velY)
    let ballsKineticEnergy = (mass * speed * speed) / 2;
    totalKineticEnergy = totalKineticEnergy + ballsKineticEnergy;
    return totalKineticEnergy;
  }

}
function calculateCenterOfmass(balls) {
  let sumofx = 0;
  let sumofy = 0;
  let totalmass = 0;
  for (const ball of balls) {
    sumofx = sumofx + ball.x * ball.mass;
    sumofy = sumofy + ball.y * ball.mass;
    totalmass = totalmass + ball.mass;
  }
  3
  let xCenterOfMass = sumofx / totalmass;
  let ycenterofMass = sumofy / totalmass;

  return [xCenterOfMass, ycenterofMass];




}

const balls = [];
const numberOfBalls = 10;
while (balls.length < numberOfBalls) {
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

//Create ball for centre of mass
let xycenterOfMass = calculateCenterOfmass(balls);
let xCenterOfMass = xycenterOfMass[0];
let ycenterofMass = xycenterOfMass[1];

const centerOfMassBall = new Ball(
  xCenterOfMass,
  ycenterofMass,
  0,
  0,
  'rgb(255,255,255)',
  15
  );

let arrayOfCMpositions = [];


//paint red canvas
ctx2.fillStyle = "rgba(255, 0, 0, 1)";
ctx2.fillRect(0,
  0,
  width,
  height
  );

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0,
    0,
    width,
    height);

  //Calculate actual total kinetic energy
  let actualTotalKineticEnergy = calculateTotalKineticEnergyOfTheSystem(balls);
  //paint total kinetic energy on red canvas
  ctx2.fillStyle = "rgba(0, 0, 0, 1)";
  ctx2.fillRect(width / 2,
   0,
  5,
  actualTotalKineticEnergy / 1000
  );

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
    ball.collisionDetectAllBalls()
  }
  // other problem with the MDN code is that for a pair of conflicting balls the color will change
  //twice and not once, since it will run two times when ball A detects conflict with ball B, and when 
  //ball B detects conflict with ball A

  for (const ball of balls) {
    ball.update();
  }

  trackConflict();




  centerOfMassBall.drawSmiley();

  //add centerofmass position to array
  const centreOfMassPair = [centerOfMassBall.x, centerOfMassBall.y];
  arrayOfCMpositions.push(centreOfMassPair);

  //paint all centers of mass
  for (const element of arrayOfCMpositions) {
    let x = element[0];
    let y = element[1];
    //draw point
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.fill();


  }


  //calculate new center of mass

  xycenterOfMass = calculateCenterOfmass(balls)
  xCenterOfMass = xycenterOfMass[0];
  ycenterofMass = xycenterOfMass[1];
  centerOfMassBall.x = xCenterOfMass;
  centerOfMassBall.y = ycenterofMass;
  requestAnimationFrame(loop);
}

loop();

