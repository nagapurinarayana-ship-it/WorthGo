/* WorthGo banner-only monetization: one isolated 728x90 placement after the Finder. */
(function(){
  'use strict';
  function init(){
    var finder=document.querySelector('#finder');
    if(!finder||document.querySelector('[data-wg-banner-ad]'))return;
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
    frame.setAttribute('sandbox','allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation');
    frame.setAttribute('referrerpolicy','no-referrer-when-downgrade');
    frame.srcdoc='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body><script>atOptions={key:"fb72b1a08c3d55bfb8e97d02df50e3cc",format:"iframe",height:90,width:728,params:{}};<\/script><script src="https://www.highperformanceformat.com/fb72b1a08c3d55bfb8e97d02df50e3cc/invoke.js"><\/script></body></html>';
    section.append(label,frame);
    finder.parentNode.insertBefore(section,finder.nextSibling);

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
    nativeFrame.setAttribute('sandbox','allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation');
    nativeFrame.setAttribute('referrerpolicy','no-referrer-when-downgrade');
    nativeFrame.srcdoc='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;overflow:auto;background:transparent}</style></head><body><script async data-cfasync="false" src="https://pl30857285.effectivecpmnetwork.com/783069879d6d81d952419969a59fc985/invoke.js"><\\/script><div id="container-783069879d6d81d952419969a59fc985"></div></body></html>';
    nativeSection.append(nativeLabel,nativeFrame);
    section.parentNode.insertBefore(nativeSection,section.nextSibling);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
