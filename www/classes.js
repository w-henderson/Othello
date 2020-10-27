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

    // Validate upwards
    let proposedPieces = [];
    for (let i = y - 1; i >= 0; i--) {
      if (typeof this.content[i][x] === "object") {
        if (this.content[i][x].player != player) { proposedPieces.push([x, i]); }
        else {
          if (proposedPieces.length != 0) {
            validMove = true;
            piecesToTake = piecesToTake.concat(proposedPieces);
          }
          break;
        }
      } else { break; }
    }

    // Validate downwards
    proposedPieces = [];
    for (let i = y + 1; i < 8; i++) {
      if (typeof this.content[i][x] === "object") {
        if (this.content[i][x].player != player) { proposedPieces.push([x, i]); }
        else {
          if (proposedPieces.length != 0) {
            validMove = true;
            piecesToTake = piecesToTake.concat(proposedPieces);
          }
          break;
        }
      } else { break; }
    }

    // Validate right
    proposedPieces = [];
    for (let i = x + 1; i < 8; i++) {
      if (typeof this.content[y][i] === "object") {
        if (this.content[y][i].player != player) { proposedPieces.push([i, y]); }
        else {
          if (proposedPieces.length != 0) {
            validMove = true;
            piecesToTake = piecesToTake.concat(proposedPieces);
          }
          break;
        }
      } else { break; }
    }

    // Validate left
    proposedPieces = [];
    for (let i = x - 1; i >= 0; i--) {
      if (typeof this.content[y][i] === "object") {
        if (this.content[y][i].player != player) { proposedPieces.push([i, y]); }
        else {
          if (proposedPieces.length != 0) {
            validMove = true;
            piecesToTake = piecesToTake.concat(proposedPieces);
          }
          break;
        }
      } else { break; }
    }

    // Validate up and left
    proposedPieces = [];
    let distance = 1;
    while (x - distance >= 0 && y - distance >= 0) {
      if (typeof this.content[y - distance][x - distance] === "object") {
        if (this.content[y - distance][x - distance].player != player) { proposedPieces.push([x - distance, y - distance]); }
        else {
          if (proposedPieces.length != 0) {
            validMove = true;
            piecesToTake = piecesToTake.concat(proposedPieces);
          }
          break;
        }
      } else { break; }
      distance++;
    }

    // Validate up and right
    proposedPieces = [];
    distance = 1;
    while (x + distance < 8 && y - distance >= 0) {
      if (typeof this.content[y - distance][x + distance] === "object") {
        if (this.content[y - distance][x + distance].player != player) { proposedPieces.push([x + distance, y - distance]); }
        else {
          if (proposedPieces.length != 0) {
            validMove = true;
            piecesToTake = piecesToTake.concat(proposedPieces);
          }
          break;
        }
      } else { break; }
      distance++;
    }

    // Validate down and left
    proposedPieces = [];
    distance = 1;
    while (x - distance >= 0 && y + distance < 8) {
      if (typeof this.content[y + distance][x - distance] === "object") {
        if (this.content[y + distance][x - distance].player != player) { proposedPieces.push([x - distance, y + distance]); }
        else {
          if (proposedPieces.length != 0) {
            validMove = true;
            piecesToTake = piecesToTake.concat(proposedPieces);
          }
          break;
        }
      } else { break; }
      distance++;
    }

    // Validate down and right
    proposedPieces = [];
    distance = 1;
    while (x + distance < 8 && y + distance < 8) {
      if (typeof this.content[y + distance][x + distance] === "object") {
        if (this.content[y + distance][x + distance].player != player) { proposedPieces.push([x + distance, y + distance]); }
        else {
          if (proposedPieces.length != 0) {
            validMove = true;
            piecesToTake = piecesToTake.concat(proposedPieces);
          }
          break;
        }
      } else { break; }
      distance++;
    }

    if (returnPieces) return piecesToTake;
    return validMove;
  }
}