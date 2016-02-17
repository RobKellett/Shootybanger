var constants = require('./constants');
var player = require('./player');

globalGameList = {};

function game(id) {
  this.id = id;
  globalGameList[this.id] = this;
  this.state = {};
  this.state.players = {};
  this.log('Created.');
}
game.prototype.log = function(msg, level) {
  if((level || 1) > constants.LOGGING_THRESHOLD)
    console.log(`Game ${this.id.substring(0,5)} - ${msg}`);
};

game.prototype.startGame = function() {
  if(Object.keys(this.state.players).length < 2) {
    this.log('Attempted to start with too few players.', 50);
    return;
  }
  this.log('Starting the game.');
  var me = this;
  this.physicsStep = setInterval(function() {
    me.log('Physics step.', 2);
    for(var player in me.state.players) {
      me.state.players[player].physicsStep();
    }
  }, 16);
};

game.prototype.respond = function(evt) {
  this.log(`Received event: ${JSON.stringify(evt)}`, 3);
  for(var player in this.state.players) {
    this.state.players[player].respond(evt);
  }
};

game.prototype.addPlayer = function(playerId, name) {
  var playerIndex = Object.keys(this.state.players).length;
  this.state.players[playerId] = new player(name, playerId, playerIndex * 50, 0);
  if(Object.keys(this.state.players).length === 2)
    this.startGame();
};
game.prototype.removePlayer = function(playerId) {
  delete this.state.players[playerId];
  if(Object.keys(this.state.players).length === 0) {
    delete globalGameList[this.id];
    if(this.physicsStep)
      clearInterval(this.physicsStep);
  }
};

module.exports = {
  game,
  globalGameList
};
