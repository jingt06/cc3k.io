var potion = require('./potion')

var allItem = [potion];

module.exports = function() {
	var createObject = function(itemStr) {
			var object;
			switch (itemStr) {
				case 'potion':
					object = potion.create();
					object.radius = 0.1;
					break;
				default:
					var index = Math.floor(Math.random() * allItem.length);
					object = allItem[index].create();
					break;
			}
			return object;
		};
	return {
		createObject: createObject
	};
}