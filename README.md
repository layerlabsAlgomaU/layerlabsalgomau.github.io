# LayerLabs website

The website of LayerLabs, the student-run 3D printing club at Algoma University. Built with Next.js (App Router,
plain JavaScript) and written as a static site: `npm run build` makes plain HTML, CSS and JS files with no server.

**Looking after the site? Start with [HOW-TO-UPDATE.md](HOW-TO-UPDATE.md).** It says where every piece of content
lives and has step-by-step recipes.

Built and maintained by **Divyam Wadhawan**, Website Lead ([@Divyam200564384](https://github.com/Divyam200564384)).

## Commands

Run these inside this `next-site` folder.

| Command | What it does |
|---|---|
| `npm install` | Downloads the packages (once, or after `package.json` changes). |
| `npm run dev` | Starts the site at http://localhost:3000. Saving a file updates the page by itself. |
| `npm run build` | Builds the finished site into the `out` folder. |
| `npm run check` | Builds, then scans the result for things that must not go live (dead links, edit links, missing alt text, ...). Run it before publishing. |
| `npm start` | Previews the finished `out` folder (downloads a tiny helper the first time). |

## Where things are

```
app/
  layout.js            wraps every page: fonts, header, footer, cart, scroll effects
  page.js              Home              (/)
  about/ projects/ events/ members/ contact/   the other pages
  request/             Request a Print   (/request): ready-made items + custom requests, one form
  shop/                only a redirect to /request (old links keep working)
  not-found.js         the 404 page
  sitemap.js robots.js search-engine files
  globals.css          ALL the styling (colour and spacing variables are at the top)
components/            the building blocks: Header (menu, mobile panel), Footer, Wordmark (the big
                       footer name), RequestHub + RequestForm + ProductCard + CartDrawer + CartContext
                       (the request page and cart), JoinBanner, EventCard, PrintGallery, HeroPrinter,
                       LogoLink, FilmPlayer, ScrollEffects
data/                  the content you edit: events, prints (photos), products, members, team, process
lib/site.js            facts used on several pages: join form link, email, social links, menu, request address
public/                images (logo, prints) and the home film
scripts/check-site.mjs the checker behind `npm run check`
HOW-TO-UPDATE.md       the guide for whoever looks after the site
```

Outside this folder (not part of the website, never published): `google-apps-script/` (the code that receives
print requests), `film/` (the source of the home film), and the club's private files.

## Design notes

- One stylesheet, no CSS framework (no Bootstrap or Tailwind). Colours are the Algoma University palette; the
  light theme is the only one.
- Page changes use a soft fade-and-rise. Every animation switches off for visitors who ask for reduced motion.
- Accessibility: skip link, labelled menus, keyboard-friendly mobile menu and cart, visible focus, descriptions on
  every photo, AA contrast.

## Adding a new page

1. Make a folder in `app`, for example `app/faq`, with a `page.js` inside (copy `app/contact/page.js` as a start).
2. Change its `metadata` (title and description) and its content. Keep exactly one `<h1>`.
3. Add it to `NAV_LINKS` in `lib/site.js`. The menu, the footer and the sitemap pick it up from there.

## Publishing

The site is hosted on GitHub Pages at https://layerlabsalgomau.github.io/ (repository `layerlabsalgomau.github.io`).
Every push to the `main` branch builds, checks and publishes it automatically (`.github/workflows/deploy.yml`).
See section 5 of [HOW-TO-UPDATE.md](HOW-TO-UPDATE.md) for the steps. **Publish only this folder, never the club's
whole project folder.** (The site lives at the root of its address, so no `basePath` setting is needed. If it were
ever moved to an address like `username.github.io/repo`, add `basePath: '/repo'` to `next.config.mjs` first.)
