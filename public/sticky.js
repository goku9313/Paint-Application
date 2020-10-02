const sticky = document.getElementsByClassName("sticky")[0];
// sticky event listener
sticky.addEventListener("click", function (e) {
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
    socket.emit("stickyCreate");
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