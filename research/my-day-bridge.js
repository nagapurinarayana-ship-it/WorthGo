/* Make the homepage's Build a Day action persist the visible recommendations without a backend. */
(function(){
  const KEY='worthgo-my-day-v1';
  document.addEventListener('click',e=>{
    const button=e.target.closest('[data-build]');
    if(!button)return;
    const names=[...document.querySelectorAll('.cards .place-card h3')].map(x=>x.textContent.trim()).filter(Boolean).slice(0,3);
    if(!names.length)return;
    try{
      const current=JSON.parse(localStorage.getItem(KEY)||'[]');
      const merged=[...current,...names.filter(n=>!current.includes(n))].slice(0,12);
      localStorage.setItem(KEY,JSON.stringify(merged));
      const count=document.querySelector('.day-count');
      if(count)count.textContent=merged.length;
    }catch{}
  },true);
})();
