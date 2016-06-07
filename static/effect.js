define(function(require, exports, module) {
	exports.init = function(map) {
		var effectList = [];
		var length = map.length;
		var width = map[0].length;
		var effectMap = [];
		for (var i = 0; i < length; i++) {
			row = []
			for (var j = 0; j < width; j++) {
				row.push(null)
			}
			effectMap.push(row);
		}

    //this function runs for every 0.1 s
    run = function () {
      var i = 0;
      while (i < effectList.length) {
        var effect = effectList[i];
        effect.duration--;
        if (effect.duration == 0){
          effectMap[effect.location[0]][effect.location[1]] = null;
          effectList.splice(i, 1);
        }
      }
    }
    setInterval(run, 1000);
		return {
			addEffect: function(effect) {
				// effect = {type: , duration: , location:}
				var type = effect.type;
				var duration = effect.duration;
				var location = effect.location;
				effectMap[location[0]][location[1]] = type
				effectList.push(effect)
			},
      getEffect: function(point) {
        var x = point[0];
        var y = point[1];
        var effects = [];
        for(var i = x - 10; i <= x + 10; ++i) {
          var row = []
          for (var j = y - 10; j <= y + 10; ++j) {
            row.push(effectMap[i][j]);
          }
          effects.push(row);
        }
        return effects;
      }
		}
	}
})