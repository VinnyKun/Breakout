var canvas;

var canvasContext;

var block = {

	widthX: 50,

	lengthY: 20,

	columns: 12,

	rows: 14,

	remaining: 0,
}

var blockGrid = new Array (block.columns * block.rows);


var bat = {

	x: 300,

	y: 470,

	widthX: 80,

	lengthY: 10,
}



var ball = {

	x: bat.x,

	y: bat.y - 20,

	speedXAxis: 6,

	speedYAxis: 6,

	remaining: 5
}


window.onload = function () {

	//select the canvas element
	canvas = document.querySelector('canvas')

	//this gives 2D rendering context for the canvas
	canvasContext = canvas.getContext('2d')

	
	setInterval(function () {	
	gameParts();
	ballMovement();
	}, 25);

	//event listener to control paddle
	canvas.addEventListener('mousemove', function(event){
		
		//variable containing the area of the canvas
		var rect = canvas.getBoundingClientRect();
		
		//variable of the whole body
		var wholeBody = document.documentElement;
		
		// this returns the postion of mouse in the x-axis
		//regardless of the position of the of canvas relative to body/scroll 
		mouseXPosition = event.clientX - rect.left - wholeBody.scrollLeft;

		//this attaches the mouse's x coordinates to bat's centre
		bat.x = mouseXPosition - bat.widthX/2

	})

	blockReset();


}


var ballBlockCollision = function () {

	// X Y position of a particular block hit by ball
	var ballBlockColumnPosition = Math.floor(ball.x / block.widthX)
	var ballBlockRowPosition = Math.floor(ball.y / block.lengthY)

	//pinpoint which block was hit
	var hitBlockIndex = block.columns * ballBlockRowPosition + ballBlockColumnPosition

	//first conditional that the block must exist within defined blocks and rows
	if (ballBlockRowPosition >= 0 && ballBlockRowPosition < block.rows &&
		ballBlockColumnPosition >= 0 && ballBlockColumnPosition < block.columns) {
		
		//if the block hit is 'present' or true, it will turn false and 'cease to exist'
		if(blockGrid[hitBlockIndex]) {
			blockGrid[hitBlockIndex] = false;

			//sound upon hit: currenty off
			//blockSoundPlay();
			//playSound('#blockHit');
			
			//once false block count must be reduced
			block.remaining -= 1

			//to show decreasing blocks on the screen
			var blocks = document.querySelector('#blocks')
			blocks.innerHTML = block.remaining
			if (block.remaining == 0) {
				//alert('gameOver!')

				//stop ball movement when gameover
				ball.speedYAxis = 0;
				ball.speedXAxis = 0;
				//display modal when gameover
				toggleModal()
			}
			
			//after collision ball flight:
			//first locate ball's previous location
			var previousBallX = ball.x - ball.speedXAxis;
			var previousBallY = ball.y - ball.speedYAxis;
			var previousBallBlockColumnPosition = Math.floor(previousBallX / block.widthX);
			var previousBallBlockRowPosition = Math.floor(previousBallY / block.lengthY);

			//if ball was in the same column its speed in x axis will not be affected
			if (previousBallBlockColumnPosition != ballBlockColumnPosition) {
				ball.speedXAxis = -ball.speedXAxis
			}	

			//if ball was in the same row its speed in the Y axis will not be affected
			if (previousBallBlockRowPosition != ballBlockRowPosition) {
				ball.speedYAxis = -ball.speedYAxis
			}	
		}				
	}
}

var ballBatCollision = function () {

	//when ball hits bat
	if (ball.y > bat.y &&
		ball.y < bat.y + bat.lengthY &&
		ball.x > bat.x - 10 &&
		ball.x < bat.x + bat.widthX + 10 ) {

		ball.speedYAxis = -ball.speedYAxis

		//difference between ball centre and bat centre
		var differenceX = ball.x - (bat.x + bat.widthX/2)
		ball.speedXAxis = differenceX * 0.25;
	}


}

