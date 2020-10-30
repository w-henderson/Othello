var electron = require("electron");
var menuActive = false;
function toggleDropdown() {
    menuActive = !menuActive;
    updateMenuRender();
}
function updateMenuRender() {
    document.getElementById("dropdownMenu").className = menuActive ? "menuActive" : "";
}
function endGame() {
    document.getElementById("board").className = "hidden";
    document.getElementById("turnIndicator").className = "fa fa-circle";
    board.reset();
    menuActive = false;
    updateMenuRender();
    window.setTimeout(function () {
        renderBoard(1);
    }, 500);
}
function crossPlatformOpenURL(url) {
    try {
        electron.shell.openExternal(url);
    }
    catch (ReferenceError) {
        window.open(url);
    }
}
