var WebSocketServer = require('websocket').server;
var http = require('http');

/* Static server */
var server = http.createServer(function(request, response) {
  console.log("Request received for " + request.url);
  response.writeHead(404); // TODO: Serve static content?
  response.end();
});
var port = 8089;
server.listen(port, function() {
  console.log("Server is listening on port " + port);
});
/************/

gameServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  return true; // TODO: Security?
}

gameServer.on('request', function(request) {
  if(!originIsAllowed(request.origin)) {
    request.reject();
    console.log("Connection from origin " + request.origin + " rejected.");
    return;
  }

  var connection = request.accept('echo-protocol', request.origin);
  console.log("Connection accepted.");
  connection.on('message', function(msg) {
    if(msg.type === 'binary') {
      console.log("Binary not supported.");
      connection.sendUTF("Binary not supported.");
      connection.close();
    }
    console.log("Message received: " + msg.utf8Data);
    connection.sendUTF(msg.utf8Data);
  });
  connection.on('close', function(reasonCode, description) {
    console.log("Peer closed connection.");
  });
});
