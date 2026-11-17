// Run before styles so a remembered theme does not flash on first paint.
(() => {
  let theme = new URLSearchParams(location.search).get('theme');
  if (theme !== 'light' && theme !== 'dark') {
    try { theme = localStorage.getItem('ewan-theme'); } catch { /* Storage is optional. */ }
  }
  document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark';
  document.querySelector('meta[name="theme-color"]').content = theme === 'light' ? '#f5f8f4' : '#081418';
})();
