// T3 Experience 2027 · protótipo navegável
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const I=icon;
const DEMO=/demo/.test(location.search);
const brl=v=>'R$ '+v.toLocaleString('pt-BR',{minimumFractionDigits:2});
const av=(t,c,s=44,fs)=>`<div class="av" style="width:${s}px;height:${s}px;background:${c};font-size:${fs||Math.round(s*.32)}px">${t}</div>`;
const allSess=()=>SESS.flat();
const sess=id=>allSess().find(s=>s.id===id);

const st={
  saved:new Set(['s1','s2','s4','s5','d3','t1']), day:0, mode:'prog', track:'Todas',
  pts:640, done:new Set(['checkin','cartao']), est:2,
  voted:null, poll:[46,31,23], pollVotes:418,
  qs:[{t:'Como comissionar a equipe sem incentivar desconto?',a:'Marcos T. · Varejo',v:87,me:false},{t:'Funciona para serviço B2B ou só varejo?',a:'Anônimo',v:52,me:false},{t:'Qual o primeiro indicador para olhar?',a:'Renata S. · Saúde',v:31,me:false}],
  upv:new Set(), connected:new Set(), contacts:14, meetings:[], photos:false, hubSent:false,
  onb:{seg:'Tecnologia',busca:new Set(['Sócios / investidores','Clientes B2B']),fat:'1M a 5M'},
  selfie:false, mapMode:'2d', mapFilter:'Tudo', route:null, sponsorLead:false, notifs:3, cadernoGen:false,
  pay:JSON.parse(JSON.stringify(PAY))
};

/* ---------------- motor de navegação ---------------- */
const S={}; let app, stack=[], curTab=null, busy=false;
function build(name,p){
  const d=S[name]; const el=document.createElement('div');
  el.className='page '+(d.cls||'')+(d.tab?'':' notab');
  el.innerHTML=`<div class="sc">${d.html(p)}</div>`+(d.over?d.over(p):'');
  $$('.rv',el).forEach((e,i)=>e.style.setProperty('--i',Math.min(i,14)));
  return el;
}
function mount(name,p,el){const d=S[name]; d.init&&d.init(el,p)}
function cur(){return stack[stack.length-1]}
function go(name,p){
  if(busy)return; busy=true;
  const prev=cur(); const el=build(name,p); app.insertBefore(el,$('.tb',app));
  el.classList.add('in-r'); prev&&prev.el.classList.add('out-l');
  stack.push({name,p,el}); mount(name,p,el); updTab();
  setTimeout(()=>{if(prev){prev.el.style.visibility='hidden';prev.el.classList.remove('out-l')} el.classList.remove('in-r'); busy=false},500);
}
function present(name,p){
  if(busy)return; busy=true;
  const el=build(name,p); el.classList.add('in-up'); app.insertBefore(el,$('.tb',app));
  stack.push({name,p,el,modal:true}); mount(name,p,el); updTab();
  setTimeout(()=>{el.classList.remove('in-up');stack[stack.length-2]&&(stack[stack.length-2].el.style.visibility='hidden');busy=false},550);
}
function back(){
  if(busy||stack.length<2)return; busy=true;
  if(cur().name==='boleto'){st._quitar=false;st.bmode='boleto'}
  const c0=stack.pop(), prev=cur(); prev.el.style.visibility='';
  if(c0.modal){c0.el.classList.add('out-down')} else {c0.el.classList.add('out-r');prev.el.classList.add('in-l')}
  refresh(prev,true); updTab();
  setTimeout(()=>{c0.el.remove();prev.el.classList.remove('in-l');busy=false},c0.modal?450:500);
}
function closeAll(){while(stack.length>1){const c=stack.pop();c.el.remove()} cur().el.style.visibility='';refresh(cur(),true);updTab()}
function tab(name){
  if(busy)return;
  closeSheet(true);
  if(stack.length===1&&stack[0].name===name){const sc=$('.sc',cur().el);sc.scrollTo({top:0,behavior:'smooth'});return}
  stack.forEach(s=>s.el.remove()); stack=[];
  const el=build(name); el.classList.add('fade-in'); app.insertBefore(el,$('.tb',app));
  stack=[{name,el}]; curTab=name; mount(name,null,el); updTab();
  setTimeout(()=>el.classList.remove('fade-in'),400);
}
function reset(name){stack.forEach(s=>s.el.remove());stack=[];const el=build(name);el.classList.add('fade-in');app.insertBefore(el,$('.tb',app));stack=[{name,el}];mount(name,null,el);updTab()}
function refresh(entry=cur(),quiet){
  if(!entry)return; const d=S[entry.name]; const sc=$('.sc',entry.el); const y=sc?sc.scrollTop:0;
  entry.el.innerHTML=`<div class="sc">${d.html(entry.p)}</div>`+(d.over?d.over(entry.p):'');
  $$('.rv,.pop',entry.el).forEach(e=>{e.style.animation='none'});
  const sc2=$('.sc',entry.el); if(sc2)sc2.scrollTop=y; d.init&&d.init(entry.el,entry.p,true);
}
const TABS=[['home','home','Início'],['agenda','cal','Agenda'],['mapa','map','Mapa'],['conexoes','users','Conexões'],['voce','user','Você']];
function updTab(){
  const t=cur(); const tb=$('.tb',app); if(!t)return;
  const show=S[t.name].tab; tb.classList.toggle('hide',!show);
  if(show){curTab=t.name}
  const idx=TABS.findIndex(x=>x[0]===curTab);
  $$('button',tb).forEach((b,i)=>b.classList.toggle('on',i===idx));
  const b=$$('button',tb)[idx]; if(b){$('.pill',tb).style.transform=`translateX(${b.offsetLeft}px)`}
}

/* ---------------- utilidades de UI ---------------- */
function toast(msg,ic='check'){const o=$('.toast',app);o&&o.remove();const t=document.createElement('div');t.className='toast';t.innerHTML=I(ic,18,2)+msg;app.appendChild(t);setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300)},2200)}
function pushNote(title,body,fn){const t=document.createElement('button');t.className='push';t.innerHTML=`<div class="ico"><img src="img/logo-hub.png"></div><div style="flex:1;text-align:left"><div style="display:flex;justify-content:space-between"><b style="font-size:14px">${title}</b><span class="t-s">agora</span></div><div style="font-size:13.5px;color:#d8d8dc;margin-top:2px">${body}</div></div>`;t.onclick=()=>{t.classList.add('out');setTimeout(()=>t.remove(),400);fn&&fn()};app.appendChild(t);setTimeout(()=>{if(t.isConnected){t.classList.add('out');setTimeout(()=>t.remove(),400)}},5200)}
function sheet(html,cls=''){closeSheet(true);const s=document.createElement('div');s.className='scrim';s.onclick=()=>closeSheet();const sh=document.createElement('div');sh.className='sheet '+cls;sh.innerHTML='<div class="grab"></div>'+html;$$('.rv',sh).forEach((e,i)=>e.style.setProperty('--i',i));app.appendChild(s);app.appendChild(sh);return sh}
function closeSheet(now){const s=$('.scrim',app),sh=$('.sheet',app);if(!sh)return;if(now){s&&s.remove();sh.remove();return}s.classList.add('out');sh.classList.add('out');setTimeout(()=>{s.remove();sh.remove()},350)}
function confetti(){const c=document.createElement('div');c.className='confetti';const cols=['#D4C08E','#F5E6C4','#A68F5E','#fff','#32D74B'];for(let i=0;i<70;i++){const e=document.createElement('i');e.style.left=Math.random()*100+'%';e.style.background=cols[i%5];e.style.animationDuration=(1.6+Math.random()*1.6)+'s';e.style.animationDelay=Math.random()*.4+'s';e.style.transform=`rotate(${Math.random()*360}deg)`;c.appendChild(e)}app.appendChild(c);setTimeout(()=>c.remove(),3600)}
function mission(k,label){if(st.done.has(k))return;const m=MISSIONS.find(x=>x.k===k);st.done.add(k);st.pts+=m.p;setTimeout(()=>toast(`Missão concluída · <span class="gold">+${m.p} pts</span>`,'trophy'),label?2400:600)}
function seg(el){const s=$('.seg .on',el)||null;$$('.seg',el).forEach(sg=>{const on=$('button.on',sg),sl=$('.sl',sg);if(on&&sl){sl.style.width=on.offsetWidth+'px';sl.style.transform=`translateX(${on.offsetLeft-4}px)`}})}
function countUp(el,to,ms=1200){const from=+el.dataset.from||0;const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/ms);const e=1-Math.pow(1-k,3);el.textContent=Math.round(from+(to-from)*e);if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
function navbar(title,right=''){return `<div class="pad nav rv"><button class="ib" onclick="back()">${I('back')}</button><div class="h-s">${title}</div>${right}</div>`}
function closebar(title,right=''){return `<div class="pad nav rv"><button class="ib" onclick="back()">${I('x')}</button><div class="h-s" style="text-align:center">${title}</div>${right||'<div style="width:40px"></div>'}</div>`}
const QR=`<svg viewBox="0 0 29 29" width="100%" height="100%" shape-rendering="crispEdges"><g fill="#000"><path d="M0 0h7v7H0zM22 0h7v7h-7zM0 22h7v7H0z"/></g><g fill="#fff"><path d="M1 1h5v5H1zM23 1h5v5h-5zM1 23h5v5H1z"/></g><g fill="#000"><path d="M2 2h3v3H2zM24 2h3v3h-3zM2 24h3v3H2zM9 1h2v2H9zM12 0h1v4h-1zM15 2h3v1h-3zM9 5h4v1H9zM16 5h2v3h-2zM19 1h1v4h-1zM8 9h3v2H8zM13 8h2v3h-2zM17 10h4v1h-4zM23 9h2v3h-2zM1 9h4v1H1zM2 12h3v2H2zM6 11h2v4H6zM10 13h4v1h-4zM16 13h1v4h-1zM19 14h3v2h-3zM25 13h3v1h-3zM9 16h2v3H9zM12 17h3v2h-3zM1 16h3v2H1zM5 18h2v1H5zM18 18h1v3h-1zM21 17h4v1h-4zM26 16h2v4h-2zM9 21h4v1H9zM14 22h2v4h-2zM20 21h3v3h-3zM9 24h2v4H9zM12 26h1v3h-1zM17 24h2v2h-2zM24 23h2v2h-2zM22 26h3v2h-3zM27 25h2v4h-2zM18 27h2v2h-2z"/></g></svg>`;
function paidCount(){return st.pay.parcelas.filter(p=>p.st==='paid').length}
function payStatus(){const pc=paidCount(),n=st.pay.parcelas.length;const open=st.pay.parcelas.find(p=>p.st==='open');return pc===n?{t:'Quitado',c:'paid',s:'Pagamento concluído'}:open?{t:`${pc} de ${n} pagas`,c:'open',s:`Boleto ${open.n}/${n} vence ${open.venc.slice(0,5)}`}:{t:`${pc} de ${n} pagas`,c:'paid',s:'Em dia'}}

