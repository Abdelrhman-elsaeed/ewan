(() => {
  function syncPageLinks() {
    for (const link of document.querySelectorAll('[data-page-link]')) {
      const url = new URL(link.getAttribute('href'),location.href);
      url.searchParams.set('lang',document.documentElement.lang);
      url.searchParams.set('theme',document.documentElement.dataset.theme);
      link.href = url.pathname + url.search + url.hash;
    }
  }
  document.addEventListener('ewan:language',syncPageLinks);
  document.addEventListener('ewan:theme',syncPageLinks);
  syncPageLinks();
})();
