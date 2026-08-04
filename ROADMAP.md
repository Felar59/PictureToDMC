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

### Done

- **A URL per intent.** `/convertir-photo-point-de-croix`, `/galerie`,
  `/qui-sommes-nous`, `/faq`, `/comment-faire-une-grille-de-point-de-croix`. The old
  English paths redirect. All of them live in `frontend/src/lib/routes.ts`.
- **A real head per route** — title, description, canonical, Open Graph, Twitter —
  written by hand in `frontend/src/lib/head.ts`, no dependency.
- **`JSON-LD`**: `SoftwareApplication` on the home page, `FAQPage` on the FAQ,
  `HowTo` on the guide.
- **`robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`**, generated at build
  time by a Vite plugin from `routes.ts` and `site.ts`, so a new page reaches all four
  by being added to `indexable` and the domain changes in one line.
- **A 1200x630 share card** built from a real chart, plus a `manifest.webmanifest`.
- **The soft-404 is fixed.** Every unknown path used to answer 200 with the SPA shell,
  so a typo was a page as far as a crawler was concerned. `PythonDCA/main.py` now
  knows the router's paths: those answer 200, anything else 404, both with the same
  HTML so the not-found page still renders.
- **The FAQ and the guide exist as pages** rather than as an anchor.

### Still to do

- **Content.** The FAQ is fourteen questions; the guide is one page. What earns links
  is more of both — how to read a chart, what to do about a photo with a busy
  background, converting a pet versus a portrait. Each is a page somebody is looking
  for.
- **`hreflang`.** The language switch changes the copy but not the URL, so there is
  one address serving two languages and no way to tell a crawler that. Doing it
  properly means `/en/...` paths, which is a bigger change than it sounds.
- **Per-piece heads.** `/piece/:id` still takes the site default. Each published piece
  could carry its own title, its own description and its own chart as the share image
  — which is the one thing here that would make a shared link worth clicking.

### Why this was the highest-value item, kept for the record

emoji-art has a dedicated URL per intent and this site had one for everything. Every
query — "photo en grille de point de croix", "convertisseur photo point de croix",
"grille point de croix gratuite" — landed on `/convert`, so not one of them was
answered by a page that was *about* it. That, and not any meta tag, was the work.

Still worth adding when there is a reason to: `/confidentialite`, which §4 needs
anyway.

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

Mostly done. Drawn in the house grammar: the chart-download sheet, the share hoop,
`CornerStitch` on the orientation tiles, and now `Chevron` and `CrossMark` — the last
two replacing literal `▸` and `✕` characters, which rendered in whichever font on the
machine happened to have them rather than the one the line was set in.

What remains:

- the four category pills in the gallery could carry a mark each
- the vividness pills lean on text alone, which may be right — they are three words
  in a row and a glyph per step would be decoration

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
- ~~`home.heroLead` says "Envoyez une image"~~ — **fixed**, along with the CTAs, the
  first step and the file-formats answer. Nothing is sent anywhere, and "envoyer" was
  the wrong verb in six places.
- ~~"survolez un fil"~~ — **fixed**. It described a gesture a phone does not have, for
  a control that is now tappable.
- ~~"589 références"~~ — **fixed**. Matching is restricted to 483 plain-cotton shades,
  so 589 had quietly become wrong; and the About page said 489, which was simply an
  error.
- "Picture to DMC" appears in body copy in several places and will all have to
  move when §0 lands.
- the thread *names* are English in the French UI ("Pewter Gray - Very Dark"),
  because they come that way out of the DMC chart. Translating 483 of them is a
  real job with a real payoff for a French audience — and it is the largest remaining
  content item on this page.

---

## Smaller things, kept so they are not lost

- ~~`PythonDCA/dist/` is committed~~ — **fixed**. 19 MB untracked, including a second
  copy of the 4.4 MB segmentation model. CI builds it before it rsyncs, so what was
  committed was never what shipped.
- ~~`Dialog` has no focus trap~~ — **fixed**. It announced `aria-modal` while Tab
  walked straight out into the page behind it, which is a promise the markup was not
  keeping. Focus moves in on open, wraps at both ends, and returns to whatever opened
  it.
- ~~The converter's hover-to-isolate has no keyboard or touch path~~ — **fixed**. The
  row is a button; tapping pins a thread.
- Icon presets for member marks — the account page already says they are coming, and
  this one is waiting on the marks themselves.
- **Stored images.** Measured rather than assumed, and the answer was not the obvious
  one: a pattern thumbnail is flat blocks with hard edges, so lossy encoding is
  disqualified outright (WebP at q90 changed 68% of sub-pixels, worst channel error
  253) and AVIF was *larger* than PNG at lossless. The win was that the thumbnail was
  stored at nine pixels per stitch while the card displays it with
  `image-rendering: pixelated` — so it is stored at one pixel per stitch now, PNG,
  **19% of the bytes**, bit-for-bit identical once scaled back up. The one thing that
  would beat it is lossless WebP, which `canvas.toDataURL` cannot produce.
  What is left here: the hoop photographs on existing posts are the only large blobs
  in the database, and nothing new can add one since the picker was removed. Shrinking
  those would need an image library on the box for three files, which is not worth it.
- The Google client secret transited a chat and should be rotated.
