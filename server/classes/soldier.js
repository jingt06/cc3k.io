var attack = require('./attack');
var warrior = require('./warrior');
var mage = require('./mage');
var archer = require('./archer');
var knight = require('./knight');

module.exports = {
	create: function(player) {
		classList= [warrior, mage, archer, knight];
		upgradeList = ['warrior', 'mage', 'archer', 'knight'];
		player.class =  {
			name: 'Soldier',
			tier: 0,
			skills: [],
			upgrade: upgradeList
		};
		player.attack = function() {
			attack.basicAttack(player.map, player.position, player.face, player.attackPoint, player);
		}
		player.levelUp = function(){
			player.attackPoint += 2;
			player.defencePoint += 2;
			player.maxHP += 10;
			player.HP = player.maxHP;
		}
		player.upgradeClass = function(i){
			classList[i].transfer(player);
		}
	}
}