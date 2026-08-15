/* WorthGo monetization: clearly separated sponsored slots. */
(function(){
  function addAfter(ref,node){ref.parentNode.insertBefore(node,ref.nextSibling)}
  function slot(label,html,cls){var s=document.createElement('section');s.className='ad-slot '+(cls||'');s.setAttribute('aria-label','Sponsored');s.innerHTML='<span class="ad-slot-label">Sponsored</span>'+html;return s}
  function init(){
    var finder=document.querySelector('#finder');
    var discover=document.querySelector('.discover');
    if(finder&&!document.querySelector('[data-wg-native-ad]')){
      var native=slot('Sponsored','<script async="async" data-cfasync="false" src="https://pl30857285.effectivecpmnetwork.com/783069879d6d81d952419969a59fc985/invoke.js"><\\/script><div id="container-783069879d6d81d952419969a59fc985"></div>','ad-native');
      native.dataset.wgNativeAd='1'; addAfter(finder,native);
    }
    if(discover&&!document.querySelector('[data-wg-banner-ad]')){
      var banner=slot('Sponsored','<div class="ad-banner-inner"></div>','ad-banner');
      banner.dataset.wgBannerAd='1'; addAfter(discover,banner);
      var inner=banner.querySelector('.ad-banner-inner');
      var cfg=document.createElement('script');cfg.text="atOptions = { 'key' : 'fb72b1a08c3d55bfb8e97d02df50e3cc', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };";inner.appendChild(cfg);
      var src=document.createElement('script');src.src='https://www.highperformanceformat.com/fb72b1a08c3d55bfb8e97d02df50e3cc/invoke.js';inner.appendChild(src);
    }
    if(!document.querySelector('[data-wg-smartlink]')){
      var footer=document.querySelector('.footer');
      if(footer){var smart=slot('Sponsored','<a class="ad-sponsored-link" href="https://www.effectivecpmnetwork.com/p6awrcwi?key=c4cd285d80f323e5736a66847eb18739" rel="sponsored nofollow noopener">Sponsored</a>','ad-smartlink');smart.dataset.wgSmartlink='1';addAfter(footer,smart)}
    }
    if(!document.querySelector('[data-wg-socialbar]')){
      var social=document.createElement('div');social.dataset.wgSocialbar='1';
      var s=document.createElement('script');s.src='https://pl30857284.effectivecpmnetwork.com/b8/05/00/b80500102672bd33e34082cbcb589f42.js';social.appendChild(s);document.body.appendChild(social);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
