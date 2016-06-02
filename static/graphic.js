define(function(require, exports, module) {
  empty = ' ';
  floor = '.';
  wallH = '|';
  wallV = '-';
  corr = '#';
  exports.draw = function(context, cellWidth, x, y, type){
    if(!type){
      type = empty;
    }
    switch (type) {
      case empty:
        context.fillStyle = '#061025'
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
      default:
        context.fillStyle = '#000000'
        break;
    }
    context.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
  }
});