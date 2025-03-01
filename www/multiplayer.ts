const server: string = "https://othelloserver.herokuapp.com";
var onlinePlayer: number = 0;
var onlineGameID: number = 0;

var latestOnlineMove: number[] = [-1, -1];

// Loop to manage general server contact
function onlineGameLoop(): void {
  $.get(`${server}/latestMove/${onlineGameID}`, function (data) {
    if (!gameRunning) return;
    if (data === "") {
      showMessage("Game ended", "The other player disconnected.");
      gameRunning = false;
      resetMultiplayer();
      document.getElementById("board").className = "hidden";
      document.getElementById("turnIndicator").className = "fa fa-circle";
      board.reset();
      renderBoard(1);
    }
    if (data.player != onlinePlayer && (latestOnlineMove[0] != data.x || latestOnlineMove[1] != data.y) && board.playerTurn != onlinePlayer) {
      latestOnlineMove = [data.x, data.y];
      makeMove(parseInt(data.x), parseInt(data.y), true);
    }
    window.setTimeout(onlineGameLoop, 1000);
  }).fail(function () {
    showMessage("Game ended", "One of the players lost contact with the server.");
    gameRunning = false;
    resetMultiplayer();
    document.getElementById("board").className = "hidden";
    document.getElementById("turnIndicator").className = "fa fa-circle";
    board.reset();
    renderBoard(1);
  });
}

function hostGame(): void {
  onlineGameID = Math.round(Math.random() * 1000000);
  onlinePlayer = 1;
  document.getElementById("mainTitle").innerHTML = "Game ID: " + onlineGameID.toString();
  showMessage("Server loading.", "The board will appear once the game is ready. Please wait.");
  initiateOnlineGame();
}

function joinGame(): void {
  let id: string = (<HTMLInputElement>document.getElementById("idInput")).value;
  (<HTMLInputElement>document.getElementById("idInput")).value = "";
  $.get(`${server}/validateID/${id}`, function (data) {
    if (data === "y") {
      showMessage("Valid Game ID", "The game ID was valid, have fun!");
      onlineGameID = parseInt(id);
      onlinePlayer = 2;
      document.getElementById("mainTitle").innerHTML = "Game ID: " + onlineGameID.toString();
      onlineGameStarted();
    } else {
      showMessage("Invalid Game ID", "The game ID was invalid, please try again.");
    }
  });
}

function showMultiplayerMenu(): void {
  document.getElementById("menu").className = "styledMenu hidden";
  document.getElementById("multiplayerMenu").className = "styledMenu";
}

function backToMainMenu(): void {
  document.getElementById("menu").className = "styledMenu";
  document.getElementById("multiplayerMenu").className = "styledMenu hidden";
}

function onlineGameStarted(): void {
  aiMode = false;
  gameRunning = true;
  backToMainMenu();
  document.getElementById("turnIndicator").className = "fa fa-circle tiActive"; // Show the turn indicator
  document.getElementById("board").className = "";
  window.setTimeout(function () { // Wait for the board animation before rendering it to minimise lag
    renderBoard(1);
    onlineGameLoop();
  }, 500);
}

function initiateOnlineGame(): void {
  $.get(`${server}/startGame/${onlineGameID}`, function () {
    onlineGameStarted();
    console.log("Server started game.");
  });
}

// Send the server data to make a move
function makeOnlineMove(player: number, x: number, y: number): void {
  $.get(`${server}/makeMove/${onlineGameID}/${x}/${y}/${player}`);
}

// Reset multiplayer
function resetMultiplayer(): void {
  if (onlinePlayer != 0) {
    $.get(`${server}/endGame/${onlineGameID}`);
    document.getElementById("mainTitle").innerHTML = "Othello";
    onlinePlayer = 0;
    onlineGameID = 0;
    latestOnlineMove = [-1, -1];
  }
}