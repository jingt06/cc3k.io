define(function(require, exports, module) {
  empty = ' ';
  floor = '.';
  wallH = '|';
  wallV = '-';
  corr = '#';
  door = '+';
  exports.init = function(context, cellWidth){
    var draw = function(x, y, type){
      if(!type){
        type = empty;
      }
      switch (type) {
        case empty:
          context.fillStyle = '#061025'
          break;
        case floor:
          context.fillStyle = '#ebebeb'
          break;
        case wallH:
          context.fillStyle = '#000000'
          break;
        case wallV:
          context.fillStyle = '#000000'
          break;
        case corr:
          context.fillStyle = '#bbbbbb'
          break;
        case door:
          context.fillStyle = '#bbbbbb'
          break;
        default:
          context.fillStyle = '#000000'
          break;
      }
      context.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
    };
    var drawSelf = function(){
      x = 10*cellWidth + cellWidth/2
      y = 10*cellWidth + cellWidth/2
      context.fillStyle = 'blue'
      context.arc(x,y,cellWidth/2,0,2*Math.PI);
      context.fill();
    }
    return {
      draw: draw,
      drawMap: function(map) {
        for(i in map) {
          for (j in map[i]) {
            draw(j, i, map[i][j])
          }
        }
        drawSelf();
      }
    }
  }
});