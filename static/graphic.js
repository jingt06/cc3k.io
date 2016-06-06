define(function(require, exports, module) {
  east = 0;
  south = 1;
  west = 2;
  north = 3;
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
          context.fillStyle = '#00003f'
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

    var drawHP = function(hp, maxHP, x, y){
      startPointX = x - cellWidth;
      startPointY = y + cellWidth;
      totalLength = 2 * cellWidth;
      context.beginPath();
      context.rect(startPointX,startPointY, totalLength, cellWidth/5);
      context.lineWidth = 5;
      context.stroke();
      context.closePath();
      context.beginPath();
      hpLength = totalLength * hp / maxHP;
      context.fillStyle = '#ff0000'
      context.rect(startPointX,startPointY, hpLength, cellWidth/5);
      context.fill();
      context.closePath();
    };

    var drawItem = function(x, y, obj){
      type = obj.type;
      info = obj.info;
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
      drawFace(info.face, x, y);
      drawHP(info.HP, info.maxHP, x, y);
    };

    var drawFace = function(face, x, y) {
      context.beginPath();
      switch (face) {
        case east:
          context.fillRect(x - cellWidth/2, y - cellWidth/2, cellWidth/2, cellWidth);
          break;
        case west:
          context.fillRect(x , y - cellWidth/2, cellWidth/2, cellWidth);
          break;
        case north:
          context.fillRect(x - cellWidth/2, y, cellWidth, cellWidth/2);
          break;
        case south:
          context.fillRect(x - cellWidth/2, y - cellWidth/2, cellWidth, cellWidth/2);
          break;
      }
      context.closePath();
    };

    var drawSelf = function(userInfo){
      face = userInfo.face;
      x = 10*cellWidth + cellWidth/2;
      y = 10*cellWidth + cellWidth/2;
      context.beginPath();
      context.fillStyle = 'blue';
      context.arc(x,y,cellWidth/2,0,2*Math.PI);
      context.fill();
      context.closePath();
      drawFace(face, x, y);
      drawHP(userInfo.HP, userInfo.maxHP,x ,y)
    }
    return {
      draw: draw,
      drawMap: function(m) {
        map = m.floor;
        object = m.object;
        userInfo = m.user;
        context.clearRect(0, 0, canvas.width, canvas.height);
        for(i in map) {
          for (j in map[i]) {
            if(map[i][j] == '.'){}
            draw(j, i, map[i][j])
          }
        }
        for(i in object) {
          for (j in object[i]) {
            if (object[i][j]){
              if(i != 10 || j != 10) drawItem(j, i, object[i][j])
            }
          }
        }
        drawSelf(userInfo);
      },
      dead: function() {
        context.beginPath();
        context.fillStyle = 'black'
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font="30px Verdana";
        // Create gradient
        var gradient=context.createLinearGradient(0,0,canvas.width,0);
        gradient.addColorStop("0","magenta");
        gradient.addColorStop("0.5","blue");
        gradient.addColorStop("1.0","red");
        // Fill with gradient
        context.fillStyle=gradient;
        context.fillText("You Dead!",5 * cellWidth,9 * cellWidth);
        context.closePath();
      }
    }
  }
});