module.exports = {
  basicAction: function(enemy, floor, objects) {
    var x = enemy.location[0];
    var y = enemy.location[1];
    var playerInRange = []
    for (var i = x - 1; i <= x + 1; i++) {
      for (var j = y - 1; j <= y + 1; j++) {
        if(objects[i][j] && objects[i][j].type == 'player'){
          playerInRange.push([objects[i][j].object, [i, j]]);
        }
      }
    }
    if (playerInRange.length > 0) {
      var index = Math.floor(Math.random() * playerInRange.length);
      //attack playerInRange[index]
    } else {
      // cannot attack anyone, search for near enemy
      for (var i = x - 3; i <= x + 3; i++) {
        for (var j = y - 3; j <= y + 3; j++) {
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
        if (x > targetPosition[0]){
          x--;
        } else if (x < targetPosition[0]){
          x++;
        } else if (y > targetPosition[1]){
          y--;
        } else if (y < targetPosition[1]){
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
      }
    }
  }
}