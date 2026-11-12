/* ---------------- passaporte de estandes ---------------- */
const stampCount=()=>Object.keys(st.stamps).length;
const stand=id=>STANDS.find(x=>x.id===id);
const SCAN_ORDER=['agro','zontix','lm','credi','prisma','exata','vida','costa'];
function nextReward(){const n=stampCount();return REWARDS.find(r=>r.n>n)}
function logoTile(sd,size=56){return `<div class="stile" style="width:${size}px;height:${size}px;background:${sd.bg};color:${sd.fg};font-size:${Math.round(size*.2)}px">${sd.short}</div>`}
function passCard(){const n=stampCount(),T=STANDS.length;const nr=nextReward();return `<button class="card press rv passcard" onclick="go('passaporte')">
 <div style="display:flex;justify-content:space-between;align-items:center"><div style="display:flex;gap:10px;align-items:center"><span class="gold">${I('passport',22)}</span><div><div class="h-s" style="font-size:15px">Passaporte de estandes</div><div class="t-s">${nr?`Faltam ${nr.n-n} carimbos para ${nr.s}`:'Passaporte completo'}</div></div></div><b style="font:800 18px Montserrat" class="gold">${n}/${T}</b></div>
 <div class="pdots">${STANDS.map((sd,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}</div>
 <span class="btn g sm" style="margin-top:12px;width:100%" onclick="event.stopPropagation();present('scan')">${I('scan',17)}Escanear QR do estande</span></button>`}
function stampSVG(sd,time,size=220){return `<svg viewBox="0 0 220 220" width="${size}" height="${size}" class="stampsvg"><defs><path id="cp${size}${sd.id}" d="M110,110 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0"/></defs>
 <circle cx="110" cy="110" r="104" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="110" cy="110" r="94" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="110" cy="110" r="62" fill="none" stroke="currentColor" stroke-width="1.5"/>
 <text font-family="Montserrat" font-weight="800" font-size="12.5" letter-spacing="3.2" fill="currentColor"><textPath href="#cp${size}${sd.id}">T3 EXPERIENCE 2027 · PASSAPORTE · CARIMBADO · </textPath></text>
 <text x="110" y="102" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="${sd.short.length>5?19:24}" fill="currentColor">${sd.short}</text>
 <text x="110" y="124" text-anchor="middle" font-family="Montserrat" font-weight="700" font-size="11" letter-spacing="2" fill="currentColor">ESTANDE ${sd.booth}</text>
 <text x="110" y="142" text-anchor="middle" font-family="Inter" font-weight="600" font-size="11" fill="currentColor">13 MAI · ${time||'--:--'}</text></svg>`}
function standSheet(id){const sd=stand(id);const ok=st.stamps[id];const ld=st.leads.has(id);sheet(`<div style="display:flex;gap:14px;align-items:center;margin-top:18px" class="rv">${logoTile(sd)}<div style="flex:1"><div class="t-s">Patrocinador ${sd.tier} · Estande ${sd.booth}</div><div class="h-m">${sd.n}</div></div></div>
 <div class="card rv" style="margin-top:16px;padding:14px 16px;display:flex;gap:12px;align-items:center;${ok?'border-color:rgba(50,215,75,.35)':''}"><span class="${ok?'ok':'gold'}">${I(ok?'check':'passport',22,ok?2.4:1.7)}</span><div style="flex:1"><div class="h-s" style="font-size:14px">${ok?'Carimbado no seu passaporte':'Ainda não carimbado'}</div><div class="t-s">${ok?'Visita registrada às '+ok:'Escaneie o QR mostrado no estande para carimbar'}</div></div></div>
 <div class="card rv" style="margin-top:10px;padding:14px 16px;display:flex;gap:12px;align-items:center;border-color:rgba(212,192,142,.3)"><span class="gold">${I('gift')}</span><div style="flex:1"><div class="h-s" style="font-size:14px">Oferta do evento</div><div class="t-s">${sd.oferta}</div></div></div>
 <div class="rv" style="display:flex;gap:10px;margin-top:16px"><button class="btn o" style="flex:1" onclick="leadStand('${id}',this)">${ld?I('check',18,2)+'Contato enviado':'Deixar contato'}</button>${ok?`<button class="btn g" style="flex:1" onclick="closeSheet();routeTo('estandes')">${I('pin',18)}Ir até lá</button>`:`<button class="btn g" style="flex:1" onclick="closeSheet();setTimeout(()=>present('scan','${id}'),300)">${I('scan',18)}Escanear QR</button>`}</div>
 <p class="t-s rv" style="text-align:center;margin-top:12px">Deixar contato envia seus dados ao patrocinador, mas não carimba o passaporte.</p>`)}
