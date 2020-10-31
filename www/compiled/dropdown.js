var electron = require("electron");
var menuActive = false;
// Toggle the dropdown menu and update the DOM
function toggleDropdown() {
    menuActive = !menuActive;
    updateMenuRender();
}
// Update the DOM to reflect the boolean menuActive
function updateMenuRender() {
    document.getElementById("dropdownMenu").className = menuActive ? "menuActive" : "";
}
// End the game
function endGame() {
    document.getElementById("board").className = "hidden";
    document.getElementById("turnIndicator").className = "fa fa-circle";
    board.reset();
    gameRunning = false;
    resetMultiplayer();
    menuActive = false;
    updateMenuRender();
    window.setTimeout(function () {
        renderBoard(1);
    }, 500);
}
// Open a URL platform indepentently
function crossPlatformOpenURL(url) {
    try { // Effectively "if running as an electron app"
        electron.shell.openExternal(url);
    }
    catch (ReferenceError) { // If it's not an electron app, it'll be a web app
        window.open(url);
    }
}
