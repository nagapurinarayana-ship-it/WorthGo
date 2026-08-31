/* WorthGo sitewide discovery links plus existing isolated ad placements. */
(function(){
  'use strict';

  function addSearchTopics(){
    if(document.querySelector('[data-wg-search-topics]'))return;
    var path=location.pathname;
    var title='Popular local searches';
    var intro='Explore practical city guides using the same plain-language questions people use when deciding where to eat and what to do.';
    var links=[
      ['/hyderabad/','Hyderabad food & things to do'],
      ['/hyderabad/best-biryani','best biryani in Hyderabad'],
      ['/hyderabad/tiffin-centers','best tiffin centres in Hyderabad'],
      ['/hyderabad/best-breakfast','best breakfast in Hyderabad'],
      ['/dubai/','Dubai food & things to do'],
      ['/dubai/cheap-eats','cheap eats in Dubai'],
      ['/dubai/hidden-gems','hidden gems in Dubai']
    ];
    var topics=['restaurants near me','hidden gems','things to do','budget food','date places','family places','local favourites'];
    if(path.startsWith('/hyderabad')){
      title='Popular Hyderabad searches';
      intro='Find Hyderabad food and local discovery guides by dish, time of day, budget and type of outing.';
      links=[
        ['/hyderabad/best-biryani','best biryani in Hyderabad'],
        ['/hyderabad/tiffin-centers','Hyderabad tiffin centres'],
        ['/hyderabad/best-breakfast','best breakfast in Hyderabad'],
        ['/hyderabad/','Hyderabad food & things to do']
      ];
      topics=['Hyderabad restaurants','Irani chai Hyderabad','Hyderabad cafes','hidden places in Hyderabad','things to do in Hyderabad','places to visit in Hyderabad','budget food Hyderabad','date places Hyderabad','family places Hyderabad','late night food Hyderabad'];
    }else if(path.startsWith('/dubai')){
      title='Popular Dubai searches';
      intro='Explore Dubai by budget, neighbourhood and experience instead of assuming every worthwhile stop is expensive or tourist-heavy.';
      links=[
        ['/dubai/cheap-eats','cheap eats in Dubai'],
        ['/dubai/hidden-gems','hidden gems in Dubai'],
        ['/dubai/','Dubai food & things to do']
      ];
      topics=['affordable restaurants Dubai','budget food Dubai','Dubai street food','cheap breakfast Dubai','things to do in Dubai','places to visit in Dubai','Old Dubai food','Karama restaurants','Deira food','Satwa restaurants'];
    }
    var section=document.createElement('section');
    section.dataset.wgSearchTopics='1';
    section.setAttribute('aria-labelledby','wg-popular-searches-title');
    section.style.cssText='max-width:1120px;margin:38px auto;padding:0 20px';
    section.innerHTML='<div style="background:#fffdf8;border:1px solid #e7e2d8;border-radius:20px;padding:22px"><span style="font-size:12px;font-weight:800;letter-spacing:.1em;color:#d85f2b">SEARCH BY INTENT</span><h2 id="wg-popular-searches-title" style="margin:8px 0 8px">'+title+'</h2><p style="max-width:780px;color:#70746f;line-height:1.7;margin:0 0 14px">'+intro+'</p><nav aria-label="WorthGo popular guide searches" style="display:flex;flex-wrap:wrap;gap:9px;margin-bottom:14px">'+links.map(function(item){return '<a href="'+item[0]+'" style="display:inline-block;padding:8px 12px;border:1px solid #ded5c7;border-radius:999px;color:#6c3f23;text-decoration:none;font-weight:700;font-size:14px">'+item[1]+'</a>';}).join('')+'</nav><div aria-label="Related local discovery topics" style="display:flex;flex-wrap:wrap;gap:7px">'+topics.map(function(topic){return '<span style="padding:6px 9px;background:#f5efe5;border-radius:999px;font-size:13px;color:#595b56">'+topic+'</span>';}).join('')+'</div></div>';
    var footer=document.querySelector('footer');
    if(footer&&footer.parentNode)footer.parentNode.insertBefore(section,footer);else document.body.appendChild(section);
  }

  function init(){
    addSearchTopics();
    var finder=document.querySelector('#finder');
    if(document.querySelector('[data-wg-banner-ad]'))return;
    var section=document.createElement('section');
    section.className='ad-slot ad-banner';
    section.dataset.wgBannerAd='1';
    section.setAttribute('aria-label','Advertisement');
    var label=document.createElement('span');
    label.className='ad-slot-label';
    label.textContent='Advertisement';
    var frame=document.createElement('iframe');
    frame.title='Advertisement';
    frame.width='728';
    frame.height='90';
    frame.loading='eager';
    frame.style.cssText='display:block;width:728px;max-width:100%;height:90px;margin:8px auto 0;border:0;overflow:hidden';
    frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation');
    frame.setAttribute('referrerpolicy','no-referrer-when-downgrade');
    frame.srcdoc='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body><script>atOptions={key:"fb72b1a08c3d55bfb8e97d02df50e3cc",format:"iframe",height:90,width:728,params:{}};<\/script><script src="https://www.highperformanceformat.com/fb72b1a08c3d55bfb8e97d02df50e3cc/invoke.js"><\/script></body></html>';
    section.append(label,frame);
    if(finder&&finder.parentNode)finder.parentNode.insertBefore(section,finder.nextSibling);
    else (document.querySelector('main')||document.body).appendChild(section);

    var nativeSection=document.createElement('section');
    nativeSection.className='ad-slot ad-native';
    nativeSection.dataset.wgNativeAd='1';
    nativeSection.setAttribute('aria-label','Sponsored recommendations');
    var nativeLabel=document.createElement('span');
    nativeLabel.className='ad-slot-label';
    nativeLabel.textContent='Sponsored recommendations';
    var nativeFrame=document.createElement('iframe');
    nativeFrame.title='Sponsored recommendations';
    nativeFrame.width='100%';
    nativeFrame.height='280';
    nativeFrame.loading='lazy';
    nativeFrame.style.cssText='display:block;width:100%;max-width:760px;height:280px;margin:8px auto 0;border:0;overflow:hidden';
    nativeFrame.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation');
    nativeFrame.setAttribute('referrerpolicy','no-referrer-when-downgrade');
    nativeFrame.srcdoc='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;overflow:auto;background:transparent}</style></head><body><script async data-cfasync="false" src="https://pl30857285.effectivecpmnetwork.com/783069879d6d81d952419969a59fc985/invoke.js"><\/script><div id="container-783069879d6d81d952419969a59fc985"></div></body></html>';
    nativeSection.append(nativeLabel,nativeFrame);
    var extraLabel=document.createElement('span');
    extraLabel.className='ad-slot-label';
    extraLabel.textContent='More sponsored offers';
    var extraFrame=document.createElement('iframe');
    extraFrame.title='More sponsored offers';
    extraFrame.width='100%';
    extraFrame.height='140';
    extraFrame.loading='lazy';
    extraFrame.style.cssText='display:block;width:100%;max-width:760px;height:140px;margin:20px auto 0;border:0;overflow:hidden';
    extraFrame.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation');
    extraFrame.setAttribute('referrerpolicy','no-referrer-when-downgrade');
    extraFrame.srcdoc='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;min-height:120px;overflow:hidden;background:transparent}</style></head><body><script src="https://pl30857288.effectivecpmnetwork.com/12/10/8e/12108ef7df6279e38a91d22f7aade90a.js"><\/script><script src="https://pl30857284.effectivecpmnetwork.com/b8/05/00/b80500102672bd33e34082cbcb589f42.js"><\/script></body></html>';
    var smartLink=document.createElement('a');
    smartLink.className='ad-sponsored-link';
    smartLink.href='https://www.effectivecpmnetwork.com/p6awrcwi?key=c4cd285d80f323e5736a66847eb18739';
    smartLink.rel='sponsored nofollow noopener';
    smartLink.target='_blank';
    smartLink.textContent='Open sponsored offer';
    nativeSection.append(extraLabel,extraFrame,smartLink);
    section.parentNode.insertBefore(nativeSection,section.nextSibling);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();