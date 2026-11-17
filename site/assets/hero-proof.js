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
    const lines = document.querySelectorAll('.hero-line > span');
    // Keep Arabic shaping intact: reveal whole lines, never split letters.
    heroTimeline = gsap.timeline({ paused: true });
    heroTimeline.fromTo(lines, { yPercent: 108, opacity: .15 }, { yPercent: 0, opacity: 1, duration: 1.05, stagger: .13, ease: 'power3.out' }, 0)
      .fromTo('.hero-content > p, .hero-actions', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .65, stagger: .1, ease: 'power2.out' }, .48);
    heroTimeline.play(0);
  }
  document.addEventListener('ewan:language', () => {
    refreshProof();
    if (scrollY < innerHeight * .5) revealHero();
  });
  reduced.addEventListener('change', () => { if (reduced.matches) heroTimeline?.progress(1); });
  refreshProof();
  revealHero();
})();
