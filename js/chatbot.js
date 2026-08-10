/* ── Kontrora Chat Widget – Rich Animations ── */
(function(){
var isOpen=false,view='home',messages=[],slideBack=false;

var css=`
/* ===== LAUNCHER — editorial square + motion ===== */
#wl-btn{
  position:fixed;bottom:88px;right:24px;z-index:2147483647;
  width:128px;height:128px;border-radius:0;
  background:#EDE8E0;
  border:1px solid #EDE8E0;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 12px 32px rgba(0,0,0,.45);
  transition:background .25s ease,border-color .25s ease,color .25s ease,box-shadow .35s cubic-bezier(.16,1,.3,1);
  overflow:visible;
  padding:0;margin:0;
  color:#050505;
  -webkit-appearance:none;appearance:none;
  animation:wlEnter .65s cubic-bezier(.16,1,.3,1) both, wlFloat 4.5s ease-in-out 1s infinite;
}
#wl-btn:hover{
  background:#fff;
  border-color:#fff;
  animation:none;
  transform:translateY(-6px);
  box-shadow:0 22px 48px rgba(0,0,0,.55);
}
#wl-btn:active{
  transform:translateY(-2px) scale(.97);
  box-shadow:0 14px 28px rgba(0,0,0,.45);
}
#wl-btn.open{
  background:#050505;
  border-color:rgba(237,232,224,.35);
  color:#EDE8E0;
  animation:wlPop .4s cubic-bezier(.16,1,.3,1) both;
  transform:none;
  box-shadow:0 16px 40px rgba(0,0,0,.6);
}
#wl-btn.open:hover{
  background:#111;
  border-color:rgba(237,232,224,.5);
  transform:translateY(-3px);
}

/* Square pulse rings */
#wl-btn::before,#wl-btn::after{
  content:'';
  position:absolute;
  inset:0;
  border:1px solid rgba(237,232,224,.45);
  pointer-events:none;
  animation:wlPulse 2.8s ease-out infinite;
}
#wl-btn::after{animation-delay:1.4s;}
#wl-btn.open::before,#wl-btn.open::after{display:none;}

@keyframes wlEnter{
  from{opacity:0;transform:translateY(36px) scale(.82);}
  to{opacity:1;transform:translateY(0) scale(1);}
}
@keyframes wlFloat{
  0%,100%{transform:translateY(0);}
  50%{transform:translateY(-8px);}
}
@keyframes wlPop{
  0%{transform:scale(.92);}
  60%{transform:scale(1.04);}
  100%{transform:scale(1);}
}
@keyframes wlPulse{
  0%{transform:scale(1);opacity:.55;}
  100%{transform:scale(1.4);opacity:0;}
}

#wl-pulse1,#wl-pulse2{display:none!important;}

/* Icon morph: chat ↔ close */
#wl-btn .ico-chat,
#wl-btn .ico-close{
  display:flex;align-items:center;justify-content:center;
  position:absolute;inset:0;
  transition:transform .4s cubic-bezier(.16,1,.3,1),opacity .3s ease;
}
#wl-btn .ico-chat{opacity:1;transform:none;}
#wl-btn .ico-close{opacity:0;transform:rotate(-90deg) scale(.45);}
#wl-btn.open .ico-chat{opacity:0;transform:rotate(90deg) scale(.45);}
#wl-btn.open .ico-close{opacity:1;transform:rotate(0deg) scale(1);}
#wl-btn svg{width:56px;height:56px;display:block;transition:transform .3s ease;}
#wl-btn:not(.open) .ico-chat svg{
  animation:iconBob 3.2s ease-in-out 1.2s infinite;
}
#wl-btn:hover .ico-chat svg{animation:none;transform:scale(1.06);}
@keyframes iconBob{
  0%,100%{transform:translateY(0);}
  50%{transform:translateY(-3px);}
}

/* Notification badge */
#wl-notif{
  position:absolute;top:-6px;right:-6px;
  width:16px;height:16px;border-radius:0;
  background:#C45C5C;
  border:2px solid #050505;
  animation:badgePop .45s cubic-bezier(.16,1,.3,1) 1.5s both, badgePulse 2.2s ease-in-out 2.5s infinite;
  pointer-events:none;
}
@keyframes badgePop{from{transform:scale(0);}to{transform:scale(1);}}
@keyframes badgePulse{
  0%,100%{box-shadow:0 0 0 0 rgba(196,92,92,.45);}
  50%{box-shadow:0 0 0 8px rgba(196,92,92,0);}
}

/* ===== PANEL ===== */
#wl-panel{
  position:fixed;bottom:232px;right:24px;z-index:2147483646;
  width:340px;border-radius:0;
  background:#050505;
  border:1px solid rgba(237,232,224,.18);
  box-shadow:0 24px 60px rgba(0,0,0,.75);
  display:flex;flex-direction:column;overflow:hidden;
  transform:translateY(24px) scale(.94);
  opacity:0;pointer-events:none;
  transition:transform .42s cubic-bezier(.16,1,.3,1),opacity .32s ease,box-shadow .42s ease;
  transform-origin:bottom right;
  font-family:'DM Sans',sans-serif;
  max-height:min(600px, calc(100vh - 260px));
}
#wl-panel.open{
  transform:translateY(0) scale(1);
  opacity:1;pointer-events:auto;
  box-shadow:0 28px 70px rgba(0,0,0,.8);
  animation:panelIn .42s cubic-bezier(.16,1,.3,1) both;
}
@keyframes panelIn{
  from{opacity:0;transform:translateY(28px) scale(.92);}
  to{opacity:1;transform:translateY(0) scale(1);}
}

/* Hairline shimmer on panel top */
#wl-panel::before{
  display:block;
  content:'';
  position:absolute;top:0;left:0;right:0;height:1px;z-index:2;
  background:linear-gradient(90deg,transparent,rgba(237,232,224,.55),transparent);
  background-size:200% 100%;
  animation:shimmerLine 3.5s linear infinite;
  pointer-events:none;
}
@keyframes shimmerLine{
  0%{background-position:200% 0;}
  100%{background-position:-200% 0;}
}

/* ===== HEADER ===== */
.wl-hdr{
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 18px;border-bottom:none;flex-shrink:0;
  background:transparent;
  position:relative;z-index:1;
}
.wl-hdr-l{display:flex;align-items:center;gap:10px;}
.wl-av{
  width:34px;height:34px;border-radius:0;flex-shrink:0;
  background:#EDE8E0;
  display:flex;align-items:center;justify-content:center;
  font-size:.68rem;font-weight:800;color:#000;position:relative;
}
.wl-av::after{
  content:'';position:absolute;bottom:-1px;right:-1px;
  width:8px;height:8px;border-radius:50%;
  background:#10b981;border:2px solid #000;
}
.wl-hdr-name{font-size:.8rem;font-weight:600;color:#fff;}
.wl-hdr-sub{font-size:.66rem;color:rgba(255,255,255,.4);margin-top:1px;}
.wl-hdr-x{
  width:28px;height:28px;border-radius:0;border:none;
  background:rgba(255,255,255,.08);cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  color:rgba(255,255,255,.5);
  transition:all .2s;
}
.wl-hdr-x:hover{background:rgba(255,255,255,.15);color:#fff;}
.wl-hdr-x svg{width:10px;height:10px;}

/* ===== VIEW TRANSITIONS ===== */
.wl-view{display:flex;flex-direction:column;flex:1;min-height:0;}
.wl-view.enter{animation:slideInRight .38s cubic-bezier(.16,1,.3,1) both;}
.wl-view.enter-back{animation:slideInLeft .38s cubic-bezier(.16,1,.3,1) both;}
@keyframes slideInRight{from{opacity:0;transform:translateX(24px);}to{opacity:1;transform:none;}}
@keyframes slideInLeft{from{opacity:0;transform:translateX(-24px);}to{opacity:1;transform:none;}}

/* ===== HOME ===== */
.wl-hero{
  padding:18px 18px 20px;border-bottom:none;
  animation:heroIn .4s cubic-bezier(.16,1,.3,1) .05s both;
  position:relative;z-index:1;
}
@keyframes heroIn{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;}}
.wl-hero strong{
  display:block;font-size:1.15rem;font-weight:700;
  color:#fff;
  margin-bottom:8px;
  line-height:1.2;
  letter-spacing:-.02em;
}
.wl-hero p{font-size:.75rem;color:rgba(255,255,255,.4);line-height:1.4;margin:0;}

.wl-links{padding:0 18px 16px;display:flex;flex-direction:column;gap:0;position:relative;z-index:1;}
.wl-link{
  display:flex;align-items:center;justify-content:space-between;
  padding:13px 0;border-radius:0;
  background:transparent;
  border:none;
  border-bottom:1px solid rgba(255,255,255,.1);
  text-decoration:none;color:inherit;cursor:pointer;
  transition:all .2s ease;
  animation:linkIn .35s cubic-bezier(.16,1,.3,1) both;
  position:relative;
}
.wl-link:nth-child(1){animation-delay:.08s;}
.wl-link:nth-child(2){animation-delay:.14s;}
.wl-link:nth-child(3){animation-delay:.20s;border-bottom:none;}
.wl-link:hover{
  padding-left:6px;
}
.wl-link-l{display:flex;align-items:center;gap:11px;}
.wl-link-ic{
  width:30px;height:30px;border-radius:0;
  background:#EDE8E0;
  display:flex;align-items:center;justify-content:center;
  color:#000;flex-shrink:0;
  transition:transform .2s ease;
}
.wl-link-ic svg{width:12px;height:12px;}
.wl-link:hover .wl-link-ic{
  transform:scale(1.05);
}
.wl-link span{font-size:.8rem;font-weight:500;color:#fff;}
.wl-link .arr{color:rgba(255,255,255,.3);transition:all .2s ease;}
.wl-link .arr svg{width:11px;height:11px;}
.wl-link:hover .arr{color:#fff;transform:translateX(2px);}
@keyframes linkIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}

.wl-cta{
  margin:0 18px 18px;padding:14px 20px;border-radius:0;
  background:#fff;
  border:none;
  display:flex;align-items:center;justify-content:center;cursor:pointer;
  transition:all .2s ease;
  animation:ctaIn .38s cubic-bezier(.16,1,.3,1) .26s both;
  position:relative;
  overflow:hidden;
}
.wl-cta:hover{
  transform:translateY(-2px);
  background:#EDE8E0;
  box-shadow:0 8px 24px rgba(0,0,0,.25);
}
.wl-cta:active{transform:scale(.98);}
.wl-cta > div:first-child{padding:0;text-align:center;}
.wl-cta strong{display:block;font-size:.84rem;font-weight:600;color:#000;}
.wl-cta span{display:none;}
.wl-cta-arr{
  display:none;
}
@keyframes ctaIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}

/* ===== CHAT ===== */
.wl-back-bar{padding:10px 18px 0;}
.wl-back{
  display:inline-flex;align-items:center;gap:5px;
  background:none;border:none;cursor:pointer;
  font-size:.74rem;font-weight:600;color:rgba(255,255,255,.28);
  font-family:inherit;padding:4px 0;
  transition:color .2s,gap .25s cubic-bezier(.34,1.56,.64,1);
}
.wl-back:hover{color:rgba(255,255,255,.7);gap:8px;}

.wl-msgs{
  flex:1;overflow-y:auto;padding:14px 18px;
  display:flex;flex-direction:column;gap:10px;
  min-height:240px;max-height:340px;
}
.wl-msgs::-webkit-scrollbar{width:3px;}
.wl-msgs::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:2px;}

.wl-msg{
  display:flex;gap:8px;align-items:flex-end;max-width:88%;
  animation:msgIn .35s cubic-bezier(.34,1.2,.64,1) both;
}
.wl-msg.user{align-self:flex-end;flex-direction:row-reverse;}
@keyframes msgIn{from{opacity:0;transform:translateY(14px) scale(.9);}to{opacity:1;transform:none;}}

.wl-mav{
  width:28px;height:28px;border-radius:0;flex-shrink:0;
  background:#EDE8E0;
  display:flex;align-items:center;justify-content:center;
  font-size:.6rem;font-weight:800;color:#000;
  box-shadow:0 2px 8px rgba(255,255,255,.2);
}
.wl-bbl{
  padding:10px 14px;border-radius:0;
  font-size:.83rem;line-height:1.55;
  transition:transform .2s;
}
.wl-bbl:hover{transform:scale(1.01);}
.wl-msg.bot .wl-bbl{
  background:rgba(255,255,255,.07);
  border:1px solid rgba(255,255,255,.08);
  color:rgba(255,255,255,.85);
  border-radius:0;
}
.wl-msg.user .wl-bbl{
  background:#EDE8E0;
  color:#050505;border-radius:0;
  box-shadow:none;
}

/* Typing */
.wl-typing .wl-bbl{display:flex;gap:5px;align-items:center;padding:13px 16px;}
.wl-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.35);animation:bounce 1.4s ease-in-out infinite;}
.wl-dot:nth-child(2){animation-delay:.16s;}
.wl-dot:nth-child(3){animation-delay:.32s;}
@keyframes bounce{0%,60%,100%{transform:translateY(0);opacity:.35;}30%{transform:translateY(-7px);opacity:1;}}

/* Input */
.wl-inp-row{
  padding:12px 14px;border-top:1px solid rgba(255,255,255,.06);
  display:flex;align-items:center;gap:8px;flex-shrink:0;
  transition:border-color .25s;
}
.wl-inp-row:focus-within{border-top-color:rgba(237,232,224,.3);}
.wl-inp{
  flex:1;background:rgba(255,255,255,.06);
  border:1px solid rgba(237,232,224,.12);border-radius:0;
  padding:10px 13px;font-size:.83rem;color:rgba(255,255,255,.88);
  font-family:inherit;outline:none;
  transition:border-color .25s,background .25s,box-shadow .25s;
}
.wl-inp::placeholder{color:rgba(255,255,255,.2);}
.wl-inp:focus{
  border-color:rgba(237,232,224,.35);
  background:rgba(237,232,224,.06);
  box-shadow:none;
}
.wl-inp.shake{animation:shake .4s cubic-bezier(.36,.07,.19,.97);}
@keyframes shake{0%,100%{transform:translateX(0);}15%{transform:translateX(-6px);}30%{transform:translateX(6px);}45%{transform:translateX(-5px);}60%{transform:translateX(5px);}75%{transform:translateX(-3px);}90%{transform:translateX(3px);}}

.wl-send{
  width:36px;height:36px;border-radius:0;flex-shrink:0;
  background:#EDE8E0;
  border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
  transition:background .2s;
  color:#050505;
}
.wl-send::after{
  content:'';position:absolute;
  width:100%;height:100%;border-radius:50%;
  background:rgba(255,255,255,.3);
  transform:scale(0);opacity:1;
}
.wl-send:not(:disabled):active::after{
  animation:ripple .5s ease-out forwards;
}
@keyframes ripple{to{transform:scale(3);opacity:0;}}
.wl-send:not(:disabled):hover{
  transform:translateY(-1px);
  background:#fff;
  box-shadow:0 4px 12px rgba(237,232,224,.2);
}
.wl-send:not(:disabled):active{transform:scale(.9);}
.wl-send:disabled{background:rgba(255,255,255,.08);cursor:default;transform:none;box-shadow:none;}
.wl-send svg{transition:transform .3s cubic-bezier(.34,1.56,.64,1);}
.wl-send:not(:disabled):hover svg{transform:translateX(3px);}

/* Footer */
.wl-foot{
  padding:8px 0 10px;text-align:center;
  font-size:.59rem;color:rgba(255,255,255,.1);
  font-weight:600;letter-spacing:.07em;text-transform:uppercase;
  border-top:1px solid rgba(255,255,255,.05);flex-shrink:0;
}

/* Particle burst on open — square editorial confetti */
.wl-particle{
  position:fixed;border-radius:0;pointer-events:none;z-index:2147483645;
  animation:particleFly .85s cubic-bezier(.16,1,.3,1) forwards;
}
@keyframes particleFly{
  0%{transform:translate(0,0) scale(1) rotate(0deg);opacity:1;}
  100%{transform:translate(var(--tx),var(--ty)) scale(0) rotate(90deg);opacity:0;}
}

@media(max-width:480px){
  #wl-panel{width:calc(100vw - 24px);right:12px;bottom:224px;max-height:calc(100vh - 260px);}
  #wl-btn{right:16px;bottom:80px;width:128px;height:128px;}
  #wl-btn svg{width:56px;height:56px;}
}
`;

var styleEl=document.createElement('style');
styleEl.textContent=css;
document.head.appendChild(styleEl);

/* ── Knowledge base (loaded from JSON) + automatic study/learn ── */
var kb=null;
var kbReady=false;
var LEARN_KEY='kontrora-chatbot-learned-v1';

function mergeLearned(list){
  if(!kb||!Array.isArray(list)||!list.length)return;
  kb.qa=kb.qa||[];
  list.forEach(function(entry){
    if(!entry||!entry.answer)return;
    var q=(entry.question||'').toLowerCase();
    var exists=kb.qa.some(function(e){
      return (e.question||'').toLowerCase()===q || e.id===entry.id;
    });
    if(!exists){
      kb.qa.unshift({
        id:entry.id||('learned-'+Date.now()),
        keywords:entry.keywords||tokenize(entry.question||'').slice(0,8),
        patterns:entry.patterns||[entry.question||''],
        answer:entry.answer,
        question:entry.question||'',
        learned:true
      });
    }
  });
}

function loadLocalLearned(){
  try{
    var raw=localStorage.getItem(LEARN_KEY);
    if(!raw)return [];
    var parsed=JSON.parse(raw);
    return Array.isArray(parsed)?parsed:[];
  }catch(e){return [];}
}

function saveLocalLearned(list){
  try{localStorage.setItem(LEARN_KEY,JSON.stringify(list.slice(0,100)));}catch(e){}
}

function persistLearned(question,answer,keywords){
  var local=loadLocalLearned();
  var qn=question.toLowerCase();
  var entry=null;
  for(var i=0;i<local.length;i++){
    if((local[i].question||'').toLowerCase()===qn){
      local[i].answer=answer;
      local[i].count=(local[i].count||1)+1;
      if(keywords&&keywords.length){
        var set={};
        (local[i].keywords||[]).concat(keywords).forEach(function(k){set[k]=true;});
        local[i].keywords=Object.keys(set).slice(0,12);
      }
      entry=local[i];
      break;
    }
  }
  if(!entry){
    entry={
      id:'learned-local-'+Date.now(),
      question:question,
      answer:answer,
      keywords:keywords||tokenize(question).slice(0,8),
      patterns:[question],
      count:1,
      learned:true
    };
    local.unshift(entry);
  }
  saveLocalLearned(local);
  mergeLearned([entry]);

  // Shared learning for all visitors (requires scripts/serve.py)
  fetch('/api/chatbot-learn',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({question:question,answer:answer,keywords:entry.keywords||[]})
  }).catch(function(){});
}

var kbPromise=Promise.all([
  fetch('/data/chatbot-knowledge.json').then(function(r){if(!r.ok)throw new Error('kb');return r.json();}),
  fetch('/data/chatbot-learned.json').then(function(r){return r.ok?r.json():[];}).catch(function(){return [];})
]).then(function(results){
  kb=results[0];
  mergeLearned(results[1]);
  mergeLearned(loadLocalLearned());
  kbReady=true;
  return kb;
}).catch(function(){
  kb={qa:[],faq:[],features:[],fallback:'For help, email <b>support@kontrora.com</b> or visit <a href="/contact" style="color:#EDE8E0">/contact</a>.'};
  mergeLearned(loadLocalLearned());
  kbReady=true;
  return kb;
});

var STOP=new Set(['the','and','for','are','but','not','you','all','can','had','her','was','one','our','out','day','get','has','him','his','how','its','may','new','now','old','see','two','way','who','did','let','say','she','too','use','what','when','where','which','with','will','your','about','from','have','this','that','they','there','their','does','into','just','like','make','much','need','some','than','them','then','also','been','being','call','come','each','give','help','here','know','more','most','other','over','such','take','tell','very','want','well','work','would']);

var quickReplies={
  hello:'Hey! 👋 Welcome to Kontrora Support. Ask me about features, pricing, getting started, or our product.',
  hi:'Hi there! 👋 How can I help you today?',
  hey:'Hey! What can I help you with?',
  thanks:'You\'re welcome! 😊 Anything else I can help with?',
  'thank you':'You\'re welcome! 😊 Let me know if you need anything else.',
  bye:'Goodbye! 👋 Feel free to come back anytime.',
  goodbye:'Goodbye! 👋 Have a great day!'
};

function normalize(text){
  return String(text||'').toLowerCase().replace(/[^\w\s]/g,' ').replace(/\s+/g,' ').trim();
}

function tokenize(text){
  return normalize(text).split(' ').filter(function(w){return w.length>2&&!STOP.has(w);});
}

function hasPhrase(q, phrase){
  return q.indexOf(normalize(phrase))!==-1;
}

function hasWord(q, word){
  return new RegExp('\\b'+word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b').test(q);
}

function scoreEntry(query,tokens,entry){
  var q=normalize(query);
  var score=0;

  (entry.patterns||[]).forEach(function(p){
    if(hasPhrase(q,p))score+=8;
  });

  (entry.keywords||[]).forEach(function(kw){
    var k=normalize(kw);
    if(k.indexOf(' ')>-1){
      if(hasPhrase(q,k))score+=5;
      k.split(' ').forEach(function(w){
        if(w.length>2&&tokens.indexOf(w)!==-1)score+=1.5;
      });
    }else if(hasWord(q,k)){
      score+=3;
      if(tokens.indexOf(k)!==-1)score+=1;
    }
  });

  if(entry.question){
    if(hasPhrase(q,entry.question))score+=10;
    tokenize(entry.question).forEach(function(w){
      if(tokens.indexOf(w)!==-1)score+=1;
    });
  }

  if(entry.name&&hasPhrase(q,entry.name))score+=4;

  if(entry.summary&&score>0){
    tokenize(entry.summary).forEach(function(w){
      if(tokens.indexOf(w)!==-1)score+=0.5;
    });
  }

  return score;
}

function formatFeature(f){
  var html='<b>'+f.name+'</b> — '+f.summary;
  if(f.details&&f.details.length){
    html+='<br><br>';
    for(var i=0;i<Math.min(f.details.length,4);i++){
      html+='• '+f.details[i]+'<br>';
    }
  }
  html+='<br>See <a href="/features" style="color:#EDE8E0">/features</a>.';
  return html;
}

function stripHtml(html){
  return String(html||'').replace(/<br\s*\/?>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
}

function scorePassage(tokens, text){
  var words=tokenize(text);
  if(!words.length||!tokens.length)return 0;
  var set={};
  words.forEach(function(w){set[w]=true;});
  var hits=0;
  tokens.forEach(function(t){if(set[t])hits++;});
  return hits+(hits/tokens.length)*2;
}

/* Study the whole knowledge file for new / unmatched questions */
function buildStudyPassages(){
  if(!kb)return [];
  var passages=[];
  function add(title, text, link){
    if(!text)return;
    passages.push({title:title,text:String(text),link:link||''});
  }

  if(kb.company){
    add('About Kontrora', [kb.company.full_name, kb.company.tagline, kb.company.description, kb.company.mission, kb.company.origin, kb.company.target_audience].filter(Boolean).join('. '), '/about');
  }
  if(kb.product){
    add('Product', [kb.product.summary].concat(kb.product.value_props||[]).concat(kb.product.pain_points||[]).join('. '), '/features');
  }
  if(kb.contact){
    add('Contact', 'Email '+kb.contact.email+'. Phone '+kb.contact.phone+'. Address '+kb.contact.address+'. Response time: '+kb.contact.response_time+'.', '/contact');
  }
  if(kb.links){
    add('Links', 'App '+kb.links.app+'. Live demo '+kb.links.demo+'. GitHub '+kb.links.github+'. Website '+kb.links.website+'.', '');
  }
  if(kb.pricing){
    add('Pricing overview', kb.pricing.tagline+' Unlimited users: '+(kb.pricing.unlimited_users?'yes':'no')+'. '+kb.pricing.hosting_cost_note, '/pricing');
    (kb.pricing.plans||[]).forEach(function(p){
      add(p.name+' plan', [p.name, p.price||p.price_annual||'', p.price_monthly||'', p.description].concat(p.includes||[]).join('. '), '/pricing');
    });
  }
  (kb.features||[]).forEach(function(f){
    add(f.name, [f.summary].concat(f.details||[]).join('. '), '/features');
  });
  if(kb.tech_stack){
    add('Tech stack', [kb.tech_stack.frontend, kb.tech_stack.backend, kb.tech_stack.database, kb.tech_stack.auth, (kb.tech_stack.other||[]).join(', '), kb.tech_stack.requirements].filter(Boolean).join('. '), '/about');
  }
  if(kb.deployment){
    add('Deployment', 'Methods: '+(kb.deployment.methods||[]).join(', ')+'. '+kb.deployment.setup_summary, '/pricing');
  }
  (kb.roadmap||[]).forEach(function(r){
    add('Roadmap '+r.phase, [r.title, r.status].concat(r.items||[]).join('. '), '/roadmap');
  });
  if(kb.careers){
    add('Careers', [kb.careers.summary, 'Open roles: '+(kb.careers.open_roles||[]).join(', '), kb.careers.review_time].join('. '), '/careers');
  }
  (kb.faq||[]).forEach(function(f){
    add(f.question, stripHtml(f.answer), '/pricing');
  });
  (kb.qa||[]).forEach(function(q){
    if(q.learned)return;
    add(q.question||q.id, stripHtml(q.answer), '');
  });
  return passages;
}

function studyFromKnowledge(query){
  var tokens=tokenize(query);
  if(!tokens.length)return null;
  var passages=buildStudyPassages();
  var ranked=passages.map(function(p){
    return {p:p, score:scorePassage(tokens, p.title+' '+p.text)};
  }).filter(function(x){return x.score>=1.5;})
    .sort(function(a,b){return b.score-a.score;})
    .slice(0,3);

  if(!ranked.length||ranked[0].score<2)return null;

  var parts=[];
  ranked.forEach(function(item, idx){
    var snippet=item.p.text;
    if(snippet.length>280)snippet=snippet.slice(0,277)+'…';
    parts.push((idx===0?'<b>'+item.p.title+'</b><br>':'<b>'+item.p.title+'</b> — ')+snippet);
  });
  var topLink=ranked[0].p.link;
  if(topLink)parts.push('<br>More: <a href="'+topLink+'" style="color:#EDE8E0">'+topLink+'</a>');
  return parts.join('<br><br>');
}

function findAnswer(text){
  if(!kb)return null;
  var l=normalize(text);
  for(var k in quickReplies){
    if(l===k||l.indexOf(k+' ')===0||l.endsWith(' '+k)||(' '+l+' ').indexOf(' '+k+' ')!==-1){
      return {answer:quickReplies[k], learned:false, studied:false};
    }
  }

  var tokens=tokenize(text);
  var best=null,bestScore=0,score;

  (kb.qa||[]).forEach(function(entry){
    score=scoreEntry(text,tokens,entry);
    if(score>bestScore){bestScore=score;best={answer:entry.answer, learned:!!entry.learned};}
  });

  (kb.faq||[]).forEach(function(item){
    score=scoreEntry(text,tokens,item);
    if(score>bestScore){bestScore=score;best={answer:item.answer, learned:false};}
  });

  (kb.features||[]).forEach(function(f){
    score=scoreEntry(text,tokens,f);
    if(score>bestScore){bestScore=score;best={answer:formatFeature(f), learned:false};}
  });

  if(bestScore>=4&&best){
    return {answer:best.answer, learned:false, studied:false};
  }

  // New question: study the full knowledge database
  var studied=studyFromKnowledge(text);
  if(studied){
    return {answer:studied, learned:false, studied:true, shouldLearn:true};
  }

  return {
    answer:kb.fallback||'For help, email <b>support@kontrora.com</b> or visit <a href="/contact" style="color:#EDE8E0">/contact</a>.',
    learned:false,
    studied:false,
    shouldLearn:false
  };
}

function getReply(t){
  var result=findAnswer(t);
  if(result&&result.shouldLearn&&result.answer){
    persistLearned(t, result.answer, tokenize(t).slice(0,8));
  }
  return result?result.answer:(kb&&kb.fallback)||'';
}

/* particle burst */
function burst(x,y){
  var colors=['#EDE8E0','#9A958C','#C4A574','#C45C5C'];
  for(var i=0;i<14;i++){
    var p=document.createElement('div');
    p.className='wl-particle';
    var size=5+Math.random()*8;
    var angle=Math.random()*Math.PI*2;
    var dist=50+Math.random()*80;
    p.style.cssText='width:'+size+'px;height:'+size+'px;left:'+x+'px;top:'+y+'px;background:'+colors[i%colors.length]+';--tx:'+(Math.cos(angle)*dist)+'px;--ty:'+(Math.sin(angle)*dist)+'px;';
    document.body.appendChild(p);
    setTimeout(function(el){return function(){el.remove();};}(p),900);
  }
}

var btn=document.createElement('button');
btn.id='wl-btn';
btn.setAttribute('aria-label','Open support');
btn.innerHTML=
  '<span class="ico-chat" aria-hidden="true">'+
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter">'+
      '<path d="M4 5h16v11H8l-4 3V5z"/>'+
    '</svg>'+
  '</span>'+
  '<span class="ico-close" aria-hidden="true">'+
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square">'+
      '<path d="M6 6l12 12M18 6L6 18"/>'+
    '</svg>'+
  '</span>'+
  '<span id="wl-notif"></span>';

var panel=document.createElement('div');
panel.id='wl-panel';
panel.setAttribute('role','dialog');
panel.setAttribute('aria-label','Kontrora support');

function hdr(){
  return '<div class="wl-hdr">'+
    '<div class="wl-hdr-l">'+
      '<div class="wl-av">K</div>'+
      '<div><div class="wl-hdr-name">Kontrora Support</div><div class="wl-hdr-sub">Typically replies in minutes</div></div>'+
    '</div>'+
    '<button class="wl-hdr-x" id="wl-x" aria-label="Close">'+
      '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'+
    '</button>'+
  '</div>';
}

function renderHome(){
  return hdr()+
    '<div class="wl-view '+(slideBack?'enter-back':'enter')+'">'+
      '<div class="wl-hero"><strong>How can we help?</strong><p>Browse quick links or start a conversation.</p></div>'+
      '<div class="wl-links">'+
        '<a href="/features" class="wl-link"><div class="wl-link-l"><div class="wl-link-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></div><span>Explore Features</span></div><svg class="arr" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></a>'+
        '<a href="/pricing" class="wl-link"><div class="wl-link-l"><div class="wl-link-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><span>View Pricing</span></div><svg class="arr" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></a>'+
        '<a href="/contact" class="wl-link"><div class="wl-link-l"><div class="wl-link-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div><span>Contact Support</span></div><svg class="arr" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></a>'+
      '</div>'+
      '<div class="wl-cta" id="wl-openchat">'+
        '<div><strong>Chat with us</strong><span>Replies within minutes</span></div>'+
        '<div class="wl-cta-arr"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>'+
      '</div>'+
    '</div>'+
    '<div class="wl-foot">Kontrora Support</div>';
}

function renderChat(){
  var msgsHtml=messages.length===0
    ?'<div class="wl-msg bot"><div class="wl-mav">K</div><div class="wl-bbl">Hi! Ask me anything about Kontrora — features, pricing, or getting started.</div></div>'
    :messages.map(function(m){
      return '<div class="wl-msg '+m.role+'">'+(m.role==='bot'?'<div class="wl-mav">K</div>':'')+
        '<div class="wl-bbl">'+m.text+'</div></div>';
    }).join('');
  return hdr()+
    '<div class="wl-view '+(slideBack?'enter-back':'enter')+'">'+
      '<div class="wl-back-bar"><button class="wl-back" id="wl-bk"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>Back</button></div>'+
      '<div class="wl-msgs" id="wl-msgs">'+msgsHtml+'</div>'+
      '<div class="wl-inp-row">'+
        '<input class="wl-inp" id="wl-inp" type="text" placeholder="Type a message..." autocomplete="off"/>'+
        '<button class="wl-send" id="wl-send" disabled><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>'+
      '</div>'+
    '</div>'+
    '<div class="wl-foot">Kontrora Support</div>';
}

function scrollBottom(){var el=document.getElementById('wl-msgs');if(el)el.scrollTop=el.scrollHeight;}

function addMsg(role,text){messages.push({role:role,text:text});render();}

function sendMsg(){
  var inp=document.getElementById('wl-inp');
  if(!inp)return;
  var text=inp.value.trim();
  if(!text){inp.classList.remove('shake');void inp.offsetWidth;inp.classList.add('shake');return;}
  inp.value='';
  var s=document.getElementById('wl-send');if(s)s.disabled=true;
  slideBack=false;addMsg('user',text);
  var msgs=document.getElementById('wl-msgs');
  if(msgs){
    var t=document.createElement('div');
    t.className='wl-msg bot wl-typing';t.id='wl-typing';
    t.innerHTML='<div class="wl-mav">K</div><div class="wl-bbl"><span class="wl-dot"></span><span class="wl-dot"></span><span class="wl-dot"></span></div>';
    msgs.appendChild(t);scrollBottom();
  }
  var delay=800+Math.random()*500;
  kbPromise.then(function(){
    setTimeout(function(){
      var typing=document.getElementById('wl-typing');if(typing)typing.remove();
      slideBack=false;addMsg('bot',getReply(text));
    },delay);
  });
}

function render(){
  panel.innerHTML=view==='home'?renderHome():renderChat();
  var el;
  el=document.getElementById('wl-x');       if(el)el.onclick=toggle;
  el=document.getElementById('wl-openchat');if(el)el.onclick=function(){slideBack=false;view='chat';render();};
  el=document.getElementById('wl-bk');      if(el)el.onclick=function(){slideBack=true;view='home';render();};
  el=document.getElementById('wl-send');    if(el)el.onclick=sendMsg;
  var inp=document.getElementById('wl-inp');
  if(inp){
    inp.onkeydown=function(e){if(e.key==='Enter')sendMsg();};
    inp.oninput=function(){var s=document.getElementById('wl-send');if(s)s.disabled=!inp.value.trim();};
    setTimeout(function(){inp.focus();},60);
  }
  if(view==='chat')scrollBottom();
}

function toggle(){
  isOpen=!isOpen;
  btn.classList.toggle('open',isOpen);
  panel.classList.toggle('open',isOpen);
  /* particle burst on open */
  if(isOpen){
    var r=btn.getBoundingClientRect();
    burst(r.left+r.width/2,r.top+r.height/2);
    var notif=document.getElementById('wl-notif');
    if(notif)notif.style.display='none';
    slideBack=false;render();
  }
}

btn.onclick=toggle;
document.body.appendChild(btn);
document.body.appendChild(panel);
})();
