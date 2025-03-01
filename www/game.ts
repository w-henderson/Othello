const board: Board = new Board(8, 8);
const ai: AI = new AI();

var aiMode: boolean = false; // Whether the player is playing against the AI
var gameRunning: boolean = false;

// Function to update the visual representation of the board (also does some game management for some reason)
function renderBoard(showValidPositions: number = 0, letAIMakeMove: boolean = false): void {
  if (board.playerTurn === 1) {
    document.getElementById("turnIndicator").style.color = "#000";
  } else {
    document.getElementById("turnIndicator").style.color = "#F0FDED";
  }

  // Generate the HTML for the current board state
  let finalHTML: string = "<table>";
  let someValidMove: boolean = false;
  for (let y = 0; y < 8; y++) {
    finalHTML += "<tr>";
    for (let x = 0; x < 8; x++) {
      let xy = x.toString() + y.toString();
      if (showValidPositions != 0) {
        if (board.getTakenPieces(showValidPositions, x, y).length > 0) {
          someValidMove = true;
          finalHTML += `<td id='box${xy}' onclick='makeMove(${x}, ${y});' class='validPosition'></td>`;
          continue;
        }
      }
      finalHTML += `<td id='box${xy}' style='background-color: ${board.processContent(x, y)}'></td>`;
    }
    finalHTML += "</tr>";
  }
  finalHTML += "</table>";
  document.getElementById("board").innerHTML = finalHTML;

  if (!someValidMove) { // If the player can't move
    if (board.isFull()) { // If this is because the board is full, calculate the winner and end the game
      let pieces: number[] = board.piecesOfEachPlayer();
      if (pieces[0] > pieces[1]) {
        endGameWithMessage(1, `They had ${(pieces[0] - pieces[1])} more pieces.`);
      } else if (pieces[1] > pieces[0]) {
        endGameWithMessage(2, `They had ${(pieces[1] - pieces[0])} more pieces.`);
      } else {
        endGameWithMessage(0, "Both players had the same number of pieces!");
      }
    } else { // If the board isn't full
      if (board.getPossibleMoves(showValidPositions === 1 ? 2 : 1).length > 0) { // If the other player can play, let them
        showMessage("Turn Missed", `Player ${board.playerTurn.toString()} couldn't move so play has passed to the other player.`);
        board.playerTurn = board.playerTurn === 1 ? 2 : 1;
        if (aiMode && board.playerTurn === 2) renderBoard(board.playerTurn, true);
        else renderBoard(board.playerTurn);
        return;
      } else { // If neither player can play, calculate the winner and end the game
        let pieces: number[] = board.piecesOfEachPlayer();
        if (pieces[0] > pieces[1]) {
          endGameWithMessage(1, `Neither player could move but they had ${(pieces[0] - pieces[1])} more pieces.`);
        } else if (pieces[1] > pieces[0]) {
          endGameWithMessage(2, `Neither player could move but they had ${(pieces[1] - pieces[0])} more pieces.`);
        } else {
          endGameWithMessage(0, "Neither player could move and they had the same number of pieces!");
        }
      }
    }
  }

  // If it's the AI's turn and they haven't already had a turn, wait a bit then let them make a move
  if (letAIMakeMove) {
    window.setTimeout(aiMakeMove, (Math.random() + 0.25) * 1000);
  }
}

// Function to make message pop up for 3 seconds
function showMessage(title: string, message: string): void {
  document.getElementById("messageTitle").innerHTML = title;
  document.getElementById("messageContent").innerHTML = message;
  document.getElementById("message").className = "messageShown";
  window.setTimeout(function () {
    document.getElementById("message").className = "";
  }, 3000);
}

