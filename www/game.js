const board = new Board();
var ai = false;

function renderBoard(showValidPositions = 0, letAIMakeMove = false) {
  if (board.playerTurn === 1) {
    document.getElementById("turnIndicator").style.color = "#000";
  } else {
    document.getElementById("turnIndicator").style.color = "#F0FDED";
  }

  let finalHTML = "<table>";
  someValidMove = false;
  for (let y = 0; y < 8; y++) {
    finalHTML += "<tr>";
    for (let x = 0; x < 8; x++) {
      let xy = x.toString() + y.toString();
      if (showValidPositions != 0) {
        if (board.validateMove(showValidPositions, x, y)) {
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

  let boardAlreadyRendered = false;
  if (!someValidMove) {
    if (board.isFull()) {
      pieces = board.piecesOfEachPlayer();
      if (pieces[0] > pieces[1]) {
        endGameWithMessage(1, `They had ${(pieces[0] - pieces[1])} more pieces.`);
      } else if (pieces[1] > pieces[0]) {
        endGameWithMessage(2, `They had ${(pieces[1] - pieces[0])} more pieces.`);
      } else {
        endGameWithMessage(0, "Both players had the same number of pieces!");
      }
    } else {
      if (board.getPossibleMoves(showValidPositions === 1 ? 2 : 1).length > 0) {
        showMessage("Turn Missed", `Player ${board.playerTurn.toString()} couldn't move so play has passed to the other player.`);
        board.playerTurn = board.playerTurn === 1 ? 2 : 1;
        renderBoard(board.playerTurn);
        boardAlreadyRendered = true;
      } else {
        pieces = board.piecesOfEachPlayer();
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

  if (letAIMakeMove && !boardAlreadyRendered) {
    window.setTimeout(aiMakeMove, (Math.random() + 0.25) * 1000);
  }
}

function showMessage(title, message) {
  document.getElementById("messageTitle").innerHTML = title;
  document.getElementById("messageContent").innerHTML = message;
  document.getElementById("message").className = "messageShown";
  window.setTimeout(function () {
    document.getElementById("message").className = "";
  }, 4000)
}

function endGameWithMessage(winner, message) {
  if (winner != 0) showMessage(`Player ${winner.toString()} has won!`, message);
  else showMessage("It's a draw!", message);
  window.setTimeout(function () {
    document.getElementById("board").className = "hidden";
    document.getElementById("turnIndicator").className = "fa fa-circle";
    board.reset();
  }, 4000);
}

function makeMove(x, y) {
  if (ai && board.playerTurn === 2) return;
  let piecesToTakeXY = board.validateMove(board.playerTurn, x, y, true);
  piecesToTakeXY.forEach(function (value) {
    board.content[value[1]][value[0]].flip();
  })
  board.place(new Piece(board.playerTurn), x, y);
  if (ai && board.playerTurn === 2) {
    renderBoard(board.playerTurn, true);
  } else {
    renderBoard(board.playerTurn);
  }
}

function aiMakeMove() {
  let possibleMoves = board.getPossibleMoves(2);
  let bestMove = [];
  let bestScore = 0;

  possibleMoves.forEach(function (move) {
    let piecesToTake = board.validateMove(2, move[0], move[1], true);
    if (piecesToTake.length > bestScore) {
      bestMove = move;
      bestScore = piecesToTake.length;
    }
  });

  if (bestScore === 0) {
    if (board.isFull()) {
      pieces = board.piecesOfEachPlayer();
      if (pieces[0] > pieces[1]) {
        endGameWithMessage(1, `They had ${(pieces[0] - pieces[1])} more pieces.`);
      } else if (pieces[1] > pieces[0]) {
        endGameWithMessage(2, `They had ${(pieces[1] - pieces[0])} more pieces.`);
      } else {
        endGameWithMessage(0, "Both players had the same number of pieces!");
      }
    } else {
      if (board.getPossibleMoves(1).length > 0) {
        showMessage("Turn Missed", `Player ${board.playerTurn.toString()} couldn't move so play has passed to the other player.`);
        board.playerTurn = 1;
        renderBoard(board.playerTurn);
      } else {
        pieces = board.piecesOfEachPlayer();
        if (pieces[0] > pieces[1]) {
          endGameWithMessage(1, `Neither player could move but they had ${(pieces[0] - pieces[1])} more pieces.`);
        } else if (pieces[1] > pieces[0]) {
          endGameWithMessage(2, `Neither player could move but they had ${(pieces[1] - pieces[0])} more pieces.`);
        } else {
          endGameWithMessage(0, "Neither player could move and they had the same number of pieces!");
        }
      }
    }
  } else {
    let piecesToTakeXY = board.validateMove(2, bestMove[0], bestMove[1], true);
    piecesToTakeXY.forEach(function (value) {
      board.content[value[1]][value[0]].flip();
    })
    board.place(new Piece(board.playerTurn), bestMove[0], bestMove[1]);
    renderBoard(board.playerTurn);
  }
}

function startNormalGame() {
  renderBoard(1);
  document.getElementById("turnIndicator").className = "fa fa-circle tiActive";
  document.getElementById("board").className = "";
}

function startAIGame() {
  ai = true;
  renderBoard(1);
  document.getElementById("turnIndicator").className = "fa fa-circle tiActive";
  document.getElementById("board").className = "";
}