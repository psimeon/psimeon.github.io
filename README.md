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

## Later: GitHub Pages and domain migration

Nothing has been uploaded and no live hosting or DNS settings have been changed.

1. Export and back up the WordPress installation and media before retiring it. This local redesign is not a complete WordPress backup.
2. Create a GitHub repository and push these files when the design is approved.
3. In Settings → Pages, publish from the `main` branch and root folder. `.nojekyll` enables plain static files.
4. Verify domain ownership in GitHub, then set the Pages custom domain to `paulsimeon.com`. The included `CNAME` file contains that domain.
5. Update the domain's website DNS records to GitHub Pages. Preserve unrelated records, including email records. Configure `www` to point to the account's `<username>.github.io` hostname.
6. Enable HTTPS after GitHub has provisioned the certificate, and check all pages and redirects on the live domain.

Follow the current [GitHub custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) at launch. A domain registrar transfer is not needed to change website hosting. Custom-domain configuration must precede the DNS cutover. The GitHub username and repository are intentionally left undecided until upload.

## Validation of this draft

- All 6 HTML documents (including the 404 page) have one main heading.
- All 88 local references on the five main pages resolve, including all six contact links and search/theme scripts.
- All content images have alternative text.
- JavaScript passes `node --check`.
- The local homepage returned HTTP 200.
- Search matching, result destinations, and initial theme restoration pass automated checks.
- Firefox access was not approved for browser verification; visual layout and dialog/toggle keyboard interactions still need browser review.
