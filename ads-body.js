/* WorthGo monetization: ads appear only after the primary Finder UI and before results. */
(function(){
  'use strict';
  function addAfter(ref,node){if(ref&&ref.parentNode)ref.parentNode.insertBefore(node,ref.nextSibling)}
  function slot(cls){
    var s=document.createElement('section');
    s.className='ad-slot '+(cls||'');
    s.setAttribute('aria-label','Sponsored');
    var label=document.createElement('span');
    label.className='ad-slot-label';
    label.textContent='Sponsored';
    s.appendChild(label);
    var body=document.createElement('div');
    body.className='ad-slot-body';
    s.appendChild(body);
    return {section:s,body:body};
  }
  function externalScript(src,attrs){
    var s=document.createElement('script');
    s.src=src;
    if(attrs)Object.keys(attrs).forEach(function(k){s.setAttribute(k,attrs[k])});
    return s;
  }
  function init(){
    var finder=document.querySelector('#finder');
    if(!finder)return;

    /* 728x90 Banner: directly after Finder and before results. */
    if(!document.querySelector('[data-wg-banner-ad]')){
      var anchor=finder;
      var banner=slot('ad-banner');
      banner.section.dataset.wgBannerAd='1';
      var cfg=document.createElement('script');
      cfg.text="atOptions = { 'key' : 'fb72b1a08c3d55bfb8e97d02df50e3cc', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };";
      banner.body.appendChild(cfg);
      banner.body.appendChild(externalScript(
        'https://www.highperformanceformat.com/fb72b1a08c3d55bfb8e97d02df50e3cc/invoke.js'
      ));
      addAfter(anchor,banner.section);
    }

  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
