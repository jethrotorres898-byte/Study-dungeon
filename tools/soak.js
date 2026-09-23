const {chromium}=require('playwright');
const CLASSES_ = ['warrior','mage','rogue','cleric','brawler'];
const ACC = Number(process.argv[2] || 0.75);      // how often the player answers right
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--headless=new']});
const p=await b.newPage({viewport:{width:1000,height:800},
  reducedMotion:'reduce'});                        // skip every animation
const errs=[]; p.on('pageerror',e=>errs.push('PAGEERROR '+String(e).slice(0,200)));
p.on('console',m=>{ if(m.type()==='error') errs.push('CONSOLE '+m.text().slice(0,160)); });
await p.goto('file:///home/user/Study-dungeon/index.html');
await p.waitForFunction(()=>typeof App!=='undefined');
// the sleeps are pacing for a human watching; a soak does not need them
await p.evaluate(()=>{ window.sleep = ()=>Promise.resolve(); });

const rows=[], bad=[];
for(const cls of CLASSES_){
  const r = await p.evaluate(async ({cls, ACC})=>{
    const problems=[], log=[];
    const num = v => typeof v==='number' && isFinite(v);
    App.subjects=[{id:'sk',name:'Soak',icon:'📘',
      notes:'Photosynthesis turns light into sugar. Mitochondria make ATP. DNA carries genes. Osmosis moves water. Enzymes lower activation energy. The nucleus holds chromosomes. Ribosomes build proteins. Cells divide by mitosis.'}];
    setRealmSilently('sk');
    App.character.classId = cls;
    startRun();

    let floor=1, turns=0, deaths=0, totalTurns=0, dealt=0, taken=0, skillUses=0, monsterSkills=0;
    const perBand = {};
    const guard0 = Date.now();

    while(floor <= 100){
      if(Date.now()-guard0 > 170000){ problems.push(cls+': soak ran out of time on floor '+floor); break; }
      // level the character roughly the way a real run would
      const want = Math.min(40, 1 + Math.floor(floor*0.45));
      let guardLv = 0;
      while(classProg().level < want && guardLv++ < 400) grantXp(600);
      // and spend the points, or the skills never unlock
      // spend every point we can, cheapest first, or the skills never unlock
      for(let pass=0; pass<40; pass++){
        const prog = classProg();
        const tree = CLASSES[App.character.classId].tree || [];
        const next = tree.find(n=>!prog.allocated[n.id] && canAllocate(n, prog));
        if(!next) break;
        allocateNode(next.id);
      }

      if(App.dungeonView !== 'battle' || !App.run.monster || App.run.monster.hp<=0) startFloor(floor);
      const m = App.run.monster;
      if(!m){ problems.push(cls+' f'+floor+': no monster'); break; }
      if(!num(m.hp)||!num(m.atk)||!num(m.def)||!num(m.spd)) problems.push(cls+' f'+floor+': monster stat is NaN');
      const st0 = combatStats();
      ['atk','def','maxHp','spd','critChance','energyMax'].forEach(k=>{
        if(!num(st0[k])) problems.push(cls+' f'+floor+': player '+k+' is NaN'); });
      App.run.hp = st0.maxHp;

      turns=0;
      const hp0 = m.hp;
      while(App.run.monster && App.run.monster.hp > 0 && turns < 120){
        turns++; totalTurns++;
        if(App.run.hp <= 0){ deaths++; break; }
        App.currentPhase='difficulty';
        const diff = ['easy','medium','hard'][turns%3];
        chooseDifficulty(diff);
        if(!App.currentQuestion){ problems.push(cls+' f'+floor+': no question after choosing '+diff); break; }
        const q = App.currentQuestion;
        const right = Math.random() < ACC;
        const before = {mhp: App.run.monster.hp, php: App.run.hp};
        const ans = right ? q.correct
          : (q.options ? q.options.find(o=>o!==q.correct) : 'definitely wrong '+turns);
        await submitAnswer(ans);
        /* a right answer opens the skill menu; everything, the free swing
           included, is a skill id. Take the ultimate when it is affordable. */
        if(App.currentPhase === 'skillmenu'){
          const set = currentSkillSet().filter(Boolean);
          const afford = set.filter(s=>(s.cost||0) <= (App.run.energy||0) && skillCooldown(s.id) <= 0);
          if(!afford.length){ problems.push(cls+' f'+floor+': nothing at all is usable'); break; }
          const pick = afford.find(s=>s.ultimate) || afford[afford.length-1];
          try{ await useSkillById(pick.id); skillUses++; }
          catch(e){ problems.push(cls+' f'+floor+' skill '+pick.id+': '+e.message); break; }
        } else if(right){
          problems.push(cls+' f'+floor+': correct answer did not open the skill menu (phase '+App.currentPhase+')');
          break;
        }
        if(App.run.monster) monsterSkills += ((App.run.monster.skillCd||0)===2)?1:0;
        dealt += Math.max(0, before.mhp - (App.run.monster ? App.run.monster.hp : 0));
        taken += Math.max(0, before.php - App.run.hp);
        if(!num(App.run.hp)) { problems.push(cls+' f'+floor+': player HP went NaN'); break; }
        if(App.run.monster && !num(App.run.monster.hp)) { problems.push(cls+' f'+floor+': monster HP went NaN'); break; }
        if(App.run.hp > combatStats().maxHp) problems.push(cls+' f'+floor+': HP above max');
        if(App.run.hp <= 0){ deaths++; break; }
        if(App.currentPhase === 'postattack') startNewTurn();
      }
      if(turns >= 120) problems.push(cls+' f'+floor+' ('+m.name+'): 120 turns and it is still alive');
      const bi = bandIndexForFloor(floor);
      perBand[bi] = perBand[bi] || {turns:0, floors:0, deaths:0};
      perBand[bi].turns += turns; perBand[bi].floors++; if(App.run.hp<=0) perBand[bi].deaths++;
      log.push(floor+':'+turns);
      floor++;
    }
    return {cls, problems, totalTurns, deaths, dealt, taken, skillUses, perBand,
            level: classProg().level};
  }, {cls, ACC});
  rows.push(r); bad.push(...r.problems);
  const bands = Object.keys(r.perBand).map(k=>{
    const v=r.perBand[k]; return 'b'+(+k+1)+' '+ (v.turns/v.floors).toFixed(1)+'t';
  }).join('  ');
  console.log(`  ${r.cls.padEnd(8)} turns ${String(r.totalTurns).padStart(4)}  deaths ${String(r.deaths).padStart(2)}  skills ${String(r.skillUses).padStart(3)}  lvl ${r.level}   ${bands}`);
}
console.log('problems:', bad.length ? '\n  '+bad.slice(0,25).join('\n  ') : 'none');
console.log('page errors:', errs.length ? '\n  '+[...new Set(errs)].slice(0,12).join('\n  ') : 'none');
await b.close();
process.exit(bad.length||errs.length?1:0);
})();
