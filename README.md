# Akash Shinde — Portfolio

An editorial/magazine-style developer portfolio, built with React + Vite + React Router.
No CSS framework, no animation library — CSS custom properties for the design system,
plain CSS transitions/transforms for motion, and the native browser View Transitions API
for page changes.

## Running it

```bash
npm install
npm run dev        # local dev server (public portfolio at http://localhost:5173/)
npm run dashboard  # opens private admin dashboard directly at http://localhost:5173/admin
npm run build      # production build, output in dist/
npm run lint       # oxlint
```

## Private Admin Dashboard (CMS)

A dedicated, strictly private admin dashboard is integrated at `/admin`:
- **Master Secret Key Access**: Secured with your secret passphrase (configured in `.env` as `VITE_ADMIN_SECRET_KEY`). Visitors without the key cannot access the panel.
- **Unified Single-Hub Dashboard**: No jumping between separate pages. Tabs for:
  - **Profile & About**: Edit name, title, bio story, strengths, portrait, and links all with one save button.
  - **Projects Showcase**: Add, edit, publish/draft, and delete projects.
  - **Skills & Experience**: Add/remove categorized skill tags and manage career timeline entries.
  - **Cloud & Backup**: 1-click JSON backup download and Upstash status.
- **Dual-Mode Persistence**: Works out of the box locally via `localStorage`, and connects seamlessly to **Upstash Redis** (via REST API in `.env`) for 24/7 cloud sync without complex SDKs or rules.

## Editing content — you shouldn't need to touch components

Everything personal/editable lives in `src/data/`, as plain JS objects/arrays.
Change these and the whole site updates — no component code needs editing:

| File | Controls |
|---|---|
| `data/profile.js` | Name, role, statement, education, contact info, social/resume links, About bio & strengths |
| `data/experience.js` | Experience page entries (currently one placeholder — see below) |
| `data/projects.js` | Every project: title, descriptions, features, tech, links, image |
| `data/skills.js` | Skill categories and their tags |
| `data/homeCards.js` | The six homepage card blurbs (pulls most of its content from the files above already) |

### Images

Drop files into `public/images/`, then point to them from the data layer
(e.g. `profile.photo = "/images/portrait.jpg"`). Every image spot uses a shared
`CardImage` component (`src/components/ui/CardImage.jsx`) that renders a real `<img>`
when given a path, and falls back to a clearly-marked placeholder otherwise — so nothing
breaks if a path is missing.

## Design system

`src/styles/tokens.css` is the only file that should contain literal color hex values.
Everything else references the semantic variables it defines (`--color-accent`,
`--color-text`, etc.). To reskin the site — new accent color, different background — edit
the "RAW PALETTE" section at the top of that file.

Note: `--color-accent` (vivid, used for badges/button fills) and `--color-accent-text`
(darker, used anywhere the accent is text on the paper background) are intentionally
different shades — the vivid one fails WCAG contrast as text on this background, so don't
swap them for each other without rechecking contrast.

## Still placeholder

These are intentionally left as clearly-marked `PLACEHOLDER` values rather than invented
content — search for `PLACEHOLDER` in `src/data/` to find them all, or check this list:

- **GitHub and LinkedIn URLs** (`profile.js`) — not provided yet
- **Second About bio paragraph + career direction sentence** (`profile.js`)
- **`public/resume.pdf`** doesn't exist yet — the "Download resume" button points at it,
  so add the real file for that button to work
- **Experience page** — no real work experience yet, shows one placeholder entry
  demonstrating the shape. Replace it (or add more) in `data/experience.js`, or set the
  array to `[]` to show nothing instead
- **Project details** — your one real project (Typography Web) has real features listed,
  but its tech stack, GitHub/live links, and date are still placeholder
- **Project images** — currently show a placeholder pattern; add a second project with a
  real image and the homepage's Projects card will automatically start auto-rotating
  between project thumbnails (see `HomeProjectsPreview.jsx`) — with only one image it just
  stays static

## Project structure

```
src/
  components/
    editorial/    → the six homepage cards + their shared building blocks
    layout/       → Header (nav), PageShell (shared inner-page chrome)
    sections/     → per-page-section components (Experience, Projects, Skills, Contact)
    ui/           → generic reusable pieces (Button, Tag, CardImage)
  data/           → all editable content (see table above)
  hooks/          → small reusable hooks (reduced-motion detection, document title)
  pages/          → one file per route
  styles/         → tokens.css (design system) + base.css (reset/globals)
  utils/          → navigateWithTransition (the page-transition helper)
```
