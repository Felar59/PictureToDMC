import type { useI18n } from "@/i18n"
import * as api from "@/lib/community"

type Copy = ReturnType<typeof useI18n>["t"]

/**
 * Why the publish failed, in the member's own words.
 *
 * The daily limit is the one refusal that is not an error: nothing went wrong,
 * there is simply no room until one of today's falls out of the window, and it
 * says when. The server sends the numbers because it owns the rule; the sentence
 * is written here because only this side knows the language.
 *
 * Its own module because there are two publish paths now — a chart and a photo —
 * and the day the wording of a refusal is improved in one of them, it has to be
 * improved in both.
 */
export function describeFailure(err: unknown, t: Copy): string {
  if (!(err instanceof api.ApiError)) return t.publish.failed
  if (err.status === 413) return t.publish.tooBig
  if (err.status === 429 && err.code === "daily-limit") {
    const limit = Number(err.data?.limit) || 5
    const minutes = Math.max(1, Number(err.data?.retryInMinutes) || 60)
    return t.publish.dailyLimit(limit, minutes)
  }
  return t.publish.failed
}
