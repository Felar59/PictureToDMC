import { AI_CRAWLERS, ORIGIN, SITE_NAME, absolute } from "./site"
import { indexable, paths } from "./routes"

/**
 * The four files crawlers read, generated rather than hand-kept.
 *
 * `robots.txt`, `sitemap.xml`, `llms.txt` and `llms-full.txt` all repeat the same
 * facts — the origin, the list of routes, what each one is for. Written by hand they
 * drift the first time a route is added, and the drift is invisible: nothing on the
 * site breaks when a sitemap lists a URL that no longer exists.
 *
 * So they are built from `routes.ts` and `site.ts` at build time (see the plugin in
 * vite.config.ts). A new page appears in all four by being added to `indexable`, and
 * the day there is a real domain it changes in `site.ts` alone.
 *
 * This module is imported by the Vite config, so: no JSX, no browser API, no React.
 */

/** One place for the per-route sales pitch that llms.txt and llms-full.txt share. */
const DESCRIPTIONS: Record<string, { title: string; blurb: string }> = {
  [paths.home]: {
    title: `${SITE_NAME} — turn a photo into a cross-stitch chart`,
    blurb:
      "Upload a photograph and every stitch is matched to a real DMC thread, then handed back as a printable chart with the exact references and stitch counts. Free, no account, and the conversion runs entirely in the browser so the picture is never uploaded.",
  },
  [paths.convert]: {
    title: "Photo to cross-stitch chart converter",
    blurb:
      "The tool itself. Choose the width in stitches and how many thread colours, turn the picture if it came off a phone sideways, lift the colour, or cut the background away with a segmentation model that runs locally. Swap any matched thread for another of the 483 plain-cotton DMC shades, then download a PNG with the counting grid and the thread list. A sheet per single colour is available too, for telling two near-identical shades apart.",
  },
  [paths.gallery]: {
    title: "Cross-stitch pattern gallery",
    blurb:
      "Finished pieces shared by the community. Every one shows the threads it used and can be taken as a chart for free; an optional account is what lets you add your own.",
  },
  [paths.galleryStitches]: {
    title: "Cross-stitch pieces stitched by the community",
    blurb:
      "Photographs of finished cross-stitch, posted by the people who stitched it. A piece here needs no chart from this site — plenty were stitched from patterns found elsewhere — so it is a record of real work rather than a catalogue of what the converter can make.",
  },
  [paths.guide]: {
    title: "How to make a cross-stitch chart from a photo",
    blurb:
      "The whole process for someone who has never done it: which photographs survive being reduced to a grid, how to choose the width in stitches and the number of threads, what aida count means, how many stitches a skein covers, and how to stitch the result.",
  },
  [paths.faq]: {
    title: "Questions and answers",
    blurb:
      "Fourteen answers covering what happens to your photograph (nothing — it never leaves your computer), how many colours to choose, what the settings do, what is in the downloaded file, and whether you may sell what you stitch.",
  },
  [paths.about]: {
    title: "About us",
    blurb: "Who makes it, where it came from, and why it is free and browser-only.",
  },
}

export function robotsTxt(): string {
  const lines = [
    "# Every crawler is welcome, and the AI ones are named rather than left to a",
    "# default — see src/lib/site.ts.",
    "User-agent: *",
    "Allow: /",
    "",
    // The account page is the one thing worth keeping out: it is per-member, it is
    // behind a sign-in, and it has nothing to offer a search result.
    "Disallow: /compte",
    "",
  ]
  for (const bot of AI_CRAWLERS) {
    lines.push(`User-agent: ${bot}`, "Allow: /", "")
  }
  lines.push(`Sitemap: ${absolute("/sitemap.xml")}`, "")
  return lines.join("\n")
}

export function sitemapXml(today: string): string {
  const urls = indexable
    .map(({ path, changefreq, priority }) =>
      [
        "  <url>",
        `    <loc>${absolute(path)}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n"),
    )
    .join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function llmsTxt(): string {
  const home = DESCRIPTIONS[paths.home]
  const entry = (path: string) => {
    const d = DESCRIPTIONS[path]
    return `- [${d.title}](${absolute(path)}): ${d.blurb}`
  }
  return [
    `# ${SITE_NAME}`,
    "",
    `> ${home.blurb}`,
    "",
    "The conversion is not a service: it is JavaScript running on the visitor's own machine, so photographs are never uploaded, never stored and never seen by anyone. Publishing a finished piece sends the grid — a few kilobytes of thread indices — and nothing else.",
    "",
    "## Pages",
    "",
    entry(paths.convert),
    entry(paths.guide),
    entry(paths.faq),
    entry(paths.gallery),
    entry(paths.galleryStitches),
    entry(paths.about),
    "",
    "## About",
    "",
    "- Free to use: no account to convert, no watermark, nothing to buy.",
    "- Private by construction — the tool has no upload path for a photograph.",
    "- Matches against 483 plain-cotton DMC shades, chosen by CIEDE2000 rather than by nearest RGB. Metallic, satin and Étoile ranges are excluded because they share colour codes with plain cotton.",
    "- The downloaded chart names real references with a stitch count for each, so it can be taken to a shop.",
    "- French-first, English available.",
    "",
    "## Optional",
    "",
    `- [Everything in one file](${absolute("/llms-full.txt")}): the full description.`,
    `- [Sitemap](${absolute("/sitemap.xml")}): every indexable route.`,
    "",
  ].join("\n")
}

export function llmsFullTxt(): string {
  return [
    llmsTxt().trimEnd(),
    "",
    "",
    "## How the conversion works",
    "",
    "1. The photograph is decoded once and drawn down to a whole multiple of the stitch grid, then that last reduction is averaged in linear light. Averaging sRGB values instead — which is what a canvas does by default — darkens and mutes every cell that spans an edge; measured, it costs up to 18 CIEDE2000 on a single stitch.",
    "2. Each cell becomes a CIELAB colour. Optional steps then apply: a segmentation model (u2netp, the small U²-Net, run in WebAssembly) to cut the subject out, and a chroma lift, because thread is more saturated than a photograph.",
    "3. k-means++ clusters the cells into the requested number of colours.",
    "4. Each cluster is assigned a distinct DMC thread by CIEDE2000, then the choice is improved by Lloyd iterations whose centres must be real threads — the nearest thread to a centroid is not the thread that best covers a cluster.",
    "5. Every stitch takes its nearest chosen thread, and any thread left covering nothing is dropped so the shopping list cannot ask for a skein for zero stitches.",
    "",
    "## What you can download",
    "",
    "- The full chart: the pattern at 20 pixels a stitch, a counting grid with a heavier rule every ten stitches closed on all four edges, and a legend listing every reference, its name and its stitch count.",
    "- A sheet for one thread: that thread alone, with the silhouette of the whole piece around it so the stitches can be placed. Useful for two shades that are hard to tell apart on a full chart.",
    "- Options: the grid, the legend, a silhouette keyline, backstitch along the seams between colours the eye can separate, and the background colour.",
    "",
    "## Limits, stated plainly",
    "",
    "- A chart is a low-resolution picture. Sixty stitches across is sixty pixels of information, so busy scenes, distant faces and fine texture do not survive.",
    "- Background removal finds a subject, not a miracle: a plain background works, a patterned rug does not.",
    "- Thread names come from the DMC chart in English, including in the French interface.",
    "",
    `Made by Felar. Source of truth for these files: src/lib/crawler-files.ts at ${ORIGIN}.`,
    "",
  ].join("\n")
}
