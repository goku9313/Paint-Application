var memoryRecieved = [];
var flagReceiver = 0;
// memory management
function addLineRec(color, thickness, startX, startY) {
    var objStart = {
        "color": color,
        "thickness": thickness,
        "startX": startX,
        "startY": startY,
        "endPoints": []
    };
    memoryRecieved.push(objStart);
}

function endLineRec(endX, endY) {
    var obj = {
        "X": endX,
        "Y": endY
    };
    var lineObj = memoryRecieved[memoryRecieved.length - 1];
    lineObj.endPoints.push(obj);
    memoryRecieved[memoryRecieved.length - 1] = lineObj;

}
// line drawing
socket.on("drawdown", function (pt) {
    flagReceiver = 1;
    ctx.beginPath();
    ctx.lineWidth = pt.thickness;
    ctx.strokeStyle = pt.color;
    ctx.lineCap = 'round';
    ctx.moveTo(pt.x, pt.y);
    addLineRec(ctx.strokeStyle, ctx.lineWidth, pt.x, pt.y);
});
socket.on("drawmove", function (pt) {
    if (flagReceiver == 1) {
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
        endLineRec(pt.x, pt.y);
    }
});
socket.on("drawup", function () {
    flagReceiver = 0;
    ctx.closePath();
})
// Undo & Redo
socket.on("undo", function (obj) {
    for (var i = 0; i < memoryRecieved.length; i++) {
        if (JSON.stringify(obj) === JSON.stringify(memoryRecieved[i])) {
            memoryRecieved.splice(i, 1);
            break;
        }
    }
    ctx.clearRect(0, 0, board.width / currentZoomValue, board.height / currentZoomValue);
    draw();
});
socket.on("redo", function (obj) {
    memoryRecieved.push(obj);
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineWidth = obj.thickness;
    ctx.strokeStyle = obj.color;
    ctx.moveTo(obj.startX, obj.startY);
    for (var j = 0; j < obj.endPoints.length; j++) {
        var objLine = obj.endPoints[j];
        ctx.lineTo(objLine.X, objLine.Y);
        ctx.stroke();
    }
    ctx.closePath();
});

// image receiver
socket.on("imageLoad", function (src) {
    const img = document.createElement("img");
    img.setAttribute("class", "uploadedImage");
    img.setAttribute("draggable", "false");
    img.src = src;
    body.appendChild(img);
    var index = document.getElementsByClassName("uploadedImage").length - 1;
    const rect = img.getBoundingClientRect();
    var flagImg = 0;
    var diffX = rect.left;
    var diffY = rect.top;
    body.addEventListener("mousedown", function (e) {
        if (e.target == img) {
            flagImg = 1;
            diffX = e.clientX - diffX;
            diffY = e.clientY - diffY;
        }
    });
    body.addEventListener("mousemove", function (e) {
        if (flagImg == 1) {
            var l = e.clientX - diffX;
            var t = e.clientY - diffY;
            console.log(index);
            var obj = {
                "index": index,
                "l": l,
                "t": t
            };
            socket.emit("imagemove", obj);
            img.style.left = l + "px";
            img.style.top = t + "px";
        }
    });
    body.addEventListener("mouseup", function (e) {
        const rect = img.getBoundingClientRect();
        flagImg = 0;
        diffX = rect.left;
        diffY = rect.top;
    });
    body.addEventListener("mouseleave", function (e) {
        const rect = img.getBoundingClientRect();
        flagImg = 0;
        diffX = rect.left;
        diffY = rect.top;
    });
});
// image mover
socket.on("imagemove", function (obj) {
    const img = document.getElementsByClassName("uploadedImage")[obj.index];
    img.style.left = obj.l + "px";
    img.style.top = obj.t + "px";
});

//sticky creator
socket.on("stickyCreate", function () {
    const stickyElement = document.createElement("div");
    const nav = document.createElement("div");
    const closeButton = document.createElement("div");
    closeButton.textContent = "X";
    closeButton.setAttribute("class", "stickyClose");
    nav.appendChild(closeButton);
    const bodySticky = document.createElement("div");
    stickyElement.setAttribute("class", "stickyNote");
    nav.setAttribute("class", "navSticky");
    bodySticky.setAttribute("class", "bodySticky");
    // for editing sticky content
    bodySticky.setAttribute("contentEditable", "true");
    stickyElement.appendChild(nav);
    stickyElement.appendChild(bodySticky);
    body.appendChild(stickyElement);
    closeButton.addEventListener("click", function (e) {
        const stickyTemp = e.target.parentElement.parentElement;
        socket.emit("stickyClose", index);
        stickyTemp.remove();
    });
    // Code for moving the sticky
    var index = document.getElementsByClassName("stickyNote").length - 1;
    const rect = stickyElement.getBoundingClientRect();
    var flagStick = 0;
    var diffX = rect.left;
    var diffY = rect.top;
    body.addEventListener("mousedown", function (e) {
        if (e.target == nav) {
            flagStick = 1;
            diffX = e.clientX - diffX;
            diffY = e.clientY - diffY;
            bodySticky.blur();
        }
    });
    body.addEventListener("mousemove", function (e) {
        if (flagStick == 1) {
            var l = e.clientX - diffX;
            var t = e.clientY - diffY;
            var obj = {
                "index": index,
                "l": l,
                "t": t
            };
            socket.emit("stickyMove", obj);
            stickyElement.style.left = l + "px";
            stickyElement.style.top = t + "px";
        }
    });
    body.addEventListener("mouseup", function (e) {
        const rect = stickyElement.getBoundingClientRect();
        flagStick = 0;
        diffX = rect.left;
        diffY = rect.top;
    });
    body.addEventListener("mouseleave", function (e) {
        const rect = stickyElement.getBoundingClientRect();
        flagStick = 0;
        diffX = rect.left;
        diffY = rect.top;
    });
    // equivalent of onchange for contenteditable in div
    bodySticky.addEventListener("input", function (e) {
        var obj = {
            "index": index,
            "text": this.innerHTML
        };
        socket.emit("contentChange", obj);
    })
});
// sticky closer
socket.on("stickyClose", function (index) {
    const sticky = document.getElementsByClassName("stickyNote")[index];
    sticky.remove();
});
//sticky mover
socket.on("stickyMove", function (obj) {
    const sticky = document.getElementsByClassName("stickyNote")[obj.index];
    sticky.style.left = obj.l + "px";
    sticky.style.top = obj.t + "px";
});
// sticky editor
socket.on("contentChange", function (obj) {
    const sticky = document.getElementsByClassName("stickyNote")[obj.index].childNodes[1];
    sticky.innerHTML = obj.text;
})