const {chromium} = require('playwright');
(async()=>{
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium', args:['--headless=new']});
  const p = await b.newPage({viewport:{width:1280,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file:///home/user/Study-dungeon/index.html');
  await p.waitForTimeout(500);
  await p.click('button:has-text("Study")');
  await p.waitForTimeout(250);
  await p.screenshot({path:'/tmp/claude-0/-home-user-Study-dungeon/fc42c896-5bb9-5d8b-88e3-1899bbc43a28/scratchpad/s_notes.png', fullPage:true});
  // add a subject through the UI
  await p.click('button:has-text("+ New Subject")');
  await p.waitForTimeout(150);
  await p.fill('.inline-form input', 'World History');
  await p.click('.inline-form button:has-text("Create")');
  await p.waitForTimeout(250);
  console.log('subject bar:', (await p.textContent('.subject-bar')).replace(/\s+/g,' '));
  await p.click('button:has-text("Quiz Practice")');
  await p.waitForTimeout(250);
  console.log('quiz (History, no cards):', (await p.textContent('#panel')).replace(/\s+/g,' ').slice(120,330));
  await p.click('.quizdiffs button:has-text("Hard")');
  await p.waitForTimeout(200);
  console.log('quiz hard:', (await p.textContent('#panel')).replace(/\s+/g,' ').slice(120,300));
  // back to Play: the new subject should be a realm
  await p.click('button:has-text("Play")');
  await p.waitForTimeout(250);
  console.log('realms:', await p.$$eval('.realm-card', es=>es.map(e=>e.textContent.replace(/\s+/g,' ').trim())));
  await p.screenshot({path:'/tmp/claude-0/-home-user-Study-dungeon/fc42c896-5bb9-5d8b-88e3-1899bbc43a28/scratchpad/s_select3.png', fullPage:true});
  console.log('errors:', errs);
  await b.close();
})();
