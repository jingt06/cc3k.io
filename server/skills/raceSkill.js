module.exports = {
	addRaceSkill: function(race) {
    // race is one of 'ORC', 'HUMAN', 'ELF', 'TROLL', 'DWARF'
    switch (race) {
      case 'HUMAN':
        return {
          name: 'The Human Spirit',
          sid: 1,
          description: 'Restore player 5% hp and temporally increase attack and defence',
          use: function(p){
            p.HP += p.HP*5/100;
            if (p.HP >= p.maxHP) p.HP = p.maxHP;
            p.attackPoint += 10;
            p.defencePoint += 10;
            setTimeout(function(){
              p.attackPoint -= 10;
              p.defencePoint -= 10;
            }, 5000);
          }
        }
        break;
      case floor:
	}
}