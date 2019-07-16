var canvas = document.getElementById("maze");
var ctx = canvas.getContext("2d");
var userInput = document.getElementById("driver_code").value;
//var maze_sel = document.getElementById("maze_sel").value;


//var maze_sel = "88us";
var maze_sel;
var driver;
var memMaze = [];
// canvas.width = 600;
// canvas.height = 600;

var NORTH	= 0;
var EAST	= 1;
var SOUTH	= 2;
var WEST	= 3;
var VISIT	= 4;
var DATA	= 5;


var cWidth = 16;
var cHeight = 16;
var pwidth = canvas.width;
var pheight = canvas.height;
var pCellWidth = pwidth/cWidth;
var pCellHeight = pheight/cHeight;
var mRadius = Math.floor(pCellWidth/2) - 5;
var maze_selp;
var maze;
var timerT;
var i, x, y;
var px;
var py;
var code;
var speed = 200;
var mouse, mouseLog;
var attribute = [
	{x: 0,y: 0,o: "S",c: "Green"},
	{x: 15,y: 0,o: "W",c: "Blue"},
	{x: 0,y: 15,o: "E",c: "Yellow"},
	{x: 15,y: 15,o: "N",c: "Purple"}
//	{x: 7,y: 7,o: "N",c: "Orange"},
//	{x: 5,y: 15,o: "W",c: "Gray"}
];
var mouseList = new Array(attribute.length)
var mouseLogList = new Array(attribute.length)

