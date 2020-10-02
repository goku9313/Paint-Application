//pencil width changer
thicknessPencil.addEventListener("mouseup", function (e) {
    pencilWidth = this.value;
    ctx.lineWidth = this.value;
});
// pencil color changer
function changeColor(color) {
    pencilColor = color;
    ctx.strokeStyle = color;
    pencilTools.style.display = "none";
}
// pencil event listener
p.addEventListener("click", function (e) {
    pencil.click();
});
pencil.addEventListener("click", function (e) {
    ctx.lineWidth = pencilWidth;
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "black";
    eraserClicks = 0;
    magClicks = 0;
    eraserTools.style.display = "none";
    magOptions.style.display = "none";
    if (pencilClicks == 1) {
        pencilTools.style.display = "block";
        pencilClicks = 2;
    } else if (pencilClicks == 2) {
        pencilTools.style.display = "none";
        pencilClicks = 1;
    } else {
        pencilClicks++;
        const t = document.getElementsByClassName("text")[0];
        t.remove();
        const p = document.createElement("p");
        p.textContent = "Pencil";
        p.setAttribute("class", "text");
        this.parentElement.appendChild(p);
        p.addEventListener("click", function (e) {
            pencil.click();
        });
        this.parentElement.classList.add("selected");
        eraser.parentElement.classList.remove("selected");
    }
});