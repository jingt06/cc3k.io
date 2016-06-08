module.exports = {
	create: function(){
		return {
			type: 'potion',
			consumable: true,
			description: 'a health potion that restores 10% - 20% health',
			use: function(player) {
				var restore = Math.floor(Math.random() * 10 + 11);
				player.HP += player.HP * restore / 100;
				if (player.HP > player.maxHP) player.HP = player.maxHP;
				return 'restores ' +  restore + ' HP.'
			},
			getInfo: function() {
				return null;
			}
		}
	}
}