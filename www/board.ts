// Piece class to represent a square of the board
class Piece {
  player: number; // The number of the player
  color: "black" | "white"; // The colour of the player
  empty: boolean; // Whether the square is empty

  constructor(player: number, empty: boolean = false) {
    this.player = player;
    this.color = this.player === 1 ? "black" : "white";
    this.empty = empty;
  }

  // Function to flip the piece, reversing its values
  flip(): void {
    this.player = this.player === 1 ? 2 : 1;
    this.color = this.player === 1 ? "black" : "white";
  }
}

// Class to represent the game board
class Board {
  content: Piece[][]; // 2D array of pieces to represent the content
  playerTurn: number; // Number of the player whose turn it is
  width: number; // How wide the board is (not used in this version)
  height: number; // How high the board is (not used in this version)

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    // Fill the board with empty pieces
    this.content = [];
    for (let y = 0; y < this.height; y++) {
      this.content.push([]);
      for (let x = 0; x < this.width; x++) {
        this.content[y].push(new Piece(0, true));
      }
    }
    this.playerTurn = 1;

    // Place the pieces in the starting locations
    this.place(new Piece(1), 3, 4);
    this.place(new Piece(1), 4, 3);
    this.place(new Piece(2), 3, 3);
    this.place(new Piece(2), 4, 4);
  }

  // Reset the board's state for a new game
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

  // Place a piece and update the player's turn
  place(piece: Piece, x: number, y: number): void {
    this.content[y][x] = piece;
    this.playerTurn = this.playerTurn === 1 ? 2 : 1
  }

  // Return the colour of the piece at coordinates (x, y)
  processContent(x: number, y: number): string {
    if (!this.content[y][x].empty) return this.content[y][x].color;
    return "#0C3B2C";
  }

  // Return a boolean as to whether the board is full
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

  // Return how many pieces each player has
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

  // Return a list of possible moves
  getPossibleMoves(player: number): number[][] {
    let possibleMoves: number[][] = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.getTakenPieces(player, x, y).length > 0) {
          possibleMoves.push([x, y]);
        }
      }
    }
    return possibleMoves;
  }

  // Return a list of the pieces which would be taken by a move to coordinates (x, y)
  getTakenPieces(player: number, x: number, y: number): number[][] {
    let piecesToTake: number[][] = [];
    if (!this.content[y][x].empty) return []; // If the square is already occupied, return because the move is invalid

    // Create array of directions to scan from the move
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

    // Scan along each direction, finding which pieces can be taken and adding them to the list piecesToTake.
    possibleDirections.forEach(function (direction) {
      let proposedPieces: number[][] = [];
      let currentPosition: { x: number, y: number } = { x: x + direction[0], y: y + direction[1] };
      while (currentPosition.x >= 0 && currentPosition.x < this.width && currentPosition.y >= 0 && currentPosition.y < this.height) {
        if (!this.content[currentPosition.y][currentPosition.x].empty) {
          if (this.content[currentPosition.y][currentPosition.x].player != player) {
            proposedPieces.push([currentPosition.x, currentPosition.y]);
          }
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