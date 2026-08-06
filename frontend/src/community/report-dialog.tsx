import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Pill } from "@/components/ui/pill"
import { useI18n } from "@/i18n"
import * as api from "@/lib/community"

/** The keys the server groups on, paired with the copy that explains them. */
const REASONS = [
  ["not-mine", "notMine"],
  ["explicit", "explicit"],
  ["spam", "spam"],
  ["off-topic", "offTopic"],
  ["other", "other"],
] as const

/**
 * Flagging a piece.
 *
 * Needed because a photo post is whatever somebody uploaded — the chart path is
 * bounded by what the converter can produce, and a free photograph is not. Without
 * this the only way to deal with one would have been SQL on the server.
 *
 * A reason, and optionally a line of explanation. Reporting the same piece twice
 * replaces the reason rather than counting twice, so this can be sent again without
 * anybody worrying about what a second report means.
 */
export function ReportDialog({
  postId,
  open,
  onClose,
}: {
  postId: number
  open: boolean
  onClose: () => void
}) {
  const { t } = useI18n()
  const [reason, setReason] = useState<string>("explicit")
  const [note, setNote] = useState("")
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle")

  const submit = async () => {
    setState("sending")
    try {
      // The note travels appended to the reason: the server stores one string, and
      // grouping still works because the key is the first word of it.
      await api.reportPost(postId, note.trim() ? `${reason}: ${note.trim()}` : reason)
      setState("sent")
    } catch {
      setState("failed")
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={t.report.title}>
      {state === "sent" ? (
        <div className="flex flex-col gap-5">
          <p className="text-[15px] text-clay m-0">{t.report.done}</p>
          <Button onClick={onClose}>{t.report.close}</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <p className="text-[15px] text-clay m-0">{t.report.lead}</p>

          <div>
            <div className="text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2">
              {t.report.reasonLabel}
            </div>
            <div className="flex flex-wrap gap-2">
              {REASONS.map(([key, copy]) => (
                <Pill key={key} selected={reason === key} onClick={() => setReason(key)}>
                  {t.report.reasons[copy]}
                </Pill>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="report-note"
              className="block text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2"
            >
              {t.report.noteLabel}
            </label>
            <textarea
              id="report-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.report.notePlaceholder}
              maxLength={240}
              rows={3}
              className="w-full text-base bg-linen border-[1.5px] border-edge-3 rounded-[14px] px-4 py-3 outline-none transition-colors focus:border-coral focus:bg-blanc resize-y"
            />
          </div>

          {state === "failed" && (
            <p
              role="alert"
              className="bg-coral-wash border-[1.5px] border-coral-edge text-coral-deeper rounded-[14px] px-4 py-3 text-sm m-0"
            >
              {t.report.failed}
            </p>
          )}

          <div className="flex gap-3 flex-wrap pt-1">
            <Button
              className="flex-1 min-w-[160px]"
              onClick={() => void submit()}
              disabled={state === "sending"}
            >
              {state === "sending" ? t.report.working : t.report.submit}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              {t.account.cancel}
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  )
}
