# Paul Simeon — personal website

Local redesign of paulsimeon.com, prepared for GitHub Pages. Light, minimal styling with white backgrounds, restrained green accents, and readable typography. Plain HTML, CSS, and a small JavaScript file; no dependencies or build step.

## Preview locally

You can open `index.html` directly in your browser. Internal page links name their `index.html` files explicitly, so navigation works without a server.

For a preview that behaves like the hosted site, run from this folder:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. Stop with Ctrl+C.

## Editing

- `index.html`: homepage
- `about-2/index.html`: biography and contact
- `research/index.html`: research
- `publications/index.html`: all 11 publication entries, with browser-side search
- `teaching/index.html`: teaching
- `assets/style.css`: shared design and responsive layout
- `assets/site.js`: mobile navigation, publication filtering, site-search dialog, theme toggle, footer year
- `assets/theme.js`: restores the saved light/dark preference before styles load
- `assets/search-index.js`: generated search content for all five pages and individual research sections/publications
- `scripts/build_search_index.py`: rebuilds search content from the HTML

Each page includes its navigation and footer directly, so content and links also work without JavaScript. Update all five pages when changing shared navigation. No third-party fonts, scripts, or analytics are required.

The existing WordPress page paths are retained. All content and both images were adapted from the owner's current website on October 29, 2026. The cluster temperature simulation is credited to Kirk Barrow. The portrait and research image are stored locally, so the new site does not depend on WordPress hosting.

The redesign retains all 11 publication entries, uses public paper links rather than institution-specific proxy URLs, and omits a malformed ADS link and an incorrectly duplicated INSPIRE link. Publication status and biography reflect the source site and should be reviewed before launch. The teaching page describes existing interests; it does not advertise courses or simulations as already available.

## Search and themes

Use the header search button or Command-K (Control-K on Windows/Linux) to search. Arrow keys move through results, Enter opens a result, and Escape closes the dialog. Search is entirely local and also works when opening `index.html` directly from Finder.

The moon/sun button switches themes. Light is the default. A visitor's choice is saved in browser storage when available; private browsing or local-file storage restrictions may limit persistence.

After editing page content, rebuild the index and run the search/theme checks:

```sh
python3 scripts/build_search_index.py
node tests/site.test.cjs
```

All “Get in touch” links go to the contact section at the bottom of About. The email address there still opens an email draft.

## Hosting and updates

Repository: https://github.com/psimeon/psimeon.github.io

GitHub Pages publishes the root of the `main` branch. The custom domain is `paulsimeon.com`; its website DNS must point to GitHub Pages before the new site appears there. The 2026 WordPress snapshot is preserved in `archives/2026/` and can be opened offline.

After editing, rebuild the search index and run the checks above, then commit and push to `main`. GitHub Pages deploys the update automatically.

### Domain migration status — November 5, 2026

The initial GitHub deployment succeeded. HostMonster DNS still requires the website cutover. Current website A record: `67.20.76.217`. Current `www` CNAME: `paulsimeon.com`.

GitHub Pages requires apex A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`; `www` should be a CNAME to `psimeon.github.io`.

Preserve mail service during the cutover. `mail.paulsimeon.com` currently has its own A record at `67.20.76.217`. MX records are priority 0 `mail.paulsimeon.com` and priority 10 `paulsimeon.com`. The latter depends on the website address and needs review before changing the apex A records. Leave the primary mail host and unrelated DNS records intact. Do not retire WordPress/HostMonster until web and mail behavior have been checked. This archive is not a WordPress database backup.

Enable enforced HTTPS once GitHub provisions the custom-domain certificate. Follow the current [GitHub domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Validation of this draft

- Local file links and assets on all six HTML pages resolve.
- All content images have alternative text.
- JavaScript passes `node --check`.
- The local homepage returned HTTP 200.
- Search matching, result destinations, and initial theme restoration pass automated checks.
- The published homepage was verified in a browser after the initial GitHub deployment.
