var east = 0;
var south = 1;
var west = 2;
var north = 3;

module.exports = {
	basicAttack: function(map, point, face, attack, player) {
		var newPoint;
		switch (face) {
			case east:
				newPoint = [point[0], point[1] + 1]
				break;
			case west:
				newPoint = [point[0], point[1] - 1]
				break;
			case north:
				newPoint = [point[0] - 1, point[1]]
				break;
			case south:
				newPoint = [point[0] + 1, point[1]]
				break;
		}
    map.action(player, 'attack', newPoint);
	}
}