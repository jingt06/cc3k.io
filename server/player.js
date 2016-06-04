east = 0;
south = 1;
west = 2;
north = 3;

allPlayer = {}

module.exports = {
  createPlayer: function(cid, m, pos, skt){
    var p = {};
    p.position = pos;
    p.map = m;
    p.clientId = cid;
    p.face = east;
    allPlayer[cid] = p;
    p.socket = skt;

    p.move = function (x, y) {
      newPos = [p.position[0] + x, p.position[1] + y];
      if (p.map.available(newPos)){
        p.map.removeItem(p.position)
        p.position = newPos;
        p.map.addItem(newPos, 'player', p);
      }
    };
    p.notify = function(){
      p.socket.emit('map', p.map.getSight(p.position))
    };
    p.map.addItem(pos, 'player', p);
    
    return p
  },

  deletePlayer: function(cid) {
    allPlayer[cid].map.removeItem(allPlayer[cid].position);
    delete allPlayer[cid];
  },

  move : function(cid, x, y) {
    allPlayer[cid].move(x, y);
  }


}