const test = (name, run) => { run(); console.log(`PASS ${name}`); };
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = name => fs.readFileSync(path.join(root, 'assets', name), 'utf8');
const context = vm.createContext({ window: {} });
vm.runInContext(source('search-index.js'), context);
vm.runInContext(source('search.js'), context);
const search = context.window.SiteSearch;

test('empty search offers navigation and contact', () => {
  const results = search.find('');
  assert.equal(results.length, 6);
  assert.ok(results.some(entry => entry.url === 'about-2/index.html#contact'));
});
test('search finds accented author names without typing accents', () => {
  assert.ok(search.find('Noemie Globus').some(entry => entry.kind === 'Publication' && entry.title.startsWith('A Hierarchical Shock Model')));
});
test('search combines years and topics and ranks matching titles first', () => {
  const result = search.find('2013 pion')[0];
  assert.equal(result.kind, 'Publication');
  assert.match(result.title, /Pion-Decay/);
});
test('page body text is searchable', () => {
  assert.ok(search.find('mentored').some(entry => entry.url === 'teaching/index.html'));
});
test('unknown text returns no results', () => {
  assert.equal(search.find('zzzz-no-such-publication').length, 0);
});
test('every search result points to an existing local page and anchor', () => {
  for (const entry of context.window.SITE_SEARCH_INDEX) {
    const [file, anchor] = entry.url.split('#');
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    if (anchor) assert.ok(html.includes(`id="${anchor}"`), entry.url);
  }
});
test('theme defaults to light, restores dark, and tolerates blocked storage', () => {
  for (const [value, expected] of [[null, 'light'], ['dark', 'dark'], ['light', 'light'], ['invalid', 'light']]) {
    const doc = { documentElement: { dataset: {} } };
    vm.runInNewContext(source('theme.js'), { document: doc, localStorage: { getItem: () => value } });
    assert.equal(doc.documentElement.dataset.theme, expected);
  }
  const doc = { documentElement: { dataset: {} } };
  vm.runInNewContext(source('theme.js'), { document: doc, localStorage: { getItem() { throw Error('Storage unavailable'); } } });
  assert.equal(doc.documentElement.dataset.theme, 'light');
});


test('homepage uses a single Research heading without the retired slogan', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const section = html.match(/<section[^>]*id="research-overview"[^>]*>([\s\S]*?)<\/section>/)[1];
  assert.match(section, /<div class="section-heading"><h2>Research<\/h2><p>/);
  assert.doesNotMatch(section, /Small particles|Very big questions|class="eyebrow"/);
  const homepage = context.window.SITE_SEARCH_INDEX.find(entry => entry.url === 'index.html');
  assert.doesNotMatch(homepage.keywords, /Small particles|Very big questions/);
});
