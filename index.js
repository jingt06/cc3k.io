var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var map = require('./server/map');
var keyListener = require('./server/keylistener')(null, null, null, null);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


app.use(express.static(__dirname + '/static'));

//this function runs for every 10 ms
run = function () {
  //running
}
setInterval(run, 10);

io.on('connection', function(socket){
  // when the new user connect to server
  // send initialization object to this user
  socket.emit('id', socket.id)
  spawnPoint = map.generateSpawnPoint();
  socket.emit('map', map.getSight(spawnPoint[0], spawnPoint[1]))
  // initialization done

  // when user disconnect
  socket.on('disconnect', function(){
  });

  // when user pressed some key
  socket.on('k', function(key){
    keyListener(key);
  })
})

