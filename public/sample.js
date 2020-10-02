const board = document.getElementsByTagName("canvas")[0];
board.height = window.innerHeight;
board.width = window.innerWidth;

//Create solid rectangle
const ctx = board.getContext("2d");
// ctx.fillStyle = "gray";
// ctx.fillRect(30, 20, window.innerWidth / 2, window.innerHeight / 2);

// // Create border of rectangle
// ctx.strokeStyle = "black"; // this is also default value
// ctx.lineWidth = 15; // default value is 5
// ctx.strokeRect(30, 20, window.innerWidth / 2, window.innerHeight / 2);

// // Create line
// ctx.strokeStyle = "cyan";
// ctx.lineWidth = 2;
// ctx.beginPath();
// ctx.moveTo(100, 100);
// ctx.lineTo(500, 500);
// ctx.lineTo(1000, 500);
// ctx.stroke();
// ctx.closePath();