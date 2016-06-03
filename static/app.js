requirejs(["helper/init", "graphic"], function(init, graphic) {
	var clientId;
	var map;
	screenWidth = init.width;
  	socket = io();

  	graphic = graphic.init(init.context, init.cellWidth);
    window.onkeyup = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        socket.emit('k',key);
    }

    socket.on('map', function(m){
      map = m;
      graphic.drawMap(m);
    });

    socket.on('id', function(id){
      clientId = id
    });
});

