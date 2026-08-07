import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { useI18n } from "@/i18n"
import * as api from "@/lib/community"

/**
 * Deleting your own account.
 *
 * The privacy page promises "sa suppression complète — compte, publications et
 * commentaires", so this deletes rather than anonymises. A policy page that says
 * one thing while the code quietly does another is the exact failure that page
 * exists to prevent.
 *
 * Three things make this safe to put in front of somebody:
 *
 * 1. It counts first. "Tout supprimer" makes a person guess how much everything
 *    is; "vos 4 grilles et vos 12 commentaires" is the same warning without the
 *    fear, and it lets someone notice the numbers are wrong — that they are signed
 *    in as the wrong account — *before* agreeing rather than after.
 * 2. Typing the word. This audience includes people who are not confident with a
 *    computer and for whom a mis-tap is a real risk; a button you cannot press by
 *    accident is worth more here than one fewer step.
 * 3. It says plainly what it cannot undo, including the part that affects other
 *    people: a chart already downloaded stays downloaded, but it leaves the gallery
 *    for everyone.
 */
export function DeleteAccountDialog({
  open,
  onClose,
  onDeleted,
}: {
  open: boolean
  onClose: () => void
  onDeleted: () => void
}) {
  const { t } = useI18n()
  const copy = t.account.danger

  const [summary, setSummary] = useState<api.AccountSummary | null>(null)
  const [typed, setTyped] = useState("")
  const [working, setWorking] = useState(false)
  const [failed, setFailed] = useState(false)

  // Counted when the dialog opens, not when the page loads: it is the number at
  // the moment of asking that has to be right, and somebody may have deleted a
  // piece since arriving.
  useEffect(() => {
    if (!open) return
    setTyped("")
    setFailed(false)
    setSummary(null)
    let cancelled = false
    api
      .accountSummary()
      .then((s) => !cancelled && setSummary(s))
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [open])

  // Case-insensitive and trimmed. The word is a speed bump, not a spelling test,
  // and a capitals-locked keyboard on a phone should not be the thing that stops
  // somebody leaving.
  const armed = typed.trim().toUpperCase() === copy.confirmWord

  const remove = async () => {
    if (!armed || working) return
    setWorking(true)
    setFailed(false)
    try {
      await api.deleteAccount()
      onDeleted()
    } catch {
      setFailed(true)
      setWorking(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={copy.dialogTitle} className="max-w-[520px]">
      <div className="flex flex-col gap-5">
        <p className="text-[16px] leading-[1.6] text-clay m-0">{copy.whatGoes}</p>

        <ul className="list-none p-0 m-0 flex flex-col gap-2">
          {[
            copy.account,
            // Dashes while the counts are still in flight, rather than zeros: a
            // zero is a claim, and "no charts will be deleted" is the one thing
            // this dialog must never say wrongly.
            summary ? copy.posts(summary.posts) : "—",
            summary ? copy.comments(summary.comments) : "—",
            summary ? copy.likes(summary.likesGiven) : "—",
          ].map((line, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[15.5px] text-ink">
              <span
                aria-hidden="true"
                className="mt-[7px] size-2 rounded-[2px] bg-coral shrink-0"
              />
              {line}
            </li>
          ))}
        </ul>

        <p className="text-[14.5px] leading-[1.6] text-cocoa bg-linen rounded-card px-4 py-3 m-0">
          {copy.irreversible}
        </p>

        <div>
          <label
            htmlFor="delete-confirm"
            className="block text-[14.5px] font-bold text-ink mb-1.5"
          >
            {copy.confirmLabel}
          </label>
          <input
            id="delete-confirm"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-blanc border-2 border-edge-3 rounded-card px-4 py-2.5 text-[16px] text-ink focus:border-coral focus:outline-none"
          />
        </div>

        {failed && (
          <p role="alert" className="text-[15px] text-coral-deeper m-0">
            {copy.failed}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button variant="quiet" onClick={onClose} disabled={working}>
            {copy.cancel}
          </Button>
          {/* Coral is the site's only "yes" colour, and this is a yes — but the
              button stays disabled until the word is typed, so the strongest
              colour on the page cannot be pressed by accident. */}
          <Button onClick={() => void remove()} disabled={!armed || working}>
            {working ? copy.working : copy.confirm}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
