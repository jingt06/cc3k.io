var helper = require('../helper.js');

module.exports = {
  basicAction: function(enemy, floor, objects, io) {
    // this is for simple melee enemy, attack range: 1
    var x = enemy.position.x;
    var y = enemy.position.y;
    var playerInRange = []
    // playerInRange is [player, position] where position is a point of x and y
    //check attack range first
    attackRange = enemy.attackRange;
    for (var i = Math.ceil(x) - Math.ceil(attackRange); i <= Math.ceil(x) + Math.ceil(attackRange); i++) {
      for (var j = Math.ceil(y) - Math.ceil(attackRange); j <= Math.ceil(y) + Math.ceil(attackRange); j++) {
        if(objects[i][j].length != 0){
          for (index in objects[i][j]) {
            object = objects[i][j][index];
            if (object.type == 'player' && helper.distance(object.object.position, enemy.position) <= attackRange) {
              playerInRange.push([object.object, object.position]);
            }
          }
        }
      }
    }
    if (playerInRange.length > 0) {
      // attack player
      var index = Math.floor(Math.random() * playerInRange.length);
      console.log('attack')
      var attackedPlayer = playerInRange[index][0].attacked(enemy);
      io.emit('effect' , {type: 'attack', duration: 5, location: playerInRange[index][1]});
    } /*else {
      // cannot attack anyone, search for near enemy
      for (var i = x - 5; i <= x + 5; i++) {
        for (var j = y - 5; j <= y + 5; j++) {
          if(objects[i][j] && objects[i][j].type == 'player'){
            playerInRange.push([objects[i][j].object, [i, j]]);
          }
        }
      }
      if (playerInRange.length > 0) {
        var index = Math.floor(Math.random() * playerInRange.length);
        var target = playerInRange[index][0];
        var targetPosition = playerInRange[index][1];
        var oldx = x;
        var oldy = y;
        if (x > targetPosition[0] && !objects[x - 1][y]){
          x--;
        } else if (x < targetPosition[0] && !objects[x + 1][y]){
          x++;
        } else if (y > targetPosition[1]  && !objects[x][y - 1]){
          y--;
        } else if (y < targetPosition[1]  && !objects[x][y + 1]){
          y++;
        }
        if(floor[x][y] == '.' && !objects[x][y]){
          objects[oldx][oldy] = null;
          enemy.location = [x, y];
          objects[x][y] = {
            type: 'enemy',
            object: enemy
          };
        }
      } else {
        //just random move
        var rand = Math.floor(Math.random() * 4);
        var oldx = x;
        var oldy = y;
        switch (rand) {
          case 0:
            x++;
            break;
          case 1:
            x--;
            break;
          case 2:
            y++;
            break;
          case 3:
            y--;
            break;
        }
        if(floor[x][y] == '.' && !objects[x][y]){
          objects[oldx][oldy] = null;
          enemy.location = [x, y];
          objects[x][y] = {
            type: 'enemy',
            object: enemy
          };
        }
      }
    }*/
  }
}