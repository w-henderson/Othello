// Piece class to represent a square of the board
var Piece = /** @class */ (function () {
    function Piece(player, empty) {
        if (empty === void 0) { empty = false; }
        this.player = player;
        this.color = this.player === 1 ? "black" : "white";
        this.empty = empty;
    }
    // Function to flip the piece, reversing its values
    Piece.prototype.flip = function () {
        this.player = this.player === 1 ? 2 : 1;
        this.color = this.player === 1 ? "black" : "white";
    };
    return Piece;
}());
// Class to represent the game board
var Board = /** @class */ (function () {
    function Board(width, height) {
        this.width = width;
        this.height = height;
        // Fill the board with empty pieces
        this.content = [];
        for (var y = 0; y < this.height; y++) {
            this.content.push([]);
            for (var x = 0; x < this.width; x++) {
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
    Board.prototype.reset = function () {
        this.content = [];
        for (var y = 0; y < this.height; y++) {
            this.content.push([]);
            for (var x = 0; x < this.width; x++) {
                this.content[y].push(new Piece(0, true));
            }
        }
        this.playerTurn = 1;
        this.place(new Piece(1), 3, 4);
        this.place(new Piece(1), 4, 3);
        this.place(new Piece(2), 3, 3);
        this.place(new Piece(2), 4, 4);
    };
    // Place a piece and update the player's turn
    Board.prototype.place = function (piece, x, y) {
        this.content[y][x] = piece;
        this.playerTurn = this.playerTurn === 1 ? 2 : 1;
    };
    // Return the colour of the piece at coordinates (x, y)
    Board.prototype.processContent = function (x, y) {
        if (!this.content[y][x].empty)
            return this.content[y][x].color;
        return "#0C3B2C";
    };
    // Return a boolean as to whether the board is full
    Board.prototype.isFull = function () {
        var full = true;
        this.content.forEach(function (value) {
            value.forEach(function (realValue) {
                if (realValue.empty) {
                    full = false;
                }
            });
        });
        return full;
    };
    // Return how many pieces each player has
    Board.prototype.piecesOfEachPlayer = function () {
        var player1 = 0;
        var player2 = 0;
        this.content.forEach(function (value) {
            value.forEach(function (realValue) {
                if (!realValue.empty) {
                    if (realValue.player === 1) {
                        player1++;
                    }
                    else {
                        player2++;
                    }
                }
            });
        });
        return [player1, player2];
    };
    // Return a list of possible moves
    Board.prototype.getPossibleMoves = function (player) {
        var possibleMoves = [];
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (this.getTakenPieces(player, x, y).length > 0) {
                    possibleMoves.push([x, y]);
                }
            }
        }
        return possibleMoves;
    };
    // Return a list of the pieces which would be taken by a move to coordinates (x, y)
    Board.prototype.getTakenPieces = function (player, x, y) {
        var piecesToTake = [];
        if (!this.content[y][x].empty)
            return []; // If the square is already occupied, return because the move is invalid
        // Create array of directions to scan from the move
        var possibleDirections = [
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
            var proposedPieces = [];
            var currentPosition = { x: x + direction[0], y: y + direction[1] };
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
                }
                else {
                    break;
                }
                currentPosition.x += direction[0];
                currentPosition.y += direction[1];
            }
        }, this);
        return piecesToTake;
    };
    return Board;
}());
