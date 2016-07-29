requirejs(["helper/init", "graphic"], function(init, graphic) {
	var clientId;
	var map;
  var graphic
	screenWidth = init.width;
  var socket = io.connect(window.location.hostname);
  window.onkeydown = function(e) {
      var key = e.keyCode ? e.keyCode : e.which;
      socket.emit('k',key);
  }

  // this message will only recieved once
  socket.on('map', function(m){
    map = m;
    graphic = graphic.init(m, init.canvas, init.context, init.cellWidth, socket);
  });

  socket.on('login', function(){
    graphic.loadImages(()=>{graphic.login();});
  })

  socket.on('event', function(m){
    graphic.drawMap(m);
  })

  socket.on('id', function(id){
    clientId = id
  });

  socket.on('message', function(message) {
    switch(message) {
      case 'dead':
        graphic.dead();
        break;
    }
  })

  socket.on('effect', function(effect) {
    graphic.addEffect(effect);
  });

  socket.on('effects', function(effects) {
    for(i in effects.locations){
      graphic.addEffect({type: effects.type, duration: effects.duration, location: effects.locations[i]});
    }
  });
});

