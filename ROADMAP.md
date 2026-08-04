# Roadmap

What is next, and why. Written so that picking any item up in a month does not
require remembering the conversation it came from.

Nothing here is a promise about dates. The order inside each section is the order
that makes the work cheapest, which is not always the order of importance.

---

## 0. The name — everything else waits on this

The site has no name. "Picture to DMC" is a description of what it does, "DMC" is
somebody else's trademark, and the domain is still an IP address with `sslip.io`
bolted on.

This is first because it is a **blocker for five other items**, not because it is
urgent on its own:

| Blocked | Why |
|---|---|
| the logo | a wordmark cannot be drawn around a name that may change |
| the downloaded chart's header | the line currently reads `DMC · 12 couleurs · …` |
| the domain | and therefore Search Console, ads, and every absolute URL |
| `llms.txt`, `sitemap.xml`, Open Graph | all of which name the site and link to it |
| the favicon and the manifest | same mark, same name |

Constraints worth writing down before choosing:

- **DMC is a registered trademark of DMC (Dollfus-Mieg & Compagnie).** Using it in
  the *name* invites a problem that never has to be had. Using it to say which
  threads a chart uses is ordinary factual use and is fine — that distinction is
  the whole reason the name has to move away from it.
- `.com` free, or a French `.fr` if the audience really is French-first.
- Say it out loud. Half the traffic will hear it before typing it.
- Room to grow: the engine already renders on tote bags and cushions. A name about
  charts will be a cage in a year.

### The chart's header line

`renderChart`'s legend title is passed in by the caller and currently starts with
the literal `DMC`. Once the site has a name that line becomes
`<name> · 12 couleurs · 4 292 points · 58 × 74` — the site's signature on something
people print, keep, and put in a hoop for a fortnight. It is free advertising on a
physical object and it is currently spent on a thread manufacturer.

Where: `frontend/src/i18n/dictionary.ts`, `chart.legendTitle` in both languages, and
`chart.isolate.legendTitle` for the per-thread sheets.

---

## 1. SEO — be findable by people, and by the models people now ask

Follow what emoji-art.com does, because it works there and the two sites have the
same shape: a browser-side tool with no signup.

### Current state

`frontend/index.html` has a title, one description, a theme colour and favicons.
That is all. No `robots.txt`, no `sitemap.xml`, no `llms.txt`, no Open Graph, no
canonical, no structured data, no manifest — and, more importantly, **one URL for
the whole tool**.

### The structural piece, and the one that matters most

emoji-art has a dedicated, clean URL per intent: `/image-to-emoji`,
`/emoji-mosaic`, `/emoji-art-editor`, `/library`, `/gallery`, plus a how-to and an
FAQ. Each one answers a different thing somebody types into a search box.

This site has `/convert`. Everything anyone might search for — "photo en grille de
point de croix", "convertisseur photo point de croix", "grille point de croix
gratuite", "trouver les fils DMC d'une image" — lands on the same page, so none of
them is answered by a page that is *about* it.

Splitting that is the highest-value SEO work here and it is not a meta tag. A first
cut:

- `/` — what it is, the example, the gallery
- `/convertir-photo-point-de-croix` — the converter, with real copy above it
- `/galerie` — already exists as `/gallery`; the French path is the better one
- `/comment-faire-une-grille-de-point-de-croix` — the guide, the page that earns
  links
- `/faq` — currently an anchor on the home page, which cannot rank on its own
- `/qui-sommes-nous` — exists as `/about`
- `/confidentialite` — needed anyway for ads, see §4

### The files

- **`robots.txt`** — explicitly allow the AI crawlers rather than leaving it to a
  default: `ChatGPT-User`, `ClaudeBot`, `Claude-Web`, `PerplexityBot`,
  `Google-Extended`, `Applebot-Extended`, `CCBot`. Plus the `Sitemap:` line.
- **`llms.txt`** — the emerging convention, and emoji-art's is a good model: an
  `H1` with the name, a `>` blockquote summary, then `## Tools` with one
  `[title](url): description` per route, `## About`, `## Optional`. About 4 kB.
- **`llms-full.txt`** — everything in one file, ~15 kB.
- **`sitemap.xml`** — every indexable route. Trivial once §1's routes exist, and
  pointless before.
- **`manifest.webmanifest`** — name, icons, theme colour.

### Per page

- a distinct `<title>` and `description` — a single-page app serves the same head
  to every route today, so every route looks identical to a crawler
