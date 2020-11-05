var AI = /** @class */ (function () {
    function AI(cpv, ev, ohm, oocp) {
        if (cpv === void 0) { cpv = 5; }
        if (ev === void 0) { ev = 0.5; }
        if (ohm === void 0) { ohm = 0.01; }
        if (oocp === void 0) { oocp = 20; }
        this.cornerPieceValue = cpv;
        this.edgeValue = ev;
        this.opponentHelpMultiplier = ohm;
        this.openOpponentCornerPenalty = oocp;
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
        console.log(valueToOpponent);
        baseScore -= valueToOpponent * this.opponentHelpMultiplier; // Account for it
        return baseScore;
    };
    AI.prototype.getNextTurnProspects = function (move) {
        // Create array of corner piece coordinates given board dimensions
        var cornerPieces = [
            [0, 0],
            [0, board.width - 1],
            [board.height - 1, 0],
            [board.height - 1, board.width - 1]
        ];
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
        var opponentScore = 0;
        possibleOpponentMoves.forEach(function (move) {
            opponentScore += virtualBoard.getTakenPieces(1, move[0], move[1]).length;
            if (cornerPieces.includes(move)) {
                opponentScore += this.openOpponentCornerPenalty;
            }
        });
        return opponentScore; // Return how many there are
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
