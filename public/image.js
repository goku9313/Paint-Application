const image = document.getElementsByClassName("inputImage")[0];
// image event listener
image.addEventListener("change", function () {

    const img = document.createElement("img");
    img.setAttribute("class", "uploadedImage");
    img.setAttribute("draggable", "false");
    const file = this.files[0];
    if (file) {
        img.src = URL.createObjectURL(file);
        socket.emit("imageLoad", img.src);
        body.appendChild(img);
        var index = document.getElementsByClassName("uploadedImage").length - 1;
        URL.revokeObjectURL(file);
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
    }
});