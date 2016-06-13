module.exports = function(player) {
  var MouseListener = function(cid, pos){
    if(!player.getPlayer(cid)) return;
    p = player.getPlayer(cid);
    console.log(pos);
    pos.x = pos.x * 1.2 * p.maxSpeed;
    pos.y = pos.y * 1.2 * p.maxSpeed;
    console.log(pos);
    if (pos.x > p.maxSpeed) pos.x = p.maxSpeed;
    if (pos.y > p.maxSpeed) pos.y = p.maxSpeed;
    if (pos.x < -p.maxSpeed) pos.x = -p.maxSpeed;
    if (pos.y < -p.maxSpeed) pos.y = -p.maxSpeed;
    console.log(pos);
    p.speed = pos;
  }
  return MouseListener;
}