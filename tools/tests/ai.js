const {chromium}=require('playwright');
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--headless=new']});
const p=await b.newPage({viewport:{width:1100,height:900}});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/user/Study-dungeon/index.html');
await p.waitForFunction(()=>typeof App!=='undefined');

// ---- what the request actually looks like
const req = await p.evaluate(async ()=>{
  let captured=null;
  window.fetch = async (url, init)=>{
    captured = {url, headers:init.headers, body: JSON.parse(init.body)};
    return {ok:true, status:200, headers:{get:()=>null}, json: async ()=>({
      stop_reason:'end_turn',
      content:[{type:'text', text: JSON.stringify({
        notes:'# Cells\n- **Mitochondria** make ATP.',
        cards:[
          {q:'Which organelle makes ATP?', a:'Mitochondria', why:'ATP is produced by oxidative phosphorylation on the inner mitochondrial membrane.',
           wrong:['Ribosome','Golgi apparatus','Lysosome'], topic:'Organelles', level:'recall'},
          {q:'What process makes most ATP?', a:'Oxidative phosphorylation', why:'It couples the electron transport chain to ATP synthase.',
           wrong:['Glycolysis','Fermentation','Mitochondria'], topic:'Respiration', level:'apply'}
        ]})}]
    })};
  };
  await setApiKey('sk-ant-test');
  const out = await aiStudyAnalyze('Mitochondria make ATP.', [], 'focus on definitions');
  return {captured, out, model: await getAiModel()};
});

console.log('model        ', req.model);
console.log('max_tokens   ', req.captured.body.max_tokens);
console.log('system       ', req.captured.body.system ? req.captured.body.system.length+' chars' : 'MISSING');
console.log('thinking     ', JSON.stringify(req.captured.body.thinking));
console.log('output_config', JSON.stringify(req.captured.body.output_config).slice(0,80)+'...');
console.log('schema type  ', req.captured.body.output_config.format.type);
console.log('source in user turn, not system:',
   req.captured.body.messages[0].content.some(c=>c.type==='text' && c.text.includes('<extract>')));
console.log('cards parsed ', req.out.flashcards.length,
            '| wrong answers:', JSON.stringify(req.out.flashcards[0].wrong),
            '| topic:', req.out.flashcards[0].topic,
            '| why:', req.out.flashcards[0].why.slice(0,40)+'...');
console.log('self-answer stripped:',
  !req.out.flashcards[1].wrong.some(w=>w.toLowerCase()==='oxidative phosphorylation'));

// ---- the distractors actually reach the multiple choice
const mcq = await p.evaluate(()=>{
  const pool = [
    makeCard('Which organelle makes ATP?','Mitochondria',{wrong:['Ribosome','Golgi apparatus','Lysosome'],why:'because',topic:'Organelles'}),
    makeCard('Capital of France?','Paris',{wrong:['Lyon','Marseille','Nice']}),
    makeCard('2+2?','4',{wrong:['3','5','6']}),
  ];
  const q = buildCardQuestion(pool.filter(c=>c.front.indexOf('organelle')>=0), 'medium', {id:'x',name:'Bio'});
  return {options:q.options, why:q.why, topic:q.topic};
});
console.log('mcq options  ', JSON.stringify(mcq.options));
console.log('all from this question:',
  mcq.options.every(o=>['Mitochondria','Ribosome','Golgi apparatus','Lysosome'].indexOf(o)>=0));
console.log('why carried  ', !!mcq.why, '| topic carried', mcq.topic);

// ---- old decks without the new fields still work
const legacy = await p.evaluate(()=>{
  const s = {name:'Old', flashcards:[{id:'a',front:'Q1',back:'A1'},{id:'b',front:'Q2',back:'A2'},{id:'c',front:'Q3',back:'A3'}]};
  normalizeSubject(s);
  const q = buildCardQuestion(s.flashcards,'medium',{id:'o',name:'Old'});
  return {fields:Object.keys(s.flashcards[0]).sort().join(','), opts:q.options.length};
});
console.log('legacy card  ', legacy.fields);
console.log('legacy mcq   ', legacy.opts, 'options');

// ---- retry on 429
const retry = await p.evaluate(async ()=>{
  let n=0; window.sleep=()=>Promise.resolve();
  window.fetch = async ()=>{ n++;
    if(n<3) return {ok:false, status:429, headers:{get:()=>null}, text:async()=>'rate limited'};
    return {ok:true, status:200, headers:{get:()=>null}, json:async()=>({stop_reason:'end_turn',
      content:[{type:'text',text:JSON.stringify({notes:'n',cards:[]})}]})};
  };
  const out = await aiStudyAnalyze('x',[],'');
  return {calls:n, notes:out.notes};
});
console.log('429 retried  ', retry.calls, 'calls ->', retry.notes);

// ---- weak spots
const weak = await p.evaluate(()=>{
  const s={name:'W',flashcards:[
    makeCard('a','1',{topic:'Respiration',seen:6,missed:5}),
    makeCard('b','2',{topic:'Respiration',seen:4,missed:3}),
    makeCard('c','3',{topic:'Organelles',seen:8,missed:1}),
    makeCard('d','4',{topic:'Never asked'}),
  ]};
  return weakTopics(s,5).map(r=>r.topic+' '+r.missed+'/'+r.seen);
});
console.log('weak spots   ', JSON.stringify(weak));

console.log('page errors:', errs.length ? errs : 'none');
await b.close();})();
