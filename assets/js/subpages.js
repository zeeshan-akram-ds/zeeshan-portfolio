/* Theme toggle, mobile menu and call-booking click tracking for the About and case-study pages. */
(function(){
  var root=document.documentElement,btn=document.getElementById('theme-toggle');
  if(btn){
    var label=function(){btn.setAttribute('aria-label',root.getAttribute('data-theme')==='dark'?'Switch to light theme':'Switch to dark theme');};
    label();
    btn.addEventListener('click',function(){
      var next=root.getAttribute('data-theme')==='dark'?'light':'dark';
      root.setAttribute('data-theme',next);
      try{localStorage.setItem('ml-theme',next);}catch(e){}
      label();
    });
  }
})();
(function(){
  var btn=document.getElementById('menu-btn'),nav=document.getElementById('site-nav');
  if(!btn||!nav){return;}
  function set(open){nav.classList.toggle('open',open);btn.setAttribute('aria-expanded',open?'true':'false');btn.setAttribute('aria-label',open?'Close menu':'Open menu');}
  btn.addEventListener('click',function(){set(!nav.classList.contains('open'));});
  nav.addEventListener('click',function(e){if(e.target.closest('a')){set(false);}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){set(false);btn.focus();}});
})();
document.querySelectorAll('a[data-cta]').forEach(function(a){
  a.addEventListener('click',function(){
    if(typeof gtag==='function'){gtag('event','book_call_click',{cta_location:a.getAttribute('data-cta')});}
  });
});
