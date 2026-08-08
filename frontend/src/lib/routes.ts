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
  convert: "/convertir-photo-point-de-croix",
  gallery: "/galerie",
  /**
   * The second gallery: photos of finished work, chart or no chart.
   *
   * A sub-path of /galerie rather than a sibling, because it is the same page with
   * the other tab selected — and because /galerie keeps the charts. That URL is the
   * one already indexed and already linked, and on the day this shipped the photo
   * gallery was empty: handing the indexed URL to an empty page would have been a
   * choice made for the tidiness of the code rather than for anyone reading it.
   * When the photos outnumber the charts, swapping the default is one line.
   */
  galleryStitches: "/galerie/broderies",
  about: "/qui-sommes-nous",
  /**
   * What the site knows about you.
   *
   * French, like its neighbours, and spelled the way somebody would search for it
   * — "politique de confidentialité" is what a French reader looks for, and
   * /privacy would be the one English word left in a French path set.
   */
  privacy: "/confidentialite",
  faq: "/faq",
  guide: "/comment-faire-une-grille-de-point-de-croix",
  account: "/compte",
  atelier: "/atelier",
  /** Not linked for anyone but an admin, and noindex — the moderation queue. */
  reports: "/signalements",
  piece: (id: number | string) => `/piece/${id}`,
  maker: (id: number | string) => `/brodeur/${id}`,
} as const

/** The old English paths, and where they now go. */
export const legacyRedirects: ReadonlyArray<readonly [string, string]> = [
  ["/convert", paths.convert],
  ["/gallery", paths.gallery],
  ["/about", paths.about],
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
