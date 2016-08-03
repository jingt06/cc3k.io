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
       '          |  |....................................................|   ##   |..............................................|---|..............|-| |          ',
       '          |  |---------------------###----------------------------|   ##   |-------------##-------------------|...........|   |................| |          ',
       '          |                        ###                                ##                 ##                   |...........|   |................| |          ',
       '          |                        ###                                #####################                   |...........|   |................| |          ',
       '          |                        ###                                #####################                   |...........|   |................| |          ',
       '          |                        ###                                ##                 ##                   |...........|   |................| |          ',
       '          |                        ###                                ##                 ##                   |...........|   |................| |          ',
       '          |                        ###                                ##         |-------##-------------|     |...........|   |................| |          ',
       '          |                        ###                                ##         |......................|     |...........|   |--------|.......| |          ',
       '          |                        ###                                ##         |......................|     |...........|            |.......| |          ',
       '          |                        #####################################         |......................| #####...........|            |.......| |          ',
       '          |                        #####################################         |......................| #####...........|------------|.......| |          ',
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
       '          |   |........|----------------|..................|          ######################################      |............................| |          ',
       '          |   |........|-----------|    |..................|          ##                   ##                     |............................| |          ',
       '          |   |....................|    |..................|          ##                   ##                     |............................| |          ',
       '          |   |....................|    |..................|          ##       |-----------##---------------------|............................| |          ',
       '          |   |....................|    |..................|          ##       |...............................................................| |          ',
       '          |   |....................|    |..................|          ##       |...............................................................| |          ',
       '          |   |........|-----------|    |..................|          ##       |...............................................................| |          ',
       '          |   |........|----------------|..................|          ##       |............|---------------------------|......................| |          ',
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
// each entry is a json of {type:..., object:...}

for (var i = 0; i < mapHeight + mapMargin * 2; ++i) {
  var row = [];
  for (var j = 0; j < mapWidth + mapMargin * 2; ++j) {
    row.push(null);
  }
  objects.push(row);
}

var generateSpawnPoint = function(){
    var point = [Math.floor(Math.random()*mapHeight + mapMargin),
             Math.floor(Math.random()*mapWidth + mapMargin)];
    if (map[point[0]][point[1]] == '.' && !objects[point[0]][point[1]]) {
      return point;
    } else {
      return generateSpawnPoint();
    }
}

var notify = function(point) {
    var y = point[0]
    var x = point[1]
    for(var i = y - 10; i < y + 11; ++i) {
      for(var j = x - 10; j < x + 11; ++j) {
        if (objects[i][j]) {
          if (objects[i][j].type == 'player') {
            objects[i][j].object.notify();
          }
        }
      }
    }
}

var notifyAll = function() {
    for(i in objects) {
      for(j in objects[i]) {
        if (objects[i][j]) {
          if (objects[i][j].type == 'player') {
            objects[i][j].object.notify();
          }
        }
      }
    }
}

var addObject = function(point, type, obj) {
      objects[point[0]][point[1]] = {
        type: type,
        object: obj
      };
      notify(point);
}

var generateObject = function() {
  var point = generateSpawnPoint();
  var obj = object.createObject();
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

var shareExp = function (num, point) {
  var x = point[0];
  var y = point[1];
  var players = [];
  for (var i = x - 10; i <= x + 10; i++) {
    for (var j = y - 10; j <= y + 10; j++) {
      if(objects[i][j] != null && objects[i][j].type == 'player') {
        players.push(objects[i][j].object);
      }
    }
  }
  numPlayer = players.length;
  if (numPlayer == 0) return;
  sharedExp = num / numPlayer;
  players.map((player)=>player.addExp(sharedExp));
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
    io: io,
    getSight: function(point){
      var y = point[0]
      var x = point[1]
      var sliceObj = objects.slice(y-10, y + 11);
      var floor = []
      var obj = []
      for (index in sliceObj) {
        obj.push(sliceObj[index].slice(x-10, x+11).map(function(o) {
          if (o) {
            return {
              type: o.type,
              info: o.object.getInfo()
            }
          } else {
            return null;
          }
        }));
      }
      return {
        location: point,
        object: obj
      };
    },
    available: function(point, player){
      if(player && objects[point[0]][point[1]] && objects[point[0]][point[1]].object.consumable){
        objects[point[0]][point[1]].object.use(player);
        objects[point[0]][point[1]] = null;
        generateObject();
      }
      return (map[point[0]][point[1]] == '.' || map[point[0]][point[1]] == '#') && !objects[point[0]][point[1]];
    },
    addObject: addObject,
    removeObject: function(point, player){
      objects[point[0]][point[1]] = null;
      notify(point);
    },
    action: function(player, action, targets, options) {
      var retval = 0;
      switch (action) {
        case 'attack':
          var type = options.type;
          if (type == null) type = 'swardAttack';
          var duration = options.duration;
          if (duration == null) duration =5;
          io.emit('effects' , {type: type, duration: duration, locations: targets});
          notify(player.position);
          for (var i = targets.length - 1; i >= 0; i--) {
            obj = objects[targets[i][0]][targets[i][1]];
            if (obj && obj.type == 'player') {
              var attackedPlayer = obj.object;
              var killed = attackedPlayer.attacked(player);
              if (killed != -1) {
                // share exp
                shareExp(killed, targets[i]);
              }
              retval = 1;
            } else if (obj && obj.type == 'enemy') {
              var attackedEnemy = obj.object;
              attackedEnemy.attacked(player);
              if (attackedEnemy.isDead()) {
                var id = attackedEnemy.id;
                objects[targets[i][0]][targets[i][1]] = null;
                player.addExp(attackedEnemy.exp/3);
                shareExp(attackedEnemy.exp, targets[i]);
                generateEnemy(id);
              }
              retval = 1;
            }
            notify(player.position);
          }
          break;
      }
      return retval;
    },
    enemyMove: function(){
      for (var i = enemyList.length - 1; i >= 0; i--) {
        if(!enemyList[i].isDead()) enemyList[i].action(map, objects, io);
      }
      notifyAll();
    }
  };
}