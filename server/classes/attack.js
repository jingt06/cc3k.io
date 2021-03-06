var east = 0;
var south = 1;
var west = 2;
var north = 3;
bullet = require('../skills/bullet').sendBullet;

module.exports = {
	basicAttack: function(map, point, face, attack, player) {
		options = {type: 'swardAttack'}
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
  	  	map.action(player, 'attack', [newPoint], options);
	},

	rangeAttack: function(map, point, face, attack, player) {
		var options = {
			factor: 1,
			range: 7,
			speed: 1,
			radius: 0,
			num: 1,
			position: [point[0], point[1]],
			type: 'arrowAttack'
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
		options = {type: 'magicAttack'}
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
  	  	map.action(player, 'attack', newPoints, options);
	},

	adjacentAttack: function(map, point, face, attack, player) {
		options = {type: 'swardAttack'}
		var newPoints = [[point[0], point[1] + 1], [point[0], point[1] - 1],[point[0] + 1, point[1]], [point[0] - 1, point[1]]];
    	map.action(player, 'attack', newPoints, options);
	},

	rowAttack: function(map, point, face, attack, player) {
		options = {type: 'swardAttack'}
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
    	map.action(player, 'attack', newPoints, options);
	},
}