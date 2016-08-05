module.exports = {
	sendBullet: function(map, attacker, options, next){
		options.position = next(options.position);
		var points;
		if(options.radius == 0){
			points = [options.position];
		} else {
			points = []
			for (var i = 0; i <= options.radius; ++i) {
				for (var j = 0; j <= options.radius-i; ++j) {
					points.push([options.position[0] + i, options.position[1] + j]);
					points.push([options.position[0] - i, options.position[1] - j]);
					points.push([options.position[0] - i, options.position[1] + j]);
					points.push([options.position[0] + i, options.position[1] - j]);
				}
			}
		}
		attackOptions = {type:options.type, duration: options.speed, factor: options.factor};
		var retval = map.action(attacker, 'attack', points, attackOptions);
		if (retval == 1) if (--options.num == 0) return; //hit
		if (--options.range == 0) return;
		setTimeout(function(){ bullet(map, attacker, options, next) }, options.speed*100);
	}
}