var ballMovement = function () {

	ballBlockCollision();
	ballBatCollision();
	
	var balls = document.querySelector('#balls')
	balls.innerHTML = ball.remaining

	//when ball hit the sides of the canvas, it will bounce off in the opposite x direction
	if (ball.x > canvas.width - 5  && ball.speedXAxis > 0.0) {
	ball.speedXAxis = -ball.speedXAxis
	}

	if (ball.x < 5 && ball.speedXAxis < 0.0) {
		ball.speedXAxis = -ball.speedXAxis;
	}

	//when ball hit the top of the canvas, it will bounce off in the opposite y direction
	if (ball.y < 1 && ball.speedYAxis < 0.0) {
	ball.speedYAxis = -ball.speedYAxis
	}

	//basic ball movement is both X and Y axis
	ball.y += ball.speedYAxis;
	//console.log(ball.y)
	ball.x += ball.speedXAxis;
	//console.log(ball.x)


	if (ball.y > canvas.height) {

		ball.remaining -= 1
		//console.log('balls:' + ball.remaining)
		balls.innerHTML = ball.remaining
		//ball reset in the center if ball is lost
		ball.x = bat.x + bat.widthX/2;
		ball.y = bat.y - 20;
		ball.speedXAxis = 0;
		ball.speedYAxis = ball.speedYAxis;

		if (ball.remaining == 0) {
			//alert('gameOver!')
			
			//stop ball movement when gameover
			ball.speedYAxis = 0;
			ball.speedXAxis = 0;
			
			//display gameover modal
			toggleModal()
		}
	}


}



var gameParts = function () {	
	
	//the canvas/'field' is colored
	canvasContext.fillStyle = ('#34304c');

	//x,y,width,height: cover entire canvas, fillRect draws a rectangle
	canvasContext.fillRect(0, 0, canvas.width, canvas.height) 

	//console.log('field is ready!')


	
	//the player bat rectangle is coloured white
	canvasContext.fillStyle = ('#5a9d45');

	//x,y,width,height: position , fillRect draws a rectangle
	canvasContext.fillRect(bat.x, bat.y, bat.widthX, bat.lengthY) 
	
	//to ensure function is working
	//onsole.log('at bat!') 



	
	//the ball is coloured:
	canvasContext.fillStyle = ('00820c')

	//no arcfill so beginPath function is needed to fill colour
	canvasContext.beginPath();
	
	//(x,y,radius,angle, radians: ball position and size.
	// ball center coordinates accessed from its object
	canvasContext.arc(ball.x, ball.y, 5, 0, Math.PI * 2, true)

	////no arcfill so this helps fill colour
	canvasContext.fill();

	// to ensure that function is working
	//console.log('ball in play')

	
	
	drawBlocks();
}


var drawBlocks = function()	{

	//the block rectangle is coloured
	canvasContext.fillStyle = ('#00ff24');

	for (var rowNumber = 0; rowNumber < block.rows; rowNumber++) {

		for (var columnNumber = 0; columnNumber < block.columns; columnNumber++) {

			//every block will have a unique index(left to right reset left to right)
			var index = block.columns * rowNumber + columnNumber

			if (blockGrid[index]) {
				canvasContext.fillRect(block.widthX * columnNumber, rowNumber * block.lengthY, block.widthX - 2, block.lengthY -1) 
			}//drawing of one block of a row column by column

		}// of column count per row	

	} //end of row count

	//to ensure function is working
	//console.log('blocks in place!')  
}


var blockReset = function () {
	block.remaining = 0
	var i;

	// for (i = 0; i < block.columns * 13; i++) {
	// 	blockGrid[i] = false;

	//}//to empty out first two rows to create some wall action
	
	for (i = block.columns * 3; i < block.columns * block.rows; i++) {
		blockGrid[i] = true;
		block.remaining += 1
	}// to show the remaining rows

	var blocks = document.querySelector('#blocks')
	blocks.innerHTML = block.remaining
	
	// blockGrid[102] = false;
}


var toggleModal = function() {

	var modal = document.querySelector(".modal");

        
    modal.classList.toggle("show-modal");
    
         
}

// var playSound = function(soundID) {

// 	var SoundSelectedByID = document.querySelector(soundID)
		
// 	SoundSelectedByID.play();
// }

// playSound('#blockHit');

// playSound('#batHit');


// var blockSound = new Audio ('blockhit.mp3')

// var blockSoundPlay = function () { 

// 	blockSound.play();

//  }	

// var batSound = new Audio ('batHitBall.mp3')

// var batkSoundPlay = function () { 

// 	batSound.play();

// }	




















