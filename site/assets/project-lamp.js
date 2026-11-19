(() => {
  const showcase = document.querySelector('.work-showcase');
  const lamp = showcase?.querySelector('.project-lamp');
  if (!lamp) return;
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
  const atmosphere = lamp.querySelector('.lamp-atmosphere');
  let started = false;
  let ignition;
  let mistFrame = 0;
  let mistFollowing = false;
  // Two brief, uneven starts, then a steady light. Only a small local source flickers.
  const frames = [
    { '--lamp-power': '0', offset: 0 },
    { '--lamp-power': '.22', offset: .12 },
    { '--lamp-power': '.045', offset: .22 },
    { '--lamp-power': '.58', offset: .36 },
    { '--lamp-power': '.16', offset: .46 },
    { '--lamp-power': '1', offset: .76 },
    { '--lamp-power': '1', offset: 1 }
  ];
  function illuminate() {
    if (started) return;
    started = true;
    observer?.disconnect();
    showcase.dataset.lampState = 'lighting';
    if (reduced.matches || !showcase.animate) {
      showcase.dataset.lampState = 'on';
      return;
    }
    ignition = showcase.animate(frames, { duration: 1200, easing: 'linear', fill: 'forwards', iterations: 1 });
    ignition.finished.then(() => {
      showcase.dataset.lampState = 'on';
      ignition.cancel(); // The resting CSS state is already fully lit; no retained animation.
    }).catch(() => {});
  }
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) illuminate();
  }, { rootMargin: '0px 0px -7% 0px', threshold: .75 }) : null;
  showcase.dataset.lampState = 'waiting';
  if (reduced.matches || !observer) illuminate();
  else observer.observe(lamp);
  const atmosphereObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    const visible = entries.some(entry => entry.isIntersecting);
    showcase.classList.toggle('lamp-inview', visible);
    if (!visible) clearMist();
  }) : null;
  atmosphereObserver?.observe(lamp);
  function clearMist() {
    cancelAnimationFrame(mistFrame);
    mistFrame = 0;
    if (!mistFollowing) return;
    mistFollowing = false;
    atmosphere.style.setProperty('--mist-cover','1');
    atmosphere.style.setProperty('--mist-drift-x','0px');
    atmosphere.style.setProperty('--mist-drift-y','0px');
  }
  addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reduced.matches || !finePointer.matches || !showcase.classList.contains('lamp-inview')) { clearMist(); return; }
    cancelAnimationFrame(mistFrame);
    const {clientX,clientY} = event;
    mistFrame = requestAnimationFrame(() => {
      const bounds = atmosphere.getBoundingClientRect();
      const x = clientX-bounds.left, y = clientY-bounds.top;
      if (x < -100 || x > bounds.width+100 || y < -100 || y > bounds.height+100) { clearMist(); return; }
      mistFollowing = true;
      // Cutout stays at the pointer; only the surrounding air drifts with easing.
      atmosphere.style.setProperty('--mist-cursor-x',`${x}px`);
      atmosphere.style.setProperty('--mist-cursor-y',`${y}px`);
      atmosphere.style.setProperty('--mist-cover','0');
      atmosphere.style.setProperty('--mist-drift-x',`${Math.max(-10,Math.min(10,(x/bounds.width-.5)*20))}px`);
      atmosphere.style.setProperty('--mist-drift-y',`${Math.max(-5,Math.min(5,(y/bounds.height-.5)*10))}px`);
    });
  }, {passive:true});
  document.addEventListener('pointerleave',clearMist);
  addEventListener('blur',clearMist);
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    illuminate();
    ignition?.cancel();
    showcase.dataset.lampState = 'on';
    clearMist();
  });
})();
