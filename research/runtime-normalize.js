/* Normalize legacy research fields and merge the current static research expansion before the browser recommendation engine runs. */
(function(){
  const expansion=window.WORTHGO_DATA_EXPANSION||window.WORTHGO_EXPANSION;
  if(expansion&&window.WORTHGO_DATA){
    Object.entries(expansion).forEach(([city,items])=>{
      const base=window.WORTHGO_DATA[city]||[];
      const seen=new Set(base.map(p=>p.id));
      items.forEach(p=>{if(!seen.has(p.id)){base.push(p);seen.add(p.id);}});
      window.WORTHGO_DATA[city]=base;
    });
  }
  Object.values(window.WORTHGO_DATA||{}).forEach(list=>list.forEach(p=>{
    if(!p.reviewSignal&&p.reviewSignals){
      const r=p.reviewSignals;
      const rating=Number(r.googleRating??r.rating);
      const reviewCount=Number(r.googleReviewCount??r.reviewCount??0);
      if(Number.isFinite(rating))p.reviewSignal={source:'Google/business research',rating,reviewCount,reviewThemes:r.reviewThemes||[]};
    }
    if(p.reviewSignal&&!Number.isFinite(Number(p.reviewSignal.rating)))delete p.reviewSignal.rating;
  }));
})();
