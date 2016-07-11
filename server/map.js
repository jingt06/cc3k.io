var mapWidth = 80;
var mapHeight = 25;
var mapMargin = 10;
var totalObjects = 10;
var totalEnemies = 10;
var object = require('./items/object')();
var enemies = require('./enemies/enemy.js')();
var helper = require('./helper.js');
var map = ['                                                                                                                                                            ',
       '                                                                                                    ',
       '                                                                                                    ',
       '                                                                                                    ',
       '                                                                                                    ',
       '                                                                                                    ',
       '                                                                                                    ',
       '                                                                                                    ',
       '                                                                                                    ',
       '                                                                                                    ',
       '                                                                                                    ',
       '          |------------------------------------------------------------------------------|          ',
       '          |                                                                              |          ',
       '          | |--------------------------|        |------------------------|               |          ',
       '          | |..........................|        |........................|               |          ',
       '          | |..........................##########........................|-------|       |          ',
       '          | |..........................|   #    |................................|--|    |          ',
       '          | |..........................|   #    |...................................|--| |          ',
       '          | |----------#---------------|   #    |-----#----------------|...............| |          ',
       '          |            #                 ##############                |...............| |          ',
       '          |            #                 #     |------#------|         |...............| |          ',
       '          |            #                 #     |.............|         |...............| |          ',
       '          |            ###################     |.............|   #######...............| |          ',
       '          |            #                 #     |.............|   #     |...............| |          ',
       '          |            #                 #     |------#------|   #     |--------#------| |          ',
       '          |  |---------#-----------|     #            #          #              #        |          ',
       '          |  |.....................|     #            #          #         |----#------| |          ',
       '          |  |.....................|     #########################         |...........| |          ',
       '          |  |.....................|     #            #                    |...........| |          ',
       '          |  |.....................|     #    |-------#--------------------|...........| |          ',
       '          |  |.....................|     #    |........................................| |          ',
       '          |  |.....................############........................................| |          ',
       '          |  |.....................|          |........................................| |          ',
       '          |  |---------------------|          |----------------------------------------| |          ',
       '          |                                                                              |          ',
       '          |------------------------------------------------------------------------------|          ',
       '                                                                                                    ',
       '                                                                                                    ',
       '                                                                                                    ',
       '                                                                                                    ',
       '                                                                                                    ',
       '                                                                                                    ',
       '                                                                                                    ',
       '                                                                                                    ',
       '                                                                                                    ',
       '                                                                                                   '
       ];

var enemyList = [];

// objects contains objects on the map,
// which including items(ruins, potions...), enemies and players
// each entry in objects is a lsit of objects, which is json of {type, object, position}
var objects = [];
for (var i = 0; i < mapHeight + mapMargin * 2; ++i) {
  var row = [];
  for (var j = 0; j < mapWidth + mapMargin * 2; ++j) {
    row.push([]);
  }
  objects.push(row);
}

var generateSpawnPoint = function(){
  var point = {x: Math.random()*mapHeight + mapMargin,
               y: Math.random()*mapWidth + mapMargin};
  if (map[Math.floor(point.x)][Math.floor(point.y)] == '.' && objects[Math.floor(point.x)][Math.floor(point.y)].length == 0) {
    return point;
  } else {
    return generateSpawnPoint();
  }
  return point;
}

var notify = function(point) {
  var y = Math.floor(point.x);
  var x = Math.floor(point.y);
  for(var i = y - 3; i < y + 4; ++i) {
    for(var j = x - 3; j < x + 4; ++j) {
      for(k in objects[i][j]){
        if (objects[i][j][k].type == 'player') {
          objects[i][j][k].object.notify();
        }
      }
    }
  }
}

var notifyAll = function() {
    for(i in objects) {
      for(j in objects[i]) {
        for(k in objects[i][j]){
          if (objects[i][j][k].type == 'player') {
            objects[i][j][k].object.notify();
          }
        }
      }
    }
}

var addObject = function(point, type, obj) {
  objects[Math.floor(point.x)][Math.floor(point.y)].push({
    type: type,
    object: obj
  });
}
var removeObject = function(point, obj){
  for (var i = objects[Math.floor(point.x)][Math.floor(point.y)].length - 1; i >= 0; i--) {
    if (objects[Math.floor(point.x)][Math.floor(point.y)][i].object == obj) {
      objects[Math.floor(point.x)][Math.floor(point.y)].splice(i, 1);
    }
  }
}

var generateObject = function() {
  var point = generateSpawnPoint();
  var obj = object.createObject();
  obj.position = point;
  addObject(point, obj.type, obj);
}

