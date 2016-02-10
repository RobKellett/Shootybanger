var express = require('express');
var guid = require('guid');
var app = express();
var ws = require('express-ws')(app);

function connection(ws) {
  this.socket = ws;
  this.handle = handshake;
  this.player = {
    x: 0,
    y: 0,
    vx: 0
  };

  var me = this;

  this.sendStateTimer = setInterval(function() {
    try {
      me.socket.send(JSON.stringify(me.player));
    } catch (e) {
      console.log(e);
      this.close();
    }
  }, 200);
  this.playerUpdateTimer = setInterval(function() {
    me.player.x += me.player.vx;
  }, 100);
}
connection.prototype.close = function() {
  clearInterval(this.sendStateTimer);
  clearInterval(this.playerUpdateTimer);
  this.socket.close();
};

function handshake(message) {
  try {
    if(message.kind === 'new') {
      // Create a new game
      this.socket.send('New game created with id ' + guid.raw());
      this.handle = game;
    } else if(message.kind === 'join') {
      this.socket.send('Joined game with id ' + message.game_id);
      this.handle = game;
    }
    else {
      console.log('Unexpected message: ' + JSON.stringify(message));
      this.socket.send('Unexpected message');
    }
  } catch (e) {
    console.log(e);
    this.close();
  }
}

function game(message) {
  if(message.kind === 'key') {
    if(message.data.act === 'up') {
      this.player.vx = 0;
    } else if(message.data.key === 'left') {
      this.player.vx = -50;
    } else if(message.data.key === 'right') {
      this.player.vx = 50;
    }
  }
}

var port = 8089;
app.use('/', express.static(__dirname + '/public'));
app.listen(process.env.port || port);
app.ws('/socket', function(ws, req) {
  console.log('Received websocket connection.');

  var conn = new connection(ws);

  ws.on('message', function(msg) {
    try {
      var message = JSON.parse(msg);
      conn.handle(message);
    } catch (e) {
      console.log(e);
      conn.socket.send('Error processing message');
      conn.close();
    }
  });
});
