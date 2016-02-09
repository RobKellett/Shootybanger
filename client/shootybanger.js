document.addEventListener("DOMContentLoaded", function() {
    var socket = new WebSocket("ws://ricci:8089/", "echo-protocol");
    
    socket.onopen = function() {
        socket.send("[hacker voice] I'm in.");
    };
    
    socket.onmessage = function(event) {
        var div = document.createElement("div");
        div.textContent = event.data;
        document.querySelector("body").appendChild(div);
    };
});