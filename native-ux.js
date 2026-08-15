/* WorthGo native UX: progressive discovery without changing core feature logic. */
(function(){
  'use strict';
  const init=()=>{
    const app=document.querySelector('main');
    if(app) app.classList.add('wg-native');
    document.querySelectorAll('input[type="search"],input[placeholder*="Search" i]').forEach(el=>el.classList.add('wg-search'));
    document.querySelectorAll('button').forEach(btn=>{
      const t=(btn.textContent||'').trim().toLowerCase();
      if(t.includes('clear')||t.includes('reset')) btn.classList.add('wg-clear');
      if(t.includes('go to matches')||t==='go') btn.classList.add('wg-go');
    });
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
