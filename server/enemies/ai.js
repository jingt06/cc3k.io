var helper = require('../helper.js');

module.exports = {
  basicAction: function(enemy, floor, objects, io) {
    // this is for simple melee enemy, attack range: 1
    var x = enemy.position.x;
    var y = enemy.position.y;
    var playerInRange = []
    // playerInRange is [player, position] where position is a point of x and y
    //check attack range first
    var attackRange = enemy.attackRange;
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
      var attackedPlayer = playerInRange[index][0].attacked(enemy);
      //io.emit('effect' , {type: 'attack', duration: 5, location: playerInRange[index][1]});
      return;
    }
    // cannot attack anyone, search for the nearest near enemy
    var viewRange = enemy.viewRange;
    var target = null
    var minDistance = viewRange
    for (var i = Math.ceil(x) - Math.ceil(viewRange); i <= Math.ceil(x) + Math.ceil(viewRange); i++) {
      for (var j = Math.ceil(y) - Math.ceil(viewRange); j <= Math.ceil(y) + Math.ceil(viewRange); j++) {
        for (index in objects[i][j]) {
          var object = objects[i][j][index];
          var dis = helper.distance(object.object.position, enemy.position);
          if (object.type == 'player' &&  dis <= viewRange &&
            dis < minDistance) {
            target = object.object
            minDistance = dis
          }
        }
      }
    }
    if (target != null) {
      // there is player in version range
      var targetPosition = target.position;
      enemy.speed = {x: targetPosition.x - enemy.position.x > enemy.maxSpeed ?
        enemy.maxSpeed : targetPosition.x - enemy.position.x,
        y: targetPosition.y - enemy.position.y > enemy.maxSpeed ?
        enemy.maxSpeed : targetPosition.y - enemy.position.y}
      console.log(enemy.speed)
    } else {
      //just random move
      enemy.speed.x = Math.random() * enemy.maxSpeed;
      enemy.speed.y = Math.random() * enemy.maxSpeed;
    }
  }
}