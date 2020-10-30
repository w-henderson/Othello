const electron = require("electron");

var menuActive: boolean = false;

function toggleDropdown(): void {
  menuActive = !menuActive;
  updateMenuRender();
}

function updateMenuRender(): void {
  document.getElementById("dropdownMenu").className = menuActive ? "menuActive" : "";
}

function endGame(): void {
  document.getElementById("board").className = "hidden";
  document.getElementById("turnIndicator").className = "fa fa-circle";
  board.reset();
  menuActive = false;
  updateMenuRender();
  window.setTimeout(function () {
    renderBoard(1);
  }, 500);
}

function crossPlatformOpenURL(url): void {
  try {
    electron.shell.openExternal(url);
  } catch (ReferenceError) {
    window.open(url);
  }
}