/* ================= TELAS ================= */

/* ---- entrada ---- */
S.welcome={cls:'full',html:()=>`<div class="splash"></div><div class="splash-sh"></div>
 <div style="position:absolute;left:24px;right:24px;bottom:54px;z-index:2">
  <img src="img/logo.png" class="rv" style="height:64px;margin-bottom:28px">
  <div class="mono rv">Experience · 2027</div>
  <div class="h-xl rv" style="font-size:40px;margin-top:12px">Em qual liga<br>você vai<br><span class="gold">jogar?</span></div>
  <p class="t rv" style="margin:16px 0 28px;color:#c9c9cd">O maior encontro de empresários do Norte de Minas, na palma da mão.</p>
  <button class="btn g rv" onclick="go('login')">Entrar com meu ingresso</button>
  <button class="btn o rv" style="margin-top:10px" onclick="go('login',{qr:1})">${I('qr',18)}Escanear QR do ingresso</button>
  <p class="t-s rv" style="text-align:center;margin-top:16px">Ainda não tem ingresso? <span class="gold">Garantir vaga</span></p>
 </div>`};

S.login={html:p=>`${navbar('')}
 <div class="pad">
  <div class="h-l rv" style="margin-top:6px">Confirme seu acesso</div>
  <p class="t rv" style="margin-top:8px">Enviamos um código de 4 dígitos para <span style="color:var(--txt)">fi•••@zontix.com.br</span>, o e-mail do seu ingresso.</p>
  <div class="otp rv" style="margin-top:28px">${[0,1,2,3].map(i=>`<span data-i="${i}" class="${i===0?'c':''}"></span>`).join('')}</div>
  <p class="t-s rv" style="margin-top:14px">Reenviar em <span id="rs" style="color:var(--txt)">0:30</span> · <span class="gold">Receber por WhatsApp</span></p>
  <button class="chip gl rv" id="paste" style="margin-top:16px" onclick="otpFill()">${I('mail',15)}Usar código do e-mail · 4821</button>
  <div class="keypad rv">${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(k=>k===''?'<span></span>':`<button onclick="otpKey('${k}')">${k}</button>`).join('')}</div>
 </div>`,
 init:el=>{st._otp='';let s=30;const iv=setInterval(()=>{const r=$('#rs',el);if(!r){clearInterval(iv);return}s--;r.textContent='0:'+String(Math.max(s,0)).padStart(2,'0');if(s<=0)clearInterval(iv)},1000)}};
function otpKey(k){if(k==='⌫'){st._otp=st._otp.slice(0,-1)}else if(st._otp.length<4){st._otp+=k}otpDraw()}
function otpFill(){const code='4821';let i=0;st._otp='';const iv=setInterval(()=>{st._otp+=code[i++];otpDraw();if(i>=4)clearInterval(iv)},160)}
function otpDraw(){const el=cur().el;$$('.otp span',el).forEach((s,i)=>{s.textContent=st._otp[i]||'';s.classList.toggle('c',i===st._otp.length);s.classList.toggle('f',i<st._otp.length)});if(st._otp.length===4){setTimeout(()=>{toast('Acesso confirmado','faceid');go('onb1')},450)}}

const onbHead=(n,t,sub)=>`<div class="pad nav rv"><button class="ib" onclick="back()">${I('back')}</button><div class="prog" style="flex:1"><i style="width:${n*33.3}%"></i></div><span class="t-s">${n} de 3</span></div>
 <div class="pad"><div class="h-l rv" style="margin-top:6px">${t}</div><p class="t rv" style="margin-top:8px">${sub}</p></div>`;
S.onb1={html:()=>`${onbHead(1,'Sua foto, suas fotos','Com uma selfie, a gente encontra você nas fotos oficiais do evento e mostra seu rosto para quem você conhecer.')}
 <div class="pad">
  <button class="selfie rv ${st.selfie?'done':''}" onclick="selfie()" style="display:flex">${st.selfie?`<div class="av" style="width:150px;height:150px;font-size:48px;background:${C.gold}">FA</div>`:I('camera',40,1.4)}</button>
  <p class="t-s rv" style="text-align:center;margin-top:14px">${st.selfie?'<span class="ok">Foto salva</span> · usada só dentro do app':'Toque para tirar a selfie'}</p>
 </div>
 <div class="bottom"><button class="btn w ${st.selfie?'':'dis'}" onclick="go('onb2')">Continuar</button><button class="t-s" style="display:block;margin:12px auto 0" onclick="go('onb2')">Fazer depois</button></div>`};
function selfie(){if(st.selfie)return;const b=$('.selfie',cur().el);b.innerHTML='<div class="scan"></div>'+I('faceid',54,1.4);b.style.color='var(--gold)';setTimeout(()=>{st.selfie=true;refresh()},1600)}
S.onb2={html:()=>{const o=st.onb;const ch=(g,v,multi)=>{const on=multi?o[g].has(v):o[g]===v;return `<button class="chip ${on?'on':''}" onclick="onbSel('${g}','${v}',${multi})">${on&&multi?I('check',15,2.2):''}${v}</button>`};
 return `${onbHead(2,'O que você veio buscar?','Usamos isso para indicar as pessoas certas para você conhecer no evento.')}
 <div class="pad">
  <div class="lbl rv">Seu segmento</div><div class="opt rv">${['Varejo','Tecnologia','Agro','Saúde','Indústria','Construção','Serviços'].map(v=>ch('seg',v)).join('')}</div>
  <div class="lbl rv">Quero encontrar</div><div class="opt rv">${['Sócios / investidores','Fornecedores','Clientes B2B','Mentores','Talentos'].map(v=>ch('busca',v,true)).join('')}</div>
  <div class="lbl rv">Faturamento anual</div><div class="opt rv">${['Até 1M','1M a 5M','5M a 15M','15M+'].map(v=>ch('fat',v)).join('')}</div>
 </div>
 <div class="bottom"><button class="btn w" onclick="go('onb3')">Continuar</button></div>`}};
function onbSel(g,v,m){if(m){st.onb[g].has(v)?st.onb[g].delete(v):st.onb[g].add(v)}else st.onb[g]=v;refresh()}
S.onb3={html:()=>`${onbHead(3,'Não perca o que importa','Escolha o que pode te avisar. Dá para mudar depois em Você › Notificações.')}
 <div class="pad"><div class="card rv" style="margin-top:22px">
  ${[['clock','Lembrete 10 min antes das sessões salvas',1],['users','Pedidos de conexão e reuniões',1],['money','Pagamento do ingresso (boletos e Pix)',1],['star','Novidades dos patrocinadores',0]].map((x,i)=>`${i?'<div class="hr"></div>':''}<div class="li">${I(x[0],20)}<span style="flex:1;font-size:14.5px">${x[1]}</span><span class="tg ${x[2]?'on':''}" onclick="this.classList.toggle('on')"></span></div>`).join('')}
 </div></div>
 <div class="bottom"><button class="btn g" onclick="finishOnb()">Ativar e entrar</button></div>`};
function finishOnb(){reset('home');curTab='home';updTab();setTimeout(()=>toast('Bem-vindo à T3 Experience, Filipe','spark'),500);if(!DEMO)setTimeout(()=>pushNote('Gestão à vista em 10 min','Sala Gestão · toque para ver a rota',()=>{tab('mapa');setTimeout(()=>routeTo('gestao'),400)}),7000)}

/* ---- início ---- */
S.home={tab:1,html:()=>{const ps=payStatus();const mine=SESS[0].filter(s=>st.saved.has(s.id)&&!s.live).slice(0,3);const sug=Object.entries(PEOPLE).slice(0,3);
 return `<div class="pad rv" style="display:flex;align-items:center;justify-content:space-between;margin:8px 0 18px">
  <img src="img/logo-hub.png" style="height:26px">
  <div style="display:flex;gap:8px"><button class="ib" onclick="notifs()">${I('bell')}${st.notifs?'<span class="dot"></span>':''}</button><button class="ib gd" onclick="present('ticket')">${I('ticket')}</button></div></div>
 <div class="pad rv" style="margin-bottom:16px"><div class="t">Bom dia, Filipe · Dia 1</div><div class="h-l" style="margin-top:2px">Abertura acontecendo agora</div></div>
 <button class="hero lv rv press" onclick="present('live','s1')"><div class="in">
  <span class="live" style="background:rgba(0,0,0,.55);padding:6px 10px;border-radius:12px;backdrop-filter:blur(8px)">AO VIVO · PALCO LIGA</span>
  <div class="h-m" style="margin-top:10px;font-size:21px">Em qual liga sua empresa vai jogar em 2027?</div>
  <div class="t" style="color:#d4d4d8;margin-top:4px">Rafael Andrade · 612 assistindo</div>
  <div style="display:flex;gap:8px;margin-top:14px"><span class="btn g sm">${I('msg',16)}Participar</span><span class="btn sm" style="background:rgba(255,255,255,.12);font-weight:500">Próxima em&nbsp;<b id="cdn" style="font-variant-numeric:tabular-nums">1:17:42</b></span></div>
 </div></button>
 ${ps.c==='open'?`<div class="pad rv" style="margin-top:14px"><button class="alert press" onclick="go('pagamentos')">${I('receipt',22)}<div style="flex:1"><div class="h-s" style="font-size:14px">Boleto 2 de 3 disponível</div><div class="t-s">R$ 990,00 · vence 15/05 · pague por boleto ou Pix</div></div>${I('chev',16)}</button></div>`:''}
 <div class="pad">
  <div class="sec rv"><h3>Atalhos</h3></div>
  <div class="qa rv">
   <button onclick="present('ticket')"><span>${I('qr',24)}</span>Ingresso</button>
   <button onclick="go('pagamentos')"><span>${I('money',24)}${ps.c==='open'?'<i class="dot"></i>':''}</span>Pagamentos</button>
   <button onclick="present('cartao')"><span>${I('swap',24)}</span>Trocar cartão</button>
   <button onclick="go('fotos')"><span>${I('image',24)}</span>Minhas fotos</button>
  </div>
  <div class="sec rv"><h3>Sua agenda hoje</h3><button onclick="st.mode='mine';tab('agenda')">Ver tudo</button></div>
  ${mine.map(s=>`<button class="card press rv" style="display:flex;gap:14px;padding:14px 16px;margin-bottom:10px;width:100%;text-align:left;align-items:center" onclick="go('session','${s.id}')"><div style="font:700 14px Montserrat;color:var(--gold);width:44px">${s.h}</div><div style="flex:1"><div class="h-s" style="font-size:14.5px">${s.t}</div><div class="t-s" style="margin-top:3px">${ROOMS[s.room]} · ${s.dur} min</div></div>${I('chev',16)}</button>`).join('')}
  <div class="sec rv"><h3>Pessoas para conhecer</h3><button onclick="tab('conexoes')">Ver todas</button></div>
 </div>
 <div class="hs rv">${sug.map(([k,p])=>`<button class="card press" style="width:200px;padding:16px;text-align:left" onclick="go('perfil','${k}')">${av(p.av,p.c,44)}<div class="h-s" style="font-size:15px;margin-top:12px">${p.n}</div><div class="t-s">${p.seg} · ${p.city.split(' ·')[0]}</div><div style="margin-top:10px;font:800 15px Montserrat;color:var(--gold)">${p.pct}% <span class="t-s" style="font:500 11px Inter">afinidade</span></div></button>`).join('')}</div>
 <div class="pad"><div class="sec rv"><h3>Patrocinadores</h3><button onclick="tab('mapa')">No mapa</button></div></div>
 <div class="hs rv">${SPONS.map(s=>`<div class="sp" style="background:${s[1]};color:${s[2]}">${s[0]}</div>`).join('')}</div>
 <div class="pad"><button class="card press rv" style="margin-top:22px;padding:18px;width:100%;text-align:left;display:flex;gap:14px;align-items:center;background:linear-gradient(150deg,rgba(212,192,142,.14),var(--s1) 60%);border-color:rgba(212,192,142,.3)" onclick="go('hub')"><img src="img/logo.png" style="height:34px"><div style="flex:1"><div class="h-s" style="font-size:14.5px">O jogo continua depois do evento</div><div class="t-s">Conheça a comunidade T3 Hub</div></div>${I('chev',16)}</button></div>`},
 init:(el)=>{let s=1*3600+17*60+42;clearInterval(st._cd);st._cd=setInterval(()=>{const c=$('#cdn');if(!c)return;s--;c.textContent=`${Math.floor(s/3600)}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`},1000)}};
