/* A monster has to finish dying. The boss-only sway rule was written with a
   selector that caught every monster and sits below the generic fade, so it
   won the tie and nothing ever left the screen. */
const {chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--headless=new']});
  const p=await b.newPage({viewport:{width:1000,height:820}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file:///home/user/Study-dungeon/index.html');
  await p.waitForFunction(()=>typeof App!=='undefined');
  await p.waitForTimeout(400);

  const r = await p.evaluate(async()=>{
    const bad=[], log=[];
    const wait = ms => new Promise(r=>setTimeout(r,ms));
    App.subjects=[{id:'s1',name:'T',icon:'📘',notes:'x'}];
    if(typeof setRealmSilently==='function') setRealmSilently('s1');
    App.character.classId='warrior';

    /* every archetype in the roster must have a death that ends */
    const arches = new Set();
    BAND_ROSTER.flat().forEach(sp=>arches.add(sp.arche));
    const kinds = {};
    arches.forEach(a=>{ kinds[deathKind(a)] = (kinds[deathKind(a)]||0)+1; if(!CRE_SHEET[a]) bad.push(a+' has no sprite'); });
    log.push(['death kinds in the roster', Object.keys(kinds).map(k=>k+'×'+kinds[k]).join(' ')]);
    if(Object.keys(kinds).length < 5) bad.push('only '+Object.keys(kinds).length+' death kinds across the whole roster');

    /* and the animation on a plain monster must be one that finishes */
    for(const [floor, label] of [[7,'ordinary'], [40,'boss']]){
      App.run = Object.assign(defaultRun(), {active:true, floor, difficulty:'medium'});
      partyInit(['warrior','mage','cleric']);
      App.run.monster = generateMonster(floor, 0);
      App.dungeonView='battle'; App.currentPhase='difficulty'; App.__life=null; render();
      await wait(120);
      const box = document.querySelector('.combatant.monster .sprite-box');
      if(!box){ bad.push(label+': no sprite to kill'); continue; }
      const m = App.run.monster;
      box.classList.add('dying', 'die-' + deathKind(m.arche));
      const cs = getComputedStyle(box);
      const name = cs.animationName, count = cs.animationIterationCount, fill = cs.animationFillMode;
      log.push([label+' ('+m.arche+')', name+' ×'+count+' fill:'+fill]);
      if(count === 'infinite' && !(m.isBoss && m.smallBoss)) bad.push(label+' death animation never ends: '+name);
      if(fill.indexOf('forwards') < 0) bad.push(label+' death does not hold its last frame: fill '+fill);
      /* and it really does end invisible */
      await wait(1100);
      const op = Number(getComputedStyle(box).opacity);
      log.push([label+' opacity after 1.1s', op.toFixed(2)]);
      if(op > 0.02) bad.push(label+' is still '+Math.round(op*100)+'% visible a second after dying');
      box.classList.remove('dying');
    }
    /* the zombie is not the skeleton */
    const a = CRE_SHEET.zombie, s2 = CRE_SHEET.skeleton;
    if(!a) bad.push('no zombie sprite');
    else {
      const same = JSON.stringify(a.px[a.clips.idle[0]]) === JSON.stringify(s2.px[s2.clips.idle[0]]);
      if(same) bad.push('the zombie is drawn exactly like the skeleton');
      const palSame = JSON.stringify(a.pal) === JSON.stringify(s2.pal);
      if(palSame) bad.push('the zombie shares the skeleton palette');
      log.push(['zombie', 'own sprite and own palette']);
    }
    const z = BAND_ROSTER.flat().find(sp=>sp.name && sp.name.indexOf('Zombie')>=0);
    if(z && z.arche !== 'zombie') bad.push('Zombie Corpse still uses the '+z.arche+' sprite');
    return {bad, log};
  });
  r.log.forEach(x=>console.log(' ', x.join('  |  ')));
  console.log('\nfailures:', r.bad.length?'\n  '+r.bad.join('\n  '):'none');
  console.log('errors:', errs.length?errs:'none');
  await b.close();
  process.exit(r.bad.length||errs.length?1:0);
})();
