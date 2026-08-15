(() => {
  const SAVE_KEY='worthgo-saved-v1';
  const getSaved=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'[]')}catch{return[]}};
  const setSaved=items=>localStorage.setItem(SAVE_KEY,JSON.stringify([...new Set(items)].slice(0,100)));
  const toast=msg=>window.toast?.(msg)||(()=>{const t=document.createElement('div');t.className='toast show';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)})();
  const placeName=card=>card?.querySelector('h3')?.textContent.trim();
  const persistCardSave=card=>{const name=placeName(card);if(!name)return;const saved=getSaved();const button=card.querySelector('.save');if(!button)return;const isSaved=saved.includes(name);const nextSaved=!isSaved;setSaved(nextSaved?[...saved,name]:saved.filter(x=>x!==name));const text=nextSaved?'♥':'♡';if(button.textContent!==text)button.textContent=text;if(button.getAttribute('aria-pressed')!==String(nextSaved))button.setAttribute('aria-pressed',String(nextSaved));toast(nextSaved?'Saved locally':'Removed from saved places')};
  const syncSaveButtons=()=>document.querySelectorAll('.place-card .save').forEach(b=>{const card=b.closest('.place-card');const saved=getSaved().includes(placeName(card));const text=saved?'♥':'♡';const pressed=String(saved);if(b.textContent!==text)b.textContent=text;if(b.getAttribute('aria-pressed')!==pressed)b.setAttribute('aria-pressed',pressed)});
  const fixBuildDay=()=>{const button=document.querySelector('[data-build]');if(!button||button.dataset.wgFixed)return;button.dataset.wgFixed='1';button.addEventListener('click',()=>{setTimeout(()=>{const names=[...document.querySelectorAll('.place-card h3')].slice(0,3).map(x=>x.textContent.trim()).filter(Boolean);if(window.WORTHGO_DAY?.add&&names.length){names.forEach(name=>window.WORTHGO_DAY.add(name));toast(`${names.length} places added to My Day`)}},50)});};
  const shareDetail=async e=>{const btn=e.target.closest('[data-share-detail]');if(!btn)return;const modal=btn.closest('.wg-modal');const name=modal?.querySelector('h2')?.textContent.trim();if(!name)return;const city=/Dubai/i.test(document.querySelector('.city-pill')?.textContent||'')?'Dubai':'Hyderabad';const place=Object.values(window.WORTHGO_DATA||{}).flat().find(p=>p.name===name);const id=place?.id||name;const url=`${location.origin}${location.pathname}?city=${encodeURIComponent(city)}&place=${encodeURIComponent(id)}`;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();try{if(navigator.share)await navigator.share({title:`${name} · WorthGo`,text:`${name} — WorthGo`,url});else{await navigator.clipboard.writeText(url);toast('Place link copied')}}catch{toast('Place link ready to share')}};
  const runQuery=()=>{const q=new URLSearchParams(location.search).get('q');if(!q)return;const input=document.querySelector('#wgSearch');if(!input)return;input.value=q;document.querySelector('#wgSearchBtn')?.click()};

  // Shared place URLs are resolved by features.js using the place ID. After a city
  // switch, replay popstate so the existing ID-based resolver opens the exact place.
  const fixCityPlaceUrl=()=>{const params=new URLSearchParams(location.search);const requestedCity=params.get('city');const place=params.get('place');if(!requestedCity||!place||!/^(Hyderabad|Dubai)$/i.test(requestedCity))return;const current=/Dubai/i.test(document.querySelector('.city-pill')?.textContent||'')?'Dubai':'Hyderabad';if(current.toLowerCase()===requestedCity.toLowerCase()){setTimeout(()=>window.dispatchEvent(new PopStateEvent('popstate')),0);return}const pill=document.querySelector('.city-pill');if(!pill)return;pill.click();setTimeout(()=>{const option=[...document.querySelectorAll('.quick-options button,.quick-sheet button')].find(b=>b.textContent.trim().toLowerCase().includes(requestedCity.toLowerCase()));if(option){option.click();setTimeout(()=>window.dispatchEvent(new PopStateEvent('popstate')),220)}},100)};

  // Advanced filters should refine results in place. The app may request a scroll
  // after each change; immediately restore the filter panel position. The user
  // explicitly chooses when to jump to the actual matches with the Go button.
  const installFilterGoUX=()=>{const box=document.querySelector('.advanced-filters');if(!box||box.dataset.wgGoInstalled)return;box.dataset.wgGoInstalled='1';const grid=box.querySelector('.advanced-grid');if(!grid)return;const actions=document.createElement('div');actions.className='wg-filter-actions';actions.innerHTML='<span class="wg-filter-hint" aria-live="polite">Choose any filters you want, compare the matches, then tap Go.</span><button type="button" class="primary-btn wg-filter-go">Go to matches →</button>';grid.after(actions);const go=actions.querySelector('.wg-filter-go');go.addEventListener('click',()=>{const discover=document.querySelector('.discover');if(!discover)return;discover.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>{const first=discover.querySelector('.place-card');first?.setAttribute('tabindex','-1');first?.focus({preventScroll:true});},450)});};
  const protectFilterScroll=()=>{document.addEventListener('change',e=>{const select=e.target.closest?.('.advanced-filter');if(!select)return;const box=select.closest('.advanced-filters');if(!box)return;const anchor=box.getBoundingClientRect().top+window.scrollY-16;const restore=()=>{if(document.activeElement===select||document.activeElement?.closest?.('.advanced-filters'))window.scrollTo({top:anchor,behavior:'auto'});};requestAnimationFrame(()=>requestAnimationFrame(restore));setTimeout(restore,140);setTimeout(restore,320)},true)};
  const updateFilterHint=()=>{const hint=document.querySelector('.wg-filter-hint');if(!hint)return;const selected=[...document.querySelectorAll('.advanced-filter')].filter(x=>x.value).length;hint.textContent=selected?`${selected} filter${selected===1?'':'s'} selected · compare the matches below, then tap Go.`:'Choose any filters you want, compare the matches, then tap Go.'};

  const fixStaleMenu=()=>{const replace=()=>document.querySelectorAll('body *').forEach(el=>{if(el.children.length===0&&/More WorthGo features will arrive after the core Finder is finished/i.test(el.textContent||''))el.textContent='Everything you need to discover, save and plan with WorthGo.'});replace();document.addEventListener('click',e=>{if(e.target.closest('.menu-btn'))setTimeout(replace,0)});};
  const init=()=>{
    document.addEventListener('click',e=>{const save=e.target.closest('.place-card .save');if(save){e.preventDefault();e.stopPropagation();persistCardSave(save.closest('.place-card'))}},true);
    document.addEventListener('click',shareDetail,true);
    protectFilterScroll();
    let queued=false;
    const observer=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;syncSaveButtons();fixBuildDay();installFilterGoUX();updateFilterHint()})});
    observer.observe(document.body,{childList:true,subtree:true});
    syncSaveButtons();
    fixBuildDay();
    installFilterGoUX();
    updateFilterHint();
    document.addEventListener('change',e=>{if(e.target.closest?.('.advanced-filter'))setTimeout(updateFilterHint,0)},true);
    runQuery();
    fixCityPlaceUrl();
    fixStaleMenu();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();