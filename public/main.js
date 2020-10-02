const board = document.getElementsByTagName("canvas")[0];
const canvasWindow = document.getElementsByClassName("canvasParent")[0];
var boardPos = board.getBoundingClientRect();
var body = document.querySelector("body");
const socket = io.connect('https://canvas3111.herokuapp.com/');
var flag = 0;
var currentZoomValue = 1;
var previousZoomValue = 1; // Shows the previous zoom value
var pencilClicks = 1; // shows previous clicks
var eraserClicks = 0; // shows previous clicks
var magClicks = 0; // shows previous clicks
var pencilWidth = 25;
var eraserWidth = 30;
var pencilColor = "black";

board.height = 1080;
board.width = 1920;
canvasWindow.style.height = window.innerHeight + "px";
canvasWindow.style.width = window.innerWidth + "px";

var memory = [];
var poppedMemory = [];
const ctx = board.getContext("2d");
// storage
function addLine(color, thickness, startX, startY) {
    var objStart = {
        "color": color,
        "thickness": thickness,
        "startX": startX,
        "startY": startY,
        "endPoints": []
    };
    memory.push(objStart);
}

function endLine(endX, endY) {
    var obj = {
        "X": endX,
        "Y": endY
    };
    var lineObj = memory[memory.length - 1];
    lineObj.endPoints.push(obj);
    memory[memory.length - 1] = lineObj;

}

// Creating Lines
// ctx.lineWidth = lineWidth;
board.addEventListener("mousedown", function (e) {
    // this first step is taken for accounting for the different approaches taken for +zoom and -zoom
    if (board.height < window.innerHeight) {
        boardPos = board.getBoundingClientRect();
        var x = (e.clientX - boardPos.x + canvasWindow.scrollLeft) / currentZoomValue;
        var y = (e.clientY - boardPos.y + canvasWindow.scrollTop) / currentZoomValue;
    } else {
        var x = (e.clientX - 16 + canvasWindow.scrollLeft) / currentZoomValue;
        var y = (e.clientY - 16 + canvasWindow.scrollTop) / currentZoomValue;
    }
    if (pencilClicks != 0) {
        ctx.lineWidth = pencilWidth;
        ctx.strokeStyle = pencilColor;
        ctx.globalCompositeOperation = "source-over";
    } else {
        ctx.lineWidth = eraserWidth;
        ctx.strokeStyle = "white";
        ctx.globalCompositeOperation = "destination-out";
    }
    var pt = {
        "color": ctx.strokeStyle,
        "thickness": ctx.lineWidth,
        "x": x,
        "y": y
    };
    socket.emit("drawdown", pt);
    flag = 1;
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.moveTo(x, y);
    addLine(ctx.strokeStyle, ctx.lineWidth, x, y);
});
board.addEventListener("mousemove", function (e) {
    if (flag == 1) {
        if (board.height < window.innerHeight) {
            boardPos = board.getBoundingClientRect();
            var x = (e.clientX - boardPos.x + canvasWindow.scrollLeft) / currentZoomValue;
            var y = (e.clientY - boardPos.y + canvasWindow.scrollTop) / currentZoomValue;
        } else {
            var x = (e.clientX - 16 + canvasWindow.scrollLeft) / currentZoomValue;
            var y = (e.clientY - 16 + canvasWindow.scrollTop) / currentZoomValue;
        }
        var pt = {
            "x": x,
            "y": y
        };
        socket.emit("drawmove", pt);
        ctx.lineTo(x, y);
        ctx.stroke();
        endLine(x, y);
    }
});
board.addEventListener("mouseup", function (e) {
    ctx.globalCompositeOperation = "source-over";
    socket.emit("drawup");
    flag = 0;
    poppedMemory.length = 0; // Because of required functionality
    ctx.closePath();
});
board.addEventListener("mouseleave", function (e) {
    ctx.globalCompositeOperation = "source-over";
    socket.emit("drawup");
    flag = 0;
    poppedMemory.length = 0; // Because of required functionality
    ctx.closePath();
});

// menu drop down
const pull = document.getElementsByClassName("pull")[0];
var isOpen = false;
pull.addEventListener("click", function (e) {
    const parent = e.target.parentElement.parentElement;
    if (window.innerWidth <= 750) {
        if (isOpen) {
            isOpen = false;
            parent.style.top = "0px";
            parent.style.left = "-145px";
            e.target.style.transform = "rotate(270deg)";
        } else {
            isOpen = true;
            parent.style.top = "0px";
            parent.style.left = "0px";
            e.target.style.transform = "rotate(90deg)";
        }
    } else {
        if (isOpen) {
            parent.style.top = "-80px";
            parent.style.left = "0px";
            isOpen = false;
            e.target.style.transform = "rotate(0deg)";
        } else {
            parent.style.top = "0px";
            parent.style.left = "0px";
            isOpen = true;
            e.target.style.transform = "rotate(+180deg)";
        }
    }
});
// resize functionality
const nav = document.getElementsByTagName("nav")[0];

function reportWindowSize() {
    canvasWindow.style.height = window.innerHeight + "px";
    canvasWindow.style.width = window.innerWidth + "px";
    if (isOpen) {
        if (window.innerWidth <= 750) {
            nav.style.top = "0px";
            nav.style.left = "0px";
            pull.style.transform = "rotate(90deg)";
        } else {
            nav.style.left = "0px";
            nav.style.top = "0px";
            pull.style.transform = "rotate(180deg)";
        }
    } else {
        if (window.innerWidth <= 750) {
            nav.style.top = "0px";
            nav.style.left = "-145px";
            pull.style.transform = "rotate(270deg)";
        } else {
            nav.style.left = "0px";
            nav.style.top = "-80px";
            pull.style.transform = "rotate(0deg)"
        }
    }

    draw();
}
window.onresize = reportWindowSize;