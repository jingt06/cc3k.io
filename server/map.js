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
    // TODO: solve conflict problem
    //if (map[point[0]][point[1]] == '.' && !objects[point[0]][point[1]]) {
    //  return point;
    //} else {
    //  return generateSpawnPoint();
    //}
    return point;
}

var notify = function(point) {
    var y = point[0]
    var x = point[1]
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
  console.log(point)
  objects[Math.floor(point.x)][Math.floor(point.y)].push({
    type: type,
    object: obj
  });
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

for (var i = totalObjects; i >= 0; i--) {
    //generateObject(); //TODO No enemy for now
    //generateEnemy();
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
    getSight: function(point){
      var y = Math.floor(point[0]);
      var x = Math.floor(point[1]);
      var sliceObj = objects.slice(y-3, y + 4);
      var floor = []
      var obj = []
      for (index in sliceObj) {
        obj.push(sliceObj[index].slice(x - 3, x + 4).map(function(o) {
          var returnList = []
          for (index in o) {
            returnList.push ({
              type: o.type,
              info: o.object.getInfo()
            })
          }
          return returnList;
      }))};
      return {
        location: point,
        object: obj
      };
    },
    /*available: function(point, player){
      if(player && objects[point[0]][point[1]] && objects[point[0]][point[1]].object.consumable){
        objects[point[0]][point[1]].object.use(player);
        objects[point[0]][point[1]] = null;
        generateObject();
      }
      return (map[point[0]][point[1]] == '.' || map[point[0]][point[1]] == '#') && !objects[point[0]][point[1]];
    },*/
    addObject: addObject,
    removeObject: function(point, player){
      console.log(point)
      for (var i = objects[Math.floor(point.x)][Math.floor(point.y)].length - 1; i >= 0; i--) {
        if (objects[Math.floor(point.x)][Math.floor(point.y)][i] == player) {
          objects.slice(i, 1);
        }
      }
      notify(point);
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
    enemyMove: function(){
      for (var i = enemyList.length - 1; i >= 0; i--) {
        if(!enemyList[i].isDead()) enemyList[i].action(map, objects, io);
      }
      notifyAll();
    }
  };
}