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
			enemy.attacked = function(attacker) {
		        enemy.HP -= attacker.attackPoint * 100 / (100 + enemy.defencePoint);
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