const eraserTools = document.getElementsByClassName("eraser-options")[0];
const thicknessEraser = document.getElementsByClassName("range")[1];
const eraser = document.getElementsByClassName("eraser")[0];

const pencil = document.getElementsByClassName("pencil")[0];
const pencilTools = document.getElementsByClassName("pencil-options")[0];
const thicknessPencil = document.getElementsByClassName("range")[0];
const p = document.getElementsByClassName("text")[0];
// eraser width changer
thicknessEraser.addEventListener("mouseup", function (e) {
    eraserWidth = this.value;
    ctx.lineWidth = this.value;
});
// eraser event listener
eraser.addEventListener("click", function (e) {
    ctx.lineWidth = eraserWidth;
    ctx.strokeStyle = "white";
    pencilClicks = 0;
    magClicks = 0;
    magOptions.style.display = "none";
    pencilTools.style.display = "none";
    if (eraserClicks == 1) {
        eraserTools.style.display = "block";
        eraserClicks = 2;
    } else if (eraserClicks == 2) {
        eraserTools.style.display = "none";
        eraserClicks = 1;
    } else {
        eraserClicks++;
        const t = document.getElementsByClassName("text")[0];
        t.remove();
        const p = document.createElement("p");
        p.textContent = "Eraser";
        p.setAttribute("class", "text");
        this.parentElement.appendChild(p);
        p.addEventListener("click", function (e) {
            eraser.click();
        });
        this.parentElement.classList.add("selected");
        pencil.parentElement.classList.remove("selected");
    }
});