var generateEnemy = function(id) {
  var point = generateSpawnPoint();
  var enemy = enemies.createEnemy(point);
  if (id) {
    enemyList[id] = enemy;
  } else {
    var id = enemyList.length;
    enemyList.push(enemy);
    enemy.id = id;
  }
  addObject(point, enemy.type, enemy);
}

var available = function(point, player, isPlayer){
  if (map[Math.floor(point.x)][Math.floor(point.y)] == '.' || map[Math.floor(point.x)][Math.floor(point.y)] == '#') {
    // push nearest objects into one array
    // each item in array is a json of {obj, point}
    nearByPlayers = []
    for (var i = Math.floor(point.x) - 1; i <= Math.floor(point.x) + 1; ++i) {
      for (var j = Math.floor(point.y) - 1; j <= Math.floor(point.y) + 1; ++j) {
        for(index in objects[i][j]){
          nearByPlayers.push(objects[i][j][index]);
        }
      }
    }
    if(nearByPlayers.length == 0){
      return true;
    }
    for (index in nearByPlayers) {
      obj = nearByPlayers[index];
      if (obj.object != player){
        if (helper.distance(point, obj.object.position) <= parseFloat(player.radius) + parseFloat(obj.object.radius)){
          if(isPlayer && obj.object.consumable) {
            obj.object.use(player);
            // remove object from map
            objects[Math.floor(obj.object.position.x)][Math.floor(obj.object.position.y)].splice(index, 1);
            generateObject();
            return true;
          }
          return false;
        }
      }
    }
    return true;
  }
  return false;
}

for (var i = totalObjects; i >= 0; i--) {
    generateObject();
    generateEnemy();
}

module.exports = function(io) {
  return {
    onlineUser: 0,
    map: map,
    objects: objects,
    height: mapHeight,
    width: mapWidth,
    margin:mapMargin,
    generateSpawnPoint: generateSpawnPoint,
    getSight: function(point, player){
      var y = Math.floor(point.x);
      var x = Math.floor(point.y);
      var floor = []
      var obj = []
      for (var i = y - 3; i <= y + 4; ++i) {
        for (var j = x - 3; j <= x + 4; ++j) {
          for(index in objects[i][j]) {
            o = objects[i][j][index];
            if (o.object != player) {
              obj.push ({
                type: o.type,
                info: o.object.getInfo(),
                position: o.object.position
              })
            }
          }
        }
      }
      return {
        object: obj,
        location: point
      };
    },
    available: available,
    addObject: addObject,
    removeObject: removeObject,/*
    action: function(player, action, targets, options) {
      switch (action) {
        case 'attack':
          io.emit('effects' , {type: 'attack', duration: 5, locations: targets});
          notify(player.position);
          for (var i = targets.length - 1; i >= 0; i--) {
            obj = objects[targets[i][0]][targets[i][1]];
            if (obj && obj.type == 'player') {
              var attackedPlayer = obj.object;
              attackedPlayer.attacked(player);
            } else if (obj && obj.type == 'enemy') {
              var attackedEnemy = obj.object;
              attackedEnemy.attacked(player);
              if (attackedEnemy.isDead()) {
                var id = attackedEnemy.id;
                objects[targets[i][0]][targets[i][1]] = null;
                player.addExp(attackedEnemy.exp);
                generateEnemy(id);
              }
            }
            notify(player.position);
          }
          break;
      }
    },*/
    enemyMove: function() {
      for (var i = enemyList.length - 1; i >= 0; i--) {
        if(!enemyList[i].isDead()){
          e = enemyList[i];
          e.action(map, objects, io);
          var oldCoor = {};
          var newCoor = {}
          oldCoor.x = Math.floor(e.position.x);
          oldCoor.y = Math.floor(e.position.y);
          newCoor.x = e.position.x + e.speed.x;
          newCoor.y = e.position.y + e.speed.y;
          if (available(newCoor, e)) {
            e.position = newCoor;
          } else if (available({x: e.position.x, y: newCoor.y}, e)) {
            e.position.y = newCoor.y;
          } else if (available({x: newCoor.x, y: e.position.y}, e)) {
            e.position.x = newCoor.x;
          }
          if (e.position.x > oldCoor.x + 1 || e.position.x < oldCoor.x ||
            e.position.y > oldCoor.y + 1 || e.position.y < oldCoor.y){
            removeObject(oldCoor, e)
            addObject({x: Math.floor(e.position.x), y: Math.floor(e.position.y)}, 'enemy', e);
          }
        }
      }
    }
  };
}