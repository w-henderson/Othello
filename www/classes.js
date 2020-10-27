class Piece {
  constructor(player) {
    this.player = player;
    this.color = this.player === 1 ? "black" : "white";
  }

  flip() {
    this.player = this.player === 1 ? 2 : 1;
    this.color = this.player === 1 ? "black" : "white";
  }
}

class Board {
  constructor() {
    this.content = [
      ["-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-"]
    ];
    this.playerTurn = 1;

    this.place(new Piece(1), 3, 4);
    this.place(new Piece(1), 4, 3);
    this.place(new Piece(2), 3, 3);
    this.place(new Piece(2), 4, 4);
  }

  reset() {
    this.content = [
      ["-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-"]
    ];
    this.playerTurn = 1;

    this.place(new Piece(1), 3, 4);
    this.place(new Piece(1), 4, 3);
    this.place(new Piece(2), 3, 3);
    this.place(new Piece(2), 4, 4);
  }

  place(piece, x, y) {
    this.content[y][x] = piece;
    this.playerTurn = this.playerTurn === 1 ? 2 : 1
  }

  processContent(x, y) {
    if (typeof this.content[y][x] === "object") return this.content[y][x].color;
    return "#0C3B2C";
  }

  displayValids(player) {
    let possibles = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (this.validateMove(player, x, y)) {
          possibles.push([x, y]);
        }
      }
    }
    return possibles;
  }

  isFull() {
    let full = true;
    this.content.forEach(function (value) {
      value.forEach(function (realValue) {
        if (typeof realValue != "object") {
          full = false;
        }
      });
    });
    return full;
  }

  piecesOfEachPlayer() {
    let player1 = 0;
    let player2 = 0;
    this.content.forEach(function (value) {
      value.forEach(function (realValue) {
        if (typeof realValue === "object") {
          if (realValue.player === 1) {
            player1++;
          } else {
            player2++;
          }
        }
      })
    });
    return [player1, player2];
  }

  getPossibleMoves(player) {
    let possibleMoves = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (this.validateMove(player, x, y)) {
          possibleMoves.push([x, y]);
        }
      }
    }
    return possibleMoves;
  }

  validateMove(player, x, y, returnPieces = false) {
    let validMove = false;
    let piecesToTake = [];

    if (typeof this.content[y][x] === "object") return validMove;

    let possibleDirections = [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1]
    ];

    possibleDirections.forEach(function (direction) {
      let proposedPieces = [];
      let currentPosition = { x: x + direction[0], y: y + direction[1] };
      while (currentPosition.x >= 0 && currentPosition.x < 8 && currentPosition.y >= 0 && currentPosition.y < 8) {
        if (typeof this.content[currentPosition.y][currentPosition.x] === "object") {
          if (this.content[currentPosition.y][currentPosition.x].player != player) { proposedPieces.push([currentPosition.x, currentPosition.y]); }
          else {
            if (proposedPieces.length != 0) {
              validMove = true;
              piecesToTake = piecesToTake.concat(proposedPieces);
            }
            break;
          }
        } else { break; }
        currentPosition.x += direction[0];
        currentPosition.y += direction[1];
      }
    }, this);

    if (returnPieces) return piecesToTake;
    return validMove;
  }
}