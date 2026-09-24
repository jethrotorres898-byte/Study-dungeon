const {chromium} = require('playwright');
const SC='/tmp/claude-0/-home-user-Study-dungeon/fc42c896-5bb9-5d8b-88e3-1899bbc43a28/scratchpad/';
(async()=>{
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium', args:['--headless=new']});
  const p = await b.newPage({viewport:{width:1280,height:1000}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file:///home/user/Study-dungeon/index.html');
  await p.waitForTimeout(500);
  await p.click('button:has-text("Characters")'); await p.waitForTimeout(300);
  await p.screenshot({path:SC+'chars.png', fullPage:false});
  console.log('cards:', await p.$$eval('.class-card .cname', es=>es.map(e=>e.textContent).join(', ')));
  // female mage in battle
  await p.evaluate(async()=>{
    App.topTab='play'; setRealm('math'); App.character.classId='mage'; startRun();
    App.run.monster.hp=9999; App.run.monster.maxHp=9999;
  });
  await p.waitForTimeout(600);
  await p.screenshot({path:SC+'battle_f.png', clip:{x:70,y:150,width:620,height:470}});
  console.log('battle parts:', await p.$$eval('.combatant.player .rig .part', es=>es.map(e=>e.getAttribute('class').replace('part p-','')).join(',')));
  console.log('errors:', errs);
  await b.close();
})();
