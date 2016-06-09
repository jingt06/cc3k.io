var soldier = require('./soldier')


//class must overwrite player's levelUp, attack method.
module.exports = {
	createSoldier: function(player) {
		return soldier.create(player);
	}
}