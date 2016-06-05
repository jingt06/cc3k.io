var left = 37;
var up = 38;
var right = 39;
var down = 40;
var space = 32;


module.exports = function(player){
  var keyLeft = function(cid) {
    player.getPlayer(cid).move(0, -1);
  }
  var keyDown = function(cid) {
    player.getPlayer(cid).move(1, 0);
  }
  var keyRight = function(cid) {
    player.getPlayer(cid).move(0, 1);
  }
  var keyUp = function(cid) {
    player.getPlayer(cid).move(-1, 0);
  }
  var keySpace = function(cid) {
    player.getPlayer(cid).attack();
  }

  var keyListener = function(cid, key){
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
    }
  }
  return keyListener;
}