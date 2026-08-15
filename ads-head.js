/* WorthGo monetization: provider-supplied popunder, loaded once from <head>. */
(function(){
  if(document.querySelector('script[data-worthgo-popunder]')) return;
  var s=document.createElement('script');
  s.src='https://pl30857288.effectivecpmnetwork.com/12/10/8e/12108ef7df6279e38a91d22f7aade90a.js';
  s.dataset.worthgoPopunder='1';
  document.head.appendChild(s);
})();
