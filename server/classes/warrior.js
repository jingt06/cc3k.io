var attack = require('./attack');
var skill = require('../skills/classSkill');

module.exports = {
	transfer: function(player) {
		if (player.class.tier == 0) {
			player.dodge += 5;
			player.attackPoint += 5;
			player.class =  {
				name: 'Warrior',
				tier: 1,
				skills: []
			};
			player.attack = function() {
				attack.adjacentAttack(player.map, player.position, player.face, player.attackPoint, player);
			};
			player.levelUp = function(){
				player.attackPoint += 5;
				player.defencePoint += 2;
				player.maxHP += 20;
				player.HP += player.maxHP / 2;
				if (player.HP > player.maxHP) {
					player.HP = player.maxHP;
				}
			};
			player.classSkill = skill.rushing;
			player.upgradeClass = null;
		}
	}
}