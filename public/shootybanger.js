document.addEventListener("DOMContentLoaded", function() {
    var socket = new WebSocket("ws://ricci:8089/socket", "echo-protocol");
    
    socket.onopen = function() {
        console.log("Connected.")
    };
    
    socket.onmessage = function(event) {
        console.log("Got data from server: " + event.data);
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
    }
    
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
            console.log("Sent key " + key + " as " + act + ".")
        }
    };
    
    document.addEventListener("keydown", function(evt) {
        sendKey(evt.keyCode, "down");
    });
    
    document.addEventListener("keyup", function(evt) {
        sendKey(evt.keyCode, "up");
    });
});