(() => {
  const root = document.documentElement;
  const copy = window.EWAN_COPY;
  const byId = id => document.getElementById(id);
  const text = (id, value) => { byId(id).textContent = value; };
  const translations = [...document.querySelectorAll('[data-text]')].map(element => [element, element.innerHTML]);
  const labels = [...document.querySelectorAll('[data-label]')].map(element => [element, element.getAttribute('aria-label')]);
  const imageDescriptions = [...document.querySelectorAll('[data-alt]')].map(element => [element, element.alt]);
  const languageButton = document.querySelector('[data-language]');
  const mobileMenu = byId('site-menu');
  const menuToggle = document.querySelector('.menu-toggle');
  const form = byId('brief-form');
  const projectType = byId('project-type');
  const config = window.EWAN_CONTACT;
  const whatsapp = /^\d{8,15}$/.test(config.whatsapp) ? config.whatsapp : '';
  const email = /^[^\s@?]+@[^\s@?]+\.[^\s@?]+$/.test(config.email) ? config.email : '';
  const contactMode = whatsapp ? 'whatsapp' : email ? 'email' : 'download';
  let language = 'ar';
  let process = 'discovery';

  function element(tag, value) {
    const node = document.createElement(tag);
    node.textContent = value;
    return node;
  }

  function renderProcess() {
    const [kicker, heading, description, output] = copy.process[process][language];
    const level = Object.keys(copy.process).indexOf(process) + 1;
    text('process-kicker', kicker);
    text('process-heading', heading);
    text('process-description', description);
    text('process-output', output);
    text('diagram-index', `0${level} / 04`);
    byId('process-art').dataset.level = level;
  }

  function renderContact() {
    const contact = copy.contact[language];
    text('contact-action', contact[contactMode]);
    text('contact-arrow', contactMode === 'download' ? '↓' : '↗');
    text('contact-hint', contact[contactMode === 'download' ? 'localHint' : contactMode + 'Hint']);
    text('form-status', '');
  }

  function setLanguage(next) {
    language = next;
    root.lang = next;
    root.dir = next === 'ar' ? 'rtl' : 'ltr';
    for (const [node, arabic] of translations) {
      node.innerHTML = next === 'ar' ? arabic : copy.en[node.dataset.text];
    }
    for (const [node, arabic] of labels) {
      node.setAttribute('aria-label', next === 'ar' ? arabic : copy.en[node.dataset.label]);
    }
    for (const [node, arabic] of imageDescriptions) node.alt = next === 'ar' ? arabic : copy.en[node.dataset.alt];
    document.title = next === 'ar' ? 'إيوان للبرمجيات | Ewan Software' : 'Ewan Software | Design and Development';
    languageButton.lang = next === 'ar' ? 'en' : 'ar';
    languageButton.textContent = next === 'ar' ? 'EN' : 'عربي';
    languageButton.setAttribute('aria-label', next === 'ar' ? 'Switch to English' : 'غيّر اللغة إلى العربية');
    renderProcess();
    renderContact();
    document.dispatchEvent(new Event('ewan:language'));
  }

  function storedLanguage() {
    const requested = new URLSearchParams(location.search).get('lang');
    if (requested === 'ar' || requested === 'en') return requested;
    try { return localStorage.getItem('ewan-language') === 'en' ? 'en' : 'ar'; }
    catch { return 'ar'; }
  }

  setLanguage(storedLanguage());
  languageButton.addEventListener('click', () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
    try {
      localStorage.setItem('ewan-language', language);
      if (new URLSearchParams(location.search).has('lang')) {
        const url = new URL(location.href);
        url.searchParams.set('lang', language);
        history.replaceState(history.state, '', url);
      }
    } catch { /* Language switching still works in the current view. */ }
  });

  function setupTabs(selector, panelId, onSelect) {
    const buttons = [...document.querySelectorAll(selector)];
    const panel = byId(panelId);
    function select(button, focus = false) {
      for (const tab of buttons) {
        const active = tab === button;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      }
      panel.setAttribute('aria-labelledby', button.id);
      onSelect(button);
      if (focus) button.focus();
    }
    for (const button of buttons) {
      button.addEventListener('click', () => select(button));
      button.addEventListener('keydown', event => {
        const current = buttons.indexOf(button);
        const direction = root.dir === 'rtl' ? -1 : 1;
        const next = {
          Home: 0,
          End: buttons.length - 1,
          ArrowRight: current + direction,
          ArrowLeft: current - direction
        }[event.key];
        if (typeof next !== 'number') return;
        event.preventDefault();
        select(buttons[(next + buttons.length) % buttons.length], true);
      });
    }
  }

  setupTabs('[data-step]', 'process-panel', button => {
    process = button.dataset.step;
    renderProcess();
  });

  function toggleMenu(open, restoreFocus = false) {
    mobileMenu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    if (restoreFocus) menuToggle.focus();
  }
  menuToggle.addEventListener('click', () => toggleMenu(menuToggle.getAttribute('aria-expanded') === 'false'));
  mobileMenu.addEventListener('click', event => {
    if (event.target.closest('a')) toggleMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') toggleMenu(false, true);
  });
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.nav-shell')) toggleMenu(false);
  });
  matchMedia('(max-width: 820px)').addEventListener('change', () => toggleMenu(false));

  function updateHeader() {
    document.body.classList.toggle('is-scrolled', window.scrollY > 48);
  }
  addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(form);
    const info = copy.contact[language];
    const labels = [...form.querySelectorAll('label > span')].map(span => span.textContent);
    const lines = [
      [labels[0], fields.get('name').trim()],
      [labels[1], fields.get('email').trim()],
      [labels[2], projectType.selectedOptions[0].textContent],
      [labels[3], fields.get('details').trim()]
    ];
    const message = lines.map(([label, value]) => `${label}\n${value}`).join('\n\n');
    if (contactMode === 'email') {
      location.href = `mailto:${email}?subject=${encodeURIComponent(info.subject)}&body=${encodeURIComponent(message)}`;
      text('form-status', info.emailHint);
    } else if (contactMode === 'whatsapp') {
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      text('form-status', info.whatsappHint);
    } else {
      const url = URL.createObjectURL(new Blob([`${info.subject}\n\n${message}\n`], { type: 'text/plain;charset=utf-8' }));
      const download = element('a', '');
      download.href = url;
      download.download = 'ewan-project-brief.txt';
      document.body.append(download);
      download.click();
      download.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      text('form-status', info.downloaded);
    }
  });
  form.querySelector('[type="submit"]').disabled = false;
})();
