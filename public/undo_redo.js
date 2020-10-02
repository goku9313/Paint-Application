const undo = document.getElementsByClassName("undo")[0];
const redo = document.getElementsByClassName("redo")[0];

undo.addEventListener("click", function (e) {
    if (memory.length >= 1) {
        var obj = memory.pop();
        socket.emit("undo", obj);
        poppedMemory.push(obj);
        ctx.clearRect(0, 0, board.width / currentZoomValue, board.height / currentZoomValue);
        draw();
    }
});

function draw() {
    for (var i = 0; i < memory.length; i++) {
        var objLine = memory[i];
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineWidth = objLine.thickness;
        ctx.strokeStyle = objLine.color;
        ctx.moveTo(objLine.startX, objLine.startY);
        for (var j = 0; j < objLine.endPoints.length; j++) {
            var obj = objLine.endPoints[j];
            ctx.lineTo(obj.X, obj.Y);
            ctx.stroke();
        }
        ctx.closePath();
    }
    for (var i = 0; i < memoryRecieved.length; i++) {
        var objLine = memoryRecieved[i];
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineWidth = objLine.thickness;
        ctx.strokeStyle = objLine.color;
        ctx.moveTo(objLine.startX, objLine.startY);
        for (var j = 0; j < objLine.endPoints.length; j++) {
            var obj = objLine.endPoints[j];
            ctx.lineTo(obj.X, obj.Y);
            ctx.stroke();
        }
        ctx.closePath();
    }
}
var poppedMemory = [];
// redo event code
redo.addEventListener("click", function (e) {
    if (poppedMemory.length >= 1) {
        var objLine = poppedMemory.pop();
        socket.emit("redo", objLine);
        memory.push(objLine);
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineWidth = objLine.thickness;
        ctx.strokeStyle = objLine.color;
        ctx.moveTo(objLine.startX, objLine.startY);
        for (var j = 0; j < objLine.endPoints.length; j++) {
            var obj = objLine.endPoints[j];
            ctx.lineTo(obj.X, obj.Y);
            ctx.stroke();
        }
        ctx.closePath();
    }
});