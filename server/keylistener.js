var left = 37;
var up = 38;
var right = 39;
var down = 40;

module.exports = function(leftFun, upFun, rightFun, downFun){
  var keyListener = function(key){
    switch(key) {
      case 38:
        if(downFun) downFun(key);
        break;
      case 40:
        if(upFun) upFun(key);
        break;
      case 37:
        if(leftFun) leftFun(key);
        break;
      case 39:
        if(rightFun) rightFun(key);
        break;
    }
  }
  return keyListener;
}