/**
 * Every route's head, baked into JSON at build time for the Python server to serve.
 *
 * The problem this solves, measured on production before it existed:
 *
 *     curl https://…/piece/4  →  the home page's <title>, no ld+json, an empty body
 *
 * `useHead` writes the head after React has run. Googlebot executes JavaScript and
 * sees it; GPTBot, ClaudeBot and PerplexityBot do not — they read the HTML the
 * server sent and leave. So every page of a client-rendered site looks to them like
 * the same page: whatever `index.html` happens to say.
 *
 * The fix is for the server to send the right head. The awkward part is that all the
 * words live here, in TypeScript, and the server is Python. Rather than translate
 * them by hand into a second file that would drift from the first edit onwards, the
 * build calls the same functions the app calls and writes the answers to
 * `head-manifest.json`. The server reads that file and pastes. It holds no copy and
 * makes no decisions.
 *
 * The dynamic routes cannot be baked — a piece's title is a row in a database — so
 * what is stored for those is the *template*, produced by calling the real i18n
 * function with sentinel arguments and swapping them for named placeholders. The
 * server fills them in. That way even the shape of "{title}, par {maker} — grille de
 * point de croix" comes from the same source as the client's.
 *
 * French, not the active language: the server cannot know what a visitor's toggle
 * says, French is the canonical language of the site, and it is what `inLanguage`
 * claims everywhere else.
 */

import { fr } from "../i18n/fr"

import { ARTICLE_KEYS, ARTICLES } from "./articles"
import { MAKER_PREFIX, PIECE_PREFIX, indexable, legacyRedirects, paths } from "./routes"
import {
  PIECE_GENRE,
  aboutGraph,
  articleGraph,
  privacyGraph,
  convertGraph,
  faqGraph,
  galleryGraph,
  guideGraph,
  homeGraph,
} from "./schema"
import { ORIGIN, SITE_NAME } from "./site"

const LANG = "fr"

/**
 * Sentinels chosen to survive a round trip through a template and be findable
 * afterwards: improbable as content, and — for the numbers — not a value that could
 * plausibly appear beside them in the same sentence.
 */
const S = {
  title: "TITLE",
  maker: "MAKER",
  width: 811_001,
  height: 811_002,
  threads: 811_003,
  pieces: 811_004,
}

/** Swap every sentinel for the `{name}` the server looks for. */
function template(built: string): string {
  return built
    .replaceAll(S.title, "{title}")
    .replaceAll(S.maker, "{maker}")
    .replaceAll(String(S.width), "{width}")
    .replaceAll(String(S.height), "{height}")
    .replaceAll(String(S.threads), "{threads}")
    .replaceAll(String(S.pieces), "{pieces}")
}

/* ------------------------------------------------------------------- body
 *
 * A readable document for the readers that never run the JavaScript.
 *
 * The head told them what each page *is*. This gives them something to quote —
 * and, just as importantly, something to follow: measured on production before
 * this existed, the served HTML contained **zero links**, on every page. A crawler
 * that does not execute JavaScript could reach nothing from the home page. Only
 * sitemap.xml was holding the site together, and a sitemap is a list of addresses,
 * not a structure.
 *
 * React clears `#root` when it mounts, so everything below is replaced the moment
 * the app boots. Nobody sees two versions. What a person on a slow connection sees
 * in the meantime is the page's actual words in the site's actual fonts, instead of
 * the blank cream rectangle they got before — so this is not only for machines.
 *
 * Only classes already used by the real pages appear here, so Tailwind has
 * certainly emitted them.
 */

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/** The links every page carries, so the site has a shape without JavaScript. */
function chrome(t: typeof fr, inner: string): string {
  const link = (to: string, label: string) => `<a href="${to}">${esc(label)}</a>`
  const nav = [
    link(paths.home, SITE_NAME),
    link(paths.convert, t.nav.convert),
    link(paths.gallery, t.nav.gallery),
    link(paths.guide, t.nav.guide),
    link(paths.faq, t.nav.faq),
  ].join(" · ")
  const foot = [
    link(paths.galleryStitches, t.footer.stitches),
    link(paths.about, t.footer.about),
  ].join(" · ")
  return (
    `<div class="mx-auto max-w-[780px] px-5 py-12">` +
    `<nav class="text-[14px] text-cocoa mb-8 flex flex-wrap gap-2">${nav}</nav>` +
    inner +
    `<nav class="text-[14px] text-cocoa mt-12 flex flex-wrap gap-2">${foot}</nav>` +
    `</div>`
  )
}

const h1 = (text: string) =>
  `<h1 class="text-[32px] sm:text-[40px] leading-[1.12] mt-2 mb-5">${esc(text)}</h1>`
const h2 = (text: string) => `<h2 class="text-[22px] m-0 mb-4">${esc(text)}</h2>`
const p = (text: string) =>
  `<p class="text-[16px] leading-[1.7] text-clay m-0 mb-4">${esc(text)}</p>`

