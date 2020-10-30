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
        possibleMoves.forEach(function (move) {
            var piecesToTake = board.getTakenPieces(2, move[0], move[1]);
            var score = ai.calculateScore(move, piecesToTake.length);
            scoredPossibleMoves.push(new Move(move, score));
        });
        scoredPossibleMoves.sort(function (a, b) { return (a.score < b.score) ? 1 : -1; });
        if (scoredPossibleMoves.length === 0 || scoredPossibleMoves[0].score === 0)
            return [];
        return scoredPossibleMoves[0].move;
    };
    AI.prototype.calculateScore = function (move, piecesToTake) {
        var cornerPieces = [
            [0, 0],
            [0, board.width - 1],
            [board.height - 1, 0],
            [board.height - 1, board.width - 1]
        ];
        var baseScore = piecesToTake;
        if (cornerPieces.includes(move))
            baseScore += this.cornerPieceValue;
        else if (move[0] == 0 || move[0] == 7 || move[1] == 0 || move[1] == 7)
            baseScore += this.edgeValue;
        var valueToOpponent = this.getNextTurnProspects(move);
        baseScore -= valueToOpponent * this.opponentHelpMultiplier;
        return baseScore;
    };
    AI.prototype.getNextTurnProspects = function (move) {
        var virtualBoard = new Board(board.width, board.height);
        virtualBoard.playerTurn = 2;
        for (var y = 0; y < board.height; y++) {
            for (var x = 0; x < board.width; x++) {
                var realPiece = board.content[y][x];
                virtualBoard.content[y][x] = new Piece(realPiece.player, realPiece.empty);
            }
        }
        var piecesToTakeXY = virtualBoard.getTakenPieces(2, move[0], move[1]);
        piecesToTakeXY.forEach(function (value) {
            virtualBoard.content[value[1]][value[0]].flip();
        });
        virtualBoard.place(new Piece(2), move[0], move[1]);
        var possibleOpponentMoves = virtualBoard.getPossibleMoves(1);
        return possibleOpponentMoves.length;
    };
    return AI;
}());
var Move = /** @class */ (function () {
    function Move(move, score) {
        this.move = move;
        this.score = score;
    }
    return Move;
}());
