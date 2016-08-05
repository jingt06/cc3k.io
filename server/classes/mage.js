var attack = require('./attack');
var skill = require('../skills/classSkill');

module.exports = {
	transfer: function(player) {
		if (player.class.tier == 0) {
			player.critAtt += 10;
			player.attackPoint += 15;
			player.class =  {
				name: 'Mage',
				tier: 1,
				skills: []
			};
			player.attack = function() {
				attack.coneAttack(player.map, player.position, player.face, player.attackPoint, player);
			};
			player.levelUp = function(){
				player.attackPoint += 10;
				player.maxHP += 5;
				player.HP += player.maxHP / 3;
				if (player.HP > player.maxHP) {
					player.HP = player.maxHP;
				}
			};
			player.classSkill = skill.fireBall;
			player.upgradeClass = null;
		}
	}
}