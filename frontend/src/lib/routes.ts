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
  about: "/qui-sommes-nous",
  faq: "/faq",
  guide: "/comment-faire-une-grille-de-point-de-croix",
  account: "/compte",
  atelier: "/atelier",
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
  changefreq: "daily" | "weekly" | "monthly"
  priority: string
}> = [
  { path: paths.home, changefreq: "weekly", priority: "1.0" },
  { path: paths.convert, changefreq: "monthly", priority: "0.9" },
  { path: paths.gallery, changefreq: "daily", priority: "0.8" },
  { path: paths.guide, changefreq: "monthly", priority: "0.7" },
  { path: paths.faq, changefreq: "monthly", priority: "0.6" },
  { path: paths.about, changefreq: "monthly", priority: "0.4" },
]

/**
 * Note on individual pieces, now that each one carries its own head and its own share
 * card: they are still deliberately absent above. There are four today and there could
 * be four thousand, they come and go as people delete them, and a sitemap listing URLs
 * that 404 next week is worse than one that never mentioned them. The gallery links to
 * every one of them, which is how a crawler is meant to find them.
 */
