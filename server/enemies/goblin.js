module.exports = {
	create: function(){
		var goblin = {
			type: 'enemy',
			name: 'Goblin',
			consumable: false,
			description: 'Goblin is a legendary evil or mischievous grotesque dwarf-like daemon ',
			HP: 200,
			maxHP: 200,
			attackPoint: 15,
			defencePoint: 5,
			exp: 50
		};
		goblin.getInfo = function() {
			return {
				type: 'enemy',
				name: 'Goblin',
				HP: goblin.HP,
				maxHP: goblin.maxHP
			};
		};
		return goblin;
	}
}