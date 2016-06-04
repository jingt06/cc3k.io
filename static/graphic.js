define(function(require, exports, module) {
  empty = ' ';
  floor = '.';
  wallH = '|';
  wallV = '-';
  corr = '#';
  door = '+';
  exports.init = function(canvas, context, cellWidth){
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
      context.beginPath();
      context.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
      context.closePath();
    };
    var drawItem = function(x, y, type){
      switch (type) {
        case 'player':
          context.fillStyle = '#ff0000'
          break;
        default:
          return;
      }
      x = x*cellWidth + cellWidth/2
      y = y*cellWidth + cellWidth/2
      context.beginPath();
      context.arc(x,y,cellWidth/2,0,2*Math.PI);
      context.fill();
      context.closePath();
    };
    var drawSelf = function(){
      x = 10*cellWidth + cellWidth/2
      y = 10*cellWidth + cellWidth/2
      context.fillStyle = 'blue'
      context.beginPath();
      context.arc(x,y,cellWidth/2,0,2*Math.PI);
      context.fill();
      context.closePath();
    }
    return {
      draw: draw,
      drawMap: function(m) {
        map = m.floor;
        object = m.object;
        context.clearRect(0, 0, canvas.width, canvas.height);
        for(i in map) {
          for (j in map[i]) {
            if(map[i][j] == '.'){}
            draw(j, i, map[i][j])
            if (object[i][j]){
              drawItem(j, i, object[i][j])
            }
          }
        }
        drawSelf();
      }
    }
  }
});