function notifs(){st.notifs=0;refresh();const ps=payStatus();sheet(`<div class="h-m" style="margin:14px 0 12px">Notificações</div>
 ${[[ 'receipt','Boleto 2 de 3 disponível','R$ 990,00 · vence 15/05','go(\'pagamentos\')',ps.c==='open'],['users','Pedro Salles quer se conectar','Agro · 92% de afinidade',"go('perfil','ps')",1],['clock','Gestão à vista começa às 10:30','Sala Gestão · você salvou esta sessão',"go('session','s2')",1],['trophy','Você subiu para a Liga Prata','Faltam 360 pts para a Ouro',"go('liga')",1]].filter(x=>x[4]).map(x=>`<button class="li rv" style="padding:14px 0" onclick="closeSheet();setTimeout(()=>{${x[3]}},300)"><span class="ib" style="color:var(--gold)">${I(x[0])}</span><div style="flex:1"><div style="font-size:14.5px;font-weight:600">${x[1]}</div><div class="t-s">${x[2]}</div></div>${I('chev',16)}</button>`).join('<div class="hr"></div>')}`)}

/* ---- agenda ---- */
S.agenda={tab:1,html:()=>{let list=SESS[st.day];if(st.mode==='mine')list=list.filter(s=>st.saved.has(s.id));if(st.track!=='Todas')list=list.filter(s=>s.track===st.track);
 const meets=st.mode==='mine'?st.meetings.filter(m=>st.day===0):[];
 const nMine=SESS[st.day].filter(s=>st.saved.has(s.id)).length+(st.day===0?st.meetings.length:0);
 return `<div class="pad"><div class="ttl rv"><h2>Agenda</h2><button class="ib" onclick="toast('Busca por tema, palestrante ou sala','search')">${I('search')}</button></div>
 <div class="days rv">${EVENT.dias.map((d,i)=>`<button class="${i===st.day?'on':''}" onclick="st.day=${i};refresh()"><small>${d.d}</small><b>${d.n}</b></button>`).join('')}</div>
 <div class="seg rv" style="margin-top:14px"><div class="sl"></div><button class="${st.mode==='prog'?'on':''}" onclick="st.mode='prog';refresh()">Programação</button><button class="${st.mode==='mine'?'on':''}" onclick="st.mode='mine';refresh()">Minha agenda · ${nMine}</button></div>
 <div class="chips rv" style="margin:14px -20px 14px">${['Todas','Palco Liga','Sala Gestão','Workshops','Networking'].map(t=>`<button class="chip ${st.track===t?'on':''}" onclick="st.track='${t}';refresh()">${t}</button>`).join('')}</div>
 ${meets.map(m=>`<div class="ses rv"><div class="h">${m.h}</div><div class="card mine" style="flex:1;padding:14px 16px;border-color:rgba(212,192,142,.3)"><span class="chip gl" style="height:24px;font-size:11px">Reunião</span><div class="h-s" style="margin-top:8px">${m.with}</div><div class="meta"><span>${I('pin',13)}Lounge de Negócios · Mesa 7</span></div></div></div>`).join('')}
 ${list.length?list.map(s=>sesCard(s)).join(''):`<div class="empty rv">${I('bookmark',28)}<p style="margin-top:10px">Nada salvo ${st.track!=='Todas'?'nesta trilha':'neste dia'} ainda.<br>Toque no marcador de uma sessão para montar sua agenda.</p></div>`}
 </div>`},init:el=>seg(el)};
function sesCard(s){const on=st.saved.has(s.id);return `<div class="ses rv"><div class="h">${s.h}</div><button class="card press ${s.live?'lv':''} ${on&&!s.live?'mine':''}" onclick="${s.live?`present('live','${s.id}')`:`go('session','${s.id}')`}">
 ${s.live?'<span class="live">AO VIVO</span>':''}<div class="h-s" style="${s.live?'margin-top:8px':''};font-size:15.5px">${s.t}</div>
 ${s.spk?`<div class="spk">${av(s.av,s.c,24,10)}<span class="t-s">${s.spk} · ${s.role}</span></div>`:''}
 <div class="meta"><span>${I('clock',13)}${s.dur} min</span><span>${I('pin',13)}${ROOMS[s.room]}</span>${s.live?`<span>${I('users',13)}${s.aud} assistindo</span>`:''}${s.vagas?`<span class="gold">${s.vagas} vagas restantes</span>`:''}</div>
 <span class="bm ${on?'on':''}" onclick="event.stopPropagation();save('${s.id}',this)">${I('bookmark',20)}</span></button></div>`}
function save(id,elb){const on=st.saved.has(id);on?st.saved.delete(id):st.saved.add(id);if(elb){elb.classList.toggle('on',!on);elb.classList.add('bump');setTimeout(()=>elb.classList.remove('bump'),250)}toast(on?'Removida da sua agenda':'Salva · lembrete 10 min antes',on?'x':'bookmark');setTimeout(()=>refresh(),on?300:600)}

