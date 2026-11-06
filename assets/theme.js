// Runs before styles load to avoid a flash when a returning visitor chose dark mode.
(() => {
  let theme = 'light';
  try {
    if (localStorage.getItem('paul-simeon-theme') === 'dark') theme = 'dark';
  } catch (_) { /* Theme switching still works when browser storage is unavailable. */ }
  document.documentElement.dataset.theme = theme;
})();
