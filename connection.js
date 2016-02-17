var constants = require('./constants');
var g = require('./game');
var guid = require('guid');

function connection(ws) {
  this.socket = ws;
  this.id = guid.raw();
  this.handle = handshake;
  this.log('Opened.', 15);
}

connection.prototype.log = function(msg, level) {
  if((level || 1) > constants.LOGGING_THRESHOLD)
    console.log(`Connection ${this.id.substring(0,5)} - ${msg}`);
};

connection.prototype.close = function() {
  this.log('Closing.', 15);
  if(this.syncState)
    clearInterval(this.syncState);
  if(this.game)
    this.game.removePlayer(this.id);
  this.socket.close();
};

connection.prototype.joinGame = function(id, playerName) {
  this.game = g.globalGameList[id];
  this.log(`Player chose name ${playerName}`);
  this.game.addPlayer(this.id, playerName);
  this.socket.send(JSON.stringify({
    kind: "joined",
    gameId: this.game.id,
    playerId: this.id
  }));
  var me = this;
  this.syncState = setInterval(function() {
    try {
      me.log(`Syncing state for Game ${me.game.id}`, 5);
      me.socket.send(JSON.stringify({
        kind: 'sync',
        state: me.game.state
      }));
    } catch (e) {
      me.log(`Error while syncing state: ${e}`);
      me.close();
    }
  }, 500);
};

function handshake(message) {
  try {
    if(message.kind === 'new') {
      // Create a new game
      var newGame = new g.game(guid.raw());
      this.joinGame(newGame.id, message.playerName);
      this.handle = gameDispatch;
    } else if(message.kind === 'join') {
      this.joinGame(message.gameId, message.playerName);
      this.handle = gameDispatch;
    }
    else {
      this.log(`Unexpected message: ${JSON.stringify(message)}`, 10);
      this.socket.send(JSON.stringify({
        kind: "error",
        message: "Unexpected message"
      }));
    }
  } catch (e) {
    console.log(e);
    this.close();
  }
}

function gameDispatch(message) {
  this.game.respond(message);
}

module.exports = connection;
