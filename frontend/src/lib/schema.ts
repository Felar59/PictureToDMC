/**
 * Structured data: what each page *is*, said in a vocabulary machines already read.
 *
 * Worth being straight about the payoff, because most writing on this subject is
 * selling something. Google removed HowTo rich results in September 2023 and FAQ
 * rich results in May 2026, so two of the three graphs this site already had earn
 * nothing in a search result any more. They are kept because the markup is still
 * valid schema.org and is still read by Bing, Perplexity and the retrieval crawlers
 * — but nobody should expect a fancier blue link out of them.
 *
 * What genuinely still pays, from Google's own current gallery, and all of it
 * applies here: Organization, Breadcrumb, Image metadata (a licence and a creator
 * shown against a picture in Google Images), Profile page, and Software app. A
 * gallery of member-made work whose pages are mostly pictures by named people is
 * close to the middle of that list, which is the answer to "is schema.org not just
 * an e-commerce thing" — the e-commerce half (Product, Offer, AggregateRating,
 * Review) is exactly the half this site has no honest use for.
 *
 * The other reason, and the durable one: an answer engine that has to *infer* what
 * this site does will sometimes infer wrong. Stating it costs a few hundred bytes.
 *
 * Everything is emitted as one `@graph` per page with stable `@id`s, so the
 * organisation and the site are single nodes that every page's other nodes point
 * at, rather than a fresh copy of the same claim on each URL.
 */

import type { Copy } from "../i18n/copy"

import { ARTICLES, type ArticleKey } from "./articles"

import { ORIGIN, SITE_NAME, absolute } from "./site"
import { paths } from "./routes"

/** Stable anchors. A node with an `@id` is one thing mentioned in many places. */
export const ORG_ID = `${ORIGIN}/#organization`
export const SITE_ID = `${ORIGIN}/#website`

type Node = Record<string, unknown>

/**
 * The craft, in words somebody would search for. `genre` is free text, so this is
 * the one string in a piece's graph that is a choice rather than a fact — which is
 * why it is a named constant: the Python server builds that same graph for crawlers
 * that do not run JavaScript, and it reads this value out of the head manifest
 * rather than carrying its own spelling of it.
 */
export const PIECE_GENRE = "Cross stitch pattern"

/** Wrap nodes into the single script tag `useHead` writes. */
export function graph(...nodes: Array<Node | Node[] | null | undefined>): object {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.flat().filter(Boolean),
  }
}

/**
 * Who runs this. Deliberately thin: an Organization may carry an address, a
 * founder, a telephone number and half a dozen sameAs profiles, and every one of
 * those here would be invented. It says the name, the mark and the site.
 */
export function organization(): Node {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: ORIGIN,
    logo: { "@type": "ImageObject", url: `${ORIGIN}/og.png` },
  }
}

/** The site as a thing, so pages can say which site they belong to. */
export function webSite(lang: string): Node {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    name: SITE_NAME,
    url: ORIGIN,
    inLanguage: lang,
    publisher: { "@id": ORG_ID },
  }
}

/**
 * The trail to the current page.
 *
 * One of the few types with a live rich result: Google draws it as the path under
 * the title instead of a bare URL. The trail must match what a visitor can
 * actually click, which is why the caller passes it rather than it being derived
 * from the path — `/piece/12` sits under the gallery, and no amount of splitting
 * the URL on slashes would know that.
 */
export function breadcrumb(trail: Array<{ name: string; path: string }>): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: absolute(step.path),
    })),
  }
}

/**
 * The converter, as an application.
 *
 * `offers` at zero is not decoration: "free" is the single most load-bearing fact
 * about this tool and the one an answer engine is most likely to get wrong, since
 * nearly every competitor charges. No `aggregateRating`, which means no Software
 * App rich result — that one needs a rating, and there is no rating system here.
 * Inventing one to earn a star in a search result is exactly the kind of thing this
 * markup is not for.
 */
export function application(description: string, features: string[]): Node {
  return {
    "@type": "SoftwareApplication",
    "@id": `${ORIGIN}${paths.convert}#app`,
    name: SITE_NAME,
    url: absolute(paths.convert),
    applicationCategory: "DesignApplication",
    // The browser is the runtime. Not "Windows, macOS, Linux" — nothing installs.
    operatingSystem: "Web browser",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    description,
    featureList: features,
    publisher: { "@id": ORG_ID },
  }
}

/** A member, referenced by their profile URL so every mention is the same person. */
export function person(id: number, name: string): Node {
  return {
    "@type": "Person",
    "@id": `${ORIGIN}${paths.maker(id)}#person`,
    name,
    url: absolute(paths.maker(id)),
  }
}

