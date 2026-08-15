/* Normalize legacy research fields before the browser recommendation engine runs. */
(function(){
  const lists=Object.values(window.WORTHGO_DATA||{});
  lists.flat().forEach(p=>{
    if(!p.reviewSignal && p.reviewSignals){
      const r=p.reviewSignals;
      const rating=Number(r.googleRating||r.rating);
      const reviewCount=Number(r.googleReviewCount||r.reviewCount||0);
      if(Number.isFinite(rating)) p.reviewSignal={source:'Google/business research',rating,reviewCount,reviewThemes:r.reviewThemes||[]};
    }
    if(p.reviewSignal && !Number.isFinite(Number(p.reviewSignal.rating))){delete p.reviewSignal.rating;}
  });
})();
