document.addEventListener("DOMContentLoaded", function() {
    var socket = new WebSocket("ws://ricci:8089/socket", "echo-protocol");
    var canvas = document.querySelector("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    
    var player = {
        position: {
            x: 0,
            y: 0
        },        
        velocity: {
            x: 0,
            y: 0
        }
    };

    socket.onopen = function() {
        console.log("Connected.");
        socket.send(JSON.stringify({
          "kind": "new"
        }));
    };

    socket.onmessage = function(event) {
        var data = JSON.parse(event.data);
        player.position.x = data.x;
        player.position.y = data.y;
        player.velocity.x = data.vx;
    };

    var key2key = function(keyCode) {
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
        var key = key2key(keyCode);

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
        
        ctx.fillStyle = "black";
        ctx.fillRect(player.position.x, player.position.y, 100, 100);
        
        window.requestAnimationFrame(draw);
    };
    
    window.requestAnimationFrame(draw);
});