/** heading-and-body pairs — the shape the guide, the about page and the home
 *  page's steps all happen to share. */
function sections(items: ReadonlyArray<{ heading: string; body: string }>): string {
  return items.map((s) => `<section>${h2(s.heading)}${p(s.body)}</section>`).join("")
}

function homeBody(t: typeof fr): string {
  return chrome(
    t,
    h1(t.home.heroTitleBefore + t.home.heroTitleAccent + t.home.heroTitleAfter) +
      p(t.home.heroLead) +
      `<p class="text-[16px] m-0 mb-8"><a href="${paths.convert}">${esc(t.home.ctaUpload)}</a></p>` +
      h2(t.home.stepsTitle) +
      // The home page's steps say `title` where the guide's say `heading`. Mapped
      // rather than made uniform: those two dictionaries are read by components
      // that are not being touched here.
      sections(t.home.steps.map((s) => ({ heading: s.title, body: s.body }))) +
      h2(t.home.faqTitle) +
      t.home.faq.map((f) => `<section>${h2(f.q)}${p(f.a)}</section>`).join("") +
      `<p class="text-[16px] m-0"><a href="${paths.faq}">${esc(t.home.faqMore)}</a></p>`,
  )
}

function guideBody(t: typeof fr): string {
  return chrome(
    t,
    h1(t.guide.title) +
      p(t.guide.lead) +
      p(t.guide.intro) +
      sections(t.guide.steps) +
      `<section>${h2(t.guide.ctaTitle)}${p(t.guide.ctaBody)}` +
      `<p class="text-[16px] m-0"><a href="${paths.convert}">${esc(t.guide.ctaButton)}</a></p></section>`,
  )
}

function faqBody(t: typeof fr): string {
  return chrome(
    t,
    h1(t.faqPage.title) +
      p(t.faqPage.lead) +
      t.faqPage.groups
        .map(
          (g) =>
            `<section>${h2(g.heading)}` +
            g.items.map((i) => `<h3 class="text-[17px] m-0 mb-1">${esc(i.q)}</h3>${p(i.a)}`).join("") +
            `</section>`,
        )
        .join(""),
  )
}

function privacyBody(t: typeof fr): string {
  return chrome(
    t,
    h1(t.privacyPage.title) +
      p(t.privacyPage.lead) +
      p(t.privacyPage.updated) +
      sections(t.privacyPage.blocks) +
      `<section>${h2(t.privacyPage.contactHeading)}${p(t.privacyPage.contactBody)}</section>`,
  )
}

/**
 * A content page, for the readers that never run the JavaScript.
 *
 * These are the pages most likely to be *read* by one — they are answers to whole
 * questions, which is what an answer engine quotes — so serving them as an empty
 * div would have been the one place the prerendering mattered most and did least.
 */
function articleBody(t: typeof fr, which: (typeof ARTICLE_KEYS)[number]): string {
  const copy = t.articles[which]
  const related = ARTICLES[which].related
    .map((key) => {
      const to = key === "guide" ? paths.guide : ARTICLES[key].path
      const label = key === "guide" ? t.guide.title : t.articles[key].title
      return `<li class="m-0 mb-1"><a href="${to}">${esc(label)}</a></li>`
    })
    .join("")
  return chrome(
    t,
    h1(copy.title) +
      p(copy.lead) +
      p(copy.intro) +
      sections(copy.sections) +
      `<section>${h2(t.articles.relatedHeading)}<ul class="list-none p-0 m-0">${related}</ul></section>` +
      `<section>${h2(t.articles.ctaTitle)}${p(t.articles.ctaBody)}` +
      `<p class="text-[16px] m-0"><a href="${paths.convert}">${esc(t.articles.ctaButton)}</a></p></section>`,
  )
}

function aboutBody(t: typeof fr): string {
  return chrome(t, h1(t.aboutPage.title) + p(t.aboutPage.lead) + sections(t.aboutPage.blocks))
}

/** The two interactive pages. Their content is a tool and a live list, neither of
 *  which can be written down here — so they get their heading, what they are for,
 *  and the links. That is honest, and it is more than the nothing they had. */
function plainBody(t: typeof fr, heading: string, lead: string): string {
  return chrome(t, h1(heading) + p(lead))
}

export type StaticHead = {
  title: string
  description: string
  /** Already serialised: the server pastes it into a script tag verbatim. */
  jsonLd: string
  /** Ready-made HTML for `#root`, replaced by React the moment it mounts. */
  body: string
}

