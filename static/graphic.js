define(function(require, exports, module) {
  var effect;
  var east = 0;
  var south = 1;
  var west = 2;
  var north = 3;
  var empty = ' ';
  var floor = '.';
  var wallH = '|';
  var wallV = '-';
  var corr = '#';
  var door = '+';
  var point;
  var objects;
  var userInfo;
  var graphics = {}
  exports.init = function(map, canvas, context, cellWidth){
    effect = require('effect').init(map, canvas, context, cellWidth, graphics);
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
      context.strokeStyle = '#000000'
      context.stroke();
      context.closePath();
      context.beginPath();
      hpLength = totalLength * hp / maxHP;
      context.fillStyle = '#ff0000'
      context.rect(startPointX,startPointY, hpLength, cellWidth/5);
      context.fill();
      context.closePath();
    };

    var drawObject = function(x, y, obj){
      var type = obj.type;
      var info = obj.info;
      switch (type) {
        case 'player':
          context.fillStyle = '#ff0000'
          break;
        default:
          return;
      }
      var x = x*cellWidth + cellWidth/2
      var y = y*cellWidth + cellWidth/2
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
      var face = userInfo.face;
      var x = 10*cellWidth + cellWidth/2;
      var y = 10*cellWidth + cellWidth/2;
      context.beginPath();
      context.fillStyle = 'blue';
      context.arc(x,y,cellWidth/2,0,2*Math.PI);
      context.fill();
      context.closePath();
      drawFace(face, x, y);
      drawHP(userInfo.HP, userInfo.maxHP,x ,y)
    }

    graphics.draw = draw;
    graphics.redraw = function() {
      var x = point[0];
      var y = point[1];
      context.clearRect(0, 0, canvas.width, canvas.height);
      // draw floor
      for(var i = 0; i <= 20; ++i) {
        for (var j = 0; j <= 20; ++j) {
          var pointX = x - 10 + i;
          var pointY = y - 10 + j;
          draw(j, i, map[pointX][pointY]);
        }
      }
      // draw objects
      for(i in objects) {
        for (j in objects[i]) {
          if (objects[i][j]){
            if(i != 10 || j != 10) drawObject(j, i, objects[i][j])
          }
        }
      }
      effects = effect.getEffect(point);
      // draw effects
      for(i in effects) {
        for (j in effects[i]) {
          if (effects[i][j]){
            effect.drawEffect(j, i, effects[i][j]);
          }
        }
      }
      drawSelf(userInfo);
    };
    graphics.drawMap = function(m) {
      objects = m.object;
      userInfo = m.user;
      point = m.location;
      var x = point[0];
      var y = point[1];
      graphics.redraw();
    };
    graphics.dead = function() {
      context.beginPath();
      context.fillStyle = 'black';
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
    };
    graphics.addEffect = function(message) {
      effect.addEffect(message);
    };
    return graphics;
  }
});