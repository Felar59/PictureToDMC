/**
 * The facts about the site that more than one place needs to agree on.
 *
 * This exists so that the day the domain and the name are decided, the change is
 * here and nowhere else. Four generated files, every canonical URL, every Open
 * Graph tag and every entry in `llms.txt` read from this module — and it is imported
 * by `vite.config.ts` as well as by the app, which is why it holds no JSX and
 * touches no browser API.
 */

/**
 * Where the site actually lives.
 *
 * This is what makes a domain *canonical*, and it is worth being explicit about
 * because nothing at the registrar says which of several names is the real one.
 * Three things do, and two of them read from here: the 301 in nginx (an alias
 * never serves a page, it only points), the `<link rel="canonical">` on every
 * page, and everything the site says about itself — sitemap, Open Graph, llms.txt.
 *
 * `www.vallee-points-de-croix.fr`, `cross-stitch-valley.com` and the old
 * `164-132-99-194.sslip.io` all resolve here and all redirect to this name. The
 * sslip address is kept in that list rather than switched off: it is the address
 * this site was reachable at for its first months, so it is what any existing
 * link and any already-crawled URL still points to.
 *
 * See deploy/enable-https.sh, which holds the other half of the arrangement.
 */
export const ORIGIN = "https://vallee-points-de-croix.fr"

/**
 * The name, long and short.
 *
 * `SITE_NAME` is the full one and belongs wherever there is room and wherever it
 * is the *first* time somebody meets the site: the og:site_name, the manifest,
 * the about page. `SITE_SHORT` is what people will actually say, and belongs
 * wherever 29 characters do not fit — a browser tab, the header line printed
 * across the top of a chart, a breadcrumb.
 *
 * Both live here rather than in the dictionaries because the name is not
 * translated: it is the same in French and in English, and a site whose name
 * changed with the language toggle would be two sites.
 */
export const SITE_NAME = "La Vallée des Points de Croix"
export const SITE_SHORT = "La Vallée"

/**
 * The wordmark's two lines, split where the mark splits them.
 *
 * Kept apart from `SITE_NAME` on purpose: joining them back together with a space
 * is how the full name is spelled, but the mark needs to know where the break
 * falls, and deriving that by splitting on " des " would break the day the name
 * gains or loses a preposition.
 */
export const SITE_NAME_LINES = { place: "LA VALL\u00c9E", of: "des points de croix" }

/** No trailing slash, no double slash. */
export function absolute(path: string): string {
  return `${ORIGIN}${path === "/" ? "/" : path.replace(/\/+$/, "")}`
}

/**
 * Crawlers allowed by name.
 *
 * Left to a default, an AI crawler's access is whatever its operator decided this
 * month. Naming them is a decision recorded in the repository — and this list says
 * yes to all of them deliberately: a free tool wants to be the answer when someone
 * asks a model how to turn a photograph into a cross-stitch chart.
 */
export const AI_CRAWLERS = [
  "ChatGPT-User",
  "OAI-SearchBot",
  "GPTBot",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "meta-externalagent",
]
