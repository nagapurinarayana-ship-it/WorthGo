/* WorthGo native UX — explicit hooks only; never infer UI from button text. */
(function(){
  'use strict';
  function init(){
    const main=document.querySelector('#top');
    if(main) main.classList.add('wg-native');
    document.querySelectorAll('#finder input[type="search"], #finder .search-input, #finder [data-role="search"]').forEach(el=>el.classList.add('wg-search'));
    document.querySelectorAll('[data-action="clear-filters"], [data-filter-clear]').forEach(el=>el.classList.add('wg-clear'));
    document.querySelectorAll('[data-action="go-to-matches"], [data-go-matches]').forEach(el=>el.classList.add('wg-go'));
    document.querySelectorAll('[data-role="quick-choices"], .quick-row').forEach(el=>el.classList.add('wg-quick'));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
