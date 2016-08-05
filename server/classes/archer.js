var attack = require('./attack');
var skill = require('../skills/classSkill');

module.exports = {
	transfer: function(player) {
		if (player.class.tier == 0) {
			player.critAtt += 15;
			player.attackPoint += 8;
			player.dodge += 10;
			player.class =  {
				name: 'Archer',
				tier: 1,
				skills: []
			};
			player.attack = function() {
				attack.rangeAttack(player.map, player.position, player.face, player.attackPoint, player);
			};
			player.levelUp = function(){
				player.attackPoint += 4;
				player.dodge += 1;
				player.critAtt += 1;
				player.maxHP += 10;
				player.HP += player.maxHP / 3;
				if (player.HP > player.maxHP) {
					player.HP = player.maxHP;
				}
			};
			player.classSkill = skill.arrowRain;
			player.upgradeClass = null;
		}
	}
}