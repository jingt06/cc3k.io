var ai = require('./ai')
module.exports = {
	create: function(){
		var imp = {
			type: 'enemy',
			name: 'imp',
			consumable: false,
			HP: 200,
			maxHP: 200,
			attackPoint: 15,
			defencePoint: 10,
			exp: 300,
			attackRange: 2,
			visionRange: 7,
			actionCount: 0,
			actionFreq: 3,
			attackType: 'fireAttack',
			dodge: 5,
			critical: 5
		};
		imp.getInfo = function() {
			return {
				type: imp.type,
				name: imp.name,
				HP: imp.HP,
				maxHP: imp.maxHP
			};
		};
		imp.action = function(floor, objects, io) {
			++imp.actionCount;
			if (imp.actionCount == imp.actionFreq) {
				ai.basicAction(imp, floor, objects, io);
				imp.actionCount = 0;
			}
		}
		return imp;
	}
}