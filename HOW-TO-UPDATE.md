# How to update the LayerLabs website

For whoever looks after the site next (a new Website Lead, an executive, a volunteer). You do not need to be
an expert. Most changes are editing a line of text in one file. If you get stuck, see "If something goes wrong"
at the bottom.

---

## 1. Running the site on your computer

You need **Node.js** (the "LTS" version, from nodejs.org) and **VS Code**. Then, once:

1. Open the `next-site` folder in VS Code.
2. Open the terminal (Terminal → New Terminal) and run: `npm install`
   (this downloads the helper packages; you only do it once, or after someone updates `package.json`).

Every time you work on the site:

1. Run: `npm run dev`
2. Open **http://localhost:3000** in your browser.
3. Edit a file and save it. The page updates by itself. Press `Ctrl+C` in the terminal to stop.

---

## 2. Where is the thing I want to change?

| I want to change… | Edit this file |
|---|---|
| The sign-up (join) form link, the club email, the Instagram / GitHub links, the menu pages | `lib/site.js` |
| News and events (Home "News" and the Partners & Events page) | `data/events.js` |
| Photos of our prints (Home and Projects) | `data/prints.js` + the picture in `public/images/prints/` |
| The ready-made items people can request (Flexi Rex, etc.) | `data/products.js` (and the Google script, see recipe C) |
| The Members page steps and links | `data/members.js` |
| The team on the About page | `data/team.js` |
| The 5 steps of "How a project works" | `data/process.js` |
| The words on a page | `app/<page name>/page.js` (for Home it is `app/page.js`) |
| Colours, fonts sizes, spacing | the top of `app/globals.css` (the `:root` block) |
| The home page film | the `film/` folder (outside `next-site`, see `film/README.md`), then copy the new video into `public/video/` |
| How "Request a print" sends requests | `google-apps-script/` (outside `next-site`, see its `SETUP.md`) |

**Never edit** the folders `.next` and `out`, or the `node_modules` folder. They are made automatically.

---

## 3. Common jobs, step by step

### A. Add (or remove) an event or a piece of news
1. Open `data/events.js`.
2. Copy one whole `{ ... },` block, paste it **above** the first, and change the text. `day` and `month` are what the
   big date badge shows; `dateTime` is the first day as `YYYY-MM-DD`. The paragraph is `before` + the date + `after`
   (leave `after` out and a full stop is used).
3. The Home page shows the **first** one only (as "News"). The Partners & Events page shows all of them.
4. When something is old news, delete its block. Only write things that are true and that everyone involved is happy
   to see: do not credit one person in a way that leaves a teammate out.

### B. Add a photo of a print
1. Resize the picture to about **1200 pixels wide** and save it as a JPG under about 250 KB (any free image
   editor works; big phone photos make the site slow).
2. Put it in `public/images/prints/`.
3. Open `data/prints.js` and copy one block. Change `src` to your file name, set the real `width` and `height`,
   and write the `alt`: one plain sentence describing the picture for people who cannot see it. Never leave it empty.
4. The **first four** photos show on Home; the Projects page shows all. Put the best ones first.
5. Only use photos the club took itself, or that you have permission to use.

