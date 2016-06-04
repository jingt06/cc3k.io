var left = 37;
var up = 38;
var right = 39;
var down = 40;


module.exports = function(player){
  var keyLeft = function(cid) {
    player.move(cid, 0, -1);
  }
  var keyUp = function(cid) {
    player.move(cid, 1, 0);
  }
  var keyRight = function(cid) {
    player.move(cid, 0, 1);
  }
  var keyDown = function(cid) {
    player.move(cid, -1, 0);
  }

  var keyListener = function(cid, key){
    switch(key) {
      case 38:
        keyDown(cid);
        break;
      case 40:
        keyUp(cid);
        break;
      case 37:
        keyLeft(cid);
        break;
      case 39:
        keyRight(cid);
        break;
    }
  }
  return keyListener;
}