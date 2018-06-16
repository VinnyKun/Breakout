var canvas;

var canvasContext;

var ball = {

	x: 3000,

	y: 250,

	speedXAxis: 6,

	speedYAxis: 6,
}


var bat = {

	x: 300,

	y: 470,

	widthX: 80,

	lengthY: 10,
}

var block = {

	widthX: 75,

	lengthY: 20,

	number: 8,
}

var blockGrid = [ true, true, true true, true, true, true, true ];


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

}

var ballMovement = function () {

	//basic ball movement is both X and Y axis
	ball.y += ball.speedYAxis;
	console.log(ball.YPosition)
	ball.x += ball.speedXAxis;
	console.log(ball.YPosition)


	//when ball hit the sides of the canvas, it will bounce off in the opposite x direction
	if (ball.x < canvas.width - 5) {
	ball.speedXAxis = -ball.speedXAxis
	}

	if (ball.x > 5) {
		ball.speedXAxis = -ball.speedXAxis;
	}


	////when ball hit the top of the canvas, it will bounce off in the opposite y direction
	if (ball.y < 1) {
	ball.speedYAxis = -ball.speedYAxis
	}

	if (ball.y > canvas.height) {

		//ball reset in the center if ball is lost
		ball.x = canvas.width/2;
		ball.y = canvas.height/2;
		ball.speedXAxis = 0
		ball.speedYAxis = ball.speedYAxis;
	}


	if (ball.y > bat.y &&
		ball.y < bat.y + bat.lengthY &&
		ball.x > bat.x - 10 &&
		ball.x < bat.x + bat.widthX + 10 ) {

		ball.speedYAxis = -ball.speedYAxis

		//difference between ball centre and bat centre
		var differenceX = ball.x - (bat.x + bat.widthX/2)
		ball.speedXAxis = differenceX * 0.3;
	}


}



var gameParts = function () {	
	
	//the canvas/'field' is colored
	canvasContext.fillStyle = ('#34304c');

	//x,y,width,height: cover entire canvas, fillRect draws a rectangle
	canvasContext.fillRect(0, 0, canvas.width, canvas.height) 

	console.log('field is ready!')


	
	//the player bat rectangle is coloured white
	canvasContext.fillStyle = ('#5a9d45');

	//x,y,width,height: position , fillRect draws a rectangle
	canvasContext.fillRect(bat.x, bat.y, bat.widthX, bat.lengthY) 
	
	//to ensure function is working
	console.log('at bat!') 



	
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
	console.log('ball in play')

	drawBlocks(0, '#00ff24');


}

var drawBlocks = function(row, color)	{

	//the block rectangle is coloured
	canvasContext.fillStyle = (color);

	
	canvasContext.fillRect(block.widthX * 0, row * 25 + 1, block.widthX - 2, block.lengthY) 

	
	canvasContext.fillRect(block.widthX * 1, row * 25 + 1, block.widthX - 2, block.lengthY)

	
	canvasContext.fillRect(block.widthX * 2, row * 25 + 1, block.widthX - 2, block.lengthY)

	
	canvasContext.fillRect(block.widthX * 3, row * 25 + 1, block.widthX - 2, block.lengthY)

	
	canvasContext.fillRect(block.widthX * 4, row * 25 + 1, block.widthX - 2, block.lengthY)

	
	canvasContext.fillRect(block.widthX * 5, row * 25 + 1, block.widthX - 2, block.lengthY)


	canvasContext.fillRect(block.widthX * 6, row * 25 + 1, block.widthX - 2, block.lengthY)


	canvasContext.fillRect(block.widthX * 7, row * 25 + 1, block.widthX , block.lengthY)



	//to ensure function is working
	console.log('blocks in place!')  

}
