const download = document.getElementsByClassName("download")[0];
// download event listener
download.addEventListener("click", function (e) {
    var link = document.createElement('a');
    link.setAttribute('download', 'Demo.png');
    link.setAttribute('href', board.toDataURL("image/png"));
    link.click();
    link.remove();
});