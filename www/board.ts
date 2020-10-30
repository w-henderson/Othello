class Piece {
  player: number;
  color: "black" | "white";
  empty: boolean;

  constructor(player: number, empty: boolean = false) {
    this.player = player;
    this.color = this.player === 1 ? "black" : "white";
    this.empty = empty;
  }

  flip(): void {
    this.player = this.player === 1 ? 2 : 1;
    this.color = this.player === 1 ? "black" : "white";
  }
}

class Board {
  content: Piece[][];
  playerTurn: number;
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.content = [];
    for (let y = 0; y < this.height; y++) {
      this.content.push([]);
      for (let x = 0; x < this.width; x++) {
        this.content[y].push(new Piece(0, true));
      }
    }
    this.playerTurn = 1;

    this.place(new Piece(1), 3, 4);
    this.place(new Piece(1), 4, 3);
    this.place(new Piece(2), 3, 3);
    this.place(new Piece(2), 4, 4);
  }

  reset(): void {
    this.content = [];
    for (let y = 0; y < this.height; y++) {
      this.content.push([]);
      for (let x = 0; x < this.width; x++) {
        this.content[y].push(new Piece(0, true));
      }
    }
    this.playerTurn = 1;

    this.place(new Piece(1), 3, 4);
    this.place(new Piece(1), 4, 3);
    this.place(new Piece(2), 3, 3);
    this.place(new Piece(2), 4, 4);
  }

  place(piece: Piece, x: number, y: number): void {
    this.content[y][x] = piece;
    this.playerTurn = this.playerTurn === 1 ? 2 : 1
  }

  processContent(x: number, y: number): string {
    if (!this.content[y][x].empty) return this.content[y][x].color;
    return "#0C3B2C";
  }

  displayValids(player: number): number[][] {
    let possibles: number[][] = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.validateMove(player, x, y)) {
          possibles.push([x, y]);
        }
      }
    }
    return possibles;
  }

  isFull(): boolean {
    let full: boolean = true;
    this.content.forEach(function (value) {
      value.forEach(function (realValue) {
        if (realValue.empty) {
          full = false;
        }
      });
    });
    return full;
  }

  piecesOfEachPlayer(): number[] {
    let player1: number = 0;
    let player2: number = 0;
    this.content.forEach(function (value) {
      value.forEach(function (realValue) {
        if (!realValue.empty) {
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

  getPossibleMoves(player: number): number[][] {
    let possibleMoves: number[][] = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.validateMove(player, x, y)) {
          possibleMoves.push([x, y]);
        }
      }
    }
    return possibleMoves;
  }

  validateMove(player: number, x: number, y: number): boolean {
    let validMove: boolean = false;
    let piecesToTake: number[][] = [];
    if (!this.content[y][x].empty) return validMove;

    let possibleDirections: number[][] = [
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
      let proposedPieces: number[][] = [];
      let currentPosition: { x: number, y: number } = { x: x + direction[0], y: y + direction[1] };
      while (currentPosition.x >= 0 && currentPosition.x < this.width && currentPosition.y >= 0 && currentPosition.y < this.height) {
        if (!this.content[currentPosition.y][currentPosition.x].empty) {
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

    return validMove;
  }

  getTakenPieces(player: number, x: number, y: number): number[][] {
    let piecesToTake: number[][] = [];
    if (!this.content[y][x].empty) return [];

    let possibleDirections: number[][] = [
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
      let proposedPieces: number[][] = [];
      let currentPosition: { x: number, y: number } = { x: x + direction[0], y: y + direction[1] };
      while (currentPosition.x >= 0 && currentPosition.x < this.width && currentPosition.y >= 0 && currentPosition.y < this.height) {
        if (!this.content[currentPosition.y][currentPosition.x].empty) {
          if (this.content[currentPosition.y][currentPosition.x].player != player) { proposedPieces.push([currentPosition.x, currentPosition.y]); }
          else {
            if (proposedPieces.length != 0) {
              piecesToTake = piecesToTake.concat(proposedPieces);
            }
            break;
          }
        } else { break; }
        currentPosition.x += direction[0];
        currentPosition.y += direction[1];
      }
    }, this);

    return piecesToTake;
  }
}