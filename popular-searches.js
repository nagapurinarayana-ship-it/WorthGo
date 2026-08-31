/* Visible search-intent section for local discovery pages. */
(function(){
  'use strict';
  if(document.querySelector('[data-worthgo-popular-searches]'))return;
  const path=location.pathname;const city=path.startsWith('/dubai')?'Dubai':'Hyderabad';
  const terms=city==='Dubai'?['best restaurants in Dubai','cheap eats in Dubai','Dubai street food','hidden gems in Dubai','things to do in Dubai','Old Dubai places to visit','Karama Deira Satwa food','affordable restaurants in Dubai']:['best restaurants in Hyderabad','best biryani in Hyderabad','Hyderabad tiffin centres','best breakfast in Hyderabad','Irani chai Hyderabad','hidden places in Hyderabad','things to do in Hyderabad','places to visit in Hyderabad','budget food Hyderabad','date places Hyderabad'];
  const section=document.createElement('section');section.dataset.worthgoPopularSearches='1';section.className='seo-intro shell';section.innerHTML='<span class="kicker">POPULAR '+city.toUpperCase()+' SEARCHES</span><h2>More ways people explore '+city+'</h2><p>Use these common search themes as starting points, then open the focused WorthGo guides or Finder to narrow places by area, time, budget and experience.</p><div style="display:flex;flex-wrap:wrap;gap:9px;margin-top:14px">'+terms.map(t=>'<span style="padding:7px 10px;border:1px solid #e7e2d8;border-radius:999px;background:#fffdf8;font-size:13px">'+t+'</span>').join('')+'</div>';
  const footer=document.querySelector('footer');if(footer&&footer.parentNode)footer.parentNode.insertBefore(section,footer);else document.body.appendChild(section);
})();
