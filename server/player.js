east = 0;
south = 1;
west = 2;
north = 3;

allPlayer = {}

determineFace = function(y, x){
  if (x > 0) {
    return east;
  } else if (x < 0) {
    return west;
  } else if (y > 0) {
    return south;
  } else if (y < 0) {
    return north;
  }
}

module.exports = {
  createPlayer: function(cid, m, pos, skt){
    var p = {};

    // player meta data and other object
    p.map = m;
    p.clientId = cid;
    p.face = east;
    allPlayer[cid] = p;
    p.socket = skt;

    // player status info
    p.position = pos;
    p.maxHP = 100;
    p.HP = 100;
    p.attack = 20
    p.defence =20

    // player methodmi
    var notify = function() {
      mapInfo = p.map.getSight(p.position);
      mapInfo.user = {
        face: p.face,
        HP: p.HP,
        maxHP: p.maxHP
      };
      p.socket.emit('map', mapInfo);
    };

    p.move = function (x, y) {
      newPos = [p.position[0] + x, p.position[1] + y];
      p.face = determineFace(x, y);
      if (p.map.available(newPos)){
        p.map.removeItem(p.position);
        p.position = newPos;
        p.map.addItem(newPos, 'player', p);
      } else {
        notify();
      }
    };

    p.notify = notify

    p.getInfo = function() {
      return {
        face: p.face,
        HP: p.HP,
        maxHP: p.maxHP
      }
    }
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