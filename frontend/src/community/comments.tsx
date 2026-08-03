import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"
import * as api from "@/lib/community"
import { useAuth } from "./auth-context"

/**
 * The conversation under a published piece.
 *
 * Reading it needs no account, the way the rest of the gallery doesn't — only
 * writing does. A new note is appended from what the server hands back rather
 * than by refetching the thread, so the box empties and the note appears in one
 * step even on a slow connection.
 */
export function Comments({ postId }: { postId: number }) {
  const { t, lang } = useI18n()
  const { user, signIn } = useAuth()

  const [comments, setComments] = useState<api.Comment[] | null>(null)
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    setComments(null)
    api
      .fetchComments(postId)
      .then((r) => !cancelled && setComments(r.comments))
      .catch(() => !cancelled && setComments([]))
    return () => {
      cancelled = true
    }
  }, [postId])

  const send = async () => {
    const text = body.trim()
    if (!text || sending) return
    setSending(true)
    setFailed(false)
    try {
      const saved = await api.addComment(postId, text)
      setComments((list) => [...(list ?? []), saved])
      setBody("")
    } catch {
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  const remove = async (id: number) => {
    // Optimistic: put the note back if the server disagrees.
    const before = comments
    setComments((list) => (list ?? []).filter((c) => c.id !== id))
    try {
      await api.deleteComment(id)
    } catch {
      setComments(before)
    }
  }

  const when = (ms: number) =>
    new Date(ms).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  return (
    <section className="mt-12">
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="text-[22px] m-0">{t.comments.heading}</h2>
        {comments && comments.length > 0 && (
          <span className="font-mono text-[12.5px] text-stone">
            {t.comments.count(comments.length)}
          </span>
        )}
      </div>

      {/* The box comes first: an empty thread is an invitation, not a report. */}
      {user ? (
        <div className="bg-blanc rounded-card shadow-soft p-4 flex flex-col gap-3">
          <label className="sr-only" htmlFor="new-note">
            {t.comments.placeholder}
          </label>
          <textarea
            id="new-note"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t.comments.placeholder}
            rows={3}
            maxLength={1000}
            className="w-full resize-y rounded-field border-[1.5px] border-edge-3 bg-linen px-3.5 py-3 text-[15.5px] text-ink placeholder:text-sand focus-visible:border-coral"
          />
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {failed ? (
              <p role="alert" className="text-[14px] text-coral-deeper m-0">
                {t.comments.failed}
              </p>
            ) : (
              <span />
            )}
            <Button size="sm" onClick={() => void send()} disabled={!body.trim() || sending}>
              {sending ? t.comments.sending : t.comments.send}
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-blanc rounded-card shadow-soft p-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[15.5px] text-clay m-0">{t.comments.signIn}</p>
          <Button size="sm" onClick={() => signIn(`/piece/${postId}`)}>
            {t.account.signIn}
          </Button>
        </div>
      )}

      {comments === null ? (
        <p className="text-[15px] text-stone mt-5">{t.comments.loading}</p>
      ) : comments.length === 0 ? (
        <p className="font-hand text-[15.5px] text-sand mt-5">{t.comments.empty}</p>
      ) : (
        <ul className="list-none p-0 m-0 mt-5 flex flex-col gap-3">
          {comments.map((c) => {
            const mine = user && (user.id === c.author.id || user.isAdmin)
            return (
              <li key={c.id} className="bg-blanc rounded-card shadow-soft p-4 flex gap-3.5">
                <Link to={`/brodeur/${c.author.id}`} className="shrink-0">
                  {c.author.avatarUrl ? (
                    <img
                      src={c.author.avatarUrl}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="size-9 rounded-full bg-linen"
                    />
                  ) : (
                    <span className="size-9 rounded-full bg-coral text-blanc grid place-items-center font-display font-semibold">
                      {c.author.displayName.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <Link
                      to={`/brodeur/${c.author.id}`}
                      className="text-[14.5px] font-bold text-cocoa hover:text-coral-deep transition-colors"
                    >
                      {c.author.displayName}
                    </Link>
                    <span className="font-mono text-[11.5px] text-sand">{when(c.createdAt)}</span>
                  </div>
                  {/* whitespace-pre-line, so a note written in paragraphs keeps
                      them; break-words, so a pasted URL can't widen the page. */}
                  <p className="text-[15.5px] text-ink leading-[1.55] m-0 mt-1 whitespace-pre-line break-words">
                    {c.body}
                  </p>
                </div>
                {mine && (
                  <button
                    type="button"
                    onClick={() => void remove(c.id)}
                    aria-label={t.comments.deleteAria}
                    className="self-start text-[13px] font-bold text-stone hover:text-coral-deep cursor-pointer shrink-0"
                  >
                    ✕
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
