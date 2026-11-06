'use strict';
document.documentElement.classList.add('js-enabled');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (menu && navigation) {
  menu.hidden = false;
  const closeMenu = () => {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(expanded));
    navigation.classList.toggle('is-open', expanded);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menu.focus();
    }
  });
}
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
const search = document.querySelector('#publication-query');
if (search) {
  document.querySelector('.publication-search').hidden = false;
  const publications = [...document.querySelectorAll('[data-publication]')];
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  search.addEventListener('input', () => {
    const words = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    publications.forEach(publication => {
      const matches = words.every(word => normalize(publication.textContent).includes(word));
      publication.hidden = !matches;
      if (matches) count += 1;
    });
    document.querySelectorAll('.publication-group').forEach(group => {
      group.hidden = ![...group.querySelectorAll('[data-publication]')].some(publication => !publication.hidden);
    });
    document.querySelector('#publication-count').textContent = `${count} publication${count === 1 ? '' : 's'}`;
    document.querySelector('#no-results').hidden = count !== 0;
  });
}

const themeButton = document.querySelector('.theme-toggle');
if (themeButton) {
  themeButton.hidden = false;
  const updateThemeButton = () => {
    const label = document.documentElement.dataset.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    themeButton.setAttribute('aria-label', label);
    themeButton.title = label;
  };
  themeButton.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('paul-simeon-theme', theme); } catch (_) { /* Optional persistence. */ }
    updateThemeButton();
  });
  updateThemeButton();
}

const searchDialog = document.querySelector('#site-search');
const searchButton = document.querySelector('.search-toggle');
if (searchDialog && searchButton && typeof searchDialog.showModal === 'function') {
  searchButton.hidden = false;
  const query = searchDialog.querySelector('#site-search-query');
  const results = searchDialog.querySelector('.search-results');
  const status = searchDialog.querySelector('.search-status');
  // Resolve from the script's location so links also work when opened from Finder.
  const script = document.querySelector('script[src$="assets/site.js"]');
  const siteRoot = new URL('../', script.src);
  let previousFocus;
  const renderResults = () => {
    const entries = window.SiteSearch.find(query.value);
    results.replaceChildren();
    entries.forEach(entry => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = new URL(entry.url, siteRoot).href;
      const kind = document.createElement('span');
      kind.className = 'search-result-kind';
      kind.textContent = entry.kind;
      const title = document.createElement('strong');
      title.textContent = entry.title;
      const excerpt = document.createElement('span');
      excerpt.className = 'search-result-excerpt';
      excerpt.textContent = entry.text.length > 150 ? `${entry.text.slice(0, 147)}…` : entry.text;
      link.append(kind, title, excerpt);
      item.append(link);
      results.append(item);
    });
    status.textContent = entries.length ? `${entries.length} result${entries.length === 1 ? '' : 's'}` : 'No results. Try another topic, author, or year.';
  };
  const openSearch = () => {
    if (searchDialog.open) return;
    previousFocus = document.activeElement;
    query.value = '';
    renderResults();
    searchDialog.showModal();
    document.body.classList.add('search-open');
    query.focus();
  };
  searchButton.addEventListener('click', openSearch);
  searchDialog.querySelector('.search-close').addEventListener('click', () => searchDialog.close());
  searchDialog.addEventListener('click', event => {
    if (event.target !== searchDialog) return;
    const rect = searchDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) searchDialog.close();
  });
  searchDialog.addEventListener('close', () => {
    document.body.classList.remove('search-open');
    previousFocus?.focus();
  });
  results.addEventListener('click', event => {
    if (event.target.closest('a')) searchDialog.close();
  });
  query.addEventListener('input', renderResults);
  searchDialog.addEventListener('keydown', event => {
    const links = [...results.querySelectorAll('a')];
    const index = links.indexOf(document.activeElement);
    if (event.key === 'ArrowDown' && links.length) {
      event.preventDefault();
      links[(index + 1) % links.length].focus();
    } else if (event.key === 'ArrowUp' && links.length) {
      event.preventDefault();
      if (index === 0) query.focus();
      else links[index < 0 ? links.length - 1 : index - 1].focus();
    } else if (event.key === 'Enter' && document.activeElement === query && links.length) {
      event.preventDefault();
      links[0].click();
    }
  });
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (searchDialog.open) searchDialog.close();
      else openSearch();
    }
  });
}

// Offer copying without opening the visitor's email application.
document.querySelectorAll('[data-copy-email]').forEach(button => {
  button.hidden = false;
  const status = button.parentElement.querySelector('.copy-email-status');
  let resetTimer;
  button.addEventListener('click', async () => {
    clearTimeout(resetTimer);
    let copied = false;
    try {
      await navigator.clipboard.writeText(button.dataset.copyEmail);
      copied = true;
    } catch (_) {
      // Support local-file previews and browsers without Clipboard API access.
      const field = document.createElement('textarea');
      field.value = button.dataset.copyEmail;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.append(field);
      field.select();
      try { copied = document.execCommand('copy'); } catch (_) { /* Show manual-copy guidance. */ }
      field.remove();
      button.focus();
    }
    status.textContent = copied ? 'Copied!' : 'Select the address to copy it manually.';
    if (copied) resetTimer = setTimeout(() => { status.textContent = ''; }, 2500);
  });
});
