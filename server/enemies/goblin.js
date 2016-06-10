var ai = require('./ai')
var counter = 0;
module.exports = {
	create: function(){
		var goblin = {
			type: 'enemy',
			name: 'Goblin',
			consumable: false,
			description: 'Goblin is a legendary evil or mischievous grotesque dwarf-like daemon ',
			HP: 200,
			maxHP: 200,
			attackPoint: 5,
			defencePoint: 0,
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
		goblin.action = function(floor, objects, io) {
			++counter;
			if (counter == 2) {
				ai.basicAction(goblin, floor, objects, io);
				counter = 0;
			}
		}
		return goblin;
	}
}