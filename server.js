var constants = require('./constants');
var connection = require('./connection');
var express = require('express');
var guid = require('guid');
var app = express();
var ws = require('express-ws')(app);

var port = 8089;
app.use('/', express.static(__dirname + '/public'));
app.listen(process.env.port || port);
app.ws('/socket', function(ws, req) {
  console.log('Received websocket connection.');

  var conn = new connection(ws);

  ws.on('message', function(msg) {
    try {
      var message = JSON.parse(msg);
      message.sentBy = conn.id;
      conn.handle(message);
    } catch (e) {
      console.log(e);
      conn.socket.send(JSON.stringify({
        kind:'error',
        message: 'Error processing message'
      }));
      conn.close();
    }
  });
});
