const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(cors())

var ongoingGames = {};

app.get("/", (req, res) => {
  res.send("Server online.");
})

app.get("/startGame/:onlineGameID", (req, res) => {
  ongoingGames[req.params.onlineGameID] = { "player": 0, "x": -1, "y": -1 };
  res.send("Success");
  console.log(`New game started with ID ${req.params.onlineGameID}.`);
});

app.get("/latestMove/:onlineGameID", (req, res) => {
  res.json(ongoingGames[req.params.onlineGameID]);
});

app.get("/makeMove/:onlineGameID/:x/:y/:player", (req, res) => {
  ongoingGames[req.params.onlineGameID] = { "player": parseInt(req.params.player), "x": req.params.x, "y": req.params.y };
  res.send("Success");
});

app.get("/endGame/:onlineGameID", (req, res) => {
  try {
    delete ongoingGames[req.params.onlineGameID];
    res.send("Success");
    console.log(`Game with ID ${req.params.onlineGameID} ended.`);
  } catch (_) {
    res.send("Probably already deleted")
  }
});

app.get("/validateID/:onlineGameID", (req, res) => {
  if (req.params.onlineGameID in ongoingGames) {
    res.send("y");
  } else {
    res.send("n");
  }
});

app.listen(port, () => {
  console.log("Server successfully started.");
})