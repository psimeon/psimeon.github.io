'use strict';
// Shared by the search dialog and the lightweight search checks.
window.SiteSearch = {
  normalize(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  },
  find(query, entries = window.SITE_SEARCH_INDEX || []) {
    const words = this.normalize(query).trim().split(/\s+/).filter(Boolean);
    if (!words.length) return entries.filter(entry => entry.kind === 'Page' || entry.kind === 'Contact');
    return entries.map(entry => {
      const title = this.normalize(entry.title);
      const text = this.normalize(`${entry.title} ${entry.text} ${entry.keywords || ""} ${entry.kind}`);
      const score = words.every(word => text.includes(word))
        ? words.reduce((sum, word) => sum + (title.includes(word) ? 3 : 1), 0) : 0;
      return { entry, score };
    }).filter(result => result.score > 0).sort((a, b) => b.score - a.score).map(result => result.entry);
  }
};