function leadStand(id,b){if(st.leads.has(id))return;st.leads.add(id);b.innerHTML=I('check',18,2)+'Contato enviado';toast('Contato enviado · não vale carimbo','send')}
function replaceTop(name,p){const old=cur();const el=build(name,p);el.classList.add('fade-in');app.insertBefore(el,$('.tb',app));stack[stack.length-1]={name,p,el,modal:old.modal};mount(name,p,el);updTab();setTimeout(()=>{old.el.remove();el.classList.remove('fade-in')},360)}

S.scan={cls:'full',html:id=>`<div class="cam"></div>
 <div class="pad nav" style="position:relative;z-index:5;margin-top:calc(var(--top) + 4px)"><button class="ib" style="background:rgba(0,0,0,.45)" onclick="back()">${I('x')}</button><div class="h-s" style="text-align:center;flex:1">Escanear QR</div><button class="ib" style="background:rgba(0,0,0,.45)" onclick="toast('Lanterna ligada','torch')">${I('torch')}</button></div>
 <div class="vf"><i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i><div class="vfqr">${QR}</div><div class="scan"></div></div>
 <div class="scanhint"><div class="h-s" id="shint">Aponte para o QR do estande</div><div class="t-s" style="margin-top:4px;color:#cfcfd3">Cada estande visitado vira um carimbo no seu passaporte</div>
 <div class="chip gl dk" style="margin-top:14px">${I('passport',14)}Passaporte ${stampCount()}/${STANDS.length}</div></div>`,
 init:(el,id)=>{clearTimeout(st._scanT);const target=id||SCAN_ORDER.find(k=>!st.stamps[k])||'agro';st._scanT=setTimeout(()=>{if(cur().name!=='scan')return;const v=$('.vf',el);v.classList.add('lock');const sd=stand(target);$('#shint',el).textContent=`QR lido · Estande ${sd.booth} · ${sd.n}`;setTimeout(()=>{if(cur().name!=='scan')return;doStamp(target)},900)},2600)}};
function doStamp(id){const already=!!st.stamps[id];if(!already){const c=stampCount();st.stamps[id]=String(9+Math.floor(c/2)).padStart(2,'0')+':'+String(14+c*6).padStart(2,'0');st.pts+=50}
 const n=stampCount();let reward=null;if(!already){if(n>=5&&!st.done.has('estande')){st.done.add('estande');st.pts+=200}reward=REWARDS.find(r=>r.n===n)||null}
 replaceTop('stamp',{id,already,reward})}
