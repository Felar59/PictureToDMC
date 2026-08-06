import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { useAuth } from "@/community/auth-context"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"
import * as api from "@/lib/community"
import { paths } from "@/lib/routes"
import { useHead } from "@/lib/head"

/**
 * The moderation queue.
 *
 * Linked from the account page, for an admin, and from nowhere else — plus
 * `noindex`, because a page nobody but two people can use has no business in a
 * search result. The server is what actually guards it: `/api/reports` answers 404
 * to anyone who is not an admin, so hiding the link is presentation, not security.
 *
 * Two outcomes, and they live in different places on purpose. Deleting the piece is
 * done on the piece itself, where the thing being judged is visible — a queue that
 * can delete from a one-line summary is a queue that deletes the wrong row. Clearing
 * the report is the verdict "I looked, it is fine", and that is here.
 */
export default function Reports() {
  const { t } = useI18n()
  const { user } = useAuth()

  useHead({ title: t.reports.title, description: t.reports.lead, noindex: true })

  const [entries, setEntries] = useState<api.ReportEntry[]>([])
  const [state, setState] = useState<"loading" | "ready" | "failed" | "forbidden">("loading")
  const [clearing, setClearing] = useState<number | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await api.fetchReports()
      setEntries(res.reports)
      setState("ready")
    } catch (err) {
      // 404 is what the server says to everyone who may not read this — the same
      // answer it gives for a route that does not exist, deliberately.
      setState(err instanceof api.ApiError && (err.status === 404 || err.status === 401) ? "forbidden" : "failed")
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const dismiss = async (postId: number) => {
    setClearing(postId)
    try {
      await api.dismissReports(postId)
      setEntries((prev) => prev.filter((e) => e.postId !== postId))
    } finally {
      setClearing(null)
    }
  }

  return (
    <div className="mx-auto max-w-[820px] px-5 sm:px-8 py-12">
      <h1 className="text-[30px] sm:text-[36px] m-0">{t.reports.title}</h1>
      <p className="text-[16px] leading-[1.6] text-clay mt-3 mb-8 max-w-[560px]">
        {t.reports.lead}
      </p>

      {state === "loading" && <p className="text-cocoa m-0">{t.reports.loading}</p>}
      {state === "failed" && <p className="text-coral-deeper m-0">{t.reports.failed}</p>}
      {state === "forbidden" && (
        <div className="flex flex-col items-start gap-4">
          <p className="text-coral-deeper m-0">{t.reports.forbidden}</p>
          <Button asChild variant="secondary">
            <Link to={user ? paths.account : paths.gallery}>{t.piece.backToGallery}</Link>
          </Button>
        </div>
      )}
      {state === "ready" && entries.length === 0 && (
        <p className="font-hand text-[17px] text-quill m-0">{t.reports.empty}</p>
      )}

      <ul className="list-none p-0 m-0 flex flex-col gap-3">
        {entries.map((e) => (
          // One row per report, not per piece: two people flagging the same photo
          // for different reasons is two things to read, and the repetition is the
          // count.
          <li
            key={`${e.postId}-${e.reporterName}-${e.createdAt}`}
            className="bg-blanc rounded-[16px] shadow-card-sm p-4 flex flex-wrap items-center gap-x-4 gap-y-2"
          >
            <div className="flex-1 min-w-[220px]">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-medium text-[16.5px]">{e.title}</span>
                <span className="font-mono text-[11.5px] uppercase tracking-[.08em] text-stone">
                  {t.reports.kind[e.kind]}
                </span>
              </div>
              <div className="text-[13.5px] text-stone mt-0.5">
                {t.reports.by(e.authorName)} · {t.reports.reportedBy(e.reporterName)}
              </div>
              {/* The reason verbatim, including whatever the reporter typed after
                  it. Truncating the one piece of free text in the queue would hide
                  the part that says what to look at. */}
              <p className="text-[14.5px] text-cocoa mt-1.5 m-0 break-words">{e.reason}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button asChild size="sm" variant="secondary">
                <Link to={paths.piece(e.postId)}>{t.reports.open}</Link>
              </Button>
              <Button size="sm" disabled={clearing === e.postId} onClick={() => void dismiss(e.postId)}>
                {clearing === e.postId ? t.reports.dismissing : t.reports.dismiss}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