### C. Add or rename a ready-made item
1. Open `data/products.js` and copy one block (give it a new `id` with no spaces, like `phone-stand`).
2. **Important:** also open the Google script (Extensions → Apps Script in the club's Google Sheet) and add the exact
   same product name to `ALLOWED_ITEMS`, then **Deploy → Manage deployments → Edit → New version → Deploy**.
   If you skip this, requests for the new item will be refused.
3. Do not put prices anywhere.

### D. Change the team (after elections)
Open `data/team.js` and change the names and titles. Ask each person first, and confirm their title with them.

### E. Add the WhatsApp or LinkedIn link
- **WhatsApp:** in `data/members.js`, find "Join the member chat" and put the invite link between the quotes
  after `href:` (replace `null`).
- **LinkedIn:** in `lib/site.js`, add one line to the `SOCIALS` list, like the Instagram one. It then shows
  in the footer and on the Contact page.

### F. Change the club email or the join form
Open `lib/site.js`. The email is `EMAIL` and the join form is `JOIN_FORM_URL`. Use the form's **viewform** link,
never its edit link. If the email changes, also change `NOTIFY_EMAILS` in the Google script.

### G. Make "Request a print" send to a new Google Sheet or account
Follow `google-apps-script/SETUP.md`, then put the new web address (it ends in `/exec`) in `REQUEST_ENDPOINT`
in `lib/site.js`.

---

## 4. Before you publish: the check

Run: `npm run check`

It builds the finished site and then looks for things that must never go live: dead `#` links, "coming soon"
text outside the Members page, TODO notes, Google "edit" links, images without descriptions, a missing or double
page heading, broken internal links, and the forbidden orange. If it prints problems, fix them and run it again.
It ends with "no problems found" when all is well.

Then look at the site yourself, on a **real phone** too, and read every page once. The check cannot tell if a
sentence is wrong.

---

## 5. Publishing

The site is hosted on **GitHub Pages**, in the club's GitHub repository named **`layerlabsalgomau.github.io`**
(account `LayerLabsAlgomaU`). Its address is **https://layerlabsalgomau.github.io/**.

**To publish a change:** save your edits, then in the `next-site` folder run:

```
git add -A
git commit -m "Describe what you changed"
git push
```

That is all. GitHub then builds the site by itself (the file `.github/workflows/deploy.yml`) and, if the check
passes, publishes it within a couple of minutes. Watch it under the repository's **Actions** tab: a green tick
means it is live; a red cross means the check found a problem and **nothing was published**: open the run and
read the message (it is the same message `npm run check` shows on your computer).

Rules:
- **Publish only the `next-site` project, never the whole club folder.** The folder above it holds private club
  files that must not be public. Ask the previous Website Lead for the list, and keep them out of GitHub.
- Run `npm run check` on your computer first, so you find problems before GitHub does.
- Run `npm audit` now and then. If it reports a problem, update the package (`npm install next@latest`), run
  `npm run check`, then push.
- **Settings that must stay on** (repository > Settings > Pages): Source = **GitHub Actions**, and **Enforce HTTPS**.
- Only people who need to publish should have access to the repository. The club GitHub login must have
  2-step verification on, with the password kept in the club's password manager.
- If the address ever changes (for example to a university address), change `SITE_URL` in `lib/site.js`.

---

## 6. Rules the club agreed on (please keep them)

- Clients are **on campus only** for now: campus departments and student clubs. No local businesses.
- **No prices, revenue or profit-sharing** anywhere on the site.
- **Never** put a Google Form's edit link, or a spreadsheet of responses, on the site. Only public `viewform`
  links (Google Docs as `/preview`).
- **Do not invent** testimonials, ratings, numbers of members or prints, or awards. Real quotes only, with permission.
- Use only the **Algoma University colours**. **Never Orange (#E87000)**: it is reserved for Indigenous programming.
- Keep text readable: AODA (Ontario) needs strong contrast, so no white text on Gold or light grey, and no black text on
  Red or Dark Blue.
- The brand fonts in `Fonts.zip` are paid and must **never** be published. The site uses free Google fonts.
- The club's name on the site is **LayerLabs**.

---

## 7. Handover checklist (do this each year when the team changes)

- [ ] The new owner has access to the **club Google account** (password in a password manager, 2-step verification on).
- [ ] The new owner owns or can edit the **request Google Sheet** and its script, and the **GitHub** project.
- [ ] Old executives are removed from `data/team.js`, the Google Sheet and GitHub.
- [ ] Past events are removed or updated.
- [ ] The year in the footer updates by itself. Check the dates elsewhere.
- [ ] Old request rows in the Google Sheet are deleted when no longer needed (they hold students' names and emails).
- [ ] Copies of `google-apps-script/`, `film/` and this folder are saved somewhere the club controls (not on one person's laptop).

---

## 8. If something goes wrong

- **The page looks broken after an edit:** you probably made a typo (a missing quote or bracket). Undo your last
  change (`Ctrl+Z`) or look at the red error message in the terminal and in the browser: it names the file and line.
- **"npm: command not found" or similar:** Node.js is not installed. Install it from nodejs.org and reopen VS Code.
- **Odd errors after pulling new changes:** run `npm install` again.
- **`npm run check` finds a problem:** read the message. It names the page and what is wrong.
- **Requests stop arriving:** open the web address of the Google script in a browser (it should show
  `{"ok":true,...}`), then see `google-apps-script/SETUP.md`. Email limits can also be reached on busy days.
- **Using version history:** if the project is on GitHub, you can always go back to an earlier version there.