/**
 * One published piece: the work, the picture of it, and who made it.
 *
 * `ImageObject` is the part with a current, documented payoff — it is what puts a
 * creator and a licence link against a picture in Google Images, which for a
 * gallery is the search surface that matters most. `creditText` and `creator` are
 * facts the database holds.
 *
 * There is deliberately no `license` field. Every published chart here can be
 * downloaded by anyone, and the gallery says as much in French, but "you may take
 * this" is not the same statement as a named licence with terms, and picking one on
 * a member's behalf is not mine to do. `acquireLicensePage` points at the piece,
 * which is where the download actually is. See ROADMAP.md — it wants a decision,
 * not a guess.
 */
export function piece(opts: {
  id: number
  title: string
  description: string
  authorId: number
  authorName: string
  createdAt: number
  likeCount: number
  /** Absent on a piece whose thumbnail never rendered. */
  imagePath?: string
  lang: string
}): Node[] {
  const url = absolute(paths.piece(opts.id))
  const author = { "@id": `${ORIGIN}${paths.maker(opts.authorId)}#person` }

  const image: Node | null = opts.imagePath
    ? {
        "@type": "ImageObject",
        "@id": `${url}#image`,
        contentUrl: `${ORIGIN}${opts.imagePath}`,
        url: `${ORIGIN}${opts.imagePath}`,
        creator: author,
        creditText: opts.authorName,
        acquireLicensePage: url,
      }
    : null

  return [
    {
      "@type": "CreativeWork",
      "@id": `${url}#work`,
      name: opts.title,
      description: opts.description,
      url,
      // The craft, in the words someone would search for. `genre` is free text and
      // this is the honest one.
      genre: PIECE_GENRE,
      author,
      creator: author,
      // Milliseconds in the database; schema.org wants ISO 8601.
      dateCreated: new Date(opts.createdAt).toISOString(),
      datePublished: new Date(opts.createdAt).toISOString(),
      inLanguage: opts.lang,
      isPartOf: { "@id": SITE_ID },
      publisher: { "@id": ORG_ID },
      ...(image ? { image: { "@id": `${url}#image` } } : {}),
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: opts.likeCount,
      },
    },
    ...(image ? [image] : []),
  ]
}

/**
 * A member's page. `ProfilePage` is in Google's current gallery and means exactly
 * this: a page about one person, with what they have posted on it.
 */
export function profile(opts: {
  id: number
  name: string
  bio?: string | null
  joinedAt: number
  pieces: Array<{ id: number; title: string }>
}): Node[] {
  const url = absolute(paths.maker(opts.id))
  return [
    {
      "@type": "ProfilePage",
      "@id": `${url}#profile`,
      url,
      mainEntity: { "@id": `${url}#person` },
      isPartOf: { "@id": SITE_ID },
      // What the page is a list of, which is the reason to index it at all.
      hasPart: opts.pieces.map((p) => ({
        "@type": "CreativeWork",
        "@id": `${ORIGIN}${paths.piece(p.id)}#work`,
        name: p.title,
        url: absolute(paths.piece(p.id)),
      })),
    },
    {
      "@type": "Person",
      "@id": `${url}#person`,
      name: opts.name,
      url,
      ...(opts.bio ? { description: opts.bio } : {}),
      // `dateCreated` on a Person would be a birth date. This is when the account
      // started, and there is no schema.org property for that — so it is left out
      // rather than put somewhere that reads as something else.
    },
  ]
}

/** A gallery: a page whose content is a list of other pages. */
export function collection(opts: {
  path: string
  name: string
  description: string
  lang: string
  pieces: Array<{ id: number; title: string }>
}): Node {
  const url = absolute(opts.path)
  return {
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: opts.lang,
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
    mainEntity: {
      "@type": "ItemList",
      // Only what this page is actually showing. A count of everything ever
      // published would be a claim the page does not back up.
      numberOfItems: opts.pieces.length,
      itemListElement: opts.pieces.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: absolute(paths.piece(p.id)),
      })),
    },
  }
}

/* ------------------------------------------------------------------ pages
 *
 * One builder per fixed route, so the graph for a page is written once and read
 * twice: by the route component at runtime, and by `head-manifest.ts` at build
 * time, which bakes the result into a JSON file the Python server pastes into the
 * HTML it serves.
 *
 * That second reader is the whole reason these exist as functions rather than as
 * object literals inside the route components. A crawler that does not run
 * JavaScript — which is every AI crawler — only ever sees what the server sent, so
 * the graph has to exist before React does. Building it in Python as well would
 * have been two descriptions of the same page in two languages, drifting apart
 * from the first edit. Precomputing it means the server holds no schema logic at
 * all for these routes.
 *
 * The dynamic routes (a piece, a member) cannot work this way — their graphs
 * depend on rows in the database — so those *are* built twice, and there is a test
 * that fetches both and compares them.
 */

