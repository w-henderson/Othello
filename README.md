![Othello Banner](images/banner.png)

# Othello
This program is a simple yet beautiful Electron app to play the popular strategy game Othello. You can learn more about the game [here](https://en.wikipedia.org/wiki/Reversi#Othello).

## How do I install it?
There are three ways you can get this program.
- [Download the binary](https://github.com/w-henderson/Othello/releases) (recommended)
- [Play in a browser](https://w-henderson.github.io/Othello)
- Clone the repo, install dependencies, then run `npm start`

## Features
This version of Othello features two modes, one where you can play against someone on the same computer, and another where you can play against a pretty basic AI. If you've ever looked into Othello strategies, you'll easily beat the AI, but less skilled players such as myself will have a hard time beating it! The program also features a stylish user interface with slick animations and a responsive feel.

## How does the AI work?
The AI has several parameters that developers can customise. These are for changing the AI's percieved value of specific pieces on the board as well as how much it takes into account its opponent's possible moves. The AI calculates the value of each move as follows:

1. For each move, count the number of pieces the move would take.
2. If the move is to a corner, add `cornerPieceValue` (default 3).
3. If the move is to an edge (but not a corner), add `edgeValue` (default 0.5).
4. Simulate making the move, then count how many possible moves the opponent would have, multiply by `opponentHelpMultiplier` (default 0.1), and subtract from the score.

The AI then sorts the possible moves by their scores, and chooses the best one.

## Screenshots
![Screenshot of Home](images/screenshot_home.png)
![Screenshot of Game](images/screenshot_game.png)