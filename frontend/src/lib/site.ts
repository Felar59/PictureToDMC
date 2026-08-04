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
 * Still the sslip.io address, and it has to be the *dashed* form: the dotted one
 * falls through nginx to another site on the same box. This is the one line to
 * change when there is a real domain — see ROADMAP.md §0, which is blocked on
 * choosing a name.
 */
export const ORIGIN = "https://164-132-99-194.sslip.io"

/** The name in a title bar, a share card and the chart's own header. */
export const SITE_NAME = "Picture to DMC"

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