function allIsHome(){
	for (var i = 0; i < mouseList.length; i++) {
		if (mouseList[i].isHome() == false) {return false;}
	}
	return true;
}
function changeSpeed(){
	stop();
	start();
}
function updateMouse(){
	for (var i = 0; i < mouseList.length; i++) {
		mouseList[i].draw();
	}
};
function loadDriver(driverp){
	code = driverp;

	// make sure a maze is loaded.
	if (maze_sel && maze_sel !== "loading") {

		/*
		if (driver.load) {
			driver.load();
		}
		*/
		//mouse.home();
		//mouse.memClear(); // clear the mouses memory.
		reset();

		return true;
	} else {
		return false;
	}
}
function rads(degrees){
	return (Math.PI/180)*degrees;
};
function getDir(dir, way){
	if (way === "R"){
		switch(dir){
			case "N": return "E";
			case "E": return "S";
			case "S": return "W";
			case "W": return "N";
		}
	}else if (way === "L"){
		switch(dir){
			case "N": return "W";
			case "E": return "N";
			case "S": return "E";
			case "W": return "S";
		}
	}
};
function mouse(cellX, cellY, dir, color){
	this.startPosX = cellX;
	this.startPosY = cellY;
	this.dir = dir;
	this.cellX = cellX;
	this.cellY = cellY;
	this.color = color;
	var pMouseX = this.cellX*pCellWidth + (pCellWidth/2);
    var pMouseY = this.cellY*pCellHeight + (pCellHeight/2);
	var animateDir;
	var animateMove;
	var animateTurn = "F"
	var rotatedAmount = 0;
	this.isHome = function(){
		return (this.cellX === this.startPosX) && (this.cellY === this.startPosY)
	}
	this.home = function(){
		this.cellX = this.startPosX;
		this.cellY = this.startPosY;
		this.draw();
	}
	this.memClear = function(){
		var x, y;
		for (y=0;y<cHeight;y++) {
			memMaze[y] = [];
			for (x=0;x<cWidth;x++) {
				// [NORTH,EAST,SOUTH,WEST,VISIT,DATA]
				memMaze[y][x] = [];
				if (y===0) {
					memMaze[y][x][NORTH] = false;  // wall north
				} else { 
					memMaze[y][x][NORTH] = true;
				}
				if (y===cHeight-1) {
					memMaze[y][x][SOUTH] = false; // wall south
				} else { 
					memMaze[y][x][SOUTH] = true;
				}
				if (x===0) {
					memMaze[y][x][WEST] = false; // wall west
				} else { 
					memMaze[y][x][WEST] = true;
				}
				if (x===cWidth-1) {
					memMaze[y][x][EAST] = false; // wall east
				} else { 
					memMaze[y][x][EAST] = true;
				}
				memMaze[y][x][VISIT] = false;
				memMaze[y][x][DATA] = 0;
			}
		}
	}
	this.memGetVisitedLeft = function(){
		try{
		switch(this.dir){
			case "N": return memMaze[this.cellY][this.cellX-1][VISIT];
			case "E": return memMaze[this.cellY-1][this.cellX][VISIT];
			case "S": return memMaze[this.cellY][this.cellX+1][VISIT];
			case "W": return memMaze[this.cellY+1][this.cellX][VISIT];
		}
		}catch(err){return true;}
	}
	this.memGetVisitedRight = function(){
		try{
		switch(this.dir){
			case "N": return memMaze[this.cellY][this.cellX+1][VISIT];
			case "E": return memMaze[this.cellY+1][this.cellX][VISIT];
			case "S": return memMaze[this.cellY][this.cellX-1][VISIT];
			case "W": return memMaze[this.cellY-1][this.cellX][VISIT];
		}
		}catch(err){return true;}
	}
	this.memGetVisitedFwd = function(){
		try{
		switch(this.dir){
			case "N": return memMaze[this.cellY-1][this.cellX][VISIT];
			case "E": return memMaze[this.cellY][this.cellX+1][VISIT];
			case "S": return memMaze[this.cellY+1][this.cellX][VISIT];
			case "W": return memMaze[this.cellY][this.cellX-1][VISIT];
		}
	}catch(err){return true;}
	}
	this.memGetVisitedBack = function(){
		try{
		switch(this.dir){
			case "N": return memMaze[this.cellY+1][this.cellX][VISIT];
			case "E": return memMaze[this.cellY][this.cellX-1][VISIT];
			case "S": return memMaze[this.cellY-1][this.cellX][VISIT];
			case "W": return memMaze[this.cellY][this.cellX+1][VISIT];
		}
		}catch(err){return true;}
	}
	this.fwd = function(){
		this.erase()
		//console.log("forward");
		switch(this.dir){
			case "N":if (maze[this.cellY][this.cellX].indexOf("N") !== -1) {this.cellY -= 1}break;
			case "E":if (maze[this.cellY][this.cellX].indexOf("E") !== -1) {this.cellX += 1}break;
			case "S":if (maze[this.cellY][this.cellX].indexOf("S") !== -1) {this.cellY += 1}break;
			case "W":if (maze[this.cellY][this.cellX].indexOf("W") !== -1) {this.cellX -= 1}break;
		}
	}
	this.back = function(){
		this.erase()
		//console.log("backwards")
		switch(this.dir){
			case "N":if (maze[this.cellY][this.cellX].indexOf("S") !== -1) {this.cellY += 1}break;
			case "E":if (maze[this.cellY][this.cellX].indexOf("W") !== -1) {this.cellX -= 1}break;
			case "S":if (maze[this.cellY][this.cellX].indexOf("N") !== -1) {this.cellY -= 1}break;
			case "W":if (maze[this.cellY][this.cellX].indexOf("E") !== -1) {this.cellX += 1}break;
		}
	}
	this.right = function(){
		this.erase()
		//console.log("right")
		this.dir = getDir(this.dir, "R")
	}
	this.left = function(){
		this.erase()
		//console.log("left")
		this.dir = getDir(this.dir, "L")
	}
	this.isPathFwd = function(){
		if (maze[this.cellY][this.cellX].indexOf(this.dir) !== -1){return true}
	}
	this.isPathBack = function(){
		if (maze[this.cellY][this.cellX].indexOf(getDir(getDir(this.dir, "R"), "R")) !== -1){return true}
	}
	this.isPathRight = function(){
		if (maze[this.cellY][this.cellX].indexOf(getDir(this.dir, "R")) !== -1){return true}
	}
	this.isPathLeft = function(){
		if (maze[this.cellY][this.cellX].indexOf(getDir(this.dir, "L")) !== -1){return true}
	}
	this.erase = function(){
		var px, py;
		px = pMouseX - (pCellWidth-2)/2;
		py = pMouseY - (pCellHeight-2)/2;
    	ctx.clearRect(px,py,pCellWidth-3, pCellHeight-3);
    	ctx.fillStyle = color;
    	ctx.fillRect(pMouseX-(pCellWidth/2)+1.5, pMouseY-(pCellHeight/2)+1.5, pCellWidth-3, pCellHeight-3)
	}
	this.draw = function(){
		// ctx.beginPath();
		// ctx.arc(cellX*50 + 25, cellY*50 + 25, 20, 0, 2*Math.PI);
		// ctx.fillStyle = color;
		// ctx.fill();
		pMouseX = this.cellX*pCellWidth + (pCellWidth/2);
    	pMouseY = this.cellY*pCellHeight + (pCellHeight/2);

		memMaze[this.cellY][this.cellX][VISIT] = true;
		var aMouseDir;
		switch(this.dir){
			case "N": aMouseDir = 270;break;
			case "E": aMouseDir = 0;break;
			case "S": aMouseDir = 90;break;
			case "W": aMouseDir = 180;break;
		}

		/////
	    ctx.fillStyle = color;
		this.erase()
		ctx.beginPath();
		ctx.arc(pMouseX,pMouseY,mRadius,rads(aMouseDir),
			rads(aMouseDir+360),false); // Outer circle

		ctx.lineTo(pMouseX,pMouseY);
		/*
		ctx.moveTo(110,75);
		ctx.arc(75,75,35,0,Math.PI,false);   // Mouth (clockwise)
		ctx.moveTo(65,65);
		ctx.arc(60,65,5,0,Math.PI*2,true);  // Left eye
		ctx.moveTo(95,65);
		ctx.arc(90,65,5,0,Math.PI*2,true);  // Right eye
		*/
		ctx.closePath();
		ctx.fillStyle = color;
		ctx.fill();
		ctx.strokeStyle = "#000";
		ctx.stroke();
    }//end draw func
};//end mouse func
function start(){
	timerT = setInterval(function() {mouseCode()}, speed);
};
function stop(){
	clearInterval(timerT);
};
function step(){
	stop();
	mouseCode();
};
function drawMaze() {
	var x;
	var y;
	var px;
	var py;
	var code;
	var linecolor = "red";
	// clear canvas
	canvas.width = canvas.width;

	for (y=0;y<cHeight;y++) {
		for (x=0;x<cWidth;x++) {
			code = maze[y][x];
			px = x * pCellWidth;
			py = y * pCellHeight;
			// north wall
			ctx.beginPath();
			ctx.moveTo(px,py);
			ctx.lineTo(px+pCellWidth,py);
			if (code.indexOf("N") !== -1) {
				ctx.strokeStyle="white";
			} else {
				ctx.strokeStyle=linecolor;
			}
			ctx.stroke();
			//console.log(ctx.strokeStyle)
			// east wall
			ctx.beginPath();
			ctx.moveTo(px+pCellWidth,py);
			ctx.lineTo(px+pCellWidth,py+pCellHeight);
			if (code.indexOf("E") !== -1) {
				ctx.strokeStyle="white";
			} else {
				ctx.strokeStyle=linecolor;
			}
			ctx.stroke();

			// south wall
			ctx.beginPath();
			ctx.moveTo(px+pCellWidth,py+pCellHeight);
			ctx.lineTo(px,py+pCellHeight);
			if (code.indexOf("S") !== -1) {
				ctx.strokeStyle="white";
			} else {
				ctx.strokeStyle=linecolor;
			}
			ctx.stroke();

			// west wall
			ctx.beginPath();
			ctx.moveTo(px,py+pCellHeight);
			ctx.lineTo(px,py);
			if (code.indexOf("W") !== -1) {
				ctx.strokeStyle="white";
			} else {
				ctx.strokeStyle=linecolor;
			}
			ctx.stroke();
		}
	}
	reset();
}
function reset(){
	for (var i = 0; i < mouseList.length; i++) {
		mouseList[i].memClear();
		mouseList[i].home();
		updateMouse();
		mouseLogList[i] = []
		stop();
	}
};
function mouseCode() {
	for (var i = 0; i<mouseList.length; i++) {
		//console.log(mouseLog[i])
		mouse = mouseList[i];
		mouseLog = mouseLogList[i];
		run();
	}//end loop
	updateMouse();
};//end func
for (i = 0; i < attribute.length; i++) {	
	mouseList[i] = new mouse(attribute[i].x,attribute[i].y,attribute[i].o, attribute[i].c);
	mouseLogList = new Array(attribute.length)
}
function changeMaze() {
	maze_sel = $('#maze_sel option:selected').val();
	$("#maze_sel").val(maze_sel).attr('selected','selected');
	maze_sel = "./mazes_json/" + maze_sel + ".json";
	$.getJSON(maze_sel, function(json) {
		maze = json;
		drawMaze();
	});
};
changeMaze()

//	reset();