- `<link rel="canonical">`
- Open Graph and Twitter cards with a real image. **A chart is the perfect OG
  image** — the engine already renders one, and a shared link showing an actual
  cross-stitch chart is a better advert than any illustration.
- `JSON-LD`: `SoftwareApplication` for the tool, `FAQPage` for the FAQ, `HowTo` for
  the guide
- `<html lang>` follows the language switch, which it does not today

### Content, which is the part that cannot be automated

Search rewards pages that answer something. The FAQ answers four questions; a real
one answers twenty. How many threads for a portrait, what aida count means, how to
read a chart, how to convert a photo of a pet, why a photo with a busy background
comes out badly. Each of those is a page somebody is looking for.

---

## 2. The logo

Blocked on §0. What is there now is a hoop with a needle, drawn as a component in
`frontend/src/components/brand/logo.tsx`, and it is decent — but it was drawn for a
placeholder name.

Wanted: a mark that works at 24px in a browser tab, in one colour, on a printed
chart's corner, and as a favicon. The cross stitch itself (`StitchMark`) is already
the strongest thing in the visual language and is probably the answer, or part of
it.

---

## 3. Google Search Console

Blocked on the domain, so blocked on §0. Then:

- verify the property (a DNS `TXT` record is the least fragile method)
- submit `sitemap.xml`
- watch the Coverage report for the SPA fallback serving `index.html` for URLs that
  should be 404 — that is a real risk with the current
  `main.py` catch-all and it will quietly poison indexing
- Bing Webmaster Tools at the same time; it is the same work twice and it feeds
  more than Bing

---

## 4. Ads

Deliberately last, and with a warning: the site's own copy says
**"100 % gratuit"** and the FAQ says *"il n'y a rien à acheter ici"*. Ads do not
contradict that, but a page that goes from no ads to three of them reads as a
different promise. Decide what the ceiling is before the first one goes in.

Prerequisites, in order:

1. a real domain (§0)
2. a privacy policy and a cookie notice — required by AdSense, and by the GDPR for
   a French audience regardless of AdSense
3. enough content to be approved at all; AdSense rejects thin sites, and right now
   this is one tool and a gallery
4. only then apply

Worth considering instead, or first: the chart is the product and it is free. A
"buy me a coffee" link costs nothing, needs no consent banner, and does not slow
the page down.

---

## 5. Icons

Partly done — the rotate glyph, the chart-download sheet and the share hoop are
drawn in the house grammar. What remains:

- the vividness pills and the thread rows still lean on text alone
- the mobile burger is three plain bars
- `▸` in the "Modifier" disclosure is a literal character, so it renders in
  whatever the system font decides
- `✕` on the dialog close button, same problem
- the four category pills in the gallery could carry a mark each

Rule that has been worth following: composed divs where the shape is boxes and
lines, SVG only where an arc is unavoidable. See
`frontend/src/components/brand/icons.tsx`.

---

## 6. The old copy

Written early, never revisited, and some of it is now wrong. Known:

- ~~the FAQ said a photo **"est envoyée à notre serveur"**~~ — **fixed.** It had not
  been true since the conversion moved into the browser, and it said the opposite of
  the truth about the one thing this site can claim over its competitors. Worth
  recording as the shape of problem to look for: the copy describes an architecture
  the code left behind.
- `home.heroLead` says "Envoyez une image", and the CTA is "Choisir une photo" —
  "envoyer" is now the wrong verb everywhere it appears, for the same reason
- `home.features` and `converter.threads.hints` both tell people to *hover* a
  thread, for a behaviour that has no keyboard or touch path at all. On a phone the
  copy describes something impossible.
- "Picture to DMC" appears in body copy in several places and will all have to
  move when §0 lands
- the thread *names* are English in the French UI ("Pewter Gray - Very Dark"),
  because they come that way out of the DMC chart. Translating 489 of them is a
  real job with a real payoff for a French audience.

---

## Smaller things, kept so they are not lost

- `PythonDCA/dist/` is committed but CI rebuilds it, so it is dead weight that
  dirties the tree on every local build. It wants a `.gitignore` entry and a
  `git rm --cached`.
- `Dialog` has no focus trap, no autofocus and no focus restore; tab order escapes
  into the page behind the modal.
- The converter's hover-to-isolate has no keyboard or touch path, while the copy
  tells people to hover. The chart dialog's per-thread rows solved this properly
  and the converter should borrow it.
- Icon presets for member marks — the account page already says they are coming.
- The Google client secret transited a chat and should be rotated.
