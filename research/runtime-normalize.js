/* Normalize legacy research fields, merge the current static expansion and remove known duplicate identities before recommendations run. */
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
  const aliases={'Ravi Restaurant — Satwa':'Ravi Restaurant'};
  Object.values(window.WORTHGO_DATA||{}).forEach(list=>{
    const seen=new Set();
    for(let i=list.length-1;i>=0;i--){const key=aliases[list[i].name]||list[i].name;if(seen.has(key))list.splice(i,1);else seen.add(key)}
    list.forEach(p=>{
      if(!p.reviewSignal&&p.reviewSignals){const r=p.reviewSignals;const rating=Number(r.googleRating??r.rating);const reviewCount=Number(r.googleReviewCount??r.reviewCount??0);if(Number.isFinite(rating))p.reviewSignal={source:'Google/business research',rating,reviewCount,reviewThemes:r.reviewThemes||[]};}
      if(p.reviewSignal&&!Number.isFinite(Number(p.reviewSignal.rating)))delete p.reviewSignal.rating;
    });
  });
})();
