var express = require('express');
var app = express();
var ws = require('express-ws')(app);

var port = 8089;
app.use('/', express.static(__dirname + '/public'));
app.listen(process.env.port || port);
app.ws('/socket', function(ws, req) {
  console.log('Received websocket connection.');
  ws.on('message', function(msg) {
    console.log('Received websocket message: ' + msg);
    ws.send('echo: ' + msg);
  });
});
