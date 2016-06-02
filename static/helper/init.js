define(function(require, exports, module) {
	var socket = io()
	var context;
	var canvas;
	var clientId;
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext("2d");
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
    exports.socketioInit = function(){
		socket.on('users', function(usersString){
			users = eval("(" + usersString + ")")
			context.clearRect(0, 0, canvas.width, canvas.height);
			for (id in users) {
				context.beginPath();
				context.arc(users[id].x,users[id].y, users[id].r,0,2*Math.PI);
				if(id == clientId){
					context.fillStyle = "blue";
				} else if (id == 'fruit') {
					context.fillStyle = 'yellow'
				} else {
					context.fillStyle = "red";
				}
				context.fill();
				context.stroke();
			}
	 	});
		window.onkeyup = function(e) {
		    var key = e.keyCode ? e.keyCode : e.which;
		    socket.emit('k',key);
		}
		socket.on('message', function(id){
			clientId = id
		})
	};
	exports.width = canvas.width;
	exports.height = canvas.height;
});