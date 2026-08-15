/* Keep static research layers from publishing duplicate venue identities. */
(function(){
  const aliases={'Ravi Restaurant — Satwa':'Ravi Restaurant'};
  Object.values(window.WORTHGO_DATA||{}).forEach(list=>{
    const seen=new Set();
    for(let i=list.length-1;i>=0;i--){const p=list[i];const key=aliases[p.name]||p.name;if(seen.has(key)){list.splice(i,1)}else{seen.add(key)}}
  });
})();
