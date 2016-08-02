var east = 0;
var south = 1;
var west = 2;
var north = 3;

bullet = function(map, attacker, options, next){
	options.position = next(options.position);
	var retval = map.action(attacker, 'attack', [options.position], 'arrowAttack');
	if (retval == 1) if (--options.num == 0) return; //hit
	if (--options.range == 0) return;
	setTimeout(function(){ bullet(map, attacker, options, next) }, options.speed*100);

}

module.exports = {
	basicAttack: function(map, point, face, attack, player) {
		var newPoint;
		switch (face) {
			case east:
				newPoint = [point[0], point[1] + 1];
				break;
			case west:
				newPoint = [point[0], point[1] - 1];
				break;
			case north:
				newPoint = [point[0] - 1, point[1]];
				break;
			case south:
				newPoint = [point[0] + 1, point[1]];
				break;
		}
  	  map.action(player, 'attack', [newPoint], 'swardAttack');
	},

	rangeAttack: function(map, point, face, attack, player) {
		var newPoints;
		var options = {
			factor: 1,
			range: 5,
			speed: 1,
			radius: 0,
			num: 1,
			position: [point[0], point[1]]
		}
		switch (face) {
			case east:
				bullet(map, player, options, (point)=>{point[1]++; return point;})
				break;
			case west:
				bullet(map, player, options, (point)=>{point[1]--; return point;})
				break;
			case north:
				bullet(map, player, options, (point)=>{point[0]--; return point;})
				break;
			case south:
				bullet(map, player, options, (point)=>{point[0]++; return point;})
				break;
		}
	},

	coneAttack: function(map, point, face, attack, player) {
		var newPoints;
		switch (face) {
			case east:
				newPoints = [[point[0], point[1] + 1], [point[0], point[1] + 2],[point[0] + 1, point[1] + 2], [point[0] - 1, point[1] + 2]];
				break;
			case west:
				newPoints = [[point[0], point[1] - 1], [point[0], point[1] - 2], [point[0] - 1, point[1] - 2], [point[0] + 1, point[1] - 2]];
				break;
			case north:
				newPoints = [[point[0] - 1, point[1]], [point[0] - 2, point[1]], [point[0] - 2, point[1] + 1], [point[0] - 2, point[1] - 1]];
				break;
			case south:
				newPoints = [[point[0] + 1, point[1]], [point[0] + 2, point[1]], [point[0] + 2, point[1] + 1], [point[0] + 2, point[1] - 1]];
				break;
		}
    	map.action(player, 'attack', newPoints, 'magicAttack');
	},

	adjacentAttack: function(map, point, face, attack, player) {
		var newPoints = [[point[0], point[1] + 1], [point[0], point[1] - 1],[point[0] + 1, point[1]], [point[0] - 1, point[1]]];
    	map.action(player, 'attack', newPoints, 'swardAttack');
	},

	rowAttack: function(map, point, face, attack, player) {
		var newPoints;
		switch (face) {
			case east:
				newPoints = [[point[0], point[1] + 1], [point[0] + 1, point[1] + 1],[point[0] - 1, point[1] + 1]];
				break;
			case west:
				newPoints = [[point[0], point[1] - 1], [point[0] + 1, point[1] - 1], [point[0] - 1, point[1] - 1]];
				break;
			case north:
				newPoints = [[point[0] - 1, point[1]], [point[0] - 1, point[1] - 1], [point[0] - 1, point[1] + 1]];
				break;
			case south:
				newPoints = [[point[0] + 1, point[1]], [point[0] + 1, point[1] + 1], [point[0] + 1, point[1] - 1]];
				break;
		}
    	map.action(player, 'attack', newPoints, 'swardAttack');
	},
}