var ai = require('./ai')
module.exports = {
	create: function(){
		var goblin = {
			type: 'enemy',
			name: 'goblin',
			consumable: false,
			HP: 150,
			maxHP: 150,
			attackPoint: 5,
			defencePoint: 0,
			exp: 500, // for test use , shoud be 50
			attackRange: 1,
			visionRange: 5,
			actionCount: 0,
			actionFreq: 1,
			attackType: 'swardAttack'
		};
		goblin.getInfo = function() {
			return {
				type: goblin.type,
				name: goblin.name,
				HP: goblin.HP,
				maxHP: goblin.maxHP
			};
		};
		goblin.action = function(floor, objects, io) {
			goblin.actionCount++;
			if (goblin.actionCount == goblin.actionFreq) {
				ai.basicAction(goblin, floor, objects, io);
				goblin.actionCount = 0;
			}
		}
		return goblin;
	}
}