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

    /* Native Banner: immediately after Finder, before WorthGo results. */
    if(!document.querySelector('[data-wg-native-ad]')){
      var native=slot('ad-native');
      native.section.dataset.wgNativeAd='1';
      var nativeContainer=document.createElement('div');
      nativeContainer.id='container-783069879d6d81d952419969a59fc985';
      native.body.appendChild(nativeContainer);
      native.body.appendChild(externalScript(
        'https://pl30857285.effectivecpmnetwork.com/783069879d6d81d952419969a59fc985/invoke.js',
        {'async':'async','data-cfasync':'false'}
      ));
      addAfter(finder,native.section);
    }

    /* 728x90 Banner: directly after Native Banner and still before results. */
    if(!document.querySelector('[data-wg-banner-ad]')){
      var anchor=document.querySelector('[data-wg-native-ad]')||finder;
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

    /* Smartlink remains in the footer; it never interrupts discovery/results. */
    if(!document.querySelector('[data-wg-smartlink]')){
      var footer=document.querySelector('.footer');
      if(footer){
        var smart=slot('ad-smartlink');
        smart.section.dataset.wgSmartlink='1';
        var a=document.createElement('a');
        a.className='ad-sponsored-link';
        a.href='https://www.effectivecpmnetwork.com/p6awrcwi?key=c4cd285d80f323e5736a66847eb18739';
        a.rel='sponsored nofollow noopener';
        a.textContent='Sponsored link';
        smart.body.appendChild(a);
        addAfter(footer,smart.section);
      }
    }

    /* Intentionally no Social Bar: it is a viewport-level overlay and would cover the header. */
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
