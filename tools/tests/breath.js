/* The breath, measured where it lives. A creature's idle may lift its chest,
   and it may NOT lift its feet - which is the entire difference between the
   breath and the `idlebob` translate that made everything hover. */
const {chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--headless=new']});
  const p=await b.newPage({viewport:{width:1000,height:820}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file:///home/user/Study-dungeon/index.html'); await p.waitForTimeout(600);
  await p.evaluate(async()=>{ if(App.dungeonView==='select') setRealm(App.profileId||'math');
    await setTutSeen(true); TUT.seen=true; if(TUT.on) await endTutorial(); });
  await p.evaluate(()=>{ App.character.classId='warrior'; startRun(); App.run.floor=7;
    App.run.monster=generateMonster(7,0); App.dungeonView='battle'; App.currentPhase='difficulty'; render(); });
  await p.waitForSelector('.combatant.monster .sprite-box .spr', {timeout:8000});
  await p.waitForTimeout(300);

  const bad=[], log=[];
  const info = await p.evaluate(()=>{
    const spr = document.querySelector('.combatant.monster .sprite-box .spr');
    const cs = getComputedStyle(spr);
    return {name:cs.animationName, dur:cs.animationDuration, origin:cs.transformOrigin,
            arche:App.run.monster.arche};
  });
  log.push(['animation', info.name+' '+info.dur+', origin '+info.origin+'  ('+info.arche+')']);
  if(info.name.indexOf('creBreathe') < 0) bad.push('the breath is not running: '+info.name);
  if(info.origin.indexOf('bottom') < 0 && !/\s0px$|100%/.test(info.origin)) {
    /* computed origin comes back in px; just check it is at the bottom edge */
    const ok = await p.evaluate(()=>{
      const spr=document.querySelector('.combatant.monster .sprite-box .spr');
      const h=spr.getBoundingClientRect().height;
      const oy=parseFloat(getComputedStyle(spr).transformOrigin.split(' ')[1]);
      return Math.abs(oy - h) < 2;
    });
    if(!ok) bad.push('the breath is not anchored at the feet: origin '+info.origin);
  }

  /* sample a whole cycle */
  const tops=[], bottoms=[], heroBottoms=[];
  for(let i=0;i<16;i++){
    const r = await p.evaluate(()=>{
      const m=document.querySelector('.combatant.monster .sprite-box .spr').getBoundingClientRect();
      const h=document.querySelector('.combatant.player .sprite-box').getBoundingClientRect();
      return {t:m.top, b:m.bottom, hb:h.bottom};
    });
    tops.push(r.t); bottoms.push(r.b); heroBottoms.push(r.hb);
    await p.waitForTimeout(180);
  }
  const spread=a=>Math.max(...a)-Math.min(...a);
  log.push(['over one cycle', 'feet move '+spread(bottoms).toFixed(2)+'px, chest moves '+spread(tops).toFixed(2)+'px']);
  log.push(['hero feet', spread(heroBottoms).toFixed(2)+'px']);
  if(spread(bottoms) > 0.6) bad.push('the feet move '+spread(bottoms).toFixed(2)+'px — that is a hover, not a breath');
  if(spread(tops) < 0.5)   bad.push('the breath does nothing: the chest moves '+spread(tops).toFixed(2)+'px');
  if(spread(tops) > 8)     bad.push('the breath is too big: the chest moves '+spread(tops).toFixed(2)+'px');

  /* and a boss keeps its own size while breathing */
  await p.evaluate(()=>{ App.run.floor=40; App.run.monster=generateMonster(40,0); render(); });
  await p.waitForTimeout(500);
  const boss = await p.evaluate(()=>{
    const box=document.querySelector('.combatant.monster .sprite-box');
    return {scale:getComputedStyle(box).transform, big:box.getBoundingClientRect().width};
  });
  log.push(['boss box', boss.scale.slice(0,40)+' w='+Math.round(boss.big)]);
  if(boss.scale === 'none') bad.push('the boss lost its scale — the breath clobbered it');

  /* the serpent's tongue: a hiss on an irregular timer, and it must stop the
     moment you leave the fight or it follows you round the hub */
  const amb = await p.evaluate(async()=>{
    const out = {};
    let heard = 0;
    const real = Sfx.voice.bind(Sfx);
    Sfx.voice = id => { heard++; out.last = id; };
    App.run.floor = 3;
    App.run.monster = generateMonster(3, 0);
    App.run.monster.arche = 'serpent'; App.run.monster.hp = App.run.monster.maxHp;
    App.dungeonView = 'battle'; render();
    await new Promise(r=>setTimeout(r, 6000));
    out.inFight = heard;
    heard = 0;
    App.dungeonView = 'hub'; render();
    await new Promise(r=>setTimeout(r, 6000));
    out.afterLeaving = heard;
    Sfx.voice = real;
    return out;
  });
  log.push(['serpent hiss', amb.inFight+' in 6s of fighting ('+amb.last+'), '+amb.afterLeaving+' in 6s after leaving']);
  if(!amb.inFight) bad.push('a serpent made no noise while you stood in front of it');
  if(amb.last !== 'hiss') bad.push('the serpent is making a '+amb.last+' rather than a hiss');
  if(amb.afterLeaving) bad.push('the hissing followed you out of the fight '+amb.afterLeaving+' times');

  log.forEach(x=>console.log(' ', x.join('  |  ')));
  console.log('\nfailures:', bad.length?'\n  '+bad.join('\n  '):'none');
  console.log('errors:', errs.length?errs:'none');
  await b.close();
  process.exit(bad.length||errs.length?1:0);
})();
