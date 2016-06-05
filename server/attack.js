east = 0;
south = 1;
west = 2;
north = 3;

module.exports = {
	basicAttack: function(map, point, face, attack) {
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
    map.attack(newPoint, attack);
	}
}