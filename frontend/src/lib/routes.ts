/**
 * Every path in one place.
 *
 * Two reasons, and the second is the one that matters for search.
 *
 * The first is ordinary: `/gallery` was written as a string literal in eleven files,
 * so renaming it meant finding all eleven and hoping. Now a rename is one line here.
 *
 * The second is that these paths *are* the SEO. A single-page app that answers every
 * query from `/convert` gives a crawler one page to rank for every different thing
 * people search for — "convertisseur photo point de croix", "grille point de croix
 * gratuite", "comment lire une grille". Each of those wants a URL that is about it,
 * and the URL wants to say so in the language the audience types in. French, because
 * the audience is French-first and the site already had `/piece` and `/brodeur`.
 *
 * The English paths that shipped first are kept as redirects in App.tsx: they are in
 * browser histories and possibly in a link somewhere, and a 404 is a worse answer
 * than a redirect for as long as the cost of keeping them is three lines.
 */
export const paths = {
  home: "/",
  convert: "/convert",
  gallery: "/gallery",
  /**
   * The second gallery: photos of finished work, chart or no chart.
   *
   * A sub-path of /gallery rather than a sibling, because it is the same page with
   * the other tab selected — and because /gallery keeps the charts, which is the
   * URL already linked. When the photos outnumber the charts, swapping the default
   * is one line.
   */
  galleryStitches: "/gallery/stitched",
  about: "/about",
  faq: "/faq",
  /** The guide, and the hub the three articles hang under. */
  guide: "/guide",
  readChart: "/guide/reading-a-chart",
  choosePhoto: "/guide/choosing-a-photo",
  fabric: "/guide/fabric-and-size",
  privacy: "/privacy",
  account: "/account",
  /** The internal tuning bench. Not linked, and noindex. */
  atelier: "/lab",
  /** Not linked for anyone but an admin, and noindex — the moderation queue. */
  reports: "/reports",
  piece: (id: number | string) => `/piece/${id}`,
  maker: (id: number | string) => `/maker/${id}`,
} as const

/** The prefixes the two id-bearing routes use, so the server can be told rather
 *  than made to guess. See head-manifest.ts. */
export const PIECE_PREFIX = "/piece/"
export const MAKER_PREFIX = "/maker/"

/** The old English paths, and where they now go. */
/**
 * Every address this site has ever handed out, and where it goes now.
 *
 * The paths were French for a while, on the reasoning that a French audience types
 * French and that the URL is the one line of a search result that is neither title
 * nor description. That reasoning is not wrong, but it is worth very little —
 * keywords in a URL are a famously weak signal — and it bought it at the price of
 * addresses like `/comment-faire-une-grille-de-point-de-croix`, which is fifteen
 * words nobody can read aloud, paste into a message, or type from memory.
 *
 * So: short, English, and stable. English also happens to be the neutral choice the
 * day there are `/fr/` and `/en/` variants, since neither language then owns the
 * base path.
 *
 * These are permanent redirects, not deletions. Some of them are in a browser
 * history or a message by now, and a 301 moves whatever standing they had to the
 * new address rather than throwing it away.
 */
export const legacyRedirects: ReadonlyArray<readonly [string, string]> = [
  ["/convertir-photo-point-de-croix", paths.convert],
  ["/galerie", paths.gallery],
  ["/galerie/broderies", paths.galleryStitches],
  ["/qui-sommes-nous", paths.about],
  ["/comment-faire-une-grille-de-point-de-croix", paths.guide],
  ["/comment-lire-une-grille-de-point-de-croix", paths.readChart],
  ["/quelle-photo-pour-le-point-de-croix", paths.choosePhoto],
  ["/quelle-toile-pour-le-point-de-croix", paths.fabric],
  ["/confidentialite", paths.privacy],
  ["/compte", paths.account],
  ["/signalements", paths.reports],
  ["/atelier", paths.atelier],
]

/**
 * The routes worth putting in a sitemap: fixed, public, and worth landing on.
 *
 * A piece's page is deliberately absent. There are three of them today and there
 * could be three thousand, they come and go as people delete them, and a sitemap that
 * lists URLs which 404 next week is worse than one that does not mention them —
 * they are reachable from the gallery, which is what that page is for.
 */
export const indexable: ReadonlyArray<{
  path: string
  /** Rough guide for crawlers, and honest: the gallery really does change daily. */
  changefreq: "daily" | "weekly" | "monthly" | "yearly"
  priority: string
}> = [
  { path: paths.home, changefreq: "weekly", priority: "1.0" },
  { path: paths.convert, changefreq: "monthly", priority: "0.9" },
  { path: paths.gallery, changefreq: "daily", priority: "0.8" },
  // Lower than the charts, and honestly so: it answers a different search
  // ("broderie point de croix terminée") and it starts out nearly empty.
  { path: paths.galleryStitches, changefreq: "daily", priority: "0.5" },
  { path: paths.guide, changefreq: "monthly", priority: "0.7" },
  // The same priority as the guide: each of these answers a question somebody
  // actually searches for, which is more than can be said for the about page.
  { path: paths.readChart, changefreq: "monthly", priority: "0.7" },
  { path: paths.choosePhoto, changefreq: "monthly", priority: "0.7" },
  { path: paths.fabric, changefreq: "monthly", priority: "0.7" },
  { path: paths.faq, changefreq: "monthly", priority: "0.6" },
  { path: paths.about, changefreq: "monthly", priority: "0.4" },
  { path: paths.privacy, changefreq: "yearly", priority: "0.3" },
]

/**
 * Note on individual pieces: they are absent from `indexable` above, and that is now
 * a statement about *this* file rather than about the sitemap.
 *
 * The old reasoning was that pieces come and go, and that a sitemap listing URLs which
 * 404 next week is worse than one that never mentioned them — with the gallery left to
 * do the linking. The second half turned out to be false: the gallery is a list built
 * by `fetch`, so a crawler that runs no JavaScript found nothing there, and pieces were
 * reachable from nowhere at all. See ROADMAP.md §1.
 *
 * Both halves are answered by building the sitemap on the server instead
 * (`PythonDCA/api/prerender.py`, `sitemap_xml`): it reads the live table per request,
 * so a deleted piece is absent the moment it is deleted and a new one appears the
 * moment it is published. This list is what the *fixed* pages are, and the server
 * merges the rows in.
 */
