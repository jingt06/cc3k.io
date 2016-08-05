var goblin = require('./goblin')
var imp = require('./imp')

var allEnemies = [goblin, imp];

module.exports = function() {
	var createEnemy = function(point, enemyStr) {
			var enemy;
			switch (enemyStr) {
				case 'goblin':
					enemy = goblin.create();
					break;
				case 'imp':
					enemy = imp.create();
					break;
				default:
					var index = Math.floor(Math.random() * allEnemies.length);
					enemy = allEnemies[index].create();
					break;
			}
			enemy.isDead = function() {
				return enemy.HP < 0;
			};
			enemy.attacked = function(attacker, factor) {
		      var dodgeRoll = Math.random() * 100;
		      var critRoll = Math.random() * 100;
		      if (dodgeRoll > enemy.dodge) {
		      factor = factor;
		        if (critRoll < attacker.critAtt) {
		          factor = 2 * factor;
		          attacker.map.io.emit('effect' , {type: 'critical', duration: 5, location: attacker.position});
		        }
		        enemy.HP -= factor * attacker.attackPoint * 100 / (100 + enemy.defencePoint);
		      }else{
		        attacker.map.io.emit('effect' , {type: 'dodge', duration: 5, location: enemy.position});
		      }
		      return -1;
		    };
		    enemy.addExp = function(expGain){
		    	enemy.exp += expGain;
		    }
		    enemy.location = point;
			return enemy;
		};
	return {
		createEnemy: createEnemy
	}
}