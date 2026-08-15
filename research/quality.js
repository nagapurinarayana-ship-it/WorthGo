/* WorthGo research confidence layer. It measures evidence quality; it never becomes a fake user rating. */
(function(){
  function confidence(p){
    const sources=p.sources||[];
    const official=sources.some(s=>/official|tourism|government/i.test(s));
    const google=sources.some(s=>/google|business/i.test(s));
    const independent=sources.filter(s=>!/(google|official|tourism|government)/i.test(s)).length;
    const review=p.reviewSignal||p.reviewSignals;
    let score=0;
    score+=official?25:google?20:15;
    score+=Math.min(20,Math.max(0,(sources.length-1)*5));
    if(review){const count=review.reviewCount??review.googleReviewCount??0;score+=count>=10000?15:count>=1000?12:count>=100?8:4;}
    const verified=p.lastVerified?Math.max(0,Math.floor((Date.now()-new Date(p.lastVerified))/86400000)):365;
    score+=verified<=30?15:verified<=90?12:verified<=180?8:4;
    const complete=['whyGo','whySkip','budget','duration','area','bestFor','classification'].filter(k=>p[k]!==undefined).length;
    score+=Math.round((complete/7)*15);
    score+=Math.min(10,independent*3);
    return Math.max(0,Math.min(100,score));
  }
  function band(s){return s>=85?'Verified':s>=70?'Strong research':s>=55?'Researching':'Needs verification'}
  function apply(){
    Object.values(window.WORTHGO_DATA||{}).forEach(list=>list.forEach(p=>{p.researchConfidence=confidence(p);p.researchBand=band(p.researchConfidence)}));
    document.querySelectorAll('.place-card').forEach(card=>{
      const title=card.querySelector('h3')?.textContent.trim();
      const p=Object.values(window.WORTHGO_DATA||{}).flat().find(x=>x.name===title);
      if(!p)return;
      let badge=card.querySelector('.confidence-badge');
      if(!badge){badge=document.createElement('span');badge.className='confidence-badge';card.querySelector('.place-meta')?.appendChild(badge)}
      badge.textContent=`${p.researchBand} · ${p.researchConfidence}/100`;
    });
  }
  window.WORTHGO_QUALITY={confidence,band,refresh:apply};
  apply();
  document.addEventListener('DOMContentLoaded',apply);
  const observer=new MutationObserver(()=>apply());
  const host=document.querySelector('.cards');
  if(host)observer.observe(host,{childList:true,subtree:true});
})();
