var classes = require('./classes/classes');
var skill = require('./skills/skills')
var east = 0;
var south = 1;
var west = 2;
var north = 3;
var allPlayer = {}
var raceList = ['ORC', 'HUMAN', 'ELF', 'TROLL', 'DWARF'];

var determineFace = function(y, x){
  if (x > 0) {
    return east;
  } else if (x < 0) {
    return west;
  } else if (y > 0) {
    return south;
  } else if (y < 0) {
    return north;
  }
}

module.exports = {
  createPlayer: function(name,raceIndex, cid, m, pos, skt){
    var p = {};

    // player meta data and other object
    p.map = m;
    p.clientId = cid;
    p.face = east;
    allPlayer[cid] = p;
    p.socket = skt;
    p.name = name;

    race = raceList[raceIndex]
    p.race = race;
    p.raceSkill = skill.addRaceSkill(race);

    // player status info
    p.position = pos;

    // player method
    p.initStatus = function() {
      p.maxHP = 100;
      p.exp = 20;
      p.level = 1;
      p.expNextLevel = 50;
      p.HP = p.maxHP;
      p.attackPoint = 20;
      p.defencePoint =20;
      p.regenHP = 0;
      p.dodge = 0;
      p.critAtt = 0;

      p.moveCoolDown = 1;
      p.moveCounter = 0;
      // rest player skill cooldown
      p.raceSkillCoolDown = 0;
      p.classSkillCoolDown = 0;
      p.classSkill = null;
      p.classAdvancedSkillCoolDown = 0;
      p.advancedClassSkill = null;
      p.ultimateSkillCoolDown = 0;
      classes.createSoldier(p);
    }
    p.initStatus();

    p.notify = function() {
      var mapInfo = p.map.getSight(p.position);

      // player skills
      skills = {}
      skills.raceSkill = {
            name: p.raceSkill.name,
            sid: p.raceSkill.sid,
            cd: p.raceSkillCoolDown
          }
      if (p.classSkill != null) {
        skills.classSkill = {
            name: p.classSkill.name,
            sid: p.classSkill.sid,
            cd: p.classSkillCoolDown
          }
      }
      if (p.classAdvancedSkill != null) {
        skills.classAdvancedSkill = {
            name: p.classAdvancedSkill.name,
            sid: p.classAdvancedSkill.sid,
            cd: p.classAdvancedSkillCoolDown
          }
      }
      if (p.ultimateSkill != null) {
        skills.ultimateSkill = {
            name: p.ultimateSkill.name,
            sid: p.ultimateSkill.sid,
            cd: p.ultimateSkillCoolDown
          }
      }

      // player info
      mapInfo.user = {
        face: p.face,
        HP: p.HP,
        maxHP: p.maxHP,
        att: p.attackPoint,
        def: p.defencePoint,
        dog: p.dodge,
        cri: p.critAtt,
        class: p.class.name,
        level: p.level,
        name: p.name,
        race: p.race,
        exp: p.exp,
        nextLevel: p.expNextLevel,
        numUsers: p.map.onlineUser,
        skills: skills
      };
      if (p.level >= 5 && p.class.tier == 0){
        mapInfo.upgradeClass = p.class.upgrade;
      }
      p.socket.emit('event', mapInfo);
    };

    p.move = function (x, y) {
      if(p.moveCounter != 0) return;
      var newPos = [p.position[0] + x, p.position[1] + y];
      var oldFace = p.face;
      p.face = determineFace(x, y);
      if (p.map.available(newPos, p)){
        p.map.removeObject(p.position, p);
        p.position = newPos;
        p.map.addObject(newPos, 'player', p);
      } else if (oldFace != p.face) {
        p.notify();
      }
      p.moveCounter = p.moveCoolDown;
    };

    p.isDead = function() {
      return p.HP < 0;
    };

    p.addExp = function (expGain) {
      p.exp += expGain;
      while(p.exp >= p.expNextLevel){
        p.levelUp();
        p.level ++;
        p.map.io.emit('effect' , {type: 'levelUp', duration: 10, location: p.position});
        p.exp -= p.expNextLevel;
        p.expNextLevel = p.level * (p.level - 1) * 50;
      }
    }

    p.restart = function() {
      p.socket.emit('id', p.socket.id)
      p.socket.emit('map', p.map.map);
      var spawnPoint = p.map.generateSpawnPoint();
      p.position = spawnPoint;
      p.initStatus();
      p.notify();
    }

    p.attacked = function(attacker, factor) {
      if(factor == null) factor = 1;
      var dodgeRoll = Math.random() * 100;
      var critRoll = Math.random() * 100;
      if (dodgeRoll > p.dodge) {
        factor = factor;
        if (critRoll < attacker.critAtt) {
          factor = factor * 2;
          p.map.io.emit('effect' , {type: 'critical', duration: 5, location: attacker.position});
        }
        p.HP -= factor * attacker.attackPoint * 100 / (100 + p.defencePoint);
        if (p.isDead()) {
          attacker.addExp(p.expNextLevel);
          p.delete();
          return p.expNextLevel;
        }
      }else{
        p.map.io.emit('effect' , {type: 'dodge', duration: 5, location: p.position});
      }
      return -1;
    }

    p.getInfo = function() {
      return {
        face: p.face,
        HP: p.HP,
        maxHP: p.maxHP,
        name: p.name,
        race: p.race
      }
    };

    p.delete = function() {
      var cid = p.clientId;
      allPlayer[cid].map.removeObject(allPlayer[cid].position);
      //delete allPlayer[cid];
      p.socket.emit('message', 'dead');
    };

    p.map.addObject(pos, 'player', p);
    return p;
  },

  deletePlayer: function(cid) {
    if(allPlayer[cid]) allPlayer[cid].map.removeObject(allPlayer[cid].position);
    delete allPlayer[cid];
  },

  getPlayer : function(cid) {
    return allPlayer[cid]
  },

  coolDown(){
    for(i in allPlayer){
      var player = allPlayer[i];
      if(player.moveCounter != 0) {
        player.moveCounter--;
      }
    }
  }
}
