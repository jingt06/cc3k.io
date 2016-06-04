mapWidth = 80;
mapHeight = 25;
mapMargin = 10;
map = ['                                                                                                    ',
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
       '          |  |--------------------------|        |-----------------------|               |          ',
       '          |  |..........................|        |.......................|               |          ',
       '          |  |..........................##########.......................|-------|       |          ',
       '          |  |..........................|   #    |...............................|--|    |          ',
       '          |  |..........................|   #    |..................................|--| |          ',
       '          |  |----------#---------------|   #    |----#----------------|...............| |          ',
       '          |             #                 #############                |...............| |          ',
       '          |             #                 #     |-----#------|         |...............| |          ',
       '          |             #                 #     |............|         |...............| |          ',
       '          |             ###################     |............|   #######...............| |          ',
       '          |             #                 #     |............|   #     |...............| |          ',
       '          |             #                 #     |-----#------|   #     |--------#------| |          ',
       '          |   |---------#-----------|     #           #          #              #        |          ',
       '          |   |.....................|     #           #          #         |----#------| |          ',
       '          |   |.....................|     ########################         |...........| |          ',
       '          |   |.....................|     #           #                    |...........| |          ',
       '          |   |.....................|     #    |------#--------------------|...........| |          ',
       '          |   |.....................|     #    |.......................................| |          ',
       '          |   |.....................############.......................................| |          ',
       '          |   |.....................|          |.......................................| |          ',
       '          |   |---------------------|          |---------------------------------------| |          ',
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
       '                                                                                                    '
       ];
object = [];
for (var i = 0; i < mapHeight + mapMargin * 2; ++i) {
  row = [];
  for (var j = 0; j < mapWidth + mapMargin * 2; ++j) {
    row.push(null);
  }
  object.push(row);
}
generateSpawnPoint = function(){
    point = [Math.floor(Math.random()*mapHeight + mapMargin),
             Math.floor(Math.random()*mapWidth + mapMargin)];
    if (map[point[0]][point[1]] == '.' && !object[point[0]][point[1]]) {
      return point;
    } else {
      return generateSpawnPoint();
    }
}

notify = function(point) {
    y = point[0]
    x = point[1]
    for(var i = y - 10; i < y + 11; ++i) {
      for(var j = x - 10; j < x + 11; ++j) {
        if (object[i][j]) {
          if (object[i][j].type == 'player') {
            object[i][j].item.notify();
          }
        }
      }
    }
}

module.exports = {
  map: map,
  object: object,
  height: mapHeight,
  width: mapWidth,
  margin:mapMargin,
  generateSpawnPoint: generateSpawnPoint,
  getSight: function(point){
    y = point[0]
    x = point[1]
    slicedMap = map.slice(y-10, y + 11);
    sliceObj = object.slice(y-10, y + 11);
    floor = []
    for (index in slicedMap) {
      floor.push(slicedMap[index].substring(x-10, x+11));
    }
    obj = []
    for (index in sliceObj) {
      obj.push(sliceObj[index].slice(x-10, x+11).map(function(o) {
        if (o) {
          return o.type;
        } else {
          return null;
        }
      }))
    }
    return {
      floor: floor,
      object: obj
    };
  },
  available: function(point){
    return ((map[point[0]][point[1]] == '.' || map[point[0]][point[1]] == '#') && !object[point[0]][point[1]])
  },
  addItem: function(point, type, item) {
    object[point[0]][point[1]] = {
      type: type,
      item: item
    };
    notify(point);
  },
  removeItem: function(point){
    object[point[0]][point[1]] = null;
    notify(point);
  }
};
