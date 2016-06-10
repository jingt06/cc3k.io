var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var map = require('./server/map')(io);
var player = require('./server/player');


var keyListener = require('./server/keylistener')(player);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

server.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});


app.use(express.static(__dirname + '/static'));

//this function runs for every 0.5s
run = function () {
  map.enemyMove();
}
setInterval(run, 500);

io.on('connection', function(socket){
  map.onlineUser++;
  // when the new user connect to server
  // send initialization object to this user
  socket.emit('id', socket.id)
  socket.emit('map', map.map);
  var spawnPoint = map.generateSpawnPoint();
  var newPlayer = player.createPlayer(socket.id, map, spawnPoint, socket);
  newPlayer.notify();
  // initialization done

  // when user disconnect
  socket.on('disconnect', function(){
    map.onlineUser--;
    player.deletePlayer(socket.id);
  });

  // when user pressed some key
  socket.on('k', function(key){
    keyListener(socket.id, key);
  })
})

