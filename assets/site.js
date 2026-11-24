{
  /* ---- Config: replace before going live ---- */
  const GA_ID = 'G-XXXXXXXXXX';          // Google Analytics 4 measurement ID (loaded only after consent)
  const FORM_ENDPOINT = '';               // URL of the form handler, e.g. the existing /contact processor. Empty = demo mode.

  const store = {
    get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } },
    set(k,v){ try { localStorage.setItem(k,v); } catch(e){} }
  };

  /* Mobile menu */
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('nav.main');
  const header = document.querySelector('header.site');
  function setMenu(open){
    if (!menuBtn || !nav) return;
    header.classList.toggle('nav-open', open);
    if (open) document.documentElement.style.setProperty('--nav-top', header.getBoundingClientRect().bottom + 'px');
    nav.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('.lbl').textContent = open ? 'Close' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });
  }
  document.querySelectorAll('.sub-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = document.getElementById(btn.getAttribute('aria-controls'));
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      if (sub) sub.classList.toggle('open', open);
    });
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1020 && nav && nav.classList.contains('open')) setMenu(false);
  });

  /* Cookie consent (GA4 loads only after Accept) */
  const banner = document.querySelector('.cookie');
  function loadGA(){
    if (!GA_ID || GA_ID.includes('XXXX') || window.__gaLoaded) return;
    window.__gaLoaded = true;
    const s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', GA_ID, { anonymize_ip: true });
  }
  const choice = store.get('urs-cookies');
  if (choice === 'accept') loadGA();
  else if (!choice && banner) banner.classList.add('show');
  document.querySelectorAll('[data-cookie]').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.cookie;
    if (v === 'settings') { banner && banner.classList.add('show'); return; }
    store.set('urs-cookies', v);
    banner && banner.classList.remove('show');
    if (v === 'accept') loadGA();
  }));

  /* Quote / contact form */
  const form = document.querySelector('form.quote-form');
  if (form) {
    const msg = form.querySelector('.form-msg');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      msg.className = 'form-msg';
      if (!form.checkValidity()) {
        msg.textContent = 'Please fill in the required fields marked with *.';
        msg.classList.add('err'); form.reportValidity(); return;
      }
      if (!FORM_ENDPOINT) {
        msg.textContent = 'Preview only: this form is not connected yet, so nothing was sent. Please call 020 3667 6781.';
        msg.classList.add('err'); return;
      }
      try {
        const r = await fetch(FORM_ENDPOINT, { method:'POST', body:new FormData(form) });
        if (!r.ok) throw new Error();
        form.reset();
        msg.textContent = 'Thanks, your request has been sent. We will be in touch shortly.';
        msg.classList.add('ok');
      } catch(err) {
        msg.textContent = 'Sorry, something went wrong. Please call us on 020 3667 6781.';
        msg.classList.add('err');
      }
    });
  }

  /* Header shadow on scroll */
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive:true }); onScroll();

  /* Reveal on scroll */
  const rev = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin:'0px 0px -8% 0px' });
    rev.forEach((el, i) => { el.style.transitionDelay = (el.dataset.reveal || 0) + 'ms'; io.observe(el); });
  } else rev.forEach(el => el.classList.add('in'));

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
}
