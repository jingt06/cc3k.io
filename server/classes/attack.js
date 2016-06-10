var east = 0;
var south = 1;
var west = 2;
var north = 3;

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
  	  map.action(player, 'attack', newPoint);
	},

	RangeAttack: function(map, point, face, attack, player) {
		var newPoints;
		switch (face) {
			case east:
				newPoints = [[point[0], point[1] + 1], [point[0], point[1] + 2],[point[0], point[1] + 3], [point[0], point[1] + 4]];
				break;
			case west:
				newPoints = [[point[0], point[1] - 1], [point[0], point[1] - 2], [point[0], point[1] - 3], [point[0], point[1] - 4]];
				break;
			case north:
				newPoints = [[point[0] - 1, point[1]], [point[0] - 2, point[1]], [point[0] - 3, point[1]], [point[0] - 4, point[1]]];
				break;
			case south:
				newPoints = [[point[0] + 1, point[1]], [point[0] + 2, point[1]], [point[0] + 3, point[1]], [point[0] + 4, point[1]]];
				break;
		}
		for(i in newPoints){
    		map.action(player, 'attack', newPoints[i]);
		}
	}
}