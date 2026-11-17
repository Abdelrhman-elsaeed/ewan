(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const proof = document.querySelector('.proof-section');
  const track = proof.querySelector('.proof-track');
  const group = proof.querySelector('.proof-group');
  let heroTimeline;

  function refreshProof() {
    track.querySelector('[aria-hidden="true"]')?.remove();
    const clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    clone.querySelectorAll('a').forEach(link => link.tabIndex = -1);
    clone.querySelectorAll('img').forEach(img => img.alt = '');
    track.append(clone);
  }
  const observer = new IntersectionObserver(entries => {
    proof.dataset.offscreen = String(!entries[0].isIntersecting || document.hidden);
  });
  observer.observe(proof);
  document.addEventListener('visibilitychange', () => {
    proof.dataset.offscreen = String(document.hidden || proof.getBoundingClientRect().bottom < 0 || proof.getBoundingClientRect().top > innerHeight);
  });

  async function revealHero() {
    await document.fonts.ready;
    heroTimeline?.kill();
    if (reduced.matches || !window.gsap) return;
    const name = document.querySelector('.hero-name');
    // Keep Arabic shaping intact: reveal whole lines, never split letters.
    heroTimeline = gsap.timeline({ paused: true });
    heroTimeline.fromTo(name, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }, 0)
      .fromTo('.hero-tagline, .hero-description, .hero-actions', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .65, stagger: .09, ease: 'power2.out' }, .4);
    heroTimeline.play(0);
  }
  document.addEventListener('ewan:language', () => {
    refreshProof();
    if (scrollY < innerHeight * .5) revealHero();
  });
  reduced.addEventListener('change', () => { if (reduced.matches) heroTimeline?.progress(1); });
  refreshProof();
  revealHero();

  const hero = document.querySelector('.hero');
  const desktop = matchMedia('(hover:hover) and (pointer:fine)');
  let pointerFrame = 0;
  let pointer;
  function resetDepth() {
    hero.style.removeProperty('--name-rx');
    hero.style.removeProperty('--name-ry');
    hero.style.removeProperty('--name-light');
  }
  hero.addEventListener('pointermove', event => {
    if (!desktop.matches || reduced.matches || event.pointerType !== 'mouse') return;
    pointer = { x: event.clientX, y: event.clientY };
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      const b = hero.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (pointer.x - b.left - b.width / 2) / (b.width / 2)));
      const y = Math.max(-1, Math.min(1, (pointer.y - b.top - b.height / 2) / (b.height / 2)));
      hero.style.setProperty('--name-rx', `${-y * 2.5}deg`);
      hero.style.setProperty('--name-ry', `${x * 3}deg`);
      hero.style.setProperty('--name-light', `${115 + x * 30}deg`);
    });
  }, { passive: true });
  hero.addEventListener('pointerleave', resetDepth);
  reduced.addEventListener('change', resetDepth);
})();
