import { paths } from "./routes"

/**
 * Which content pages exist, and what each one points at next.
 *
 * The copy lives in the dictionaries; this is the part that is not language —
 * the path, and the shape of the internal linking. Kept out of the route
 * component so the build can walk it too: `head-manifest.ts` renders these pages
 * for readers that never run JavaScript, and it must reach the same three.
 *
 * `related` is hand-written rather than "the other two, in order". Somebody who has
 * just read which photo to choose is about to convert one, so the next thing they
 * want is the guide; somebody who has just worked out their fabric size is about to
 * stitch, so they want to know how to read the chart. Ordering by what the reader
 * is likely to do next is the only thing that makes a related list worth having.
 */
export const ARTICLE_KEYS = ["readChart", "choosePhoto", "fabric"] as const

export type ArticleKey = (typeof ARTICLE_KEYS)[number]

export const ARTICLES: Record<
  ArticleKey,
  { path: string; related: ReadonlyArray<ArticleKey | "guide"> }
> = {
  readChart: {
    path: paths.readChart,
    // You can read a chart; the next question is what to stitch it on.
    related: ["fabric", "choosePhoto", "guide"],
  },
  choosePhoto: {
    path: paths.choosePhoto,
    // You have a photograph; the next thing is to convert it.
    related: ["guide", "fabric", "readChart"],
  },
  fabric: {
    path: paths.fabric,
    // You have your fabric; the next thing is the chart in your hand.
    related: ["readChart", "choosePhoto", "guide"],
  },
}
