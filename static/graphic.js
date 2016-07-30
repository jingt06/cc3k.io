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
  var skills;
  var graphics = {}
  var Images;

  var drawStroked = function(context,text,x,y) {
    context.font = "20px Sans-serif"
    context.strokeStyle = "black"
    context.lineWidth = 6;
    context.strokeText(text, x, y);
    context.fillStyle = 'white';
    context.fillText(text, x, y);
  }

  ImgSrc = {attack: './image/attack.png',
            playerEast: './image/playerEast.png',
            playerWest: './image/playerWest.png',
            playerNorth: './image/playerNorth.png',
            playerSouth: './image/playerSouth.png',
            goblin: './image/goblin.png',
            empty: './image/empty.png',
            floor: './image/floor.png',
            wall: './image/wall.png',
            hpPotion: './image/hpPotion.png',
            defPotion: './image/defPotion.png',
            attPotion: './image/attPotion.png',
            skill1: './image/theHumanSpirit.jpg',
            skill2: './image/rage.jpg',
            skill3: './image/dodge.jpg',
            skill4: './image/regeneration.jpg',
            skill5: './image/stoneSkin.jpg'
            }

  function loader(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for(var src in sources) {
      numImages++;
    }
    for(var src in sources) {
      images[src] = new Image();
      images[src].onload = function() {
        if(++loadedImages >= numImages) {
          callback(images);
        }
      };
      images[src].src = sources[src];
    }
  }

  exports.init = function(map, canvas, context, cellWidth,socket){
    effect = require('effect').init(map, canvas, context, cellWidth, graphics);
    var draw = function(x, y, type){
      if(!type){
        type = empty;
      }
      var img;
      switch (type) {
        case empty:
          img = Images.empty;
          break;
        case floor:
          img = Images.floor;
          break;
        case wallH:
          img = Images.wall;
          break;
        case wallV:
          img = Images.wall;
          break;
        case corr:
          img = Images.floor;
          break;
        case door:
          img = Images.floor;
          break;
        default:
          img = Images.empty;
          break;
      }
      context.beginPath();
      context.drawImage(img, x*cellWidth, y*cellWidth, cellWidth, cellWidth);
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
          var x = x * cellWidth + cellWidth / 2
          var y = y * cellWidth + cellWidth / 2
          drawStroked(context, info.name, x-info.name.length*5,y-30);
          context.fillStyle = '#ff0000'
          context.beginPath();
          context.arc(x, y , cellWidth / 2, 0, 2 * Math.PI);
          context.fill();
          context.closePath();
          drawFace(info.face, x, y);
          drawHP(info.HP, info.maxHP, x, y);
          break;
        case 'potionH':
          context.drawImage(Images.hpPotion,x*cellWidth,y*cellWidth,cellWidth,cellWidth);
          break;
        case 'potionD':
          context.drawImage(Images.defPotion,x*cellWidth,y*cellWidth,cellWidth,cellWidth);
          break;
        case 'potionA':
          context.drawImage(Images.attPotion,x*cellWidth,y*cellWidth,cellWidth,cellWidth);
          break;
        case 'enemy':
          switch (info.name) {
            case 'Goblin':
            var a = x * cellWidth;
            var b = y * cellWidth;
            context.drawImage(Images.goblin, a, b, cellWidth, cellWidth);
            break;
          }
          drawHP(obj.info.HP, obj.info.maxHP, a+cellWidth/2, b+cellWidth/2);
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
      var x = 10*cellWidth;
      var y = 10*cellWidth;
      drawStroked(context, userInfo.name , x-userInfo.name.length * 5 + cellWidth / 2, y - 25 + cellWidth/2);
      switch (face) {
        case east:
          context.drawImage(Images.playerEast,x, y, cellWidth, cellWidth)
          break;
        case west:
          context.drawImage(Images.playerWest,x, y, cellWidth, cellWidth)
          break;
        case north:
          context.drawImage(Images.playerNorth,x, y, cellWidth, cellWidth)
          break;
        case south:
          context.drawImage(Images.playerSouth,x, y, cellWidth, cellWidth)
          break;
      }
      drawHP(userInfo.HP, userInfo.maxHP,x + cellWidth/2 ,y + cellWidth/2)
    };

    // draw mini map
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
      context.font = '15px Arial';
      context.textAlign = 'center'
      context.fillText(userInfo.numUsers + ' online players', 19 * cellWidth + 15, 2 * cellWidth - 10);
      context.closePath();
    };

    // draw info panel
    var drawInfoPanel = function() {
      context.textAlign = 'start'
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

    // draw skill list
    var drawSkills = function () {
      if(skills.raceSkill){
        context.drawImage(Images['skill'+skills.raceSkill.sid], 10*cellWidth, 19*cellWidth, cellWidth, cellWidth);
        context.textAlign = 'center';
        context.fillStyle = 'rgba(250, 250, 250, 0.8)';
        context.font = '10px Verdana';
        context.fillText('Q:' + skills.raceSkill.name,10.5*cellWidth,20.5*cellWidth);
        if(skills.raceSkill.cd > 0) {
          context.beginPath();
          context.fillStyle = 'rgba(200, 200, 200, 0.6)';
          context.fillRect(10*cellWidth, 19*cellWidth, cellWidth, cellWidth)
          context.font = '30px Verdana';
          context.fillStyle = '#ffffff';
          context.fillText(skills.raceSkill.cd, 10.5*cellWidth, 20*cellWidth);
          context.closePath();
        }
      }
    }
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

      // draw mini map
      drawMiniMap();

      // draw info panel
      drawInfoPanel();

      // draw skills list
      drawSkills();
    };

    graphics.drawMap = function(m) {
      objects = m.object;
      userInfo = m.user;
      skills = userInfo.skills;
      point = m.location;
      var x = point[0];
      var y = point[1];
      graphics.redraw();
      if (m.upgradeClass) {
        drawClassUpgradeInfo(m.upgradeClass);
      }
    };

    // game over page, able to restart
    graphics.dead = function () {
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
      context.fillText('You Dead!',10.5 * cellWidth,7 * cellWidth);
      context.fillStyle='white';
      context.font='50px Georgia';
      context.fillText('R to restart',10.5 * cellWidth,10 * cellWidth);
      context.closePath();
    };

    // loading page and load images
    graphics.loadImages = function (callback) {
      context.fillStyle="#000000";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = "30px Comic Sans MS";
      context.fillStyle = "#ffffff";
      context.textAlign = "center";
      context.fillText("Loading. . .", canvas.width/2, canvas.height/2);
      loader(ImgSrc, (images) => {
        Images = images;
        callback();
      })
    }

    // login page to input name and selecte race
    graphics.login = function() {
      effect.stop();
      context.beginPath();
      context.fillStyle = 'black';
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font='30px Verdana';

      var iDiv = document.getElementById('map');

      //Create input box
      var inputName= document.createElement('input');
      inputName.type = 'text';
      inputName.style['border'] = '2px solid groove';
      inputName.style['position'] = 'absolute';
      inputName.style['left'] = 7 * cellWidth + 'px';
      inputName.style['top'] = 10 * cellWidth + 'px';
      iDiv.appendChild(inputName);
      var wText= document.createElement('text');
      //wText.style='color:red;position:absolute;left:250px;top:370px;opacity:.5'
      wText.style['color'] = 'red';
      wText.style['position'] = 'absolute';
      wText.style['left'] = '250px';
      wText.style['top'] = '370px';
      wText.style['opacity'] = '0.5';
      iDiv.appendChild(wText);

      var raceList = ['ORC', 'HUMAN', 'ELF', 'TROLL', 'DWARF'];

      //Create button
      var createButton = function(raceIndex, pos) {
        var button= document.createElement('button');
        name = raceList[raceIndex];
        button.innerHTML= name;
        button.style['position']='absolute';
        button.style['left'] = 6.5 * cellWidth + pos.x + 'px';
        button.style['top'] = 11 * cellWidth + pos.y +  'px';
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
            socket.emit('begin', value, raceIndex);
          }
        };
        return button;
      }

      //create race
      var buttonList = [];
      var num = 0;
      for(var i = 0;i < raceList.length;num++){
        for(var j = 0; j < 3&& i<raceList.length; j++){
          buttonList.push(createButton(i,{x:70*j,y:30*num}));
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
      context.fillText('Welcome to CC3K! ',canvas.width/2, 7 * cellWidth);
      context.fillStyle='white';
      context.font='30px Georgia';
      context.fillText('Enter your name please.',canvas.width/2, 9 * cellWidth);
      context.closePath();
    };
    graphics.addEffect = function(message) {
      effect.addEffect(message);
    };
    return graphics;
  }
});
