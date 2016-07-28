coolDown = function (p, s) {
  setTimeout(function(){
    p.raceSkillCoolDown = true;
  }, s*1000)
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
          use: function(p){
            if(p.raceSkillCoolDown == null || p.raceSkillCoolDown){
              p.raceSkillCoolDown = false;
              p.HP += p.maxHP*10/100;
              if (p.HP >= p.maxHP) p.HP = p.maxHP;
              p.attackPoint += 5;
              p.defencePoint += 5;
              setTimeout(function(){
                p.attackPoint -= 5;
                p.defencePoint -= 5;
              }, 5000);
              coolDown(p, 10)
            }
          }
        }
        break;
      case 'ORC':
        return {
          name: 'Rage',
          sid: 2,
          description: 'comsume HP, temporally increase attack',
          use: function(p){
            if(p.raceSkillCoolDown == null || p.raceSkillCoolDown){
              p.raceSkillCoolDown = false;
              p.HP -= p.maxHP*20/100;
              if (p.HP <= 0) p.HP = 1;
              p.attackPoint += 25;
              setTimeout(function(){
                p.attackPoint -= 25;
              }, 3000);
              coolDown(p, 10)
            }
          }
        }
        break;
      case 'ELF':
        return {
          name: 'Super Dodge',
          sid: 3,
          description: 'temporally increase dodge rate',
          use: function(p){
            if(p.raceSkillCoolDown == null || p.raceSkillCoolDown){
              p.raceSkillCoolDown = false;
              p.dodge += 20;
              setTimeout(function(){
                p.dodge -= 20;
              }, 3000);
              coolDown(p, 10)
            }
          }
        }
        break;
      case 'TROLL':
        return {
          name: 'Regeneration',
          sid: 4,
          description: 'increase 25% HP',
          use: function(p){
            if(p.raceSkillCoolDown == null || p.raceSkillCoolDown){
              p.raceSkillCoolDown = false;
              p.HP += p.maxHP*25/100;
              if (p.HP >= p.maxHP) p.HP = p.maxHP;
              coolDown(p, 20)
            }
          }
        }
        break;
      case 'DWARF':
        return {
          name: 'Stone Skin',
          sid: 5,
          description: 'temporally increase 50 defence',
          use: function(p){
            if(p.raceSkillCoolDown == null || p.raceSkillCoolDown){
              p.raceSkillCoolDown = false;
              p.defencePoint += 50;
              setTimeout(function(){
                p.defencePoint -= 50;
              }, 3000);
              coolDown(p, 15)
            }
          }
        }
        break;
  	}
  }
}