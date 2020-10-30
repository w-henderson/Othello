var AI = /** @class */ (function () {
    function AI(cornerPieceValue, edgeValue, opponentHelpMultiplier) {
        if (cornerPieceValue === void 0) { cornerPieceValue = 3; }
        if (edgeValue === void 0) { edgeValue = 0.5; }
        if (opponentHelpMultiplier === void 0) { opponentHelpMultiplier = 0.1; }
        this.cornerPieceValue = cornerPieceValue;
        this.edgeValue = edgeValue;
        this.opponentHelpMultiplier = opponentHelpMultiplier;
    }
    AI.prototype.makeMove = function () {
        var possibleMoves = board.getPossibleMoves(2);
        var scoredPossibleMoves = [];
        // Calculate the score for each move
        possibleMoves.forEach(function (move) {
            var piecesToTake = board.getTakenPieces(2, move[0], move[1]);
            var score = ai.calculateScore(move, piecesToTake.length);
            scoredPossibleMoves.push(new Move(move, score));
        });
        // Rank the moves based on their score
        scoredPossibleMoves.sort(function (a, b) { return (a.score < b.score) ? 1 : -1; });
        if (scoredPossibleMoves.length === 0)
            return []; // If no moves, don't try to return one
        return scoredPossibleMoves[0].move; // Return the (x,y) coordinate of the best move
    };
    AI.prototype.calculateScore = function (move, piecesToTake) {
        // Create array of corner piece coordinates given board dimensions
        var cornerPieces = [
            [0, 0],
            [0, board.width - 1],
            [board.height - 1, 0],
            [board.height - 1, board.width - 1]
        ];
        var baseScore = piecesToTake;
        if (cornerPieces.includes(move))
            baseScore += this.cornerPieceValue; // If it's a corner piece, increase its value
        else if (move[0] == 0 || move[0] == board.height - 1 || move[1] == 0 || move[1] == board.width - 1)
            baseScore += this.edgeValue; // If it's an edge piece, increase its value
        var valueToOpponent = this.getNextTurnProspects(move); // Calculate how much the move will help the opponent
        baseScore -= valueToOpponent * this.opponentHelpMultiplier; // Account for it
        return baseScore;
    };
    AI.prototype.getNextTurnProspects = function (move) {
        // Duplicate the board and pieces into a completely separate instance so the original board isn't affected
        var virtualBoard = new Board(board.width, board.height);
        virtualBoard.playerTurn = 2;
        for (var y = 0; y < board.height; y++) {
            for (var x = 0; x < board.width; x++) {
                var realPiece = board.content[y][x];
                virtualBoard.content[y][x] = new Piece(realPiece.player, realPiece.empty);
            }
        }
        // Perform the given move on the virtual board
        var piecesToTakeXY = virtualBoard.getTakenPieces(2, move[0], move[1]);
        piecesToTakeXY.forEach(function (value) {
            virtualBoard.content[value[1]][value[0]].flip();
        });
        virtualBoard.place(new Piece(2), move[0], move[1]);
        var possibleOpponentMoves = virtualBoard.getPossibleMoves(1); // Calculate what moves the opponent has
        return possibleOpponentMoves.length; // Return how many there are
    };
    return AI;
}());
// Simple class for storing move information
var Move = /** @class */ (function () {
    function Move(move, score) {
        this.move = move;
        this.score = score;
    }
    return Move;
}());
