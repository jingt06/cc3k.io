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
  exports.init = function(map, canvas, context, cellWidth,socket){
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
          var x = x * cellWidth + cellWidth / 2
          var y = y * cellWidth + cellWidth / 2
          context.beginPath();
          context.arc(x, y , cellWidth / 2, 0, 2 * Math.PI);
          context.fill();
          context.closePath();
          drawFace(info.face, x, y);
          drawHP(info.HP, info.maxHP, x, y);
          break;
        case 'potionH':
          context.fillStyle = '#FFFF66';
          var a = x * cellWidth + cellWidth / 2
          var b = y * cellWidth + cellWidth / 2
          context.beginPath();
          context.arc(a, b , cellWidth / 3, 0, 2 * Math.PI);
          context.fill();
          context.closePath();
          context.fillStyle = '#FF0000';
          a = x * cellWidth + cellWidth / 4;
          b = y * cellWidth + cellWidth * 2 / 5;
          context.beginPath();
          context.fillRect(a, b, cellWidth / 2, cellWidth / 5);
          context.closePath();
          a = x * cellWidth + cellWidth * 2 / 5;
          b = y * cellWidth + cellWidth / 4;
          context.beginPath();
          context.fillRect(a, b, cellWidth / 5, cellWidth / 2);
          context.closePath();
          break;
        case 'potionD':
          context.fillStyle = '#FFFF66';
          var a = x * cellWidth + cellWidth / 2
          var b = y * cellWidth + cellWidth / 2
          context.beginPath();
          context.arc(a, b , cellWidth / 3, 0, 2 * Math.PI);
          context.fill();
          context.closePath();
          context.fillStyle = '#00008b';
          a = x * cellWidth + cellWidth / 3;
          b = y * cellWidth + cellWidth / 3;
          context.beginPath();
          context.fillRect(a, b, cellWidth / 3, cellWidth / 3);
          context.closePath();
          break;
        case 'potionA':
          context.fillStyle = '#FFFF66';
          var a = x * cellWidth + cellWidth / 2
          var b = y * cellWidth + cellWidth / 2
          context.beginPath();
          context.arc(a, b , cellWidth / 3, 0, 2 * Math.PI);
          context.fill();
          context.closePath();
          context.fillStyle = '#ff4500';
          a = x * cellWidth + cellWidth / 2;
          b = y * cellWidth + cellWidth / 4;
          context.beginPath();
          context.beginPath();
          context.moveTo(a, b);
          context.lineTo(a - cellWidth / 6, b + cellWidth * 1 / 2);
          context.lineTo(a + cellWidth / 6, b + cellWidth * 1 / 2);
          context.fill();
          context.closePath();
          break;
        case 'enemy':
          context.fillStyle = '#8000FF';
          var a = x * cellWidth + cellWidth / 2
          var b = y * cellWidth + cellWidth / 2
          context.beginPath();
          context.arc(a, b , cellWidth / 2, 0, 2 * Math.PI);
          context.fill();
          context.closePath();
          drawHP(obj.info.HP, obj.info.maxHP, a, b);
          break;
        default:
          return;
      }
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
    };

    var drawMiniMap = function() {
      context.beginPath();
      context.fillStyle = 'rgba(200, 200, 200, 0.7)';
      context.fillRect(18 * cellWidth + 10, 10, 3 * cellWidth - 20, 2 * cellWidth - 20);
      context.closePath();
      var height = map.length;
      var width = map[0].length;
      context.beginPath();
      context.fillStyle = 'yellow';
      context.arc(18 * cellWidth + 10 + (3 * cellWidth - 15) * point[1] / width,
                  10 + (2 * cellWidth - 20) * point[0] / height, cellWidth / 10, 0, 2 * Math.PI);
                  context.fill();
                  context.closePath();
                  context.beginPath();
                  context.fillStyle = '#acacac';
                  context.font = "15px Arial";
                  context.fillText(userInfo.numUsers + ' online players', 18 * cellWidth + 15, 2 * cellWidth - 10);
                  context.closePath();
    };

    var drawInfoPanel = function() {
      context.beginPath();
      context.fillStyle = 'rgba(200, 200, 200, 0.7)';
      context.fillRect(10, 18 * cellWidth + 10, 7 * cellWidth, 3 * cellWidth);
      context.closePath();
      context.beginPath();
      context.textBaseline="Bottom";
      context.font = "20px Arial";
      context.fillStyle = '#000000'
      context.fillText(userInfo.class + '-LV.' + userInfo.level+ "  " + userInfo.name, 15, 19 * cellWidth);
      context.fillText('ATT: ' + userInfo.att, 15, 20 * cellWidth + 10);
      context.fillText('Critical Rate: ' + userInfo.cri, 3 * cellWidth, 20 * cellWidth + 10)
      context.fillText('DEF: ' + userInfo.def, 15, 20.5 * cellWidth + 10);
      context.fillText('Dodge Rate: ' + userInfo.dog,  3 * cellWidth, 20.5 * cellWidth + 10);
      context.closePath();
      context.beginPath();
      context.rect(15, 19 * cellWidth + 10, 6 * cellWidth, cellWidth / 3);
      context.strokeStyle = '#000000'
      context.lineWidth = 5;
      context.stroke();
      context.closePath();
      context.beginPath();
      var length = (6 * cellWidth - 3) * userInfo.exp / userInfo.nextLevel;
      context.fillStyle = '#00bfff';
      context.rect(17, 19 * cellWidth + 12, length-1, cellWidth / 3 - 5);
      context.fill();
      context.closePath();
    };

    var drawClassUpgradeInfo = function(upgradeClass) {
      context.beginPath();
      context.fillStyle =  'rgba(200, 200, 200, 0.7)';
      context.fillRect(10, 10, 10 * cellWidth + 20, 2 *cellWidth - 10);
      var classStr = '';
      for (i in upgradeClass){
        var index = parseInt(i) + 1;
        classStr = classStr + '    ' + index + ': ' + upgradeClass[i];
      }
      context.fillStyle = 'black'
      context.fillText('plese press num keys to upgrade', 20, cellWidth);
      context.fillText(classStr, 20, cellWidth * 2);
      context.closePath();
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
      drawSelf(userInfo);
      effects = effect.getEffect(point);
      // draw effects
      for(i in effects) {
        for (j in effects[i]) {
          if (effects[i][j]){
            effect.drawEffect(j, i, effects[i][j]);
          }
        }
      }
      drawMiniMap();
      drawInfoPanel();
    };
    graphics.drawMap = function(m) {
      objects = m.object;
      userInfo = m.user;
      point = m.location;
      var x = point[0];
      var y = point[1];
      graphics.redraw();
      if (m.upgradeClass) {
        drawClassUpgradeInfo(m.upgradeClass);
      }
    };
    graphics.dead = function() {
      effect.stop();
      context.beginPath();
      context.fillStyle = 'black';
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font="30px Verdana";
      // Create gradient
      var gradient=context.createLinearGradient(0,0,canvas.width,0);
      gradient.addColorStop("0","yellow");
      gradient.addColorStop("0.5","red");
      gradient.addColorStop("1.0","blue");
      // Fill with gradient
      context.fillStyle=gradient;
      context.font="70px Georgia";
      context.fillText("You Dead!",6 * cellWidth,7 * cellWidth);
      context.fillStyle='white';
      context.font="50px Georgia";
      context.fillText("R to restart",6 * cellWidth,10 * cellWidth);
      context.closePath();
    };
    graphics.login= function() {
      effect.stop();
      context.beginPath();
      context.fillStyle = 'black';
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font="30px Verdana";

      iDiv = document.getElementById("map");

      //Create input box
      var inputName= document.createElement('input');
      inputName.type = 'text';
      inputName.style="border:2px solid groove;position:absolute;left:250px;top:350px;opacity:.5"
      iDiv.appendChild(inputName);
      var wText= document.createElement('text');
      wText.style="color:red;position:absolute;left:250px;top:370px;opacity:.5"
      iDiv.appendChild(wText);

      //Create button
      var buttonGo= document.createElement('button');
      buttonGo.innerHTML= "GO";
      buttonGo.style="position:absolute;left:400px;top:350px;opacity:.5"
      buttonGo.onclick = function() {
        var value = inputName.value;
        if(value == ""){
          wText.innerHTML = "Name cannot be empty!";
        }else if(value.length > 10){
          wText.innerHTML = "The length of Name cannot greater than 10!";
        }else if(value == "cc3k"){
          wText.innerHTML = "Name cannot be same as 'cc3k'!";
        }else{
          socket.emit("begin",value);
          iDiv.removeChild(inputName);
          iDiv.removeChild(buttonGo);
          iDiv.removeChild(wText);
        }
      };
      iDiv.appendChild(buttonGo);

      // Create gradient
      var gradient=context.createLinearGradient(0,0,canvas.width,0);
      gradient.addColorStop("0","yellow");
      gradient.addColorStop("0.5","red");
      gradient.addColorStop("1.0","blue");
      // Fill with gradient
      context.fillStyle=gradient;
      context.font="50px Georgia";
      context.fillText("Welcome to CC3K! ",4 * cellWidth,7 * cellWidth);
      context.fillStyle='white';
      context.font="30px Georgia";
      context.fillText("Enter your name please.",5 * cellWidth,9 * cellWidth);
      context.closePath();
    };
    graphics.addEffect = function(message) {
      effect.addEffect(message);
    };
    return graphics;
  }
});
