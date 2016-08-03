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
				row.push([])
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
          for(index in effectMap[effect.location[0]][effect.location[1]]){
            if (effectMap[effect.location[0]][effect.location[1]][index].duration == 0){
              effectMap[effect.location[0]][effect.location[1]].splice(index, 1);
              effectList.splice(i, 1);
              redraw = true;
            }
          }
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
				var type = effect.type;
				var duration = effect.duration;
				var location = effect.location;
				effectMap[location[0]][location[1]].push(effect)
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
        context.globalAlpha = 0.8;
        if(effectType == 'dodge' || effectType == 'critical'){
          context.textAlign = 'center'
          context.fillStyle = 'red';
          context.font='15px';
          context.fillText(effectType,x*cellWidth+cellWidth/2, y*cellWidth);
        } else {
          context.drawImage(Images[effectType], x*cellWidth, y*cellWidth, cellWidth, cellWidth);
        }
        context.restore();
      }
    }
	}
})