var classes = require('./classes/classes');
var east = 0;
var south = 1;
var west = 2;
var north = 3;
var allPlayer = {}

var determineFace = function(y, x){
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
  createPlayer: function(name,race, cid, m, pos, skt){
    var p = {};

    // player meta data and other object
    p.map = m;
    p.clientId = cid;
    p.face = east;
    allPlayer[cid] = p;
    p.socket = skt;
    p.name = name;
    p.race = race;
    p.radius = 0.2;


    // player status info
    p.position = pos;

    // player method
    p.initStatus = function() {
      p.speed = {x:0, y:0}; // this is a point value
      p.maxSpeed = 0.2; // this is a int value
      p.maxHP = 100;
      p.exp = 20;
      p.level = 1;
      p.expNextLevel = 50;
      p.HP = p.maxHP;
      p.attackPoint = 20;
      p.defencePoint =20;
      p.regenHP = 0;
      p.dodge = 0;
      p.critAtt = 0;
      classes.createSoldier(p);
    }
    p.initStatus();

    p.notify = function() {
      var mapInfo = p.map.getSight(p.position, p);
      mapInfo.user = {
        face: p.face,
        HP: p.HP,
        maxHP: p.maxHP,
        att: p.attackPoint,
        def: p.defencePoint,
        dog: p.dodge,
        cri: p.critAtt,
        class: p.class.name,
        level: p.level,
        name: p.name,
        race: p.race,
        exp: p.exp,
        nextLevel: p.expNextLevel,
        numUsers: p.map.onlineUser,
        cellPosition: p.cellPosition,
        radius: p.radius
      };
      if (p.level >= 5 && p.class.tier == 0){
        mapInfo.upgradeClass = p.class.upgrade;
      }
      p.socket.emit('event', mapInfo);
    };

    p.move = function (x, y) {
      /*var newPos = [p.position[0] + x, p.position[1] + y];
      var oldFace = p.face;
      p.face = determineFace(x, y);
      if (p.map.available(newPos, p)){
        p.map.removeObject(p.position, p);
        p.position = newPos;
        p.map.addObject(newPos, 'player', p);
      } else if (oldFace != p.face) {
        p.notify();
      }*/
    };

    p.isDead = function() {
      return p.HP < 0;
    };

    p.addExp = function (expGain) {
      p.exp += expGain;
      while(p.exp >= p.expNextLevel){
        p.levelUp();
        p.level ++;
        p.exp -= p.expNextLevel;
        p.expNextLevel = p.level * (p.level - 1) * 50;
      }
    }

    p.restart = function() {
      p.socket.emit('id', p.socket.id)
      p.socket.emit('map', p.map.map);
      var spawnPoint = p.map.generateSpawnPoint();
      p.position = spawnPoint;
      p.cellPosition = [0, 0]; // position can be in range of -5 and 5
      p.initStatus();
      p.notify();
    }

    p.attacked = function(attacker) {
      var dodgeRoll = Math.random() * 100;
      var critRoll = Math.random() * 100;
      if (dodgeRoll > p.dodge) {
        var factor = 1;
        if (critRoll < attacker.critAtt) {
          factor = 2;
        }
        p.HP -= factor * attacker.attackPoint * 100 / (100 + p.defencePoint);
        if (p.isDead()) {
          attacker.addExp(p.expNextLevel * 4 / 5);
          p.delete();
        }
      }
    }

    p.getInfo = function() {
      return {
        face: p.face,
        HP: p.HP,
        maxHP: p.maxHP,
        name: p.name,
        race: p.race,
        cellPosition: p.cellPosition,
        radius: p.radius
      }
    };

    p.delete = function() {
      var cid = p.clientId;
      allPlayer[cid].map.removeObject(allPlayer[cid].position);
      //delete allPlayer[cid];
      p.socket.emit('message', 'dead');
    };

    p.map.addObject(pos, 'player', p);
    return p;
  },

  deletePlayer: function(cid) {
    if(allPlayer[cid]) allPlayer[cid].map.removeObject(allPlayer[cid].position, allPlayer[cid]);
    delete allPlayer[cid];
  },

  getPlayer : function(cid) {
    return allPlayer[cid]
  },

  playerMove: function() {
    for (cid in allPlayer) {
      p = allPlayer[cid];
      if (!p.isDead()) {
        p = allPlayer[cid];
        var oldCoor = {};
        var newCoor = {}
        oldCoor.x = Math.floor(p.position.x);
        oldCoor.y = Math.floor(p.position.y);
        newCoor.x = p.position.x + p.speed.x;
        newCoor.y = p.position.y + p.speed.y;
        if (p.map.available(newCoor, p)) {
          p.position = newCoor;
        } else if (p.map.available({x: p.position.x, y: newCoor.y}, p)) {
          p.position.y = newCoor.y;
        } else if (p.map.available({x: newCoor.x, y: p.position.y}, p)) {
          p.position.x = newCoor.x;
        }
        if (p.position.x > oldCoor.x + 1 || p.position.x < oldCoor.x ||
            p.position.y > oldCoor.y + 1 || p.position.y < oldCoor.y){
          p.map.removeObject(oldCoor, p)
          p.map.addObject({x: Math.floor(p.position.x), y: Math.floor(p.position.y)}, 'player', p);
        }
      }
    }
  },

  notifyAll: function() {
    for (cid in allPlayer) {
      p = allPlayer[cid];
      if (!p.isDead()) {
        p.notify();
      }
    }
  }


}
