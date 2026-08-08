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

Where: `frontend/src/i18n/fr.ts` et `en.ts`, cle `chart.legendTitle`, et
`chart.isolate.legendTitle` pour les planches d'un seul fil. (Le dictionnaire unique a
ete scinde par langue — voir §8.)

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
- **`JSON-LD` on every route**, composed in `frontend/src/lib/schema.ts` as one
  `@graph` per page with stable `@id`s. `Organization` + `WebSite` + `SoftwareApplication`
  (home and converter), `BreadcrumbList` everywhere, `CollectionPage` + `ItemList` on
  both galleries, `CreativeWork` + `ImageObject` + `Person` on a piece, `ProfilePage`
  on a member, `AboutPage`, and the older `FAQPage` / `HowTo`.

  Worth recording what this is and is not worth, since the internet is confident and
  wrong about it in both directions. Google removed `HowTo` rich results in September
  2023 and `FAQPage` rich results on 7 May 2026 — those two earn *nothing* in a search
  result now and are kept only because they stay valid and are read by everything that
  is not Google. The types with a live payoff are the ones added later: breadcrumbs,
  image metadata (creator and licence shown against a picture in Google Images),
  profile pages, organisation. Schema.org is emphatically not an e-commerce-only
  vocabulary — but the e-commerce half of it (`Product`, `Offer`, `AggregateRating`,
  `Review`) is exactly the half this site has no honest use for, and inventing a rating
  to earn a star would be the wrong trade.
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

- ~~**Rendre le head côté serveur.**~~ — **fait** (commit `e65aeb0`), étape 1 sur 2.

  Le serveur écrit maintenant le head lui-même, pour toutes les routes. Les mots
  viennent de `dist/head-manifest.json`, produit au build en appelant les *mêmes*
  fonctions que l'application (`frontend/src/lib/head-manifest.ts`) : Python ne
  détient aucune copie des textes. Les routes fixes arrivent avec leur JSON-LD déjà
  sérialisé ; les deux routes dynamiques stockent un gabarit et le serveur remplit
  les trous. Voir `PythonDCA/api/prerender.py`.

  Vérifié sur la production, sans navigateur :

  ```
  curl -A ClaudeBot/1.0 https://…/piece/4
    <title>fleureux, par Felar — grille de point de croix</title>
    <meta name="description" content="… 40 × 30 points en 8 fils DMC …">
    ld+json : CreativeWork, ImageObject, Person, BreadcrumbList
  ```

  **Étape 2 faite aussi** (commit `af2739f`). `#root` arrive rempli : titre, texte,
  et les liens de navigation. Mesuré sur la production :

  ```
  /                     9 liens   276 mots
  /comment-faire-…      8 liens   588 mots
  /faq                  7 liens   695 mots
  /piece/4              4 liens    43 mots
  ```

  Avant : **0 lien et 0 mot sur chaque page**. Sans JavaScript le site n'avait aucune
  structure — seul `sitemap.xml` le tenait, et un sitemap est une liste d'adresses,
  pas une forme. La page d'un membre est ce qui rend ses grilles atteignables : la
  galerie est une liste construite par `fetch`, donc invisible.

  React vide `#root` au montage : personne ne voit les deux versions. En attendant,
  un visiteur lit les vrais mots dans les vraies polices au lieu d'un rectangle
  crème vide — c'est donc aussi un premier affichage que le site n'avait pas.

  Le contexte, gardé parce qu'il explique pourquoi. Mesuré le 7 août 2026 :

  ```
  curl https://…/piece/4
    3 324 octets
    <title>Photo en grille de point de croix — gratuit…</title>   ← celui de l'accueil
    0 bloc ld+json
    <body> vide
  ```

  Tout ce que fait `useHead` — titre, description, canonique, Open Graph, JSON-LD —
  s'écrit **après** que le JavaScript a tourné. Googlebot exécute le JS et voit donc
  tout. GPTBot, ClaudeBot et PerplexityBot **n'exécutent pas de JavaScript** : ils
  lisent le HTML initial et repartent. La documentation d'Anthropic le dit noir sur
  blanc pour son propre outil de récupération web.

  Conséquence : pour ChatGPT, Claude et Perplexity, *chaque* page du site est
  aujourd'hui le titre de l'accueil, la description de l'accueil, aucun balisage et un
  corps vide. Le travail de structure est correct ; il est simplement invisible pour
  exactement les moteurs qui motivaient ce chantier.

  Deux garde-fous valent d'être notés, parce que la duplication est réelle :
  le graphe d'une pièce et celui d'un membre sont bel et bien construits deux fois,
  en TypeScript et en Python. Un test récupère les deux et les compare champ par
  champ ; ils sont identiques aujourd'hui. Et les balises portent `data-head`, donc
  React les adopte au lieu d'en ajouter une seconde série — sans quoi c'était le
  bug des canoniques en double, en pire.

