define(function(require, exports, module) {
	exports.init = function(map, canvas, context, cellWidth, graphics) {
    var running = true;
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
      var redraw = false;
      var i = 0;
      while (i < effectList.length) {
        var effect = effectList[i];
        effect.duration--;
        if (effect.duration == 0){
          redraw = true;
          effectMap[effect.location[0]][effect.location[1]] = null;
          effectList.splice(i, 1);
        } else {
          ++i;
        }
      }
      if (redraw && running) {
        graphics.redraw();
      }
    }
    window.setInterval(run, 100);
		return {
      stop: function() {
        running = false;
      },
			addEffect: function(effect) {
				// effect = {type: , duration: , location:}
        console.log (effect)
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
      },
      drawEffect: function(x, y, effectType, Images) {
        console.log(effectType)
        x = parseInt(x);
        y = parseInt(y);
        context.save();
        context.globalAlpha = 0.4;
        context.drawImage(Images[effectType], x*cellWidth, y*cellWidth, cellWidth, cellWidth);
        context.restore();
      }
    }
	}
})