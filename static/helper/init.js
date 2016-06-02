define(function(require, exports, module) {
	var context;
	var canvas;
	var width;
	var clientId;
	var map;
	socket = io()
	canvas = document.getElementById('myCanvas');
	context = canvas.getContext("2d");
	ScreenWidth = document.body.clientWidth;
	ScreenHeight = document.body.clientHeight;
	width = (ScreenWidth > ScreenHeight ? ScreenHeight : ScreenWidth); // we need a square screen
	canvas.width = width;
	canvas.height = width;
    exports.socketInit = function(){
		window.onkeyup = function(e) {
		    var key = e.keyCode ? e.keyCode : e.which;
		    socket.emit('k',key);
		}
		socket.on('map', function(m){
	 		map = m;
	 	});
		socket.on('id', function(id){
			clientId = id
		})
	};
	exports.width = width;
	exports.socket = socket;
	exports.cellWidth = width/21;
	exports.map = map;
	exports.clientId = clientId;
});