// Function to make message pop up for 3 seconds, the end the game and reset variables
function endGameWithMessage(winner: number, message: string): void {
  if (winner != 0) showMessage(`Player ${winner.toString()} has won!`, message);
  else showMessage("It's a draw!", message);
  gameRunning = false;
  window.setTimeout(function () {
    document.getElementById("board").className = "hidden";
    document.getElementById("turnIndicator").className = "fa fa-circle";
    board.reset();
    renderBoard(1);
    resetMultiplayer();
  }, 3000);
}

// Function to let the player make a move at coordinates (x, y)
function makeMove(x: number, y: number, remote: boolean = false): void {
  if (!remote && onlinePlayer != 0 && board.playerTurn != onlinePlayer) return; // If playing online and it's not the local player's turn, return
  else if (!remote && onlinePlayer != 0 && board.playerTurn === onlinePlayer) { // If playing online and it is their turn
    makeOnlineMove(board.playerTurn, x, y);
  }

  menuActive = false; // Hide the menu
  updateMenuRender(); // Update the DOM to make sure the menu is hidden
  if (aiMode && board.playerTurn === 2) return; // If it's the AI's turn, return because this shouldn't be running

  // Perform the given move
  let piecesToTakeXY = board.getTakenPieces(board.playerTurn, x, y);
  piecesToTakeXY.forEach(function (value) {
    board.content[value[1]][value[0]].flip();
  })
  board.place(new Piece(board.playerTurn), x, y);

  // Render the board with the appropriate formatting dependant on whether it's the AI's turn
  if (aiMode && board.playerTurn === 2) {
    renderBoard(board.playerTurn, true);
  } else {
    renderBoard(board.playerTurn);
  }
}

function aiMakeMove(): void {
  let aiMove: number[] = ai.makeMove(); // Select the AI's move according to the algorithm in the AI class

  if (aiMove.length === 0) { // If the AI can't make a move
    if (board.isFull()) { // If this is because the board is full, calculate the winner and end the game
      let pieces: number[] = board.piecesOfEachPlayer();
      if (pieces[0] > pieces[1]) {
        endGameWithMessage(1, `They had ${(pieces[0] - pieces[1])} more pieces.`);
      } else if (pieces[1] > pieces[0]) {
        endGameWithMessage(2, `They had ${(pieces[1] - pieces[0])} more pieces.`);
      } else {
        endGameWithMessage(0, "Both players had the same number of pieces!");
      }
    } else { // If the board is not full
      if (board.getPossibleMoves(1).length > 0) { // If the other player can play, let them
        showMessage("Turn Missed", `Player ${board.playerTurn.toString()} couldn't move so play has passed to the other player.`);
        board.playerTurn = 1;
        renderBoard(board.playerTurn);
      } else { // If neither player can play, calculate the winner and end the game
        let pieces: number[] = board.piecesOfEachPlayer();
        if (pieces[0] > pieces[1]) {
          endGameWithMessage(1, `Neither player could move but they had ${(pieces[0] - pieces[1])} more pieces.`);
        } else if (pieces[1] > pieces[0]) {
          endGameWithMessage(2, `Neither player could move but they had ${(pieces[1] - pieces[0])} more pieces.`);
        } else {
          endGameWithMessage(0, "Neither player could move and they had the same number of pieces!");
        }
      }
    }
  } else { // If the AI can make a move, perform it
    let piecesToTakeXY: number[][] = board.getTakenPieces(2, aiMove[0], aiMove[1]);
    piecesToTakeXY.forEach(function (value) {
      board.content[value[1]][value[0]].flip();
    })
    board.place(new Piece(board.playerTurn), aiMove[0], aiMove[1]);
    renderBoard(board.playerTurn);
  }
}

// Start a game
function startGame(useAI: boolean = false) {
  menuActive = false;
  updateMenuRender();
  aiMode = useAI;
  gameRunning = true;
  document.getElementById("turnIndicator").className = "fa fa-circle tiActive"; // Show the turn indicator
  document.getElementById("board").className = "";
  window.setTimeout(function () { // Wait for the board animation before rendering it to minimise lag
    renderBoard(1);
  }, 500);
}