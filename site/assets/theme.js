(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let changing = false;
  const brandImages = [...document.querySelectorAll('.brand img, .about-mark img')];
  function labels() {
    const light = root.dataset.theme === 'light';
    const ar = root.lang === 'ar';
    const label = ar ? (light ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح') : (light ? 'Switch to dark mode' : 'Switch to light mode');
    toggle.setAttribute('aria-pressed', String(light));
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
  }
  function apply(theme, persist = true) {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'light' ? '#f5f8f4' : '#081418';
    brandImages.forEach(img => { img.src = theme === 'light' ? 'assets/ewan-mark-ink.png' : 'assets/ewan-mark.png'; });
    labels();
    if (persist) {
      try { localStorage.setItem('ewan-theme', theme); } catch { /* Storage is optional. */ }
      const url = new URL(location.href);
      if (url.searchParams.has('theme')) { url.searchParams.set('theme', theme); history.replaceState(null, '', url); }
    }
    document.dispatchEvent(new CustomEvent('ewan:theme', { detail: { theme } }));
  }
  async function fade(theme) {
    const curtain = document.createElement('div');
    curtain.className = 'theme-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    curtain.style.background = theme === 'light' ? '#f5f8f4' : '#081418';
    document.body.append(curtain);
    await curtain.animate([{opacity:0},{opacity:1}],{duration:170,fill:'forwards'}).finished;
    apply(theme);
    await curtain.animate([{opacity:1},{opacity:0}],{duration:280,fill:'forwards'}).finished;
    curtain.remove();
  }
  toggle.addEventListener('click', async () => {
    if (changing) return;
    changing = true;
    toggle.setAttribute('aria-busy', 'true');
    const theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try {
      const image = document.querySelector(`.hero-photo-${theme} img`);
      if (image?.decode) await image.decode().catch(() => {});
      if (reduced.matches) { apply(theme); return; }
      if (!document.startViewTransition) { await fade(theme); return; }
      const b = toggle.getBoundingClientRect();
      const x = b.x + b.width / 2, y = b.y + b.height / 2;
      const radius = Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
      const transition = document.startViewTransition(() => apply(theme));
      await transition.ready;
      await root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${radius}px at ${x}px ${y}px)`]}, {
        duration:850,easing:'cubic-bezier(.22,.8,.25,1)',pseudoElement:'::view-transition-new(root)'
      }).finished;
      await transition.finished;
    } catch {
      apply(theme);
    } finally {
      changing = false;
      toggle.removeAttribute('aria-busy');
    }
  });
  document.addEventListener('ewan:language', labels);
  apply(root.dataset.theme === 'light' ? 'light' : 'dark', false);
})();
