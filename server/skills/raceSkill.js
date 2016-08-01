coolDown = function (p, s) {
  if (s == 0) return;
  setTimeout(function(){
    s--;
    p.raceSkillCoolDown = s;
    coolDown(p, s);
  }, 1000)
}

module.exports = {
	addRaceSkill: function(race) {
    // race is one of 'ORC', 'HUMAN', 'ELF', 'TROLL', 'DWARF'
    switch (race) {
      case 'HUMAN':
        return {
          name: 'The Human Spirit',
          sid: 1,
          description: 'Restore player 10% hp and temporally increase attack and defence',
          cd: 10,
          use: function(p){
            if(p.raceSkillCoolDown == 0){
              p.raceSkillCoolDown = this.cd;
              p.HP += p.maxHP*10/100;
              if (p.HP >= p.maxHP) p.HP = p.maxHP;
              p.attackPoint += 5;
              p.defencePoint += 5;
              setTimeout(function(){
                p.attackPoint -= 5;
                p.defencePoint -= 5;
              }, 5000);
              coolDown(p, this.cd)
              p.map.io.emit('effect' , {type: 'shield', duration: 10, location: p.position});
            }
          }
        }
        break;
      case 'ORC':
        return {
          name: 'Rage',
          sid: 2,
          description: 'comsume HP, temporally increase attack',
          cd: 10,
          use: function(p){
            if(p.raceSkillCoolDown == 0){
              p.raceSkillCoolDown = this.cd;
              p.HP -= p.maxHP*20/100;
              if (p.HP <= 0) p.HP = 1;
              p.attackPoint += 25;
              setTimeout(function(){
                p.attackPoint -= 25;
              }, 3000);
              coolDown(p, this.cd)
              p.map.io.emit('effect' , {type: 'shield', duration: 10, location: p.position});
            }
          }
        }
        break;
      case 'ELF':
        return {
          name: 'Super Dodge',
          sid: 3,
          description: 'temporally increase dodge rate',
          cd: 10,
          use: function(p){
            if(p.raceSkillCoolDown == 0){
              p.raceSkillCoolDown = this.cd;
              p.dodge += 20;
              setTimeout(function(){
                p.dodge -= 20;
              }, 3000);
              coolDown(p, this.cd)
              p.map.io.emit('effect' , {type: 'shield', duration: 10, location: p.position});
            }
          }
        }
        break;
      case 'TROLL':
        return {
          name: 'Regeneration',
          sid: 4,
          description: 'increase 25% HP',
          cd: 20,
          use: function(p){
            if(p.raceSkillCoolDown == 0){
              p.raceSkillCoolDown = this.cd;
              p.HP += p.maxHP*25/100;
              if (p.HP >= p.maxHP) p.HP = p.maxHP;
              coolDown(p, this.cd)
              p.map.io.emit('effect' , {type: 'shield', duration: 10, location: p.position});
            }
          }
        }
        break;
      case 'DWARF':
        return {
          name: 'Stone Skin',
          sid: 5,
          description: 'temporally increase 50 defence',
          cd: 15,
          use: function(p){
            if(p.raceSkillCoolDown == null || p.raceSkillCoolDown){
              p.raceSkillCoolDown = this.cd;
              p.defencePoint += 50;
              setTimeout(function(){
                p.defencePoint -= 50;
              }, 3000);
              coolDown(p, this.cd)
              p.map.io.emit('effect' , {type: 'shield', duration: 10, location: p.position});
            }
          }
        }
        break;
  	}
  }
}