var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = {}
var move = {}
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.use(express.static(__dirname + '/public'));


io.on('connection', function(socket){
  var x = Math.random() * 1300 + 100
  var y = Math.random() * 500 + 100
  users[socket.id] = {'x': x, 'y': y, 'r': 10}
  move[socket.id] = {'x': 0, 'y': 0}
  socket.on('disconnect', function(){
    delete users[socket.id]
    delete move[socket.id]
  });
  socket.send(socket.id)
  socket.on('k', function(key){
    switch(key) {
    	case 38:
    		move[socket.id].y-=1;
    		break;
    	case 40:
    		move[socket.id].y+=1;
    		break;
    	case 37:
    		move[socket.id].x-=1;
    		break;
    	case 39:
    		move[socket.id].x+=1;
    		break;
    }
  })
})


var loop = function(){
	setTimeout(function(){
		for (id in users){
			users[id].x += move[id].x
			users[id].y += move[id].y
			users[id].x = Math.min(users[id].x, 1500)
			users[id].x = Math.max(users[id].x, 0)
			users[id].y = Math.min(users[id].y, 700)
			users[id].y = Math.max(users[id].y, 0)

		}
    	io.emit('users', JSON.stringify(users))
    	loop()
	}, 50);
}


loop()