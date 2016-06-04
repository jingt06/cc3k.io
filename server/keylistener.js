var left = 37;
var up = 38;
var right = 39;
var down = 40;

module.exports = function(leftFun, upFun, rightFun, downFun){
  var keyListener = function(cid, key){
    switch(key) {
      case 38:
        if(downFun) downFun(cid);
        break;
      case 40:
        if(upFun) upFun(cid);
        break;
      case 37:
        if(leftFun) leftFun(cid);
        break;
      case 39:
        if(rightFun) rightFun(cid);
        break;
    }
  }
  return keyListener;
}