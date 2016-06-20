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
  var numCells = 3;
  var cellSize = 5;
  var drawStroked = function(context,text,x,y) {
    context.font = "20px Sans-serif"
    context.strokeStyle = "black"
    context.lineWidth = 6;
    context.strokeText(text, x, y);
    context.fillStyle = 'white';
    context.fillText(text, x, y);
  }

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
      context.fillRect(x, y, cellWidth, cellWidth);
      context.closePath();
    };

    var drawHP = function(hp, maxHP, x, y){
      startPointX = x - cellWidth / 3;
      startPointY = y + cellWidth / 3;
      totalLength = cellWidth * 2 / 3;
      context.beginPath();
      context.rect(startPointX,startPointY, totalLength, cellWidth/10);
      context.lineWidth = 5;
      context.strokeStyle = '#000000'
      context.stroke();
      context.closePath();
      context.beginPath();
      hpLength = totalLength * hp / maxHP;
      context.fillStyle = '#ff0000'
      context.rect(startPointX,startPointY, hpLength, cellWidth/10);
      context.fill();
      context.closePath();
    };

    var drawObject = function(startX, startY, shiftX, shiftY, obj){
      var type = obj.type;
      var info = obj.info;
      var position = obj.position;
      var x = position.x;
      var y = position.y;
      switch (type) {
        case 'player':
          b = (x - startX + shiftX) * cellWidth;
          a = (y - startY + shiftY) * cellWidth;
          console.log('x: '+x+',y: '+y+'shiftX: '+shiftX +'shiftY: '+shiftY+' startX:' + startX+' startY' + startY + 'a: ' + a+ 'b: '+ b);
          drawStroked(context, info.name, a-info.name.length*5,b-30);
          context.fillStyle = '#ff0000'
          context.beginPath();
          context.arc(a, b , info.radius, 0, 2 * Math.PI);
          context.fill();
          context.closePath();
          //drawFace(info.face, x, y);
          drawHP(info.HP, info.maxHP, a, b);
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
      var x = cellWidth * (0.5 + numCells);
      var y = cellWidth * (0.5 + numCells);
      drawStroked(context, userInfo.name , x-userInfo.name.length*5, y-25);
      context.beginPath();
      context.fillStyle = 'blue';
      context.arc(x,y,cellWidth * userInfo.radius,0,2*Math.PI);
      context.fill();
      context.closePath();
      //drawFace(face, x, y);
      drawHP(userInfo.HP, userInfo.maxHP,x ,y)
    };

    var drawMiniMap = function() {
      context.beginPath();
      context.fillStyle = 'rgba(200, 200, 200, 0.7)';
      context.fillRect(5.5 * cellWidth, 10, 1 * cellWidth, 0.6 * cellWidth);
      context.closePath();
      var height = map.length;
      var width = map[0].length;
      context.beginPath();
      context.fillStyle = 'yellow';
      context.arc(5.5 * cellWidth + cellWidth * point.y / width,
                  + (0.6 * cellWidth) * point.x / height + 10, cellWidth / 30, 0, 2 * Math.PI);
      context.fill();
      context.closePath();
      context.beginPath();
      context.fillStyle = '#acacac';
      context.font = '15px Arial';
      context.fillText(userInfo.numUsers + ' online players', 18 * cellWidth + 15, 2 * cellWidth - 10);
      context.closePath();
    };

    var drawInfoPanel = function() {
      context.beginPath();
      context.fillStyle = 'rgba(200, 200, 200, 0.7)';
      context.fillRect(10, 18 * cellWidth + 10, 7 * cellWidth, 3 * cellWidth);
      context.closePath();
      context.beginPath();
      context.textBaseline='Bottom';
      context.font = '20px Arial';
      context.fillStyle = '#000000'
      context.fillText(userInfo.class + '-LV.' + userInfo.level+ '  ' + userInfo.race, 15, 19 * cellWidth);
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
      var x = point.x;
      var y = point.y;
      var shiftX = Math.floor(point.x) - x - 0.5;
      var shiftY = Math.floor(point.y) - y - 0.5;
      var startX = Math.floor(x) - numCells - 1;
      var startY = Math.floor(y) - numCells - 1;
      context.clearRect(0, 0, canvas.width, canvas.height);
      // draw floor
      for(var i = 0; i <= 2 * (numCells + 1); ++i) {
        for (var j = 0; j <= 2 * (numCells + 1); ++j) {
          var pointX = startX + i;
          var pointY = startY + j;
          var canvasX = cellWidth * (shiftX + i);
          var canvasY = cellWidth * (shiftY + j);
          // switch x and y since canvas's coordinate is opposite to array's
          draw(canvasY, canvasX, map[pointX][pointY]);
        }
      }
      // draw objects
      for(i in objects) {
        drawObject(startX, startY, shiftY, shiftX, objects[i]);
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
      context.font='30px Verdana';
      // Create gradient
      var gradient=context.createLinearGradient(0,0,canvas.width,0);
      gradient.addColorStop('0','yellow');
      gradient.addColorStop('0.5','red');
      gradient.addColorStop('1.0','blue');
      // Fill with gradient
      context.fillStyle=gradient;
      context.font='70px Georgia';
      context.fillText('You Dead!',2 * cellWidth,2 * cellWidth);
      context.fillStyle='white';
      context.font='50px Georgia';
      context.fillText('R to restart',2 * cellWidth,4 * cellWidth);
      context.closePath();
    };
    graphics.login= function() {
      effect.stop();
      context.beginPath();
      context.fillStyle = 'black';
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font='30px Verdana';

      iDiv = document.getElementById('map');

      //Create input box
      var inputName= document.createElement('input');
      inputName.type = 'text';
      inputName.style['border'] = '2px solid groove';
      inputName.style['position'] = 'absolute';
      inputName.style['left'] = 3 * cellWidth + 'px';
      inputName.style['top'] = 3.5 * cellWidth + 'px';
      inputName.style['top'] = .5;
      iDiv.appendChild(inputName);
      var wText= document.createElement('text');
      //wText.style='color:red;position:absolute;left:250px;top:370px;opacity:.5'
      wText.style['color'] = 'red';
      wText.style['position'] = 'absolute';
      wText.style['left'] = '250px';
      wText.style['top'] = '370px';
      wText.style['opacity'] = '0.5';
      iDiv.appendChild(wText);

      //Create button
      var createButton = function(name, pos) {
        var button= document.createElement('button');
        button.innerHTML= name;
        button.style['position']='absolute';
        button.style['left'] = 3 * cellWidth + pos.x + 'px';
        button.style['top'] = 4 * cellWidth + pos.y +  'px';
        button.style['opacity'] = .5;
        button.onclick = function() {
          var value = inputName.value;
          if(value == ''){
            wText.innerHTML = 'Name cannot be empty!';
          }else if(value.length > 10){
            wText.innerHTML = 'The length of Name cannot greater than 10!';
          }else if(value == 'cc3k'){
            wText.innerHTML = 'Name cannot be same as \'cc3k\'!';
          }else{
            var childList = iDiv.childNodes;
            while(childList[2]){
              iDiv.removeChild(childList[2]);
            }
            socket.emit('begin',value,name);
          }
        };
        return button;
      }

      //create race
      var raceList = ['ORC', 'HUMAN', 'ELF', 'TROLL', 'DRAWF'];
      var buttonList = [];
      var num = 0;
      for(var i = 0;i < raceList.length;num++){
        for(var j = 0; j < 3&& i<raceList.length; j++){
          buttonList.push(createButton(raceList[i],{x:70*j,y:30*num}));
          iDiv.appendChild(buttonList[i]);
          i++;
        }
      }

      // Create gradient
      var gradient=context.createLinearGradient(0,0,canvas.width,0);
      gradient.addColorStop('0','yellow');
      gradient.addColorStop('0.5','red');
      gradient.addColorStop('1.0','blue');
      // Fill with gradient
      context.fillStyle=gradient;
      context.font='50px Georgia';
      context.fillText('Welcome to CC3K! ',2 * cellWidth,3 * cellWidth);
      context.fillStyle='white';
      context.font='30px Georgia';
      context.fillText('Enter your name please.',2 * cellWidth,5 * cellWidth);
      context.closePath();
    };
    graphics.addEffect = function(message) {
      effect.addEffect(message);
    };
    return graphics;
  }
});
