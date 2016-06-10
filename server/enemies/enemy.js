var goblin = require('./goblin')

var allEnemies = [goblin];

module.exports = function() {
	var createEnemy = function(enemyStr) {
			var enemy;
			switch (enemyStr) {
				case 'goblin':
					enemy = goblin.create();
					break;
				default:
					var index = Math.floor(Math.random() * allEnemies.length);
					enemy = allEnemies[index].create();
					break;
			}
			enemy.isDead = function() {
				return enemy.HP < 0;
			}
			enemy.attacked = function(attacker) {
		        enemy.HP -= attacker.attackPoint * 100 / (100 + enemy.defencePoint);
		    }
			return enemy;
		};
	return {
		createEnemy: createEnemy
	}
}