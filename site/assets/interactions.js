(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktopPointer = matchMedia('(hover: hover) and (pointer: fine)');
  const select = (selector, parent = document) => parent.querySelector(selector);
  const selectAll = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const text = (selector, value) => { select(selector).textContent = value; };
  const unit = (value, limit) => Math.max(-limit, Math.min(limit, value));
  const copy = window.EWAN_COPY;
  let scroll;

  function configureScroll() {
    scroll?.destroy();
    scroll = null;
    if (reduced.matches || !window.Lenis) return;
    scroll = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: false,
      lerp: .082,
      wheelMultiplier: 1,
      stopInertiaOnNavigate: true,
      prevent: node => node.matches('textarea, select, [contenteditable]')
    });
  }
  reduced.addEventListener('change', configureScroll);
  configureScroll();
  document.addEventListener('click', event => {
    if (!scroll || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const anchor = link.getAttribute('href');
    const destination = document.getElementById(anchor.slice(1));
    if (!destination) return;
    event.preventDefault();
    if (location.hash !== anchor) history.pushState(null, '', anchor);
    if (event.detail === 0) {
      destination.tabIndex = -1;
      destination.focus({ preventScroll: true });
    }
    const offset = -(parseFloat(getComputedStyle(destination).scrollMarginTop) || 0);
    scroll.scrollTo(destination, { offset });
  });

  const cursor = select('.cursor-dot');
  function resetCursor() { cursor.classList.remove('is-visible', 'is-hovering'); }
  document.addEventListener('pointermove', event => {
    if (!desktopPointer.matches || reduced.matches || event.pointerType !== 'mouse') return;
    const actionable = event.target.closest('a, button:not(:disabled), input, select, textarea');
    const offset = actionable ? 0 : 5;
    cursor.style.translate = `${event.clientX - 4 + offset}px ${event.clientY - 4 + offset}px`;
    cursor.classList.add('is-visible');
    cursor.classList.toggle('is-hovering', Boolean(actionable));
  }, { passive: true });
  root.addEventListener('pointerleave', resetCursor);
  addEventListener('blur', resetCursor);
  reduced.addEventListener('change', resetCursor);

  for (const button of selectAll('.magnetic')) {
    const reset = () => {
      button.style.removeProperty('--shift-x');
      button.style.removeProperty('--shift-y');
    };
    button.addEventListener('pointermove', event => {
      if (!desktopPointer.matches || reduced.matches || event.pointerType !== 'mouse') return;
      const rect = button.getBoundingClientRect();
      button.style.setProperty('--shift-x', `${unit((event.clientX - rect.left - rect.width / 2) * .075, 4)}px`);
      button.style.setProperty('--shift-y', `${unit((event.clientY - rect.top - rect.height / 2) * .11, 3)}px`);
    }, { passive: true });
    button.addEventListener('pointerleave', reset);
    reduced.addEventListener('change', reset);
  }

  function followSurface(selector, update, clear) {
    for (const item of selectAll(selector)) {
      item.addEventListener('pointermove', event => {
        if (reduced.matches || !desktopPointer.matches) return;
        const box = item.getBoundingClientRect();
        update(item, (event.clientX - box.left) / box.width, (event.clientY - box.top) / box.height);
      }, { passive: true });
      item.addEventListener('pointerleave', () => clear(item));
      reduced.addEventListener('change', () => clear(item));
    }
  }
  followSurface('.work-visual', (item, x, y) => {
    item.style.setProperty('--work-y', `${unit((x - .5) * 10, 5)}deg`);
    item.style.setProperty('--work-x', `${unit((.5 - y) * 9, 4.5)}deg`);
  }, item => {
    item.style.removeProperty('--work-y');
    item.style.removeProperty('--work-x');
  });
  followSurface('.client-tile', (item, x, y) => {
    item.style.setProperty('--spot-x', `${x * 100}%`);
    item.style.setProperty('--spot-y', `${y * 100}%`);
  }, item => {
    item.style.removeProperty('--spot-x');
    item.style.removeProperty('--spot-y');
  });
})();