S.session={cls:'full',html:id=>{const s=sess(id);const on=st.saved.has(id);return `<div class="cover" style="${s.room==='palco'?'':'background-image:url(img/f7.jpg)'}"><div class="top"><button class="ib" onclick="back()">${I('back')}</button><div style="display:flex;gap:8px"><button class="ib" onclick="toast('Link da sessão copiado','link')">${I('share')}</button></div></div></div>
 <div class="pad" style="margin-top:-80px;position:relative;z-index:4">
  <span class="chip gl dk rv">${ROOMS[s.room]} · ${s.h} · ${s.dur} min</span>
  <div class="h-l rv" style="margin-top:12px">${s.t}</div>
  ${s.spk?`<div class="card rv" style="display:flex;gap:12px;align-items:center;padding:12px 14px;margin-top:16px">${av(s.av,s.c,44)}<div style="flex:1"><div class="h-s" style="font-size:15px">${s.spk}</div><div class="t-s">${s.role}</div></div></div>`:''}
  <p class="t rv" style="margin-top:16px">${s.desc}</p>
  ${s.tags?`<div class="rv" style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">${s.tags.map(t=>`<span class="chip">${t}</span>`).join('')}</div>`:''}
  ${s.vagas?`<div class="card rv" style="margin-top:16px;padding:14px 16px;display:flex;gap:12px;align-items:center"><span class="gold">${I('users')}</span><div style="flex:1"><div class="h-s" style="font-size:14px">${s.vagas} vagas restantes</div><div class="t-s">Salvar garante sua vaga</div></div></div>`:''}
  <div class="card rv" style="margin-top:12px;padding:14px 16px;display:flex;gap:12px;align-items:center"><span class="gold">${I('note')}</span><div style="flex:1"><div class="h-s" style="font-size:14px">Anotações e resumo com IA</div><div class="t-s">Ficam no seu caderno depois da sessão</div></div></div>
 </div>
 <div class="fadeb"></div>
 <div class="bottom" style="display:flex;gap:10px">${s.room!=='externo'?`<button class="btn o" style="flex:1" onclick="routeFrom('${s.room}')">${I('pin',18)}Como chegar</button>`:''}<button class="btn ${on?'o':'g'}" style="flex:1.3" onclick="save('${id}')">${on?I('check',18,2)+'Na minha agenda':I('bookmark',18)+'Salvar na agenda'}</button></div>`}};
function routeFrom(room){closeAll();tab('mapa');setTimeout(()=>routeTo(room),450)}

/* ---- ao vivo ---- */
S.live={html:id=>{const s=sess(id||'s1');const L=st.liveTab||'q';return `<div class="pad"><div class="nav rv"><button class="ib" onclick="back()">${I('x')}</button><div style="flex:1"><span class="live">AO VIVO · ${ROOMS[s.room].toUpperCase()}</span><div class="h-s" style="font-size:14px;margin-top:3px">${s.t}</div></div></div>
 <div class="card rv" style="padding:12px 14px;display:flex;gap:12px;align-items:center">${av(s.av,s.c,40)}<div style="flex:1"><div class="h-s" style="font-size:14px">${s.spk}</div><div class="t-s">${s.aud} pessoas na sala</div></div><span class="chip gl" style="height:28px">${I('heart',14)}Aplaudir</span></div>
 <div class="seg rv" style="margin-top:14px"><div class="sl"></div><button class="${L==='q'?'on':''}" onclick="st.liveTab='q';refresh()">Perguntas</button><button class="${L==='e'?'on':''}" onclick="st.liveTab='e';refresh()">Enquete</button><button class="${L==='n'?'on':''}" onclick="st.liveTab='n';refresh()">Anotar</button></div>
 ${L==='e'?pollHtml():L==='n'?noteHtml():qHtml(s)}</div>
 ${L==='q'?`<div class="bottom"><div class="inp">${I('msg',18)}<input id="qin" placeholder="Pergunte ao ${s.spk.split(' ')[0]}…" style="margin-left:10px" onkeydown="if(event.key==='Enter')sendQ()"><button class="s" onclick="sendQ()">${I('send',18)}</button></div></div>`:''}`},init:el=>seg(el)};
function pollHtml(){const v=st.voted;const opts=['Equipe comercial','Preço / margem','Geração de leads'];return `<div class="card rv" style="margin-top:16px;padding:16px"><div class="mono" style="font-size:10px">Enquete ao vivo</div><div class="h-s" style="margin:8px 0 14px">Qual seu maior gargalo de vendas hoje?</div>
 <div class="poll ${v!==null?'voted':''}">${opts.map((o,i)=>`<button class="${v===i?'me':''}" onclick="vote(${i})"><i style="width:${v!==null?st.poll[i]:0}%"></i><span>${o}</span><span class="pc">${st.poll[i]}%</span></button>`).join('')}</div>
 <div class="t-s">${v!==null?`${st.pollVotes} votos · resultado no telão`:'Toque para votar · resultado aparece no telão'}</div></div>`}
function vote(i){if(st.voted!==null)return;st.voted=i;st.pollVotes++;st.poll=[47,30,23];if(i===1)st.poll=[45,32,23];if(i===2)st.poll=[45,31,24];const p=$('.poll',cur().el);p.classList.add('voted');$$('button',p).forEach((b,k)=>{b.classList.toggle('me',k===i);$('i',b).style.width=st.poll[k]+'%';$('.pc',b).textContent=st.poll[k]+'%'});mission('enquete',1)}
function qHtml(){const qs=[...st.qs].sort((a,b)=>b.v-a.v);return `<div class="sec rv" style="margin-top:20px"><h3>Mais votadas</h3><span class="t-s">${qs.length} perguntas</span></div>
 <div class="card rv" id="qlist">${qs.map((q,i)=>`${i?'<div class="hr"></div>':''}<div class="q"><button class="vote ${st.upv.has(q.t)?'on':''}" onclick="upv(${st.qs.indexOf(q)})">${I('chev',16,2.2).replace('<svg','<svg style="transform:rotate(-90deg)"')}${q.v}</button><div><div style="font-size:14px;line-height:1.4">${q.t}</div><div class="t-s" style="margin-top:6px">${q.a}${q.me?' · <span class="gold">enviada ao moderador</span>':''}</div></div></div>`).join('')}</div><div style="height:90px"></div>`}
function upv(i){const q=st.qs[i];if(st.upv.has(q.t)){st.upv.delete(q.t);q.v--}else{st.upv.add(q.t);q.v++}refresh()}
function sendQ(){const i=$('#qin');const t=(i&&i.value.trim())||'Isso vale para empresa de serviço com equipe pequena?';st.qs.push({t,a:'Você',v:1,me:true});st.upv.add(t);refresh();toast('Pergunta enviada ao moderador','send');mission('pergunta',1)}
function noteHtml(){return `<div class="card rv" style="margin-top:16px;padding:16px;min-height:220px"><div class="t-s">09:24 · ${sess('s1').t}</div><div style="font-size:15px;line-height:1.55;margin-top:10px;color:#e4e4e8">Ambiente define direção. Rever com quem estou andando: listar 5 empresários para conversar este mês.</div><div class="typing" style="font-size:15px;margin-top:6px;color:#e4e4e8"></div></div>
 <div style="display:flex;gap:10px;margin-top:12px" class="rv"><button class="btn o" style="flex:1" onclick="toast('Gravando nota de voz…','mic')">${I('mic',18)}Nota de voz</button><button class="btn o" style="flex:1" onclick="go('caderno')">${I('note',18)}Abrir caderno</button></div>`}

S.caderno={html:()=>`${navbar('Meu caderno',`<button class="ib" onclick="toast('Plano enviado para seu e-mail','mail')">${I('share')}</button>`)}
 <div class="pad"><div class="mono rv">Dia 1 · 4 sessões</div><div class="h-l rv" style="margin-top:10px">O que levar para segunda-feira</div>
 <div class="card rv" style="margin-top:18px;padding:16px;background:linear-gradient(160deg,rgba(212,192,142,.12),var(--s1) 55%);border-color:rgba(212,192,142,.25)">
  <div style="display:flex;gap:8px;align-items:center;color:var(--gold);font-size:13px;font-weight:600">${I('ai',16)}Plano de ação gerado com IA</div>
  <div id="aiout" style="margin-top:14px">${st.cadernoGen?aiBul():'<div class="shimmer" style="width:92%"></div><div class="shimmer" style="width:78%"></div><div class="shimmer" style="width:85%"></div>'}</div></div>
 <div class="sec rv"><h3>Suas anotações</h3><button onclick="toast('Nova anotação','edit')">+ Nova</button></div>
 <div class="card rv" style="padding:14px 16px"><div class="t-s">14:22 · Vender mais sem baixar preço</div><div style="font-size:14px;margin-top:6px;line-height:1.45">Ligar para o Pedro (Agro) sobre logística reversa. Pegar o contato no estande.</div></div>
 <div class="card rv" style="padding:14px 16px;margin-top:10px;display:flex;gap:12px;align-items:center"><span class="ib" style="color:var(--gold)">${I('mic')}</span><div><div class="h-s" style="font-size:14px">Nota de voz · 0:42</div><div class="t-s">Transcrita automaticamente</div></div></div></div>
 <div class="bottom"><button class="btn w" onclick="toast('Plano enviado para seu e-mail','mail')">${I('mail',18)}Enviar plano por e-mail</button></div>`,
 init:(el,p,re)=>{if(st.cadernoGen||re)return;setTimeout(()=>{st.cadernoGen=true;const o=$('#aiout',el);if(!o)return;o.innerHTML='';const items=AI_ITEMS;let i=0;const next=()=>{if(i>=items.length)return;const d=document.createElement('div');d.className='bul';o.appendChild(d);typeIn(d,items[i++],next)};next()},1500)}};
const AI_ITEMS=['Rever comissão: pagar sobre margem, não sobre faturamento.','Painel semanal com 5 números, olhado toda segunda às 8h.','Ticket médio: testar combo nas 3 lojas de maior fluxo.','Marcar café com Pedro Salles (Agro) até sexta.'];
const aiBul=()=>AI_ITEMS.map(t=>`<div class="bul">${t}</div>`).join('');
function typeIn(el,txt,cb){let i=0;el.classList.add('typing');const iv=setInterval(()=>{el.textContent=txt.slice(0,++i);if(i>=txt.length){clearInterval(iv);el.classList.remove('typing');setTimeout(cb,150)}},18)}

/* ---- mapa ---- */
const RM={palco:[18,16,170,130],gestao:[200,16,142,62],vendas:[200,86,142,60],lounge:[18,162,80,70],cafe:[106,162,82,70],workshops:[200,162,142,110],estandes:[18,248,170,86]};
const RT={palco:[[180,395],[194,380],[194,80],[188,80]],gestao:[[180,395],[194,380],[194,47],[206,47]],vendas:[[180,395],[194,380],[194,116],[206,116]],workshops:[[180,395],[194,380],[194,217],[206,217]],lounge:[[180,395],[194,380],[194,240],[58,240],[58,232]],cafe:[[180,395],[194,380],[194,240],[147,240],[147,232]],estandes:[[180,395],[194,380],[194,290],[188,290]],foyer:[[180,395],[180,360]]};
const PINS=[{k:'Café',ic:'coffee',x:147,y:205,l:'Café'},{k:'Banheiros',ic:'wc',x:330,y:300,l:'Banheiros'},{k:'Banheiros',ic:'wc',x:40,y:350,l:'Banheiros'},{k:'Estandes',ic:'star',x:128,y:282,l:'Estande 12',big:1,fn:"sponsor()"},{k:'Estandes',ic:'star',x:52,y:282,l:'Estande 3'},{k:'Salas',ic:'help',x:290,y:360,l:'Atendimento'}];
S.mapa={tab:1,cls:'full',html:()=>{const r=st.route;return `<div class="mapwrap">
 <div class="plan ${st.mapMode==='3d'?'d3':''}"><div class="shell"></div>
  ${Object.entries(RM).map(([k,b])=>`<button class="room ${k==='palco'?'main':''} ${r===k&&k!=='palco'?'hl':''}" style="left:${b[0]}px;top:${b[1]}px;width:${b[2]}px;height:${b[3]}px;${k==='estandes'?'align-items:flex-end;padding-bottom:6px':''}" onclick="roomSheet('${k}')">${ROOMS[k].toUpperCase()}</button>`).join('')}
  <div style="position:absolute;left:130px;top:350px;width:100px;height:40px;border:1px dashed #3a372f;border-radius:10px;display:flex;align-items:center;justify-content:center;font:600 9px Inter;color:#6a6a6e;letter-spacing:.1em">ENTRADA</div>
  ${r?`<svg class="route" viewBox="0 0 360 420" width="360" height="420"><path d="M${RT[r].map(p=>p.join(' ')).join(' L')}" fill="none" stroke="#D4C08E" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`:''}
  <div class="me-dot" style="left:180px;top:400px"></div>
  ${PINS.map(p=>`<button class="mpin ${p.big?'big':''} ${st.mapFilter!=='Tudo'&&st.mapFilter!==p.k?'hide':''}" style="left:${p.x}px;top:${p.y}px" onclick="${p.fn||`toast('${p.l}','pin')`}"><span>${I(p.ic,p.big?17:13)}</span>${p.l}</button>`).join('')}
 </div></div>
 <div class="mtop"><div style="text-align:center;font:600 16px Inter;margin-bottom:12px" class="rv">Mapa do evento</div>
  <div class="chips rv" style="margin:0 -16px;padding:0 16px">${[['Tudo'],['Banheiros','wc'],['Café','coffee'],['Estandes','star'],['Salas','door']].map(([k,ic])=>`<button class="chip ${st.mapFilter===k?'on':''}" onclick="st.mapFilter='${k}';refresh()">${ic?I(ic,14):''}${k}</button>`).join('')}</div></div>
 <div class="ctrl rv"><button class="${st.mapMode==='3d'?'on':''}" onclick="toggle3d(this)">${st.mapMode==='3d'?'2D':'3D'}</button><button onclick="toast('Camada de patrocinadores ativada','layers')">${I('layers',19)}</button><button style="color:var(--blue)" onclick="toast('Você está na entrada principal','locate')">${I('locate',19)}</button></div>
 ${r?`<div class="mcard"><div><div class="t-s">Rota até</div><div class="h-s" style="margin-top:2px">${ROOMS[r]} · ${r==='lounge'||r==='cafe'?'1':'2'} min a pé</div></div><button class="btn o sm" onclick="st.route=null;refresh()">Encerrar</button></div>`
  :`<div class="mcard"><div><div class="t-s">Próxima sessão salva · 10:30</div><div class="h-s" style="margin-top:2px">Sala Gestão · 2 min a pé</div></div><button class="btn g sm" onclick="routeTo('gestao')">Rota</button></div>`}`}};
function toggle3d(b){st.mapMode=st.mapMode==='3d'?'2d':'3d';$('.plan',cur().el).classList.toggle('d3',st.mapMode==='3d');b.classList.toggle('on',st.mapMode==='3d');b.textContent=st.mapMode==='3d'?'2D':'3D'}
function routeTo(room){st.route=room;refresh();const p=$('.route path');if(p){const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.style.animation='none';p.getBoundingClientRect();p.style.transition='stroke-dashoffset 1.2s cubic-bezier(.32,.72,0,1)';p.style.strokeDashoffset=0;setTimeout(()=>{p.style.transition='';p.style.strokeDasharray='';p.style.strokeDashoffset='';p.style.animation=''},1300)}}
function roomSheet(k){const now=allSess().filter(s=>s.room===k).slice(0,2);sheet(`<div style="margin-top:14px" class="rv"><div class="t-s">Sala</div><div class="h-m">${ROOMS[k]}</div></div>
 ${now.map(s=>`<button class="card rv press" style="margin-top:12px;padding:14px 16px;width:100%;text-align:left" onclick="closeSheet();setTimeout(()=>go('session','${s.id}'),300)"><div class="t-s">${s.h} · ${s.dur} min</div><div class="h-s" style="font-size:14.5px;margin-top:4px">${s.t}</div></button>`).join('')}
 <button class="btn g rv" style="margin-top:16px" onclick="closeSheet();routeTo('${k}')">${I('pin',18)}Traçar rota</button>`)}
function sponsor(){sheet(`<div style="display:flex;gap:14px;align-items:center;margin-top:18px" class="rv"><div style="width:56px;height:56px;border-radius:16px;background:#0f2238;color:#cfe0f3;display:flex;align-items:center;justify-content:center;font:800 12px Montserrat">AGRO</div><div style="flex:1"><div class="t-s">Patrocinador Ouro · Estande 12</div><div class="h-m">Agro Norte Máquinas</div></div></div>
 <div class="card rv" style="margin-top:16px;padding:14px 16px;display:flex;gap:12px;align-items:center;border-color:rgba(212,192,142,.3)"><span class="gold">${I('gift')}</span><div style="flex:1"><div class="h-s" style="font-size:14px">Oferta exclusiva do evento</div><div class="t-s">Diagnóstico de frota grátis para participantes</div></div></div>
 <div class="card rv" style="margin-top:10px;padding:14px 16px;display:flex;gap:12px;align-items:center"><span class="gold">${I('trophy')}</span><div style="flex:1"><div class="h-s" style="font-size:14px">Missão da Liga · +50 pts</div><div class="t-s">Visitar estandes · ${st.est} de 5</div></div></div>
 <div class="rv" style="display:flex;gap:10px;margin-top:18px"><button class="btn ${st.sponsorLead?'o':'o'}" style="flex:1" onclick="lead(this)">${st.sponsorLead?I('check',18,2)+'Contato enviado':'Deixar contato'}</button><button class="btn g" style="flex:1" onclick="closeSheet();routeTo('estandes')">${I('pin',18)}Ir até lá</button></div>`)}
function lead(b){if(st.sponsorLead)return;st.sponsorLead=true;st.est++;st.pts+=50;b.innerHTML=I('check',18,2)+'Contato enviado';toast('Contato enviado · <span class="gold">+50 pts</span>','trophy')}

/* ---- ingresso e pagamentos ---- */
S.ticket={html:()=>{const ps=payStatus();return `${closebar('Meu ingresso',`<button class="ib" onclick="toast('Ingresso compartilhado','share')">${I('share')}</button>`)}
 <div class="tk rv"><div class="top">
  <div style="display:flex;justify-content:space-between;align-items:center"><img src="img/logo-hub.png" style="height:22px"><span class="chip gl" style="height:26px;font-size:11px;font-weight:700;letter-spacing:.1em">PASSAPORTE PREMIUM</span></div>
  <div class="h-xl" style="font-size:22px;margin-top:20px">Filipe Amaral</div><div class="t-s" style="margin-top:4px">Zontix Tecnologia · Sócio-fundador</div>
  <div class="kv"><div><small>DIAS</small><b>13 a 15 · mai</b></div><div><small>ACESSO</small><b>Plenária + Lounge</b></div><div><small>LOCAL</small><b>Montes Claros · MG</b></div><div><small>Nº</small><b>T3X-27-0418</b></div></div>
 </div><div class="cut"></div>
 <div class="qrbox">${QR}</div>
 <p class="t-s" style="text-align:center;padding-bottom:22px">Aumente o brilho e aproxime da catraca</p></div>
 <button class="card paybar press rv" onclick="go('pagamentos')"><span class="st ${ps.c}" style="width:36px;height:36px;border-radius:18px;display:flex;align-items:center;justify-content:center">${I(ps.c==='paid'?'check':'receipt',18,2)}</span><div style="flex:1"><div class="h-s" style="font-size:14px">Pagamento · ${ps.t}</div><div class="t-s">${ps.s} · ingresso liberado</div></div>${I('chev',16)}</button>
 <div class="pad rv" style="margin-top:12px"><button class="btn w" onclick="toast('Adicionado à Wallet','wallet')">${I('wallet',18)}Adicionar à Wallet</button></div>`}};

S.pagamentos={html:()=>{const P=st.pay;const pc=paidCount(),n=P.parcelas.length;const pago=P.parcelas.filter(p=>p.st==='paid').reduce((a,p)=>a+p.v,0);const rest=P.total-pago;const open=P.parcelas.find(p=>p.st==='open');const R=38,CIR=2*Math.PI*R;
 return `${navbar('Pagamentos',`<button class="ib" onclick="toast('Abrindo conversa com o financeiro','whats')">${I('help')}</button>`)}
 <div class="pad">
  <div class="card rv" style="padding:18px;display:flex;gap:18px;align-items:center;background:linear-gradient(160deg,rgba(212,192,142,.1),var(--s1) 60%)">
   <div class="ring"><svg width="86" height="86"><circle cx="43" cy="43" r="${R}" stroke="#232326" stroke-width="7" fill="none"/><circle id="rg" cx="43" cy="43" r="${R}" stroke="${pc===n?'#32D74B':'#D4C08E'}" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="${CIR}" stroke-dashoffset="${CIR}" data-to="${CIR*(1-pc/n)}"/></svg><b>${pc}/${n}<small>PAGAS</small></b></div>
   <div style="flex:1"><div class="t-s">${P.plano} · ${brl(P.total)}</div><div class="h-l" style="font-size:22px;margin-top:4px">${brl(pago)}</div><div class="t-s">pagos · faltam <span style="color:var(--txt)">${brl(rest)}</span></div>
   <span class="badge ${pc===n?'paid':'paid'}" style="margin-top:8px">${pc===n?'Quitado':'Em dia · ingresso liberado'}</span></div>
  </div>
  ${open?`<button class="card rv press" style="margin-top:12px;padding:16px;width:100%;text-align:left;border-color:rgba(255,179,64,.35)" onclick="go('boleto',${open.n})"><div style="display:flex;justify-content:space-between;align-items:center"><span class="badge open">Próximo vencimento</span><span class="t-s">${open.venc}</span></div><div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:10px"><div><div class="h-l" style="font-size:24px">${brl(open.v)}</div><div class="t-s">Parcela ${open.n} de ${n} · boleto emitido</div></div><span class="btn g sm">Pagar</span></div></button>`:''}
  <div class="sec rv"><h3>Parcelas</h3><span class="t-s">${P.forma}</span></div>
  <div class="card rv">${P.parcelas.map((p,i)=>`${i?'<div class="hr"></div>':''}<button class="inst" onclick="${p.st==='paid'?`go('recibo',${p.n})`:p.st==='open'?`go('boleto',${p.n})`:`toast('Boleto ${p.n} será emitido em ${p.emissao}','clock')`}"><span class="st ${p.st}">${I(p.st==='paid'?'check':p.st==='open'?'barcode':'clock',18,2)}</span><div><div style="font-size:14.5px;font-weight:600">Parcela ${p.n} de ${n}</div><div class="t-s" style="margin-top:2px">${p.st==='paid'?`Paga via ${p.via} · ${p.pagoEm.slice(0,10)}`:p.st==='open'?`Boleto emitido · vence ${p.venc}`:`A emitir · vence ${p.venc}`}</div></div><div class="v"><b>${brl(p.v)}</b><span class="badge ${p.st}">${p.st==='paid'?'Paga':p.st==='open'?'Em aberto':'Futura'}</span></div></button>`).join('')}</div>
  ${rest>0?`<button class="btn o rv" style="margin-top:14px" onclick="quitar()">${I('pix',18)}Quitar saldo no Pix · ${brl(rest)}</button>`:''}
  <div class="sec rv"><h3>Documentos</h3></div>
  <div class="card rv"><button class="li" onclick="toast('Nota fiscal salva em Arquivos','download')">${I('doc',20)}<span>Notas fiscais</span><span class="bdg t-s">${pc} emitida${pc>1?'s':''}</span>${I('chev',16)}</button><div class="hr"></div><button class="li" onclick="toast('Contrato aberto','doc')">${I('note',20)}<span>Contrato e política de cancelamento</span>${I('chev',16)}</button><div class="hr"></div><button class="li" onclick="toast('Abrindo WhatsApp do financeiro','whats')">${I('whats',20)}<span>Falar com o financeiro</span>${I('chev',16)}</button></div>
 </div>`},init:(el)=>{setTimeout(()=>{const c=$('#rg',el);if(c)c.style.strokeDashoffset=c.dataset.to},250)}};
function quitar(){const rest=st.pay.parcelas.filter(p=>p.st!=='paid');st._quitar=true;st.bmode='pix';go('boleto',rest[0].n)}

S.boleto={html:n=>{const p=st.pay.parcelas.find(x=>x.n===n);const mode=st.bmode||'boleto';const n3=st.pay.parcelas.length;const quit=st._quitar;const val=quit?st.pay.parcelas.filter(x=>x.st!=='paid').reduce((a,x)=>a+x.v,0):p.v;
 if(p.st==='paid')return `${navbar('Parcela '+n)}<div class="pad"><div class="sys">${I('check',22,2)}<div><div class="h-s" style="font-size:15px">Pagamento confirmado</div><div class="t-s">Parcela ${n} de ${n3} · ${brl(p.v)} · via ${p.via}</div></div></div><button class="btn w" style="margin-top:14px" onclick="go('recibo',${n})">Ver comprovante</button></div>`;
 return `${navbar(quit?'Quitar saldo':`Parcela ${n} de ${n3}`)}
 <div class="pad">
  <div class="rv" style="text-align:center;margin-top:6px"><span class="badge open">${quit?'Saldo restante':'Boleto emitido em '+p.emitido}</span><div style="font:800 40px Montserrat;margin-top:12px;letter-spacing:-.02em">${brl(val)}</div><div class="t-s" style="margin-top:4px">${quit?'Pagamento à vista no Pix':'Vence '+p.venc+' · faltam 2 dias'}</div></div>
  <div class="seg rv" style="margin-top:20px"><div class="sl"></div><button class="${mode==='boleto'?'on':''} ${quit?'dis':''}" onclick="st.bmode='boleto';refresh()" ${quit?'style="opacity:.35;pointer-events:none"':''}>Boleto</button><button class="${mode==='pix'||quit?'on':''}" onclick="st.bmode='pix';refresh()">Pix · aprovação na hora</button></div>
  ${mode==='boleto'&&!quit?`
  <div class="card rv" style="margin-top:16px;padding:16px"><div class="barcode">${barcode()}</div>
   <div class="t-s" style="margin:14px 0 6px">Linha digitável</div><div class="ld">${p.linha}</div>
   <button class="btn g" style="margin-top:14px" onclick="copyCode(this,'Código de barras copiado')">${I('copy',18)}Copiar código</button></div>
  <div class="rv" style="display:flex;gap:10px;margin-top:10px"><button class="btn o" style="flex:1" onclick="toast('PDF do boleto salvo','download')">${I('download',18)}PDF</button><button class="btn o" style="flex:1" onclick="toast('Boleto enviado para seu e-mail','mail')">${I('mail',18)}E-mail</button></div>
  <div class="card rv" style="margin-top:12px;padding:4px 16px"><div class="rowkv"><span>Beneficiário</span><span>T3 Hub Eventos Ltda</span></div><div class="rowkv"><span>Vencimento</span><span>${p.venc}</span></div><div class="rowkv"><span>Após vencimento</span><span>Multa 2% + juros 1% a.m.</span></div><div class="rowkv"><span>Compensação</span><span>até 3 dias úteis</span></div></div>`
  :`<div class="card rv" style="margin-top:16px;padding:18px;text-align:center"><div style="width:190px;height:190px;margin:0 auto;background:#fff;border-radius:18px;padding:12px">${QR}</div>
   <div class="t-s" style="margin-top:14px">Pix copia e cola</div><div class="ld" style="font-size:12.5px;margin-top:6px">00020126580014br.gov.bcb.pix0136t3hub-eventos…5204000053039865406${val.toFixed(2)}</div>
   <button class="btn g" style="margin-top:14px" onclick="copyCode(this,'Pix copiado · cole no app do banco')">${I('copy',18)}Copiar Pix</button></div>
  <button class="btn o rv" style="margin-top:10px" onclick="payPix(${n})">Já paguei</button>
  <p class="t-s rv" style="text-align:center;margin-top:10px">O app confirma sozinho em segundos.${quit?'':' Pagando no Pix, o boleto é cancelado.'}</p>`}
 </div>`},init:el=>seg(el)};
function barcode(){let h='';const w=[1,2,1,3,1,1,2,1,3,2,1,1,2,3,1,2,1,1,3,1,2,2,1,1,3,1,2,1,1,2,3,1,1,2,1,3,2,1,1,2,1,3,1,1,2,2,1,3,1,2,1,1,2,1,3,1,2,2];w.forEach((x,i)=>h+=`<i style="width:${x*1.6}px;${i%2?'background:transparent':''}"></i>`);return h}
function copyCode(b,msg){b.innerHTML=I('check',18,2)+'Copiado';toast(msg,'copy');setTimeout(()=>{if(b.isConnected)b.innerHTML=I('copy',18)+'Copiar código'},2000)}
function payPix(n){const b=event.currentTarget;b.innerHTML='<span class="shimmer" style="width:120px;height:10px;margin:0"></span>';setTimeout(()=>{const q=st._quitar;st.pay.parcelas.forEach(p=>{if(p.st!=='paid'&&(q||p.n===n)){p.st='paid';p.via='Pix';p.pagoEm='13/05/2027 · 09:31';p.id='E18236120202705130931'+p.n+'xT3'}});st._quitar=false;st.bmode='boleto';confetti();toast(q?'Ingresso quitado':'Pagamento confirmado','check');back()},1600)}
S.recibo={html:n=>{const p=st.pay.parcelas.find(x=>x.n===n);return `${navbar('Comprovante',`<button class="ib" onclick="toast('Comprovante compartilhado','share')">${I('share')}</button>`)}
 <div class="pad"><div class="rv" style="text-align:center;margin-top:8px"><div style="width:64px;height:64px;border-radius:32px;background:rgba(50,215,75,.14);color:var(--ok);display:flex;align-items:center;justify-content:center;margin:0 auto" class="pop">${I('check',30,2.4)}</div><div class="h-m" style="margin-top:14px">Pagamento recebido</div><div style="font:800 34px Montserrat;margin-top:6px">${brl(p.v)}</div></div>
 <div class="card rv" style="margin-top:20px;padding:4px 16px"><div class="rowkv"><span>Parcela</span><span>${p.n} de ${st.pay.parcelas.length}</span></div><div class="rowkv"><span>Forma</span><span>${p.via}</span></div><div class="rowkv"><span>Pago em</span><span>${p.pagoEm}</span></div><div class="rowkv"><span>Pagador</span><span>Filipe Amaral</span></div><div class="rowkv"><span>Recebedor</span><span>T3 Hub Eventos Ltda</span></div><div class="rowkv"><span>ID da transação</span><span style="font-size:11.5px;font-family:ui-monospace,Consolas,monospace">${p.id}</span></div></div>
 <button class="btn o rv" style="margin-top:14px" onclick="toast('Nota fiscal salva em Arquivos','download')">${I('doc',18)}Baixar nota fiscal</button></div>`}};

/* ---- guia ---- */
S.guia={html:()=>`${navbar('Guia do participante')}
 <div class="pad"><div class="card photo rv" style="height:150px;background-image:linear-gradient(180deg,transparent 30%,rgba(0,0,0,.85)),url(img/f5.jpg);display:flex;align-items:flex-end;padding:16px"><div><div class="mono" style="font-size:10px">Montes Claros · MG</div><div class="h-m">Tudo para os 3 dias</div></div></div>
 <div class="g2" style="margin-top:12px">${GUIA.map((x,i)=>`<button class="card press rv" onclick="guiaInfo(${i})"><span class="gold">${I(x[0],24)}</span><div><div class="h-s" style="font-size:14px">${x[1]}</div><div class="t-s">${x[2]}</div></div></button>`).join('')}</div>
 <div class="card rv" style="margin-top:12px"><button class="li" onclick="toast('Abrindo WhatsApp da organização','whats')">${I('whats',20)}<span>Falar com a organização</span>${I('chev',16)}</button><div class="hr"></div><button class="li" onclick="toast('Achados e perdidos: balcão de atendimento','help')">${I('help',20)}<span>Achados e perdidos</span>${I('chev',16)}</button></div></div>`};

const GUIA=[['hotel','Hospedagem','3 hotéis parceiros com tarifa','Hotel Centro · 1,2 km<br>Hotel Avenida · 2,4 km<br>Hotel Ibituruna · 3,1 km<br><br>Use o código <b class="gold">T3X27</b> na reserva.'],['car','Transfer','Aeroporto, evento e hotéis','Saídas a cada 30 min dos hotéis parceiros, das 7h às 9h e das 18h às 23h. Do aeroporto, sob agendamento.'],['wifi','Wi-Fi','Toque para copiar a senha',''],['coffee','Onde comer','Almoço, happy hour, jantar','Almoço no pavilhão (incluso).<br>Happy hour no Lounge às 18h.<br>Jantar de abertura: local divulgado às 18h.']];
function guiaInfo(i){const g=GUIA[i];if(!g[3]){toast('Senha copiada · rede T3-Experience','wifi');return}sheet(`<div style="display:flex;gap:12px;align-items:center;margin:16px 0 12px"><span class="gold">${I(g[0],24)}</span><div class="h-m">${g[1]}</div></div><p class="t" style="line-height:1.75">${g[3]}</p>`)}

/* ---- conexões ---- */
S.conexoes={tab:1,html:()=>{const m=st.cmode||'para';return `<div class="pad"><div class="ttl rv"><h2>Conexões</h2><button class="ib gd" onclick="present('cartao')">${I('qr')}</button></div>
 <div class="seg rv"><div class="sl"></div><button class="${m==='para'?'on':''}" onclick="st.cmode='para';refresh()">Para você</button><button class="${m==='ct'?'on':''}" onclick="st.cmode='ct';refresh()">Contatos · ${st.contacts}</button><button class="${m==='re'?'on':''}" onclick="st.cmode='re';refresh()">Reuniões${st.meetings.length?' · '+st.meetings.length:''}</button></div>
 ${m==='para'?`<p class="t-s rv" style="margin:16px 0 12px"><span class="gold">●</span> 23 pessoas alinhadas ao que você busca estão no evento agora</p>
 ${Object.entries(PEOPLE).map(([k,p])=>`<div class="card mc rv"><button class="tp" style="width:100%;text-align:left" onclick="go('perfil','${k}')">${av(p.av,p.c,48)}<div><div class="h-s" style="font-size:15px">${p.n}</div><div class="t-s">${p.seg} · ${p.r.split(' · ')[0]} · ${p.fat}</div></div><div class="pct"><b>${p.pct}%</b><small>AFINIDADE</small></div></button>
  <div class="why">${I('ai',15)}<span>${p.why}</span></div>
  <div class="acts"><button class="btn o" onclick="go('perfil','${k}')">Ver perfil</button><button class="btn ${st.connected.has(k)?'o':'g'}" onclick="connect('${k}',this)">${st.connected.has(k)?I('check',16,2)+'Pedido enviado':'Conectar'}</button></div></div>`).join('')}`
 :m==='ct'?`<div class="card rv" style="margin-top:16px">${[['Mariana Prado','MP',C.lilac,'Indústria · hoje 09:12'],['Rafael Andrade','RA',C.gold,'T3 Hub · hoje 08:40'],...[...st.connected].map(k=>[PEOPLE[k].n,PEOPLE[k].av,PEOPLE[k].c,PEOPLE[k].seg+' · agora'])].reverse().map((c,i)=>`${i?'<div class="hr"></div>':''}<div class="li">${av(c[1],c[2],38)}<div style="flex:1"><div style="font-weight:600;font-size:14.5px">${c[0]}</div><div class="t-s">${c[3]}</div></div>${I('chev',16)}</div>`).join('')}</div>
  <button class="btn o rv" style="margin-top:12px" onclick="toast('Contatos exportados para a agenda do celular','download')">${I('download',18)}Exportar contatos</button>`
 :`${st.meetings.length?st.meetings.map(x=>`<div class="sys rv" style="margin-top:16px">${I('cal',22)}<div><div class="h-s" style="font-size:14.5px">${x.with} · ${x.h}</div><div class="t-s">Lounge de Negócios · Mesa 7 · hoje</div></div></div>`).join(''):`<div class="empty rv">${I('cal',28)}<p style="margin-top:10px">Nenhuma reunião marcada.<br>Abra um perfil e toque em “Marcar reunião”.</p></div>`}`}
 </div>`},init:el=>seg(el)};
function connect(k,b){if(st.connected.has(k))return;st.connected.add(k);st.contacts++;b.className='btn o';b.innerHTML=I('check',16,2)+'Pedido enviado';toast(`Pedido enviado para ${PEOPLE[k].n.split(' ')[0]}`,'users')}
S.perfil={html:k=>{const p=PEOPLE[k];return `${navbar('',`<button class="ib" onclick="toast('Perfil salvo','bookmark')">${I('bookmark')}</button>`)}
 <div class="pad"><div class="rv" style="text-align:center">${av(p.av,p.c,96,30).replace('style="','style="margin:0 auto;')}
  <div class="h-l" style="margin-top:14px">${p.n}</div><div class="t" style="margin-top:2px">${p.r}</div>
  <div style="display:flex;gap:8px;justify-content:center;margin-top:12px">${p.member?'<span class="chip gl">Membro T3 Hub</span>':''}<span class="chip">${p.city}</span></div>
  <div style="margin-top:14px;font:800 15px Montserrat;color:var(--gold)">${p.pct}% de afinidade</div></div>
 <div class="card blk rv"><div class="lb">BUSCA</div>${p.busca.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
 <div class="card blk rv"><div class="lb">OFERECE</div>${p.oferece.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
 <div class="card blk rv"><div class="lb">EM COMUM</div><div style="font-size:14px;color:#d8d8dc;line-height:1.5">3 sessões salvas iguais · 2 contatos em comum</div></div></div>
 <div class="fadeb"></div>
 <div class="bottom" style="display:flex;gap:10px"><button class="btn o" style="flex:1" onclick="go('chat','${k}')">${I('msg',18)}Mensagem</button><button class="btn g" style="flex:1.4" onclick="go('chat','${k}')">${I('cal',18)}Marcar reunião</button></div>`}};
S.chat={html:k=>{const p=PEOPLE[k];const m=st.meetings.find(x=>x.k===k);return `<div class="pad nav rv"><button class="ib" onclick="back()">${I('back')}</button>${av(p.av,p.c,36,12)}<div style="flex:1"><div class="h-s" style="font-size:15px">${p.n}</div><div class="t-s ok">No evento agora</div></div></div>
 <div class="pad" id="msgs"><div class="bub r">${p.n.split(' ')[0]}, vi que você busca ${p.busca[0].toLowerCase()}. Toma 20 min hoje?</div>${st._reply||m?'<div class="bub l">Bora! Depois do almoço fica bom.</div>':'<div class="bub l typ" style="width:64px;color:var(--mut)">• • •</div>'}
 ${m?`<div class="sys">${I('check',22,2)}<div><div class="h-s" style="font-size:14px">Reunião confirmada · ${m.h}</div><div class="t-s">Lounge de Negócios · Mesa 7 · lembrete 10 min antes</div></div></div>`:
 `<div class="card blk ${st._reply?'pop':''}" style="${st._reply?'':'display:none'}"><div class="lb">MARCAR NO LOUNGE DE NEGÓCIOS · HOJE</div><div class="slot">${['14:00','14:30','15:00','15:30','16:00','16:30'].map((h,i)=>`<button class="${i===0||i===4?'off':''} ${st._slot===h?'on':''}" onclick="st._slot='${h}';refresh()">${h}</button>`).join('')}</div><div class="t-s" style="margin-top:12px">Horários livres nas duas agendas · mesa reservada automaticamente</div>
 <button class="btn g ${st._slot?'':'dis'}" style="margin-top:14px" onclick="meet('${k}')">Confirmar ${st._slot||''}</button></div>`}</div>
 <div class="bottom"><div class="inp">Mensagem…<span class="s">${I('send',18)}</span></div></div>`},
 init:(el,k,re)=>{if(re||st._reply)return;setTimeout(()=>{st._reply=true;if(cur().name==='chat')refresh()},1300)}};
function meet(k){st.meetings.push({k,with:PEOPLE[k].n,h:st._slot});st._slot=null;mission('reuniao',1);refresh();confetti()}

S.cartao={html:()=>{const m=st.cartMode||'meu';return `<div class="pad" style="background:radial-gradient(400px 300px at 50% 30%,#2a2416,transparent)"><div class="nav rv"><button class="ib" onclick="back()">${I('x')}</button><div style="flex:1;display:flex;justify-content:center"><div class="seg" style="width:230px"><div class="sl"></div><button class="${m==='meu'?'on':''}" onclick="st.cartMode='meu';refresh()">Meu cartão</button><button class="${m==='scan'?'on':''}" onclick="st.cartMode='scan';refresh()">Escanear</button></div></div><div style="width:40px"></div></div>
 ${m==='meu'?`<div class="card pop" style="margin-top:20px;padding:26px 22px;text-align:center;background:linear-gradient(160deg,#1c1a14,#0b0b0b);border-color:rgba(212,192,142,.3)">
  ${av('FA',C.gold,64,22).replace('style="','style="margin:0 auto;')}<div class="h-m" style="margin-top:12px">Filipe Amaral</div><div class="t-s">Zontix Tecnologia · Sócio-fundador</div>
  <div style="width:210px;height:210px;margin:22px auto 0;background:#fff;border-radius:22px;padding:16px">${QR}</div></div>
 <p class="t rv" style="text-align:center;margin-top:18px">Mostre para quem você conheceu.<br>O contato entra nos dois apps na hora.</p>`
 :st._scanned?`<div class="pop" style="text-align:center;margin-top:40px">${av('MP',C.lilac,96,30).replace('style="','style="margin:0 auto;')}<div class="h-l" style="margin-top:16px">Mariana Prado</div><div class="t">Indústria · Diretora comercial</div><div class="sys" style="margin-top:22px;text-align:left">${I('check',22,2)}<div><div class="h-s" style="font-size:14px">Contato trocado</div><div class="t-s">Vocês dois já aparecem em Contatos</div></div></div></div>`
 :`<div class="scanner pop"><div class="fr"></div><div class="scan"></div></div><p class="t rv" style="text-align:center;margin-top:18px">Aponte para o QR do cartão de outra pessoa</p>`}
 </div><div class="bottom"><button class="btn o" onclick="toast('Link do seu cartão copiado','link')">${I('link',18)}Compartilhar link</button></div>`},
 init:(el,p,re)=>{seg(el);if((st.cartMode==='scan')&&!st._scanned){clearTimeout(st._sct);st._sct=setTimeout(()=>{if(cur().name!=='cartao'||st.cartMode!=='scan')return;st._scanned=true;st.contacts++;refresh();confetti();mission('cartao3')},2300)}}};
MISSIONS.push({k:'cartao3',t:'Trocar mais um cartão',p:20,hidden:1});

/* ---- você ---- */
S.voce={tab:1,html:()=>{const ps=payStatus();return `<div class="pad"><div class="rv" style="display:flex;justify-content:flex-end;margin:10px 0 4px"><button class="ib" onclick="toast('Editar perfil','edit')">${I('edit')}</button></div>
 <div class="rv" style="display:flex;gap:14px;align-items:center">${av('FA',C.gold,72,24)}<div><div class="h-l" style="font-size:22px">Filipe Amaral</div><div class="t-s">Zontix Tecnologia · Sócio-fundador</div><button class="chip gl" style="height:26px;font-size:12px;margin-top:8px" onclick="go('liga')">${I('trophy',13)}Liga ${st.pts>=1000?'Ouro':'Prata'} · ${st.pts} pts</button></div></div>
 <div class="stat rv"><div><b>${st.contacts}</b><small>Contatos</small></div><div><b>${[...st.saved].length}</b><small>Sessões</small></div><div><b>${st.meetings.length}</b><small>Reuniões</small></div></div>
 <div class="card rv" style="margin-top:14px">
  <button class="li" onclick="present('ticket')">${I('ticket',20)}<span>Meu ingresso</span>${I('chev',16)}</button><div class="hr"></div>
  <button class="li" onclick="go('pagamentos')">${I('money',20)}<span>Pagamentos</span><span class="bdg badge ${ps.c}">${ps.t}</span>${I('chev',16)}</button><div class="hr"></div>
  <button class="li" onclick="go('liga')">${I('trophy',20)}<span>Liga T3 e missões</span>${I('chev',16)}</button><div class="hr"></div>
  <button class="li" onclick="go('fotos')">${I('image',20)}<span>Minhas fotos</span>${I('chev',16)}</button><div class="hr"></div>
  <button class="li" onclick="go('caderno')">${I('note',20)}<span>Meu caderno</span>${I('chev',16)}</button><div class="hr"></div>
  <button class="li" onclick="go('guia')">${I('hotel',20)}<span>Guia do participante</span>${I('chev',16)}</button></div>
 <div class="card rv" style="margin-top:12px">
  <button class="li" onclick="toast('Notificações: lembretes, reuniões e pagamentos ativos','bell')">${I('bell',20)}<span>Notificações</span>${I('chev',16)}</button><div class="hr"></div>
  <button class="li" onclick="toast('Seu perfil aparece em Conexões','shield')">${I('shield',20)}<span>Privacidade e visibilidade</span>${I('chev',16)}</button><div class="hr"></div>
  <button class="li" onclick="go('hub')">${I('spark',20)}<span>Conhecer o T3 Hub</span>${I('chev',16)}</button><div class="hr"></div>
  <button class="li" onclick="rate()">${I('star',20)}<span>Avaliar o evento</span>${I('chev',16)}</button></div>
 <button class="li rv" style="margin-top:12px;color:var(--live);justify-content:center" onclick="st.selfie=false;reset('welcome')">${I('logout',20)}Sair da conta</button>
 </div>`}};

S.liga={html:()=>{const list=MISSIONS.filter(m=>!m.hidden);const lvl=st.pts>=1000?'Ouro':'Prata';const goal=st.pts>=1000?1500:1000;
 return `${navbar('Liga T3')}
 <div class="lvl rv"><div class="mono">Sua liga</div>
  <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-top:8px"><div class="h-xl" style="font-size:34px">${lvl}</div><div style="text-align:right"><div style="font:800 26px Montserrat" id="ptn">${st.pts}</div><div class="t-s">pontos</div></div></div>
  <div class="prog" style="margin-top:16px;height:6px;background:rgba(255,255,255,.1)"><i id="pb" style="width:0" data-w="${Math.min(100,st.pts/goal*100)}"></i></div>
  <div class="t-s" style="margin-top:8px;color:#cfc6ae">Faltam ${goal-st.pts} pts para a <b style="color:var(--gold3)">Liga ${lvl==='Prata'?'Ouro':'Diamante'}</b> · prêmio: jantar com os palestrantes</div></div>
 <div class="pad"><div class="sec rv"><h3>Missões</h3><span class="t-s">${list.filter(m=>st.done.has(m.k)).length} de ${list.length}</span></div>
 <div class="card rv">${list.map((m,i)=>`${i?'<div class="hr"></div>':''}<div class="ms"><span class="ck ${st.done.has(m.k)?'d':''}">${st.done.has(m.k)?I('check',15,2.4):''}</span><div><div style="font-size:14px;${st.done.has(m.k)?'color:var(--mut);text-decoration:line-through':''}">${m.t}</div>${m.prog&&!st.done.has(m.k)?`<div class="t-s">${st.est} de 5</div>`:''}</div><span class="pts">+${m.p}</span></div>`).join('')}</div>
 <div class="sec rv"><h3>Ranking ao vivo</h3><span class="t-s">aparece no telão</span></div>
 <div class="card rv" style="overflow:hidden">${RANK.map((r,i)=>`<div class="rk"><span class="p">${i+1}</span>${av(r[1],r[2],32,11)}<span>${r[0]}</span><span class="pt">${r[3]}</span></div>`).join('')}<div class="rk me"><span class="p">27</span>${av('FA',C.gold,32,11)}<span>Você</span><span class="pt gold">${st.pts}</span></div></div></div>`},
 init:(el,p,re)=>{if(re)return;const b=$('#pb',el);setTimeout(()=>{b.style.width=b.dataset.w+'%'},200);const n=$('#ptn',el);n.dataset.from=Math.max(0,st.pts-300);countUp(n,st.pts)}};

S.fotos={html:()=>`${navbar('Fotos do evento',`<button class="ib" onclick="toast('18 fotos salvas no celular','download')">${I('download')}</button>`)}
 <div class="pad">${st.photos?`<div class="card rv" style="padding:16px;display:flex;gap:14px;align-items:center;background:linear-gradient(160deg,rgba(212,192,142,.14),var(--s1) 60%);border-color:rgba(212,192,142,.3)"><div style="width:52px;height:52px;border-radius:26px;background:var(--gold);color:#000;display:flex;align-items:center;justify-content:center">${I('faceid',26)}</div><div style="flex:1"><div class="h-s" style="font-size:15px">Achamos 18 fotos suas</div><div class="t-s">Em alta resolução · novas fotos chegam a cada hora</div></div></div>`
 :`<div class="card rv" style="padding:22px;text-align:center"><div class="selfie" style="width:120px;height:120px;margin:0 auto" id="fscan">${I('faceid',44,1.4)}</div><div class="h-s" style="margin-top:16px">Encontre suas fotos</div><p class="t" style="margin-top:6px">Usamos a selfie do seu perfil para achar você nas fotos oficiais.</p><button class="btn g" style="margin-top:16px" onclick="findPhotos()">Encontrar minhas fotos</button></div>`}
 <div class="seg rv" style="margin:16px 0 12px"><div class="sl"></div><button class="on">${st.photos?'Minhas · 18':'Todas'}</button><button>Dia 1</button><button>Dia 2</button><button>Dia 3</button></div></div>
 <div class="gal">${PHOTOS.map((f,i)=>`<button style="background-image:url(img/${f}.jpg);animation-delay:${i*40}ms;${i%2?'background-position:right':''}" onclick="viewPhoto('${f}')"></button>`).join('')}</div>`,init:el=>seg(el)};
function rate(){sheet(`<div class="h-m" style="margin:16px 0 6px;text-align:center">Como está sendo o evento?</div><p class="t-s" style="text-align:center">Sua nota ajuda a próxima edição</p><div style="display:flex;gap:10px;justify-content:center;margin:18px 0 10px">${[1,2,3,4,5].map(i=>`<button style="color:var(--gold)" onclick="closeSheet();toast('Obrigado pela avaliação','star')">${I('star',38)}</button>`).join('')}</div>`)}
function findPhotos(){const s=$('#fscan');s.innerHTML='<div class="scan"></div>'+I('faceid',44,1.4);setTimeout(()=>{st.photos=true;refresh();toast('18 fotos encontradas','image')},2000)}
function viewPhoto(f){const v=document.createElement('div');v.className='viewer';v.innerHTML=`<button class="ib" style="position:absolute;top:60px;left:20px" onclick="this.parentNode.remove()">${I('x')}</button><div class="im" style="background-image:url(img/${f}.jpg)"></div><div style="position:absolute;left:20px;right:20px;bottom:40px;display:flex;gap:10px"><button class="btn o" style="flex:1" onclick="toast('Foto salva','download')">${I('download',18)}Salvar</button><button class="btn w" style="flex:1.5" onclick="toast('Story com moldura T3 pronto','share')">${I('share',18)}Postar com moldura</button></div>`;app.appendChild(v)}

S.hub={cls:'full',html:()=>`<div class="photo" style="height:360px;background-image:linear-gradient(180deg,rgba(0,0,0,.35),transparent 35%,#000 95%),url(img/f6.jpg)"></div>
 <div style="position:absolute;top:calc(var(--top) + 6px);left:20px;z-index:5"><button class="ib" style="background:rgba(0,0,0,.45);backdrop-filter:blur(10px)" onclick="back()">${I('back')}</button></div>
 <div class="pad" style="margin-top:-96px;position:relative">
  <img src="img/logo.png" class="rv" style="height:44px">
  <div class="h-xl rv" style="font-size:28px;margin-top:16px">A Experience<br>acaba. <span class="gold">O jogo, não.</span></div>
  <p class="t rv" style="margin-top:12px">O T3 Hub reúne mais de 80 empresários do Norte de Minas o ano inteiro: encontros mensais, missões empresariais, T3 Manager e consultoria. Vagas limitadas por segmento.</p>
  ${st.hubSent?`<div class="sys" style="margin-top:18px">${I('check',22,2)}<div><div class="h-s" style="font-size:14px">Candidatura enviada</div><div class="t-s">O time T3 fala com você em até 3 dias úteis</div></div></div>`:
  `<div class="card rv" style="margin-top:16px;padding:6px 16px">${['Candidatura em 2 min <span class="t-s">(já preenchida com seu perfil)</span>','Análise de perfil e segmento','Conversa com o time T3'].map((t,i)=>`<div class="step" ${i?'style="padding-top:0"':''}><span class="n2">${i+1}</span><div style="font-size:14px">${t}</div></div>`).join('')}</div>`}
 </div>
 ${st.hubSent?'':`<div class="fadeb"></div><div class="bottom"><button class="btn g" onclick="hubForm()">Iniciar candidatura</button><p class="t-s" style="text-align:center;margin-top:10px">${st.onb.seg}: <span class="gold">vagas abertas no seu segmento</span></p></div>`}`};
function hubForm(){sheet(`<div class="h-m rv" style="margin:16px 0 4px">Candidatura T3 Hub</div><p class="t-s rv">Revise os dados que vieram do seu perfil.</p>
 <div class="card rv" style="margin-top:14px;padding:4px 16px"><div class="rowkv"><span>Nome</span><span>Filipe Amaral</span></div><div class="rowkv"><span>Empresa</span><span>Zontix Tecnologia</span></div><div class="rowkv"><span>Segmento</span><span>${st.onb.seg}</span></div><div class="rowkv"><span>Faturamento</span><span>${st.onb.fat}</span></div><div class="rowkv"><span>Busca</span><span>${[...st.onb.busca].join(', ')||'—'}</span></div></div>
 <button class="btn g rv" style="margin-top:16px" onclick="closeSheet();st.hubSent=true;setTimeout(()=>{refresh();confetti()},300)">Enviar candidatura</button>`)}

/* ---------------- inicialização ---------------- */
function boot(){
  app=$('#app');
  app.insertAdjacentHTML('beforeend',`<div class="sb"><span>9:41</span><div class="isl"></div><div class="r">${I('wifi',17,2)}<div class="bat"></div></div></div><nav class="tb hide"><span class="pill"></span>${TABS.map(([k,i,l])=>`<button onclick="tab('${k}')">${I(i)}<span>${l}</span></button>`).join('')}</nav><div class="home-ind"></div>`);
  const fit=()=>{const d=$('.device');if(innerWidth<=520){d.style.transform='';return}const k=Math.min(DEMO?1.2:1.25,(innerHeight-(DEMO?40:60))/864);d.style.transform=`scale(${k})`};
  addEventListener('resize',fit);fit();
  if(DEMO){document.body.classList.add('demo');const f=document.createElement('div');f.className='finger';app.appendChild(f);
    app.addEventListener('pointerdown',e=>{const r=app.getBoundingClientRect();const k=r.width/390;const x=(e.clientX-r.left)/k,y=(e.clientY-r.top)/k;const t=document.createElement('div');t.className='tapfx';t.style.left=x+'px';t.style.top=y+'px';app.appendChild(t);setTimeout(()=>t.remove(),800)},true);}
  const start=new URLSearchParams(location.search).get('s');
  const intro=document.createElement('div');intro.className='intro';intro.innerHTML='<img src="img/logo.png"><div class="ln"></div><div class="mono">Experience · 2027</div>';
  if(!start){app.appendChild(intro);setTimeout(()=>{intro.classList.add('out');setTimeout(()=>intro.remove(),600)},2300)}
  reset(start&&S[start]?start:'welcome'); if(start&&S[start].tab){curTab=start;updTab()}
}
// hooks para o roteiro de vídeo
window.moveFinger=(x,y,on=true)=>{const f=$('.finger');if(!f)return;f.style.left=x+'px';f.style.top=y+'px';f.classList.toggle('on',on)};
window.fingerDown=d=>{const f=$('.finger');f&&f.classList.toggle('down',d)};
document.addEventListener('DOMContentLoaded',boot);
