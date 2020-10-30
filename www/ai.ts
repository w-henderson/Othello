class AI {
  cornerPieceValue: number;
  edgeValue: number;
  opponentHelpMultiplier: number;

  constructor(cornerPieceValue: number = 3, edgeValue: number = 0.5, opponentHelpMultiplier: number = 0.1) {
    this.cornerPieceValue = cornerPieceValue;
    this.edgeValue = edgeValue;
    this.opponentHelpMultiplier = opponentHelpMultiplier;
  }

  makeMove(): number[] {
    let possibleMoves: number[][] = board.getPossibleMoves(2);
    let scoredPossibleMoves: Move[] = [];

    possibleMoves.forEach(function (move) {
      let piecesToTake = board.getTakenPieces(2, move[0], move[1]);
      let score = ai.calculateScore(move, piecesToTake.length);
      scoredPossibleMoves.push(new Move(move, score));
    });

    scoredPossibleMoves.sort((a, b) => (a.score < b.score) ? 1 : -1);

    if (scoredPossibleMoves.length === 0 || scoredPossibleMoves[0].score === 0) return [];
    return scoredPossibleMoves[0].move;
  }

  calculateScore(move: number[], piecesToTake: number): number {
    let cornerPieces: number[][] = [
      [0, 0],
      [0, board.width - 1],
      [board.height - 1, 0],
      [board.height - 1, board.width - 1]
    ];

    let baseScore: number = piecesToTake;
    if (cornerPieces.includes(move)) baseScore += this.cornerPieceValue;
    else if (move[0] == 0 || move[0] == 7 || move[1] == 0 || move[1] == 7) baseScore += this.edgeValue;

    let valueToOpponent: number = this.getNextTurnProspects(move);
    baseScore -= valueToOpponent * this.opponentHelpMultiplier;

    return baseScore;
  }

  getNextTurnProspects(move: number[]): number {
    let virtualBoard: Board = new Board(board.width, board.height);
    virtualBoard.playerTurn = 2;
    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        let realPiece = board.content[y][x];
        virtualBoard.content[y][x] = new Piece(realPiece.player, realPiece.empty);
      }
    }

    let piecesToTakeXY: number[][] = virtualBoard.getTakenPieces(2, move[0], move[1]);
    piecesToTakeXY.forEach(function (value) {
      virtualBoard.content[value[1]][value[0]].flip();
    })
    virtualBoard.place(new Piece(2), move[0], move[1]);

    let possibleOpponentMoves: number[][] = virtualBoard.getPossibleMoves(1);
    return possibleOpponentMoves.length;
  }
}

class Move {
  move: number[];
  score: number;

  constructor(move: number[], score: number) {
    this.move = move;
    this.score = score;
  }
}