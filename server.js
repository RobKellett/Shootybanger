var express = require('express');
var guid = require('guid');
var app = express();
var ws = require('express-ws')(app);

function connection(ws) {
  this.socket = ws;
  this.handle = handshake;
}
function handshake(message) {
  if(message.kind === 'new') {
    // Create a new game
    this.socket.send('New game created with id ' + guid.raw());
    this.handle = echo;
  } else if(message.kind === 'join') {
    this.socket.send('Joined game with id ' + message.game_id);
    this.handle = echo;
  }
  else {
    this.socket.send('Unexpected message');
  }
}
function echo(message) {
  this.socket.send('echo: ' + JSON.stringify(message));
}

var port = 8089;
app.use('/', express.static(__dirname + '/public'));
app.listen(process.env.port || port);
app.ws('/socket', function(ws, req) {
  console.log('Received websocket connection.');

  var conn = new connection(ws);

  ws.on('message', function(msg) {
    console.log('Received websocket message: ' + msg);
    try {
      var message = JSON.parse(msg);
      conn.handle(message);
    } catch (e) {
      console.log(e);
      ws.send('Invalid message received');
      ws.close();
    }
  });
});