export function headManifest() {
  const t = fr

  const fixed: Record<string, StaticHead> = {
    [paths.home]: {
      title: t.head.home.title,
      description: t.head.home.description,
      jsonLd: JSON.stringify(homeGraph(t, LANG)),
      body: homeBody(t),
    },
    [paths.convert]: {
      title: t.head.convert.title,
      description: t.head.convert.description,
      jsonLd: JSON.stringify(convertGraph(t)),
      body: plainBody(t, t.converter.title, t.head.convert.description),
    },
    [paths.gallery]: {
      title: t.head.gallery.title,
      description: t.head.gallery.description,
      jsonLd: JSON.stringify(galleryGraph(t, LANG, false)),
      body: plainBody(t, t.gallery.patterns.title, t.head.gallery.description),
    },
    [paths.galleryStitches]: {
      title: t.head.galleryStitches.title,
      description: t.head.galleryStitches.description,
      jsonLd: JSON.stringify(galleryGraph(t, LANG, true)),
      body: plainBody(t, t.gallery.finished.title, t.head.galleryStitches.description),
    },
    [paths.faq]: {
      title: `${t.faqPage.title} · ${t.nav.faq} — ${SITE_NAME}`,
      description: t.faqPage.lead,
      jsonLd: JSON.stringify(faqGraph(t)),
      body: faqBody(t),
    },
    [paths.guide]: {
      title: `${t.guide.title} — ${SITE_NAME}`,
      description: t.guide.lead,
      jsonLd: JSON.stringify(guideGraph(t)),
      body: guideBody(t),
    },
    // The three content pages, spread in rather than listed one by one: adding a
    // fourth is then a row in articles.ts and nothing here.
    ...Object.fromEntries(
      ARTICLE_KEYS.map((key) => [
        ARTICLES[key].path,
        {
          title: `${t.articles[key].title} — ${SITE_NAME}`,
          description: t.articles[key].lead,
          jsonLd: JSON.stringify(articleGraph(t, LANG, key)),
          body: articleBody(t, key),
        },
      ]),
    ),
    [paths.privacy]: {
      title: `${t.privacyPage.title} — ${SITE_NAME}`,
      description: t.privacyPage.lead,
      jsonLd: JSON.stringify(privacyGraph(t)),
      body: privacyBody(t),
    },
    [paths.about]: {
      title: t.head.about.title,
      description: t.aboutPage.lead,
      jsonLd: JSON.stringify(aboutGraph(t)),
      body: aboutBody(t),
    },
  }

  return {
    origin: ORIGIN,
    siteName: SITE_NAME,
    lang: LANG,
    defaultImage: "/og.png",
    fixed,
    /** Templates. `{…}` is filled from the database by the server. */
    piece: {
      pattern: {
        title: template(t.head.piece.title(S.title, S.maker)),
        description: template(
          t.head.piece.description(S.maker, S.width, S.height, S.threads),
        ),
      },
      photo: {
        title: template(t.head.pieceStitch.title(S.title, S.maker)),
        description: template(t.head.pieceStitch.description(S.maker)),
      },
    },
    maker: {
      title: template(t.head.maker.title(S.maker)),
      // Two, because the French differs on one: "la grille que" against "les 4
      // grilles que". Calling the function with 1 and with a sentinel is how both
      // branches come from the real copy rather than from a guess about plurals.
      descriptionOne: template(t.head.maker.description(S.maker, 1)),
      descriptionMany: template(t.head.maker.description(S.maker, S.pieces)),
      empty: template(t.head.maker.empty(S.maker)),
    },
    /**
     * The fixed pages, for the sitemap the *server* now builds.
     *
     * It used to be written at build time and shipped as a static file, which
     * meant it could only ever list these eight — a piece is a database row, and
     * the build has no database. So the pieces were left out on the reasoning that
     * "the gallery links to every one of them", which was true only once
     * JavaScript had run. The server has the rows, so it merges them in and drops
     * them again when somebody deletes their work.
     */
    routes: indexable.map((r) => ({
      path: r.path,
      changefreq: r.changefreq,
      priority: r.priority,
    })),
    /**
     * The few loose values the server needs to build the two graphs it cannot be
     * handed ready-made — a piece and a member, whose contents are rows in a
     * database. Here rather than spelled again in Python, so the words still have
     * one home. That those two graphs are genuinely built twice is covered by a
     * test that fetches the server's and the browser's and compares them.
     */
    dynamic: {
      genre: PIECE_GENRE,
      // The two id-bearing prefixes, and the pages that must never be indexed.
      // The server used to spell all of these itself, in eight places, which is
      // eight chances to miss one the day a path is renamed — and renaming paths
      // is exactly what just happened.
      piecePrefix: PIECE_PREFIX,
      makerPrefix: MAKER_PREFIX,
      privatePaths: [paths.account, paths.atelier, paths.reports],
      legacy: Object.fromEntries(legacyRedirects),
      crumbHome: SITE_NAME,
      crumbGallery: t.nav.gallery,
      galleryPath: paths.gallery,
      stitchesPath: paths.galleryStitches,
    },
    /** What a page that is gone says, so a 404 is not the home page's words. */
    notFound: {
      title: t.notFound.title,
      description: t.notFound.body,
    },
  }
}
