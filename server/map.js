var mapWidth = 136;
var mapHeight = 50;
var mapMargin = 10;
var totalObjects = 10;
var totalEnemies = 30;
var object = require('./items/object')();
var enemies = require('./enemies/enemy.js')();
var map = ['                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '          |--------------------------------------------------------------------------------------------------------------------------------------|          ',
       '          |                                                                                                                                      |          ',
       '          |  |----------------------------------------------------|        |----------------------------------------------|                      |          ',
       '          |  |....................................................|        |..............................................|                      |          ',
       '          |  |....................................................|        |..............................................|                      |          ',
       '          |  |....................................................##########..............................................|                      |          ',
       '          |  |....................................................##########..............................................|--------------|       |          ',
       '          |  |....................................................|   ##   |.............................................................|       |          ',
       '          |  |....................................................|   ##   |.............................................................|       |          ',
       '          |  |....................................................|   ##   |.............................................................|---|   |          ',
       '          |  |....................................................|   ##   |.................................................................|-| |          ',
       '          |  |---------------------###----------------------------|   ##   |-------------##-------------------|................................| |          ',
       '          |                        ###                                ##                 ##                   |................................| |          ',
       '          |                        ###                                #####################                   |................................| |          ',
       '          |                        ###                                #####################                   |.........|-------|..............| |          ',
       '          |                        ###                                ##              ##                      |.........|       |..............| |          ',
       '          |                        ###                                ##              ##                      |.........|       |..............| |          ',
       '          |                        ###                                ##         |----##----------------|     |.........|       |..............| |          ',
       '          |                        ###                                ##         |......................|     |.........|       |..............| |          ',
       '          |                        ###                                ##         |......................|     |.........|       |..............| |          ',
       '          |                        #####################################         |......................| #####.........|       |..............| |          ',
       '          |                        #####################################         |......................| #####.........|-------|..............| |          ',
       '          |                        ##                                 ##         |......................| ##  |................................| |          ',
       '          |                        ##                                 ##         |......................| ##  |................................| |          ',
       '          |                        ##                                 ##         |......................| ##  |................................| |          ',
       '          |                        ##                                 ##         |......................| ##  |................................| |          ',
       '          |                        ##                                 ##         |......................| ##  |................................| |          ',
       '          |                        ##                                 ##         |......................| ##  |................................| |          ',
       '          |                        ##                                 ##         |---------##-----------| ##  |-------------##-----------------| |          ',
       '          |   |--------------------##----------------------|          ##                   ##             ##                ##                   |          ',
       '          |   |............................................|          ##                   ##             ##                ##                   |          ',
       '          |   |............................................|          ##                   ##             ##      |---------##-----------------| |          ',
       '          |   |............................................|          ##                   ##             ##      |............................| |          ',
       '          |   |............................................|          ######################################      |............................| |          ',
       '          |   |..............|----------|..................|          ######################################      |............................| |          ',
       '          |   |..............|          |..................|          ##                   ##                     |............................| |          ',
       '          |   |..............|          |..................|          ##                   ##                     |............................| |          ',
       '          |   |..............|          |..................|          ##       |-----------##---------------------|............................| |          ',
       '          |   |..............|          |..................|          ##       |...............................................................| |          ',
       '          |   |..............|          |..................|          ##       |...............................................................| |          ',
       '          |   |..............|          |..................|          ##       |...............................................................| |          ',
       '          |   |..............|----------|..................|          ##       |............|---------------------------|......................| |          ',
       '          |   |............................................#####################............|-----------------------|   |----------|...........| |          ',
       '          |   |............................................#####################....................................|--------------|...........| |          ',
       '          |   |............................................|                   |...............................................................| |          ',
       '          |   |............................................|                   |...............................................................| |          ',
       '          |   |............................................|                   |...............................................................| |          ',
       '          |   |--------------------------------------------|                   |---------------------------------------------------------------| |          ',
       '          |                                                                                                                                      |          ',
       '          |--------------------------------------------------------------------------------------------------------------------------------------|          ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            ',
       '                                                                                                                                                            '
       ];

var enemyList = [];

// objects contains objects on the map,
// which including items(ruins, potions...), enemies and players
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
    if (map[Math.floor(point.x)][Math.floor(point.y)] == '.') {
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
  //notify(point);
}

var generateObject = function() {
  var point = generateSpawnPoint();
  var obj = object.createObject();
  obj.position = point;
  console.log('create object at' + point.x + ' ' +point.y)
  addObject(point, obj.type, obj);
}

var distance = function(pointA, pointB) {
  return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
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

for (var i = totalObjects; i >= 0; i--) {
    generateObject();
    //generateEnemy();//TODO No enemy for now
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
    available: function(point, player){
      /*if(player && objects[point[0]][point[1]] && objects[point[0]][point[1]].object.consumable){
        objects[point[0]][point[1]].object.use(player);
        objects[point[0]][point[1]] = null;
        generateObject();
      }*/
      if (map[Math.floor(point.x)][Math.floor(point.y)] == '.' || map[Math.floor(point.x)][Math.floor(point.y)] == '#') {
        for (index in objects[Math.floor(point.x)][Math.floor(point.y)]) {
          obj = objects[Math.floor(point.x)][Math.floor(point.y)][index];
          if (obj.object != player){
            if (distance(point, obj.object.position) <= parseFloat(player.radius) + parseFloat(obj.object.radius)){
              return false;
            }
          }
        }
        return true;
      }
      return false;
    },
    addObject: addObject,
    removeObject: function(point, player){
      for (var i = objects[Math.floor(point.x)][Math.floor(point.y)].length - 1; i >= 0; i--) {
        if (objects[Math.floor(point.x)][Math.floor(point.y)][i].object == player) {
          objects[Math.floor(point.x)][Math.floor(point.y)].splice(i, 1);
        }
      }
    },/*
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
        if(!enemyList[i].isDead()) enemyList[i].action(map, objects, io);
      }
      notifyAll();
    }
  };
}