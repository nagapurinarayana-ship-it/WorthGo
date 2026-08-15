(() => {
  const KEY = 'worthgo-my-day-v1';
  const get = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
  const set = items => localStorage.setItem(KEY, JSON.stringify(items.slice(0, 12)));
  const findPlace = name => Object.values(window.WORTHGO_DATA || {}).flat().find(p => p.name === name);
  const count = () => { const n = get().length; document.querySelector('.day-count').textContent = n; };
  const add = name => { const items=get(); if(!items.includes(name)){items.push(name);set(items);toastDay('Added to My Day');} else toastDay('Already in My Day'); count(); render(); };
  const remove = name => {set(get().filter(x=>x!==name));toastDay('Removed from My Day');count();render();};
  const toastDay = msg => { let t=document.querySelector('#toast'); if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)} t.textContent=msg;t.classList.add('show');clearTimeout(window.__wgToast);window.__wgToast=setTimeout(()=>t.classList.remove('show'),2000); };
  const render = () => {
    const panel=document.querySelector('#dayPanel'); if(!panel)return;
    const items=get();
    panel.innerHTML=`<div class="quick-backdrop"></div><div class="quick-sheet day-sheet"><button class="quick-close" aria-label="Close">×</button><span class="kicker">YOUR DAY</span><h2>${items.length?'A little plan, made yours.':'Nothing saved yet.'}</h2>${items.length?`<p class="day-intro">Saved in this browser. No account needed.</p><div class="day-list">${items.map((name,i)=>{const p=findPlace(name);return p?`<div class="day-item"><span class="day-number">${i+1}</span><div><strong>${p.name}</strong><small>📍 ${p.area} · ${p.duration.min}–${p.duration.max} min · ${p.whyGo}</small></div><button data-remove="${encodeURIComponent(name)}" aria-label="Remove ${p.name}">×</button></div>`:''}).join('')}</div><div class="day-actions"><button class="outline-btn" data-clear-day>Clear</button><button class="primary-btn" data-share-day>Share plan</button></div>`:`<p class="day-intro">Tap “Add to My Day” on any WorthGo pick and it will stay here on this device.</p><button class="light-btn" data-close-day>Back to exploring</button>`}</div>`;
    panel.classList.add('show'); panel.setAttribute('aria-hidden','false');
    panel.querySelector('.quick-close').onclick=close; panel.querySelector('.quick-backdrop').onclick=close; panel.querySelector('[data-close-day]')?.addEventListener('click',close);
    panel.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>remove(decodeURIComponent(b.dataset.remove))));
    panel.querySelector('[data-clear-day]')?.addEventListener('click',()=>{set([]);count();render();});
    panel.querySelector('[data-share-day]')?.addEventListener('click',async()=>{const text=`My WorthGo plan\n${get().map((x,i)=>`${i+1}. ${x}`).join('\n')}`;try{await navigator.clipboard.writeText(text);toastDay('Plan copied to clipboard');}catch{toastDay('Your plan is ready to share');}});
  };
  const close=()=>{const p=document.querySelector('#dayPanel');p?.classList.remove('show');p?.setAttribute('aria-hidden','true');};
  const enhanceCards = () => document.querySelectorAll('.place-card').forEach(card => {
    if(card.querySelector('.add-day'))return;
    const name=card.querySelector('h3')?.textContent.trim(); if(!name)return;
    const body=card.querySelector('.place-body'); if(!body)return;
    const b=document.createElement('button');b.className='add-day';b.type='button';b.textContent=get().includes(name)?'✓ In My Day':'＋ Add to My Day';b.onclick=()=>{add(name);b.textContent='✓ In My Day';};
    body.appendChild(b);
    const save=card.querySelector('.save'); save?.addEventListener('click',()=>{if(get().includes(name))remove(name);else add(name);},{capture:true});
  });
  document.addEventListener('click',e=>{if(e.target.closest('.day-pill'))render();});
  new MutationObserver(enhanceCards).observe(document.body,{childList:true,subtree:true});
  count(); enhanceCards();
})();