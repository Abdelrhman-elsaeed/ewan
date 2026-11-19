(() => {
  const root = document.documentElement;
  const button = document.querySelector('[data-language]');
  const menu = document.querySelector('#site-menu');
  const menuToggle = document.querySelector('.menu-toggle');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const pointer = matchMedia('(hover:hover) and (pointer:fine)');
  const en = {
    skip:'Skip to content',brand:'Ewan<small>Software</small>',navLabel:'Main navigation',menuLabel:'Menu',
    navServices:'Services',navWork:'Work',navProcess:'Process',navClients:'Clients',navAbout:'About',navFounder:'Founder',start:'Start a project',
    backAgency:'Ewan Software',role:'Founder & CEO',name:'<span class="founder-name-face">Abdelrahman<br>Badawy</span>',position:'Understand your work.<br> Make it easier.',
    intro:'I’m Abdelrahman, founder of Ewan. I work with you from the first conversation until the idea becomes a system that makes your team’s day easier.',
    talk:'Let’s talk',exploreVision:'See Ewan’s work',portraitAlt:'Abdelrahman Badawy, founder of Ewan Software',portraitName:'Abdelrahman Badawy',
    approachTitle:'From scattered tasks<br>to one clear system.',approachBody:'For Al Falah, we brought attendance, notices, and parent follow-ups into one place.',
    sceneBefore:'Scattered work',sceneCore:'Connect the steps',sceneAfter:'An easier working day',stackLabel:'Full-stack background',techLabel:'Technologies',
    studyLabel:'Education',studyTitle:'Electronics & Communications Engineering',studyBody:'Faculty of Engineering · Mansoura University',
    trainingLabel:'Technical training',trainingLogos:'Training organizations',contactTitle:'Tell me about your project.',footer:'© Ewan Software',backTop:'Back to top'
  };
  const textNodes = [...document.querySelectorAll('[data-f]')].map(node => [node,node.innerHTML]);
  const labels = [...document.querySelectorAll('[data-f-label]')].map(node => [node,node.getAttribute('aria-label')]);
  const images = [...document.querySelectorAll('[data-f-alt]')].map(node => [node,node.alt]);
  function setLanguage(lang) {
    root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    for (const [node,arabic] of textNodes) node.innerHTML = lang === 'ar' ? arabic : en[node.dataset.f];
    for (const [node,arabic] of labels) node.setAttribute('aria-label',lang === 'ar' ? arabic : en[node.dataset.fLabel]);
    for (const [node,arabic] of images) node.alt = lang === 'ar' ? arabic : en[node.dataset.fAlt];
    const name = document.querySelector('#founder-name');
    name.dataset.depth = name.innerText;
    button.lang = lang === 'ar' ? 'en' : 'ar'; button.textContent = lang === 'ar' ? 'EN' : 'عربي';
    button.setAttribute('aria-label',lang === 'ar' ? 'Switch to English' : 'غيّر اللغة إلى العربية');
    document.title = lang === 'ar' ? 'عبد الرحمن بدوي | المؤسس والرئيس التنفيذي لإيوان' : 'Abdelrahman Badawy | Founder & CEO of Ewan Software';
    document.querySelector('meta[name="description"]').content = lang === 'ar' ? 'عبد الرحمن بدوي، مؤسس إيوان للبرمجيات. من فهم المشكلة إلى نظام يجمع خطوات العمل ويسهّل يوم فريقك.' : 'Abdelrahman Badawy, founder of Ewan Software. From understanding the problem to building a system that makes your team’s work easier.';
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[property="og:description"]').content = document.querySelector('meta[name="description"]').content;
    document.dispatchEvent(new Event('ewan:language'));
  }
  let requested = new URLSearchParams(location.search).get('lang');
  if (requested !== 'ar' && requested !== 'en') {
    try { requested = localStorage.getItem('ewan-language'); } catch { /* Optional storage. */ }
  }
  setLanguage(requested === 'en' ? 'en' : 'ar');
  button.addEventListener('click',() => {
    setLanguage(root.lang === 'ar' ? 'en' : 'ar');
    try { localStorage.setItem('ewan-language',root.lang); } catch { /* Optional storage. */ }
    const url = new URL(location.href); url.searchParams.set('lang',root.lang); history.replaceState(null,'',url);
  });
  function closeMenu(focus = false) {
    menu.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded','false');
    if (focus) menuToggle.focus();
  }
  menuToggle.addEventListener('click',() => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded',String(open)); menu.classList.toggle('is-open',open);
  });
  menu.addEventListener('click',event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown',event => { if (event.key === 'Escape' && menu.classList.contains('is-open')) closeMenu(true); });
  document.addEventListener('pointerdown',event => { if (!event.target.closest('.nav-shell')) closeMenu(); });
  matchMedia('(max-width:1100px)').addEventListener('change',() => closeMenu());
  const header = () => document.body.classList.toggle('is-scrolled',scrollY > 48);
  addEventListener('scroll',header,{passive:true}); header();

  document.addEventListener('visibilitychange',() => root.classList.toggle('reference-page-hidden',document.hidden));
  const stage = document.querySelector('.founder-portrait-stage');
  const portrait = document.querySelector('.founder-portrait');
  function resetPortrait() {
    portrait.style.removeProperty('--portrait-x'); portrait.style.removeProperty('--portrait-y');
    portrait.style.removeProperty('--portrait-light'); document.querySelector('.founder-name').style.removeProperty('--title-tilt');
  }
  stage.addEventListener('pointermove',event => {
    if (reduced.matches || !pointer.matches || event.pointerType !== 'mouse') return;
    const box = stage.getBoundingClientRect();
    const x = Math.max(0,Math.min(1,(event.clientX-box.left)/box.width)), y = Math.max(0,Math.min(1,(event.clientY-box.top)/box.height));
    portrait.style.setProperty('--portrait-y',`${(x-.5)*6}deg`);
    portrait.style.setProperty('--portrait-x',`${(.5-y)*4}deg`);
    portrait.style.setProperty('--portrait-light',`${20+x*60}%`);
    document.querySelector('.founder-name').style.setProperty('--title-tilt',`${(x-.5)*2}deg`);
  },{passive:true});
  stage.addEventListener('pointerleave',resetPortrait); reduced.addEventListener('change',resetPortrait);
  let ambienceFrame = 0;
  addEventListener('pointermove',event => {
    if (reduced.matches || !pointer.matches || event.pointerType !== 'mouse') return;
    cancelAnimationFrame(ambienceFrame);
    const {clientX,clientY} = event;
    ambienceFrame = requestAnimationFrame(() => {
      const backdrop = document.querySelector('.founder-ambience');
      backdrop.style.setProperty('--ambient-x',`${clientX}px`);backdrop.style.setProperty('--ambient-y',`${clientY}px`);
    });
  },{passive:true});
  (window.EWAN_FONTS_READY || document.fonts.ready).then(() => {
    if (reduced.matches) return;
    stage.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:1000,easing:'cubic-bezier(.2,.7,.3,1)',fill:'backwards'});
  }).catch(() => {});
})();