S.stamp={cls:'full',html:p=>{const sd=stand(p.id);const n=stampCount(),T=STANDS.length;const nr=nextReward();return `<div class="glow"></div>
 <div class="pad nav" style="position:relative;z-index:5;margin-top:calc(var(--top) + 4px)"><button class="ib" onclick="back()">${I('x')}</button><div style="flex:1"></div><button class="ib" onclick="toast('Conquista compartilhada','share')">${I('share')}</button></div>
 <div class="pad" style="text-align:center;position:relative;z-index:3">
  <div class="mono rv">${p.already?'Você já tem este carimbo':'Carimbo conquistado'}</div>
  <div class="stampwrap ${p.already?'still':''}"><div class="shock"></div><div class="stampin gold">${stampSVG(sd,st.stamps[p.id],190)}</div></div>
  <div class="h-l rv" style="font-size:22px">${p.already?'Visita já registrada':'Parabéns! Você visitou o estande da '+sd.n}</div>
  ${p.already?'':`<div class="chip gl rv" style="margin-top:10px">${I('trophy',14)}+50 pts na Liga T3</div>`}
 </div>
 <div class="pad" style="position:relative;z-index:3">
  <div class="card rv" style="margin-top:16px;padding:16px;text-align:left">
   <div style="display:flex;gap:12px;align-items:center">${logoTile(sd,48)}<div style="flex:1"><div class="h-s" style="font-size:15px">${sd.n}</div><div class="t-s">${sd.seg} · Patrocinador ${sd.tier}</div></div></div>
   <p class="t" style="margin-top:12px;color:#cfcfd3">${sd.desc}</p>
   <div style="display:flex;gap:8px;margin-top:14px"><button class="btn o sm" style="flex:1" onclick="toast('Abrindo ${sd.site}','globe')">${I('globe',16)}Site</button><button class="btn o sm" style="flex:1" onclick="toast('Abrindo o Instagram','insta')">${I('insta',16)}Instagram</button><button class="btn o sm" style="flex:1" onclick="toast('Abrindo WhatsApp do estande','whats')">${I('whats',16)}Falar</button></div>
  </div>
  <div class="card rv" style="margin-top:10px;padding:14px 16px;text-align:left"><div style="display:flex;justify-content:space-between;font-size:13px"><span>Seu passaporte</span><b class="gold">${n}/${T}</b></div><div class="prog" style="margin-top:10px;height:6px"><i class="pp" style="width:${(Math.max(0,n-1))/T*100}%" data-w="${n/T*100}"></i></div><div class="t-s" style="margin-top:8px">${p.reward?`<span class="gold">Desbloqueado: ${p.reward.t}!</span> ${p.reward.d}.`:nr?`Faltam ${nr.n-n} carimbos para ${nr.s}`:'Passaporte completo'}</div></div>
  <div style="height:90px"></div>
 </div>
 <div class="fadeb"></div><div class="bottom" style="display:flex;gap:10px"><button class="btn o" style="flex:1" onclick="replaceTop('scan')">${I('scan',18)}Escanear outro</button><button class="btn g" style="flex:1.2" onclick="back();setTimeout(()=>go('passaporte'),520)">Ver passaporte</button></div>`},
 init:(el,p)=>{setTimeout(()=>{const b=$('.pp',el);if(b)b.style.width=b.dataset.w+'%'},900);if(!p.already&&p.reward)setTimeout(confetti,650)}};

S.passaporte={html:()=>{const n=stampCount(),T=STANDS.length;const order=[...STANDS].sort((a,b)=>(!!st.stamps[b.id])-(!!st.stamps[a.id]));return `${navbar('Meu passaporte',`<button class="ib" onclick="openPassMap()">${I('map')}</button>`)}
 <div class="pad">
  <div class="pbook rv"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><div class="mono">Passaporte · Experience 2027</div><div class="h-xl" style="font-size:24px;margin-top:10px">Filipe Amaral</div><div class="t-s" style="margin-top:2px">Nº T3X-27-0418</div></div><span class="gold">${I('passport',34,1.3)}</span></div>
   <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-top:18px"><div style="font:800 40px Montserrat;line-height:1">${n}<span style="font-size:18px;color:var(--mut)">/${T}</span></div><div class="t-s" style="text-align:right">estandes<br>carimbados</div></div>
   <div class="prog" style="margin-top:12px;height:6px;background:rgba(255,255,255,.1)"><i style="width:${n/T*100}%"></i></div>
   <div class="ladder">${REWARDS.map(r=>`<div class="${n>=r.n?'on':''}"><b>${r.n}</b><span>${r.t}</span>${n>=r.n?I('check',14,2.4):''}</div>`).join('')}</div>
  </div>
  <div class="sec rv"><h3>Estandes</h3><span class="t-s">${T-n} para visitar</span></div>
  <div class="sgrid rv">${order.map(sd=>{const ok=st.stamps[sd.id];return `<button class="scell ${ok?'ok':''}" onclick="standSheet('${sd.id}')">${ok?`<div class="ministamp">${stampSVG(sd,ok,92)}</div>`:`<div class="slot0">${logoTile(sd,40)}</div>`}<div class="nm">${sd.n}</div><div class="t-s">${ok?'Carimbado · '+ok:'Estande '+sd.booth+' · pendente'}</div></button>`}).join('')}</div>
  <div class="card rv" style="margin-top:14px;padding:14px 16px;display:flex;gap:12px"><span class="gold">${I('help',20)}</span><div class="t-s" style="line-height:1.55">Só vale carimbo com o QR lido no estande. “Deixar contato” envia seus dados ao patrocinador, mas não carimba.</div></div>
 </div>
 <div class="fadeb"></div><div class="bottom"><button class="btn g" onclick="present('scan')">${I('scan',18)}Escanear QR do estande</button></div>`}};
function openPassMap(){st.mapFilter='Passaporte';closeAll();tab('mapa')}