export function homeGraph(t: Copy, lang: string): object {
  return graph(
    organization(),
    webSite(lang),
    // The converter's description, on the home page too.
    //
    // Both pages emit a SoftwareApplication node under the same `@id`, which is
    // the assertion "this is the same thing wherever you meet it". Passing the
    // home page's wording here made that one entity carry two different
    // descriptions, so a consumer merging the graph across the two URLs — the
    // entire point of the stable `@id`s in this file — had to pick one at random.
    application(t.head.convert.description, t.head.features),
  )
}

export function convertGraph(t: Copy): object {
  return graph(
    application(t.head.convert.description, t.head.features),
    breadcrumb([
      { name: t.site.short, path: paths.home },
      { name: t.nav.convert, path: paths.convert },
    ]),
  )
}

/**
 * A gallery.
 *
 * `pieces` is what the page is currently showing, so the server — which renders
 * this before anything has been fetched — passes none and emits a CollectionPage
 * with no item list. The client then replaces the whole graph with the same page
 * plus its items. The server's version is a strict subset rather than a different
 * claim, which is the property that matters: a crawler is never told something the
 * page will later contradict.
 */
export function galleryGraph(
  t: Copy,
  lang: string,
  photos: boolean,
  pieces: Array<{ id: number; title: string }> = [],
): object {
  const head = photos ? t.head.galleryStitches : t.head.gallery
  return graph(
    collection({
      path: photos ? paths.galleryStitches : paths.gallery,
      name: photos ? t.gallery.finished.title : t.gallery.patterns.title,
      description: head.description,
      lang,
      pieces,
    }),
    breadcrumb(
      photos
        ? [
            { name: t.site.short, path: paths.home },
            { name: t.nav.gallery, path: paths.gallery },
            { name: t.gallery.tabs.finished, path: paths.galleryStitches },
          ]
        : [
            { name: t.site.short, path: paths.home },
            { name: t.nav.gallery, path: paths.gallery },
          ],
    ),
  )
}

export function faqGraph(t: Copy): object {
  return graph(
    {
      "@type": "FAQPage",
      mainEntity: t.faqPage.groups.flatMap((group) =>
        group.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      ),
    },
    breadcrumb([
      { name: t.site.short, path: paths.home },
      { name: t.nav.faq, path: paths.faq },
    ]),
  )
}

export function guideGraph(t: Copy): object {
  return graph(
    {
      "@type": "HowTo",
      name: t.guide.title,
      description: t.guide.lead,
      totalTime: "PT1M",
      estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "0" },
      step: t.guide.steps.map((step, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: step.heading,
        text: step.body,
      })),
    },
    breadcrumb([
      { name: t.site.short, path: paths.home },
      { name: t.nav.guide, path: paths.guide },
    ]),
  )
}

/**
 * The privacy page.
 *
 * `WebPage`, not `AboutPage`: schema.org has no privacy-policy type, and the
 * nearest candidates would each claim something untrue. A plain WebPage with a
 * name and a description is the honest amount to say.
 */
export function privacyGraph(t: Copy): object {
  return graph(
    {
      "@type": "WebPage",
      name: t.privacyPage.title,
      description: t.privacyPage.lead,
      isPartOf: { "@id": SITE_ID },
      publisher: { "@id": ORG_ID },
    },
    breadcrumb([
      { name: t.site.short, path: paths.home },
      { name: t.privacyPage.title, path: paths.privacy },
    ]),
  )
}

export function aboutGraph(t: Copy): object {
  return graph(
    {
      "@type": "AboutPage",
      name: t.aboutPage.title,
      description: t.aboutPage.lead,
      mainEntity: { "@id": ORG_ID },
    },
    breadcrumb([
      { name: t.site.short, path: paths.home },
      { name: t.nav.about, path: paths.about },
    ]),
  )
}

/**
 * A content page.
 *
 * `Article`, which is in Google's current gallery — unlike `HowTo`, which these
 * are not: reading a chart is a set of conventions to understand rather than a
 * procedure with ordered steps, and marking it up as one would be describing a
 * different page from the one that exists.
 *
 * No `image`: an Article rich result wants one, and there is no picture on these
 * pages to point at. Naming the site's default share card would be claiming an
 * illustration this article does not have, which is the sort of small lie that
 * makes the rest of a graph worth less.
 */
export function articleGraph(t: Copy, lang: string, which: ArticleKey): object {
  const copy = t.articles[which]
  const url = absolute(ARTICLES[which].path)
  return graph(
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: copy.title,
      description: copy.lead,
      url,
      inLanguage: lang,
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      isPartOf: { "@id": SITE_ID },
      // The sections, named. It is what the page is, and it costs a line.
      articleSection: copy.sections.map((s) => s.heading),
    },
    breadcrumb([
      { name: t.site.short, path: paths.home },
      { name: t.guide.title, path: paths.guide },
      { name: copy.title, path: ARTICLES[which].path },
    ]),
  )
}
