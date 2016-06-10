var attack = require('./attack');

module.exports = {
	transfer: function(player) {
		if (player.class.tier == 0) {
			player.attackPoint += 5;
			player.maxHP += 50;
			player.defencePoint += 20;
			player.class =  {
				name: 'Knight',
				tier: 1,
				skills: []
			};
			player.attack = function() {
				attack.basicAttack(player.map, player.position, player.face, player.attackPoint, player);
			};
			player.levelUp = function(){
				player.attackPoint += 1;
				player.maxHP += 30;
				player.defencePoint += 10;
				player.HP = player.maxHP;
			};
			player.upgradeClass = null;

		}
	}
}