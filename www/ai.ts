class AI {
  cornerPieceValue: number; // How much the AI values capturing corner pieces
  edgeValue: number; // How much the AI values capturing edges
  opponentHelpMultiplier: number; // How much the AI values minimising opponent moves

  constructor(cornerPieceValue: number = 3, edgeValue: number = 0.5, opponentHelpMultiplier: number = 0.1) {
    this.cornerPieceValue = cornerPieceValue;
    this.edgeValue = edgeValue;
    this.opponentHelpMultiplier = opponentHelpMultiplier;
  }

  makeMove(): number[] {
    let possibleMoves: number[][] = board.getPossibleMoves(2);
    let scoredPossibleMoves: Move[] = [];

    // Calculate the score for each move
    possibleMoves.forEach(function (move) {
      let piecesToTake = board.getTakenPieces(2, move[0], move[1]);
      let score = ai.calculateScore(move, piecesToTake.length);
      scoredPossibleMoves.push(new Move(move, score));
    });

    // Rank the moves based on their score
    scoredPossibleMoves.sort((a, b) => (a.score < b.score) ? 1 : -1);

    if (scoredPossibleMoves.length === 0) return []; // If no moves, don't try to return one
    return scoredPossibleMoves[0].move; // Return the (x,y) coordinate of the best move
  }

  calculateScore(move: number[], piecesToTake: number): number {
    // Create array of corner piece coordinates given board dimensions
    let cornerPieces: number[][] = [
      [0, 0],
      [0, board.width - 1],
      [board.height - 1, 0],
      [board.height - 1, board.width - 1]
    ];

    let baseScore: number = piecesToTake;
    if (cornerPieces.includes(move)) baseScore += this.cornerPieceValue; // If it's a corner piece, increase its value
    else if (move[0] == 0 || move[0] == board.height - 1 || move[1] == 0 || move[1] == board.width - 1) baseScore += this.edgeValue; // If it's an edge piece, increase its value

    let valueToOpponent: number = this.getNextTurnProspects(move); // Calculate how much the move will help the opponent
    baseScore -= valueToOpponent * this.opponentHelpMultiplier; // Account for it

    return baseScore;
  }

  getNextTurnProspects(move: number[]): number {
    // Duplicate the board and pieces into a completely separate instance so the original board isn't affected
    let virtualBoard: Board = new Board(board.width, board.height);
    virtualBoard.playerTurn = 2;
    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        let realPiece = board.content[y][x];
        virtualBoard.content[y][x] = new Piece(realPiece.player, realPiece.empty);
      }
    }

    // Perform the given move on the virtual board
    let piecesToTakeXY: number[][] = virtualBoard.getTakenPieces(2, move[0], move[1]);
    piecesToTakeXY.forEach(function (value) {
      virtualBoard.content[value[1]][value[0]].flip();
    })
    virtualBoard.place(new Piece(2), move[0], move[1]);

    let possibleOpponentMoves: number[][] = virtualBoard.getPossibleMoves(1); // Calculate what moves the opponent has
    return possibleOpponentMoves.length; // Return how many there are
  }
}

// Simple class for storing move information
class Move {
  move: number[];
  score: number;

  constructor(move: number[], score: number) {
    this.move = move;
    this.score = score;
  }
}