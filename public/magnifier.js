const mag = document.getElementsByClassName("glass")[0];
const magOptions = document.getElementsByClassName("magnifier")[0];
const magFactor = document.getElementsByClassName("range")[2];
// magnification event code
board.addEventListener("scroll", function (e) {
    console.log(e);
});

magFactor.addEventListener("mouseup", function (e) {
    ctx.clearRect(0, 0, board.width, board.height);
    currentZoomValue = this.value / 100;
    //step-1 find coord of our viewport center wrt to board origin ( top-left )
    var width = window.innerWidth;
    var height = window.innerHeight;
    oldX = width / 2 + canvasWindow.scrollLeft;
    oldY = height / 2 + canvasWindow.scrollTop;

    // step-2 bringing it back to normal zoom before applying another zoom
    ctx.scale(1 / previousZoomValue, 1 / previousZoomValue);
    oldX /= previousZoomValue;
    oldY /= previousZoomValue;
    board.height /= previousZoomValue;
    board.width /= previousZoomValue;

    //step-3 apply new zoom
    var newX = oldX * currentZoomValue;
    var newY = oldY * currentZoomValue;
    board.height *= currentZoomValue;
    board.width *= currentZoomValue;
    ctx.scale(currentZoomValue, currentZoomValue);

    //step-4  setting our view window position
    if (board.height > height) {
        board.style.margin = "16px";
        canvasWindow.scrollTop = newY - (height / 2);
        canvasWindow.scrollLeft = newX - (width / 2);
    } else {
        board.style.marginLeft = (width - board.width) / 2 + "px";
        board.style.marginTop = (height - board.height) / 2 + "px";
    }
    previousZoomValue = currentZoomValue;

    draw();

});
mag.addEventListener("click", function (e) {
    if (pencilClicks != 0) pencilClicks = 1;
    else eraserClicks = 1;
    eraserTools.style.display = "none";
    pencilTools.style.display = "none";
    if (magClicks == 0) {
        magOptions.style.display = "block";
        magClicks = 1;
    } else {
        magOptions.style.display = "none";
        magClicks = 0;
    }
});