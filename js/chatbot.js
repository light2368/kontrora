/* ── Worklo Chat Widget – Rich Animations ── */
(function(){
var isOpen=false,view='home',messages=[],slideBack=false;

var css=`
/* ===== LAUNCHER ===== */
#wl-btn{
  position:fixed;bottom:72px;right:28px;z-index:2147483647;
  width:68px;height:68px;border-radius:50%;
  background:transparent;
  border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  box-shadow:none;
  transition:transform .4s cubic-bezier(.34,1.56,.64,1);
  overflow:visible;
}
#wl-btn:hover{ transform:translateY(-4px) scale(1.1); }
#wl-btn:active{ transform:scale(.9); }

/* Logo */
#wl-btn img {
  position:relative;z-index:3;
  width:56px;height:56px;object-fit:contain;
  animation:iconFloat 3.5s ease-in-out infinite;
  transition:filter .3s;
  filter:drop-shadow(0 4px 12px rgba(59,130,246,.4));
}
#wl-btn:hover img {
  filter:drop-shadow(0 4px 20px rgba(59,130,246,.7)) brightness(1.1);
}
@keyframes iconFloat{
  0%,100%{transform:translateY(0);}
  50%{transform:translateY(-6px);}
}

/* Sharp spinning arc border */
#wl-btn::before{
  content:'';position:absolute;
  width:76px;height:76px;border-radius:50%;
  border:2.5px solid transparent;
  border-top-color:#3B82F6;
  border-right-color:#8B5CF6;
  border-bottom-color:#06b6d4;
  border-left-color:transparent;
  z-index:1;
  animation:spinBorder 2s linear infinite;
  box-shadow:0 0 12px rgba(59,130,246,.3);
}
@keyframes spinBorder{to{transform:rotate(360deg);}}

/* Second counter-rotating arc */
#wl-btn::after{
  display:block;
  content:'';position:absolute;
  width:84px;height:84px;border-radius:50%;
  border:1.5px solid transparent;
  border-top-color:rgba(139,92,246,.4);
  border-left-color:rgba(6,182,212,.4);
  z-index:0;
  animation:spinBorderRev 3s linear infinite;
}
@keyframes spinBorderRev{to{transform:rotate(-360deg);}}

/* Pulse rings */
#wl-pulse1,#wl-pulse2{
  position:absolute;border-radius:50%;
  border:1px solid rgba(59,130,246,.5);
  width:68px;height:68px;
  animation:pulseOut 2.5s ease-out infinite;
  pointer-events:none;z-index:0;
}
#wl-pulse2{animation-delay:1.25s;border-color:rgba(139,92,246,.4);}
@keyframes pulseOut{
  0%{transform:scale(1);opacity:.7;}
  100%{transform:scale(2);opacity:0;}
}

/* Icon morph */
#wl-btn .ico-chat{
  display:flex;
  transition:transform .4s cubic-bezier(.34,1.56,.64,1),opacity .25s;
}
#wl-btn .ico-close{
  display:flex;position:absolute;
  opacity:0;transform:rotate(-90deg) scale(.4);
  transition:transform .4s cubic-bezier(.34,1.56,.64,1),opacity .25s;
}
#wl-btn.open .ico-chat{opacity:0;transform:rotate(90deg) scale(.4);}
#wl-btn.open .ico-close{opacity:1;transform:rotate(0deg) scale(1);}

/* Notification badge */
#wl-notif{
  position:absolute;top:-4px;right:-4px;
  width:14px;height:14px;border-radius:50%;
  background:linear-gradient(135deg,#ef4444,#dc2626);
  border:2.5px solid #fff;
  animation:badgePop .5s cubic-bezier(.34,1.56,.64,1) 2s both,badgePulse 2s ease-in-out 3s infinite;
}
@keyframes badgePop{from{transform:scale(0) rotate(-30deg);}to{transform:scale(1) rotate(0deg);}}
@keyframes badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.5);}50%{box-shadow:0 0 0 5px rgba(239,68,68,0);}}

/* ===== PANEL ===== */
#wl-panel{
  position:fixed;bottom:140px;right:28px;z-index:2147483646;
  width:340px;border-radius:16px;
  background:#000000;
  border:1px solid rgba(255,255,255,.15);
  box-shadow:0 30px 70px rgba(0,0,0,.95);
  display:flex;flex-direction:column;overflow:hidden;
  transform:translateY(28px) scale(.9) rotateX(8deg);
  opacity:0;pointer-events:none;
  transition:transform .5s cubic-bezier(.34,1.2,.64,1),opacity .35s ease;
  transform-origin:bottom right;
  transform-style:preserve-3d;
  perspective:800px;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  max-height:600px;
}
#wl-panel.open{
  transform:translateY(0) scale(1) rotateX(0deg);
  opacity:1;pointer-events:all;
}

/* No accent bar - clean minimal */
#wl-panel::before{
  display:none;
}
@keyframes borderFlow{0%{background-position:200% 0;}100%{background-position:-200% 0;}}

/* ===== HEADER ===== */
.wl-hdr{
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 18px;border-bottom:none;flex-shrink:0;
  background:transparent;
  position:relative;z-index:1;
}
.wl-hdr-l{display:flex;align-items:center;gap:10px;}
.wl-av{
  width:34px;height:34px;border-radius:8px;flex-shrink:0;
  background:#fff;
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
  width:28px;height:28px;border-radius:7px;border:none;
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
  width:30px;height:30px;border-radius:7px;
  background:#fff;
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
  margin:0 18px 18px;padding:14px 20px;border-radius:50px;
  background:#fff;
  border:none;
  display:flex;align-items:center;justify-content:center;cursor:pointer;
  transition:all .2s ease;
  animation:ctaIn .38s cubic-bezier(.16,1,.3,1) .26s both;
  position:relative;
  overflow:hidden;
}
.wl-cta:hover{
  transform:scale(1.02);
  box-shadow:0 6px 20px rgba(255,255,255,.2);
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
  width:28px;height:28px;border-radius:9px;flex-shrink:0;
  background:#fff;
  display:flex;align-items:center;justify-content:center;
  font-size:.6rem;font-weight:800;color:#000;
  box-shadow:0 2px 8px rgba(255,255,255,.2);
}
.wl-bbl{
  padding:10px 14px;border-radius:16px;
  font-size:.83rem;line-height:1.55;
  transition:transform .2s;
}
.wl-bbl:hover{transform:scale(1.01);}
.wl-msg.bot .wl-bbl{
  background:rgba(255,255,255,.07);
  border:1px solid rgba(255,255,255,.08);
  color:rgba(255,255,255,.85);
  border-bottom-left-radius:4px;
}
.wl-msg.user .wl-bbl{
  background:linear-gradient(135deg,#3B82F6,#2563eb);
  color:#fff;border-bottom-right-radius:4px;
  box-shadow:0 4px 16px rgba(59,130,246,.35);
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
.wl-inp-row:focus-within{border-top-color:rgba(59,130,246,.35);}
.wl-inp{
  flex:1;background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.09);border-radius:11px;
  padding:10px 13px;font-size:.83rem;color:rgba(255,255,255,.88);
  font-family:inherit;outline:none;
  transition:border-color .25s,background .25s,box-shadow .25s;
}
.wl-inp::placeholder{color:rgba(255,255,255,.2);}
.wl-inp:focus{
  border-color:rgba(59,130,246,.5);
  background:rgba(59,130,246,.06);
  box-shadow:0 0 0 3px rgba(59,130,246,.12),0 2px 8px rgba(59,130,246,.1);
}
.wl-inp.shake{animation:shake .4s cubic-bezier(.36,.07,.19,.97);}
@keyframes shake{0%,100%{transform:translateX(0);}15%{transform:translateX(-6px);}30%{transform:translateX(6px);}45%{transform:translateX(-5px);}60%{transform:translateX(5px);}75%{transform:translateX(-3px);}90%{transform:translateX(3px);}}

.wl-send{
  width:36px;height:36px;border-radius:11px;flex-shrink:0;
  background:linear-gradient(135deg,#3B82F6,#1d4ed8);
  border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
  transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .25s,background .2s;
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
  transform:scale(1.1) translateY(-1px);
  box-shadow:0 6px 20px rgba(59,130,246,.55);
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

/* Particle burst on open */
.wl-particle{
  position:fixed;border-radius:50%;pointer-events:none;z-index:2147483645;
  animation:particleFly .8s ease-out forwards;
}
@keyframes particleFly{
  0%{transform:translate(0,0) scale(1);opacity:1;}
  100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0;}
}

@media(max-width:480px){
  #wl-panel{width:calc(100vw - 24px);right:12px;bottom:126px;}
  #wl-btn{right:16px;bottom:60px;}
}
`;

var styleEl=document.createElement('style');
styleEl.textContent=css;
document.head.appendChild(styleEl);

var replies={
  // Greetings
  hello:'Hey! 👋 Welcome to Worklo Support. Ask me anything about features, pricing, setup, or your account.',
  hi:'Hi there! 👋 How can I help you today?',
  hey:'Hey! What can I help you with?',
  // Pricing
  price:'Worklo is <b>free to self-host</b>. Managed cloud plans are also available. Visit <a href="/pricing" style="color:#3B82F6">/pricing</a> for full details.',
  pricing:'Worklo has a <b>free self-hosted tier</b> and paid managed cloud plans with hosting, updates, and priority support. See <a href="/pricing" style="color:#3B82F6">/pricing</a>.',
  cost:'Worklo is free to self-host. Managed cloud plans are available with monthly or annual billing. Check <a href="/pricing" style="color:#3B82F6">/pricing</a>.',
  free:'Yes! Worklo is <b>open source and free to self-host</b> on your own infrastructure.',
  plan:'We offer a free self-hosted plan and paid managed cloud plans. See <a href="/pricing" style="color:#3B82F6">/pricing</a>.',
  subscription:'Monthly and annual subscriptions are available for managed cloud. Self-hosting is always free. See <a href="/pricing" style="color:#3B82F6">/pricing</a>.',
  // Features
  feature:'Worklo includes: <b>Capacity Planning</b>, <b>Time Tracking</b>, <b>Workflow Automation</b>, <b>Task Management</b> (Kanban, Gantt, Table), and a <b>Client Portal</b>. See <a href="/features" style="color:#3B82F6">/features</a>.',
  features:'Key features: capacity planning, time tracking, visual workflow builder, Kanban/Gantt/Table views, client portal, and role-based permissions. See <a href="/features" style="color:#3B82F6">/features</a>.',
  capacity:'<b>Capacity Planning</b> gives real-time visibility into every team member\'s availability before you commit to new work — by person, department, or org level.',
  time:'<b>Time Tracking</b>: clock in/out with task allocation, manual logging, 14-day edit window, and full admin analytics.',
  workflow:'<b>Workflow Automation</b> turns your SOPs into visual enforced workflows with drag-and-drop builder, role assignments, client approvals, and audit trail.',
  kanban:'Worklo supports <b>Kanban boards</b> with drag-and-drop, plus Gantt charts, Table views, and Workflow views — all switchable instantly.',
  gantt:'Yes, Worklo has <b>Gantt charts</b> with dependencies and critical path, alongside Kanban, Table, and Workflow views.',
  portal:'The <b>Client Portal</b> gives each client a secure window into their projects — real-time visibility, approval workflows, satisfaction scoring, and branded access.',
  permission:'Worklo has ~40 permissions across 15 categories, enforced at the database level with <b>PostgreSQL Row Level Security</b>.',
  security:'Security is built-in — <b>Row Level Security</b> on every table, RBAC, audit logging, rate limiting, and input validation.',
  // Setup
  deploy:'Worklo deploys via Docker on any Linux server, VPS, or cloud provider (AWS, GCP, DigitalOcean, etc.).',
  // Tech
  tech:'Worklo is built on <b>Next.js 15</b>, <b>TypeScript</b>, <b>Supabase (PostgreSQL)</b>, Tailwind CSS 4, shadcn/ui, and Docker.',
  'open source':'Yes, Worklo is <b>fully open source</b>. View, fork, and modify the code on GitHub.',
  github:'Worklo is open source at <a href="https://github.com/worklo-psa" style="color:#3B82F6" target="_blank">github.com/worklo-org</a>.',
  // Contact
  contact:'Reach us at <b>support@worklo.org</b>, call <b>+1 (929) 612 9360</b>, or visit <a href="/contact" style="color:#3B82F6">/contact</a>. We\'re at 888 Broadway, Floor 4, New York, NY 10003.',
  support:'Email <b>support@worklo.org</b> or use <a href="/contact" style="color:#3B82F6">/contact</a>. We respond within one business day.',
  email:'Our support email is <b>support@worklo.org</b>. We respond within one business day.',
  phone:'Call us at <b>+1 (929) 612 9360</b> during business hours.',
  address:'We\'re at <b>888 Broadway, Floor 4, New York, NY 10003, US</b>.',
  help:'Ask me about features, pricing, setup, or anything Worklo. Or visit <a href="/contact" style="color:#3B82F6">/contact</a> to reach our team.',
  // Company
  about:'Worklo was built by a student-run agency tired of juggling five tools. Learn more at <a href="/about" style="color:#3B82F6">/about</a>.',
  team:'Meet the team at <a href="/about" style="color:#3B82F6">/about</a>.',
  mission:'Worklo\'s mission is to replace the fragmented agency tool stack with one focused, open-source platform.',
  // Roadmap & Careers
  roadmap:'See what\'s coming at <a href="/roadmap" style="color:#3B82F6">/roadmap</a>. We ship regularly and the community shapes priorities.',
  career:'We\'re hiring! Check open positions at <a href="/careers" style="color:#3B82F6">/careers</a>.',
  careers:'We\'re hiring! Check open positions at <a href="/careers" style="color:#3B82F6">/careers</a>.',
  // Misc
  demo:'To request a demo, visit <a href="/contact" style="color:#3B82F6">/contact</a> and select "Request a demo".',
  trial:'No trial needed — Worklo is free to self-host. Download and run it immediately.',
  bug:'Report bugs at <b>support@worklo.org</b> or open an issue on <a href="https://github.com/worklo-psa" style="color:#3B82F6" target="_blank">GitHub</a>.',
  thanks:'You\'re welcome! 😊 Anything else I can help with?',
  'thank you':'You\'re welcome! 😊 Let me know if you need anything else.',
  bye:'Goodbye! 👋 Feel free to come back anytime.',
  goodbye:'Goodbye! 👋 Have a great day!'
};
var fallbacks=[
  'I\'m not sure about that. For detailed help, email <b>support@worklo.org</b> or visit <a href="/contact" style="color:#3B82F6">/contact</a>.',
  'Great question! For the most accurate answer, reach our team at <b>support@worklo.org</b>.',
  'I don\'t have a specific answer for that. Try <a href="/features" style="color:#3B82F6">/features</a> or <a href="/contact" style="color:#3B82F6">/contact</a> for more info.'
];
function getReply(t){
  var l=t.toLowerCase();
  for(var k in replies){if(l.indexOf(k)!==-1)return replies[k];}
  return fallbacks[Math.floor(Math.random()*fallbacks.length)];
}

/* particle burst */
function burst(x,y){
  var colors=['#3B82F6','#8B5CF6','#06b6d4','#10b981','#f59e0b'];
  for(var i=0;i<12;i++){
    var p=document.createElement('div');
    p.className='wl-particle';
    var size=4+Math.random()*6;
    var angle=Math.random()*Math.PI*2;
    var dist=40+Math.random()*60;
    p.style.cssText='width:'+size+'px;height:'+size+'px;left:'+x+'px;top:'+y+'px;background:'+colors[i%colors.length]+';--tx:'+(Math.cos(angle)*dist)+'px;--ty:'+(Math.sin(angle)*dist)+'px;';
    document.body.appendChild(p);
    setTimeout(function(el){return function(){el.remove();};}(p),900);
  }
}

var btn=document.createElement('button');
btn.id='wl-btn';
btn.setAttribute('aria-label','Open support');
btn.innerHTML=
  '<span id="wl-pulse1"></span>'+
  '<span id="wl-pulse2"></span>'+
  '<img src="/images/tab-logo.gif" alt="Worklo" style="width:48px;height:48px;object-fit:contain;display:block;position:relative;z-index:3;" />'+
  '<span id="wl-notif"></span>';

var panel=document.createElement('div');
panel.id='wl-panel';
panel.setAttribute('role','dialog');
panel.setAttribute('aria-label','Worklo support');

function hdr(){
  return '<div class="wl-hdr">'+
    '<div class="wl-hdr-l">'+
      '<div class="wl-av">W</div>'+
      '<div><div class="wl-hdr-name">Worklo Support</div><div class="wl-hdr-sub">Typically replies in minutes</div></div>'+
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
    '<div class="wl-foot">Worklo Support</div>';
}

function renderChat(){
  var msgsHtml=messages.length===0
    ?'<div class="wl-msg bot"><div class="wl-mav">W</div><div class="wl-bbl">Hi! Ask me anything about Worklo — features, pricing, or getting started.</div></div>'
    :messages.map(function(m){
      return '<div class="wl-msg '+m.role+'">'+(m.role==='bot'?'<div class="wl-mav">W</div>':'')+
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
    '<div class="wl-foot">Worklo Support</div>';
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
    t.innerHTML='<div class="wl-mav">W</div><div class="wl-bbl"><span class="wl-dot"></span><span class="wl-dot"></span><span class="wl-dot"></span></div>';
    msgs.appendChild(t);scrollBottom();
  }
  setTimeout(function(){
    var typing=document.getElementById('wl-typing');if(typing)typing.remove();
    slideBack=false;addMsg('bot',getReply(text));
  },800+Math.random()*500);
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