- **Content.** The FAQ is fourteen questions; the guide is one page. What earns links
  is more of both — how to read a chart, what to do about a photo with a busy
  background, converting a pet versus a portrait. Each is a page somebody is looking
  for.
- **`hreflang`.** The language switch changes the copy but not the URL, so there is
  one address serving two languages and no way to tell a crawler that. Doing it
  properly means `/en/...` paths, which is a bigger change than it sounds.
- ~~**Per-piece heads.**~~ — **fait** (commit `0130e02`). Chaque pièce porte son
  titre, sa description, son canonique et sa propre carte de partage dessinée par le
  serveur. Un post photo a depuis son propre gabarit de head : il n'a ni dimensions
  ni nombre de fils à citer, et les citer quand même écrivait « null × null points »
  dans un aperçu de lien.

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
2. ~~a privacy policy~~ — **faite** (commit `4289176`), à `/confidentialite`, dans le
   pied de page et dans le sitemap. Écrite depuis le code : `db.py` pour ce qui est
   stocké, `auth.py` pour le cookie et ses 180 jours, `google.py` pour les
   autorisations réellement demandées (`openid email profile`, rien d'autre).

   **Deux choses restent à faire, et elles sont pour Felix :**

   - Remplir `[ADRESSE À COMPLÉTER]` et `[IDENTITÉ À COMPLÉTER]` dans
     `privacyPage.contactBody`, dans `fr.ts` et `en.ts`. Une adresse à laquelle on
     peut exercer un droit — un lien GitHub n'en est pas une. La page dit elle-même,
     en toutes lettres et de façon visible, qu'il reste des crochets : c'est
     volontaire, un texte à trous déguisé en texte fini reste en ligne un an.
   - ~~**Un bouton pour supprimer son compte.**~~ — **fait.** En bas de `/compte`.
     Suppression et non anonymisation, parce que c'est ce que la page de
     confidentialité promet — « compte, publications et commentaires » — et qu'une
     page qui dit autre chose que ce que fait le code est précisément ce que cette
     page existe pour éviter.

     Le dialogue compte d'abord : « vos 2 grilles publiées », « votre commentaire ».
     « Tout supprimer » oblige à deviner combien « tout » représente, et surtout à
     ne pas pouvoir remarquer qu'on est connecté au mauvais compte. Il faut ensuite
     taper le mot — la casse est ignorée, un clavier de téléphone ne doit pas être
     ce qui empêche quelqu'un de partir.

     Le piège n'était pas la cascade : toutes les tables qui référencent `users`
     cascadent déjà. C'était `posts.like_count`, dénormalisé. Les cœurs donnés aux
     ouvrages **des autres** disparaissent de `post_likes` sans qu'aucune clé
     étrangère ne touche au compteur affiché sur la carte — chaque départ aurait
     laissé derrière lui des ouvrages annonçant un cœur qui n'existe plus,
     silencieusement et définitivement. La suppression décrémente avant d'effacer,
     et le test le vérifie sur l'ouvrage d'un tiers.

   Une bannière de cookies n'est **pas** nécessaire en l'état : le seul cookie posé
   est celui de session, strictement nécessaire au service demandé, donc exempté.
   Le jour où une régie publicitaire arrive, elle en pose d'autres et le consentement
   devient obligatoire — c'est un coût de la publicité, à mettre en face du gain.
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
- ~~the thread *names* are English in the French UI~~ — **fait.** C'était le dernier
  anglais visible du site, et il était partout : liste des fils, fiche d'un fil,
  inventaire sous une pièce publiée, et légende de la grille qu'on imprime.

  Traduire 483 chaînes à la main n'était pas la bonne forme du problème. 589 fils ne
  contiennent que **143 expressions et 15 degrés de clarté** — « Peacock Blue - Very
  Dark » est une base et une nuance. `engine/dmc-names-fr.ts` traduit les deux
  séparément et recompose, ce qui tient dans 4 kB au lieu de 589 chaînes et garantit
  que « très foncé » s'écrit pareil dans les 49 fils qui le portent. Le relevé a aussi
  montré que les nuances restent invariables en français : un adjectif de couleur
  qualifié par un autre adjectif ne s'accorde pas (« des yeux bleu clair »), donc
  « Rose clair » est correct et il n'y a pas d'accord à gérer.

  Là où le français a un usage établi en mercerie, il a été suivi : « bleu layette »,
  « vieux rose », « bleu bleuet », « gris étain », « terre cuite », « bois flotté ».
  Les noms qui voyagent ne sont pas traduits — Wedgwood, Delft, Kelly — et
  « Winnie The Pooh » prend sa forme française sous licence.

  **Le numéro reste l'identifiant**, et c'est ce qui rend la traduction sans risque :
  la légende imprime toujours le numéro en premier et en gras, c'est lui qu'on achète.
  La fiche d'un fil est le seul endroit qui montre aussi le nom anglais, parce que
  c'est celui des cartes de nuances DMC et des catalogues de boutique.

  Deux contrôles gardent l'ensemble : `check-thread-names.mjs` échoue si un seul des
  487 fils coton n'a pas de nom français, signale les entrées devenues inutiles, et
  refuse deux bases traduites pareil — sauf `Pink`/`Rose`, où le français n'a
  qu'un mot. `check-thread-names-ui.cjs` le vérifie dans le navigateur, dans les deux
  langues.

  Ce ne sont **pas** les noms du catalogue français officiel de DMC, qui n'est pas
  dans ce dépôt : ce sont des traductions idiomatiques. Si le catalogue arrive un
  jour, il remplace une table de 143 lignes.

---

## 7. The two galleries — done

Charts and finished work are two different things, and the gallery held only the
first. Both now live in one page under one entry in the navigation bar, at two URLs:
`/galerie` keeps the charts (it is the indexed one, and on the day this shipped the
photo gallery was empty) and `/galerie/broderies` holds the photographs.

The decision that shaped the work: **a photo can be published on its own**, with no
chart from this site. Somebody who stitched a pattern bought elsewhere has work worth
showing, and refusing them would have made the second gallery a subset of the first.
That is what made this more than a filter:

- `posts.kind` (`pattern` | `photo`), and `width`, `height`, `cells`, `thread_codes`
  all became nullable. SQLite cannot drop a `NOT NULL`, so `init()` rebuilds the
  table — and that migration has to run **before** `SCHEMA`, since `SCHEMA` now
  creates an index on `kind`. Verified on a copy of the production database: rows
  kept, five indexes recreated, `integrity_check` clean, and idempotent.
- Sentinels were considered and rejected. `cells = ''` would have made every reader
  guess whether a post has a chart; `kind` says so.
- A photo post has no chart, so the piece page had to stop treating a missing grid as
  a missing post — it answered "this piece isn't here any more" for every one of
  them.
- `reports` and a moderation queue at `/signalements`, because a free photograph is
  not bounded by what the converter can produce. Without it the only remedy would
  have been SQL on the server.

### Still to do here

- Invert the default when the photographs outnumber the charts — one line in
  `routes.ts`, and worth revisiting once there is anything to look at.
- Nothing sends an e-mail when something is reported. The queue has to be visited.
  Fine for two people; not fine for twenty.
- ~~Photo posts are not in the sitemap individually, like every other piece.~~ —
  **réglé, et pas seulement pour les photos.** `sitemap.xml` n'est plus un fichier
  produit au build : il est construit par le serveur à chaque requête depuis la table
  (`PythonDCA/api/prerender.py`, `sitemap_xml`). Le build ne pouvait lister que les
  huit pages fixes — une pièce est une ligne de base de données, et le build n'en a
  pas — donc *aucune* pièce et *aucun* membre n'y figurait.

  Les deux objections d'origine tombent d'elles-mêmes : une pièce supprimée disparaît
  du sitemap à l'instant où elle est supprimée, et une nouvelle y entre à l'instant où
  elle est publiée. Un membre n'y entre que s'il a publié quelque chose — une page de
  profil vide est une page mince, et en proposer à un moteur est la meilleure façon de
  lui apprendre à ignorer le site.

---

## 8. Le premier chargement — mesuré, puis réduit

Rien ici n'a été deviné : le poids par module vient des source maps du bundle livré,
et les graisses de police ont été relevées dans le navigateur, page par page.

Le paquet initial est passé de **119,2 à 102,3 kB gzip**, et deux origines externes
ont quitté le chemin critique.

| Ce qui a bougé | Pourquoi |
| --- | --- |
| Les trois polices sont servies par le site | La feuille de style venait de `fonts.googleapis.com` et les fichiers de `fonts.gstatic.com` : deux résolutions DNS et deux poignées de main TLS avant qu'un mot ne puisse s'afficher dans la bonne police. Deux des trois sont préchargées ; Shantell Sans, 70 kB à elle seule pour l'écriture manuscrite des apartés, ne l'est pas. |
| L'axe de graisse est restreint | Relevé dans le navigateur : Fredoka 700 et Nunito 600 n'apparaissent sur **aucune** page. 10,4 kB. |
| La charte DMC a quitté le paquet initial | `StitchAvatar` est dans l'en-tête, donc jamais paresseux, et il résolvait douze couleurs à travers les 589 fils. Elles sont maintenant générées par `scripts/export-dmc.py`, depuis le même tableur, dans la même passe. −9,2 kB gzip, et la charte se charge avec les pages qui s'en servent. |
| L'anglais est chargé à la demande | Les deux dictionnaires pesaient 52 kB dans ce que tout le monde télécharge, dont la moitié qu'un lecteur donné ne verra jamais. Le site est francophone d'abord : le français est statique. −7,8 kB gzip. |
| Cache d'un an sur les chemins versionnés | nginx proxie tout vers uvicorn sans aucune règle de cache, donc chaque visite revalidait onze fichiers — un aller-retour chacun pour s'entendre dire « non modifié ». Seconde visite mesurée : 10 réponses sur 11 servies par le cache, zéro revalidation. `index.html` reste volontairement dehors. |
| `.woff2` et `.onnx` déclarés | `mimetypes` ne les connaissait ni sous Windows ni forcément sur le serveur, donc ils partaient en `text/plain` — qui est dans les `gzip_types` de nginx. La machine recompressait donc des octets déjà compressés, dont les 4,4 Mo du modèle de segmentation à chaque requête. |

### Ce qui a été mesuré puis laissé tel quel

- **`tailwind-merge`, 24,6 kB (7 % du paquet).** Il gagne sa place : plusieurs
  appelants surchargent réellement les classes des composants — l'en-tête passe
  `text-[15px] px-[22px]` à un `Button` qui a déjà les siennes. Le retirer casserait
  ces surcharges en silence.
- **`react-dom`, 174,7 kB (52 %).** C'est le plancher du choix de React.
- **Shantell Sans, 70 kB pour de la décoration.** Elle ne coûte plus rien au premier
  rendu (ni préchargée, ni bloquante). La question « 70 kB pour l'écriture
  manuscrite, est-ce que ça vaut le coup ? » est une décision de design, pas une
  optimisation, et elle n'a pas été prise à ta place.

### Encore à faire

- **Une langue par URL.** `detect()` lit `navigator.language`, donc un robot dont
  l'`Accept-Language` est anglais rend les pages françaises en anglais. C'était déjà
  le cas avant ce lot — le français s'affiche désormais immédiatement en attendant
  l'anglais, ce qui est plutôt mieux pour un robot — mais le vrai correctif est
  `/en/...` avec des `hreflang`, et il touche au point 1.
- Le dictionnaire reste découpé **par langue**, pas par page : la copie du
  convertisseur et les quatorze réponses de la FAQ partent avec la page d'accueil.
  Un découpage par page rapporterait encore, au prix d'un passage sur chaque `t.*`.

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
  What is left here: the hoop photographs are the only large blobs in the database,
  and photo posts mean new ones arrive again — so they are shrunk on the way in
  instead. `preparePhoto` caps the long edge at 1400px and encodes JPEG at 0.82 in
  the browser, which puts a phone photo a long way under the 6 MB the server accepts.
  Shrinking the ones already stored would need an image library on the box for a
  handful of files, which is still not worth it.
- The Google client secret transited a chat and should be rotated.
