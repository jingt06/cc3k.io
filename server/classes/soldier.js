var attack = require('./attack')

module.exports = {
	create: function(player) {
		player.class =  {
			name: 'Soldier',
			tier: 0,
			skills: [],
		};
		player.attack = function() {
			attack.basicAttack(player.map, player.position, player.face, player.attackPoint, player);
		}
		player.levelUp = function(){
			player.attackPoint +=3;
			player.defencePoint +=3;
			player.maxHP += 20;
			player.HP = player.maxHP;
		}
	}
}