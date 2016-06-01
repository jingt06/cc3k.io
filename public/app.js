var socket = io()
var context;
var canvas;
var clientId;
document.addEventListener('DOMContentLoaded', function() {
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext("2d");

	socket.on('users', function(usersString){
		users = eval("(" + usersString + ")")
		context.clearRect(0, 0, canvas.width, canvas.height);
		for (id in users) {
			context.beginPath();
			context.arc(users[id].x,users[id].y, users[id].r,0,2*Math.PI);
			if(id == clientId){
				context.fillStyle = "red";
				context.fill();
			}
			context.stroke();
		}
 	});
}, false);
window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    socket.emit('k',key);
}

socket.on('message', function(id){
	clientId = id
	console.log(clientId)
})

