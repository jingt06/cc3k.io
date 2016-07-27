var left = 37;
var up = 38;
var right = 39;
var down = 40;
var space = 32;
var key1 = 49;
var key2 = 50;
var key3 = 51;
var key4 = 52;
var keyR= 82;

module.exports = function(player){
  var keyLeft = function(cid) {
    if (!player.getPlayer(cid).isDead()) player.getPlayer(cid).move(0, -1);
  }
  var keyDown = function(cid) {
    if (!player.getPlayer(cid).isDead()) player.getPlayer(cid).move(1, 0);
  }
  var keyRight = function(cid) {
    if (!player.getPlayer(cid).isDead()) player.getPlayer(cid).move(0, 1);
  }
  var keyUp = function(cid) {
    if (!player.getPlayer(cid).isDead()) player.getPlayer(cid).move(-1, 0);
  }
  var keySpace = function(cid) {
    if (!player.getPlayer(cid).isDead()) {
      player.getPlayer(cid).attack();
    }
  }
  var keyRestart = function(cid) {
    if (player.getPlayer(cid).isDead()) {
      player.getPlayer(cid).restart();
    }
  }
  var keyNum = function(cid, num) {
    var p = player.getPlayer(cid);
    if (!p.isDead() && p.level >= 5 && p.class.tier == 0) {
      p.upgradeClass(num - 1);
    }
  }

  var keyListener = function(cid, key){
    if(!player.getPlayer(cid)) return;
    switch(key) {
      case up:
        keyUp(cid);
        break;
      case down:
        keyDown(cid);
        break;
      case left:
        keyLeft(cid);
        break;
      case right:
        keyRight(cid);
        break;
      case space:
        keySpace(cid);
        break;
      case key1:
        keyNum(cid, 1);
        break;
      case key2:
        keyNum(cid, 2);
        break;
      case key3:
        keyNum(cid, 3);
        break;
      case key4:
        keyNum(cid, 4);
        break;
      case keyR:
        keyRestart(cid);
    }
  }
  return keyListener;
}
