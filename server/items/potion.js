// There is HalthPotion, AttackPotion and DefencePotion
var healthPotion = 0;
var atkPotion = 1;
var defPotion = 2;
module.exports = {
	create: function(){
		var randomPotion = Math.floor(Math.random() * 3);
		switch (randomPotion) {
			case healthPotion:
				return {
					type: 'potionH',
					consumable: true,
					description: 'a health potion that restores 15% - 30% health',
					use: function(player) {
						var restore = Math.floor(Math.random() * 15 + 15);
						player.HP += player.HP * restore / 100;
						if (player.HP > player.maxHP) player.HP = player.maxHP;
						return 'restores ' +  restore + ' HP.'
					},
					getInfo: function() {
						return null;
					}
				};
				break;
			case atkPotion:
				return {
					type: 'potionA',
					consumable: true,
					description: 'a attack potion that add 5 attack point',
					use: function(player) {
						player.attackPoint += 5;
						return 'add 5 attack.'
					},
					getInfo: function() {
						return null;
					}
				};
				break;
			case defPotion:
				return {
					type: 'potionD',
					consumable: true,
					description: 'a attack potion that add 5 defence point',
					use: function(player) {
						player.defencePoint += 5;
						return 'add 5 defence.'
					},
					getInfo: function() {
						return null;
					}
				};
				break;
		}
	}
}