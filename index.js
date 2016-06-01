var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = {}
var move = {}
var counter = 0
var devil;
var deleteList = [];

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
  users[socket.id] = {'x': x, 'y': y, 'r': 20}
  move[socket.id] = {'x': 0, 'y': 0}
  socket.on('disconnect', function(){
    delete users[socket.id]
    delete move[socket.id]
  });
  socket.send(socket.id)
  socket.on('k', function(key){
    switch(key) {
    	case 38:
    		move[socket.id].y-=0.1;
    		break;
    	case 40:
    		move[socket.id].y+=0.1;
    		break;
    	case 37:
    		move[socket.id].x-=0.1;
    		break;
    	case 39:
    		move[socket.id].x+=0.1;
    		break;
    }
  })
  loop()
})

var distance = function(x1, y1, x2, y2){
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

var recover = function(){
	if (devil) users[devil].r = 20;
	devil = null;
}

var addFruit = function() {
  	var x = Math.random() * 1300 + 100
  	var y = Math.random() * 500 + 100
  	users['fruit'] = {'x': x, 'y': y, 'r': 5}
}

var loop = function(){
	setTimeout(function(){
		if(counter == 5000) counter = 0;
		if(counter == 0) {
			recover();
			addFruit();
		}
		for (id in users){
			if(id == 'fruit') continue;
			users[id].x += move[id].x
			users[id].y += move[id].y
			if(users[id].x > 1500){
				users[id].x = 1500
				move[id].x = -move[id].x
			}
			if(users[id].x < 0){
				users[id].x = 0
				move[id].x = -move[id].x
			}
			if(users[id].y > 700){
				users[id].y = 700
				move[id].y = -move[id].y
			}
			if(users[id].y < 0){
				users[id].y = 0
				move[id].y = -move[id].y
			}
		}
		var userId = Object.keys(users);
		for (var i=0; i<userId.length; i++){
			for (var j = i+1; j < userId.length; j++){
				if(distance(users[userId[i]].x, users[userId[i]].y, users[userId[j]].x, users[userId[j]].y) < users[userId[i]].r + users[userId[j]].r) {
					if(userId[i] == 'fruit' || userId[j] == 'fruit'){
						var eater
						if (userId[i] == 'fruit') {
							eater = j
						} else {
							eater = i
						}
						users[userId[eater]].r = 50
						devil = userId[eater]
						deleteList.push('fruit')
					} else if (userId[i] == devil || userId[j] == devil) {
						var dead
						if (userId[i] == devil) {
							dead = j
						} else {
							dead = i
						}
						deleteList.push(userId[dead])
					} else {
						tempx = move[userId[i]].x
						tempy = move[userId[i]].y
						move[userId[i]].x = move[userId[j]].x
						move[userId[i]].y = move[userId[j]].y
						move[userId[j]].x = tempx
						move[userId[j]].y = tempy
					}
				}
			}
		}
		for (index in deleteList){
			delete users[deleteList[index]]
		}
		deleteList = []
    	io.emit('users', JSON.stringify(users))
    	loop()
    	counter++;
	}, 5);
}

