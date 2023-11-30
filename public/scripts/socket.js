// Assuming you have a WebSocket server running at ws://your-websocket-server
//Must work on this part

let socket = null;

function openConnection(ip, port) {

  const url = `ws://${ip}:${port}`;
  if (ip !== null || port !== null){
    socket = new WebSocket("ws://localhost:8080");
  }
  else{
    socket = new WebSocket (url);
  }

  socket.onopen = function () {
    alert("connection has been established");
  }

  socket.onerror = function () {
    alert("connection has not been established");
  }

  socket.onclose = function () {
    alert("connection has been closed");
  }

  socket.onmessage = function (message) {
    var textField  = document.getElementById("ReceivedDataID");
    textField.value = message.data;
  }
}

function closeConnection () {
  socket.close();
  clearInterval(interval);
}

//value json: id,state,additional value
function send(value) {
  socket.send(value);
}


function getWebSocket(){
  var state;
  switch(socket.readyState){
    case 0:
      state = "connecting";
      break;
    case 1:
      state = "open";
      break;
    case 2:
      state = "closing";
      break;
    case 3:
      state = "closed";
      break;
  }
  return state
}