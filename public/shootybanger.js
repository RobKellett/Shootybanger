document.addEventListener("DOMContentLoaded", function() {
  var socket = new WebSocket("ws://ricci:8089/socket", "echo-protocol");
  var canvas = document.querySelector("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext("2d");

  var state = {};

  socket.onopen = function() {
      console.log("Connected.");
  };

  socket.onmessage = function(event) {
      var data = JSON.parse(event.data);
      switch(data.kind) {
        case 'joined': {
          state.gameId = data.gameId;
          state.playerId = data.playerId;
          $("#gameId").val(data.gameId);
          break;
        }
        case 'sync': {
          state.gameState = data.state;
          break;
        }
      }
  };

  joinGame = function(id) {
    socket.send(JSON.stringify({
      "kind": "join",
      "gameId": id,
      "playerName": "rickJames"
    }));
  };

  newGame = function() {
    socket.send(JSON.stringify({
      "kind": "new",
      "playerName": "rickJames"
    }));
  };

  var key2Purpose = function(keyCode) {
      // left arrow
      if (keyCode == 37)
          return "left";

      // right arrow
      if (keyCode == 39)
          return "right";

      // z
      if (keyCode == 90)
          return "jump";

      // x
      if (keyCode == 88)
          return "shoot";

      return null;
  };

  var sendKey = function(keyCode, act) {
      var key = key2Purpose(keyCode);

      if (key) {
          socket.send(JSON.stringify({
              "kind": "key",
              "data": {
                  "key": key,
                  "act": act
              }
          }));
          console.log("Sent key " + key + " as " + act + ".");
      }
  };

  document.addEventListener("keydown", function(evt) {
      sendKey(evt.keyCode, "down");
  });

  document.addEventListener("keyup", function(evt) {
      sendKey(evt.keyCode, "up");
  });

  window.addEventListener("resize", function() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  });

  var draw = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if(state.gameState) {
        ctx.fillStyle = "black";
        for(var playerId in state.gameState.players) {
          var player = state.gameState.players[playerId];
          if(playerId === state.playerId) ctx.fillStyle = "red";
          else ctx.fillStyle = "black";
          ctx.fillRect(player.position.x, player.position.y, 15, 15);
        }
      }

      window.requestAnimationFrame(draw);
  };

  window.requestAnimationFrame(draw);
});
