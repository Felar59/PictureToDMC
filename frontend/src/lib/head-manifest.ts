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

import { paths } from "./routes"
import {
  PIECE_GENRE,
  aboutGraph,
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

export type StaticHead = {
  title: string
  description: string
  /** Already serialised: the server pastes it into a script tag verbatim. */
  jsonLd: string
}

export function headManifest() {
  const t = fr

  const fixed: Record<string, StaticHead> = {
    [paths.home]: {
      title: t.head.home.title,
      description: t.head.home.description,
      jsonLd: JSON.stringify(homeGraph(t, LANG)),
    },
    [paths.convert]: {
      title: t.head.convert.title,
      description: t.head.convert.description,
      jsonLd: JSON.stringify(convertGraph(t)),
    },
    [paths.gallery]: {
      title: t.head.gallery.title,
      description: t.head.gallery.description,
      jsonLd: JSON.stringify(galleryGraph(t, LANG, false)),
    },
    [paths.galleryStitches]: {
      title: t.head.galleryStitches.title,
      description: t.head.galleryStitches.description,
      jsonLd: JSON.stringify(galleryGraph(t, LANG, true)),
    },
    [paths.faq]: {
      title: `${t.faqPage.title} · ${t.nav.faq} — ${SITE_NAME}`,
      description: t.faqPage.lead,
      jsonLd: JSON.stringify(faqGraph(t)),
    },
    [paths.guide]: {
      title: `${t.guide.title} — ${SITE_NAME}`,
      description: t.guide.lead,
      jsonLd: JSON.stringify(guideGraph(t)),
    },
    [paths.about]: {
      title: t.head.about.title,
      description: t.aboutPage.lead,
      jsonLd: JSON.stringify(aboutGraph(t)),
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
     * The few loose values the server needs to build the two graphs it cannot be
     * handed ready-made — a piece and a member, whose contents are rows in a
     * database. Here rather than spelled again in Python, so the words still have
     * one home. That those two graphs are genuinely built twice is covered by a
     * test that fetches the server's and the browser's and compares them.
     */
    dynamic: {
      genre: PIECE_GENRE,
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
