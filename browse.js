(() => {
  const esc = s => String(s ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const city = () => /Dubai/i.test(document.querySelector('.city-pill')?.textContent || '') ? 'Dubai' : 'Hyderabad';
  const cfg = () => city() === 'Dubai' ? {symbol:'AED ', areas:['Any area','Al Fahidi','Bur Bur Dubai','Deira','Dubai Marina','Downtown Dubai','Al Satwa','Karama','Jumeirah','JLT','Al Quoz']} : {symbol:'₹', areas:['Any area','Old City','Central Hyderabad','Jubilee Hills','Gachibowli','Secunderabad','Koti','Begum Bazar','Ghansi Bazaar']};
  const data = () => (window.WORTHGO_DATA?.[city()] || []).map(p => ({...p, _n: window.WORTHGO_TAXONOMY?.normalize ? window.WORTHGO_TAXONOMY.normalize(p) : p}));
  const review = p => p.reviewSignal || p.reviewSignals || {};
  const rating = p => Number(review(p).rating ?? review(p).googleRating ?? 0);
  const categories = p => p._n?.foodCategories || p.foodCategories || p.categories || [];
  const venue = p => p._n?.venueType || p.venueType || p.type || '';
  const meals = p => p._n?.mealTimes || p.mealTimes || [];
  const experiences = p => p._n?.experienceTags || p.experienceTags || [];
  const saveKey = 'worthgo-saved-v1';
  const saved = () => { try { return JSON.parse(localStorage.getItem(saveKey) || '[]'); } catch { return []; } };
  const isSaved = p => saved().includes(p.name);
  const toast = m => window.toast?.(m) || (() => { const t=document.createElement('div'); t.className='toast show'; t.textContent=m; document.body.appendChild(t); setTimeout(()=>t.remove(),1800); })();
  const open = p => window.WORTHGO_FEATURES?.openPlace?.(p);
  const state = {q:'', category:'', venue:'', food:'', meal:'', experience:'', budget:'', area:'', sort:'worth'};
  const matches = () => {
    let rows = data(); const q = state.q.trim().toLowerCase();
    if (q) rows = rows.filter(p => [p.name,p.area,p.whyGo,p.whySkip,p.type,p.venueType,...categories(p),...meals(p),...experiences(p)].join(' ').toLowerCase().includes(q));
    if (state.category) rows = rows.filter(p => categories(p).some(x => String(x).toLowerCase() === state.category.toLowerCase()) || String(venue(p)).toLowerCase() === state.category.toLowerCase());
    if (state.venue) rows = rows.filter(p => venue(p) === state.venue);
    if (state.food) rows = rows.filter(p => categories(p).includes(state.food));
    if (state.meal) rows = rows.filter(p => meals(p).includes(state.meal));
    if (state.experience) rows = rows.filter(p => experiences(p).includes(state.experience));
    if (state.budget) rows = rows.filter(p => Number(p.budget?.min ?? Infinity) <= Number(state.budget));
    if (state.area) rows = rows.filter(p => p.area === state.area);
    if (state.sort === 'rating') rows.sort((a,b) => rating(b)-rating(a));
    else if (state.sort === 'price') rows.sort((a,b) => Number(a.budget?.min ?? Infinity)-Number(b.budget?.min ?? Infinity));
    else if (state.sort === 'name') rows.sort((a,b) => String(a.name).localeCompare(String(b.name)));
    else rows.sort((a,b) => (Number(b.researchConfidence)||0)+(rating(b)*3)-(Number(a.researchConfidence)||0)-(rating(a)*3));
    return rows;
  };
  const card = p => {
    const r=review(p), tags=categories(p).slice(0,2), photo=window.photoUrl?.(p.name)||'';
    return `<article class="wg-browse-card" data-browse-id="${esc(p.id ?? p.name)}"><div class="wg-browse-media">${photo?`<img src="${photo}" alt="${esc(p.name)}" loading="lazy" decoding="async">`:'<span>WorthGo</span>'}<button class="wg-browse-heart" type="button" aria-label="Save ${esc(p.name)}">${isSaved(p)?'♥':'♡'}</button></div><div class="wg-browse-body"><div class="wg-browse-line"><span>${esc(venue(p)||'Discovery')}</span><strong>${cfg().symbol}${esc(p.budget?.max??'—')}</strong></div><h3>${esc(p.name)}</h3><p>${esc(p.whyGo||'A WorthGo research pick.')}</p><div class="wg-browse-tags">${tags.map(x=>`<span>${esc(x)}</span>`).join('')}${p.area?`<span>📍 ${esc(p.area)}</span>`:''}</div><div class="wg-browse-proof">${r.rating?`★ ${esc(r.rating)}`:''}${r.reviewCount?` · ${esc(r.reviewCount)} reviews`:''}${p.duration?.min!=null?` · ${esc(p.duration.min)}–${esc(p.duration.max)} min`:''}</div><button class="wg-browse-add" type="button">＋ Add to My Day</button></div></article>`;
  };
  const options=(values,label)=>`<option value="">${label}</option>${[...new Set(values.filter(Boolean))].sort().map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('')}`;
  const build=()=>{const host=document.querySelector('#wgBrowse');if(!host)return;const rows=matches();host.querySelector('.wg-browse-count').textContent=`${rows.length} ${city()} ${rows.length===1?'place':'places'}`;host.querySelector('.wg-browse-grid').innerHTML=rows.length?rows.map(card).join(''):'<div class="wg-browse-empty"><strong>No places match those filters.</strong><p>Clear one or more filters and try again.</p></div>';host.querySelectorAll('.wg-browse-card').forEach(c=>{const p=rows.find(x=>String(x.id??x.name)===String(c.dataset.browseId));c.addEventListener('click',e=>{if(e.target.closest('button'))return;open(p)});c.querySelector('.wg-browse-heart')?.addEventListener('click',e=>{e.stopPropagation();const a=saved(),i=a.indexOf(p.name);if(i>=0){a.splice(i,1);e.currentTarget.textContent='♡';toast('Removed from saved places')}else{a.push(p.name);e.currentTarget.textContent='♥';toast('Saved locally')}localStorage.setItem(saveKey,JSON.stringify([...new Set(a)].slice(0,100)))});c.querySelector('.wg-browse-add')?.addEventListener('click',e=>{e.stopPropagation();if(window.WORTHGO_DAY?.add){window.WORTHGO_DAY.add(p);toast('Added to My Day')}else toast('My Day is unavailable')})})};
  const mount=()=>{if(document.querySelector('#wgBrowse'))return;const finder=document.querySelector('.finder');if(!finder)return;const section=document.createElement('section');section.id='wgBrowse';section.className='wg-browse shell';section.innerHTML=`<div class="wg-browse-head"><div><span class="kicker">EXPLORE THE CITY</span><h2>All places in ${city()}</h2><p>Browse everything first. Then narrow it down to what fits you.</p></div><span class="wg-browse-count"></span></div><div class="wg-searchbar"><span>⌕</span><input id="wgBrowseSearch" type="search" placeholder="Search restaurants, food, areas or things to do…" autocomplete="off"><button type="button" id="wgBrowseClear">Clear</button></div><div class="wg-chip-row" id="wgCategoryChips"></div><div class="wg-filterbar"><button type="button" class="wg-filter-toggle" id="wgFilterToggle">☷ Filters</button><select id="wgSort">${options(['worth','rating','price','name'],'Sort: WorthGo picks')}</select><span class="wg-active-count" id="wgActiveCount">No filters</span></div><div class="wg-filter-panel" id="wgFilterPanel"><div><label>Venue<select id="wgVenue">${options([],'Any venue')}</select></label><label>Food<select id="wgFood">${options([],'Any food')}</select></label><label>When<select id="wgMeal">${options([],'Any time')}</select></label><label>Experience<select id="wgExperience">${options([],'Any experience')}</select></label><label>Budget<select id="wgBudget">${options([],'Any budget')}</select></label><label>Area<select id="wgArea">${options(cfg().areas.slice(1),'Any area')}</select></label></div><button type="button" class="wg-clear-filters" id="wgClearFilters">Clear all filters</button></div><div class="wg-browse-grid"></div>`;finder.after(section);wire(section);build()};
  const wire=host=>{
    const populate=()=>{const rows=data();const freq={};rows.forEach(p=>categories(p).forEach(x=>freq[x]=(freq[x]||0)+1));const popular=Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,12).map(x=>x[0]);host.querySelector('#wgCategoryChips').innerHTML=['All',...popular].map((x,i)=>`<button type="button" class="wg-chip ${i===0?'active':''}" data-cat="${esc(i===0?'':x)}">${esc(x)}</button>`).join('');host.querySelector('#wgVenue').innerHTML=options(rows.map(venue),'Any venue');host.querySelector('#wgFood').innerHTML=options(rows.flatMap(categories),'Any food');host.querySelector('#wgMeal').innerHTML=options(rows.flatMap(meals),'Any time');host.querySelector('#wgExperience').innerHTML=options(rows.flatMap(experiences),'Any experience');host.querySelector('#wgBudget').innerHTML=options(city()==='Dubai'?[20,50,100,250].map(String):['250','500','1000','1500'],'Any budget');host.querySelector('#wgArea').innerHTML=options(cfg().areas.slice(1),'Any area')};
    populate();
    const updateActive=()=>{const n=Object.entries(state).filter(([k,v])=>k!=='sort'&&v).length;host.querySelector('#wgActiveCount').textContent=n?`${n} filter${n===1?'':'s'} applied`:'No filters'};
    const controls=[['#wgBrowseSearch','q'],['#wgVenue','venue'],['#wgFood','food'],['#wgMeal','meal'],['#wgExperience','experience'],['#wgBudget','budget'],['#wgArea','area'],['#wgSort','sort']];controls.forEach(([sel,key])=>host.querySelector(sel)?.addEventListener('input',e=>{state[key]=e.target.value;updateActive();build()}));
    host.querySelectorAll('.wg-chip').forEach(b=>b.addEventListener('click',()=>{state.category=b.dataset.cat||'';host.querySelectorAll('.wg-chip').forEach(x=>x.classList.toggle('active',x===b));updateActive();build()}));
    host.querySelector('#wgFilterToggle').onclick=()=>host.querySelector('#wgFilterPanel').classList.toggle('show');
    const clear=()=>{Object.keys(state).forEach(k=>state[k]='');state.sort='worth';host.querySelector('#wgBrowseSearch').value='';host.querySelectorAll('select').forEach(s=>s.value='');host.querySelectorAll('.wg-chip').forEach((b,i)=>b.classList.toggle('active',i===0));updateActive();build();toast('All browse filters cleared')};host.querySelector('#wgBrowseClear').onclick=clear;host.querySelector('#wgClearFilters').onclick=clear;
    const pill=document.querySelector('.city-pill');host.dataset.city=city();if(pill){const observer=new MutationObserver(()=>{const current=city();if(host.dataset.city!==current){host.dataset.city=current;populate();state.area='';host.querySelector('#wgArea').value='';build()}});observer.observe(pill,{subtree:true,childList:true,characterData:true})}
  };
  const loadSiteUx=()=>{if(document.getElementById('worthgoSiteUx'))return;const link=document.createElement('link');link.id='worthgoSiteUx';link.rel='stylesheet';link.href='site-ux.css';document.head.appendChild(link)};
  const init=()=>{loadSiteUx();mount()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
