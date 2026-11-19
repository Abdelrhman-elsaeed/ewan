(() => {
  const showcase = document.querySelector('.work-showcase');
  const lamp = showcase?.querySelector('.project-lamp');
  if (!lamp) return;
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let started = false;
  let ignition;
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
    showcase.classList.toggle('lamp-inview', entries.some(entry => entry.isIntersecting));
  }) : null;
  atmosphereObserver?.observe(lamp);
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    illuminate();
    ignition?.cancel();
    showcase.dataset.lampState = 'on';
  });
})();
