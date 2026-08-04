import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { StitchAvatar } from "@/components/brand/stitch-avatar"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"
import * as api from "@/lib/community"
import { AdminFlower } from "./admin-flower"
import { useAuth } from "./auth-context"

/**
 * The conversation under a published piece.
 *
 * Reading it needs no account, the way the rest of the gallery doesn't — only
 * writing does. A posted comment is appended from what the server hands back
 * rather than by refetching the thread, so the box empties and the comment
 * appears in one step even on a slow connection.
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

  /**
   * Delete a comment — your own, or anyone's if you are an admin.
   *
   * Your own goes in one click: it is your sentence, and putting a prompt in front
   * of it would be treating you as a suspect. Somebody else's asks first, because
   * an admin sees that ✕ on every comment on the site and the one thing it must
   * not be is easy to hit by accident.
   */
  const remove = async (comment: api.Comment, own: boolean) => {
    if (!own && !window.confirm(t.comments.confirmDeleteOther(comment.author.displayName))) return
    // Optimistic: put it back if the server disagrees.
    const before = comments
    setComments((list) => (list ?? []).filter((c) => c.id !== comment.id))
    try {
      await api.deleteComment(comment.id)
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

      {/* The box comes first: on an empty thread the useful thing on screen is
          the way to write, not the news that nobody has. */}
      {user ? (
        <div className="bg-blanc rounded-card shadow-soft p-4 flex flex-col gap-3">
          <label className="sr-only" htmlFor="new-comment">
            {t.comments.placeholder}
          </label>
          <textarea
            id="new-comment"
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
        <p className="text-[15.5px] text-stone mt-5">{t.comments.empty}</p>
      ) : (
        <ul className="list-none p-0 m-0 mt-5 flex flex-col gap-3">
          {comments.map((c) => {
            const own = user?.id === c.author.id
            const canDelete = own || Boolean(user?.isAdmin)
            return (
              <li key={c.id} className="bg-blanc rounded-card shadow-soft p-4 flex gap-3.5">
                <Link to={`/brodeur/${c.author.id}`} className="shrink-0">
                  <StitchAvatar seed={c.author.id} size={36} />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <Link
                      to={`/brodeur/${c.author.id}`}
                      className="text-[14.5px] font-bold text-cocoa hover:text-coral-deep transition-colors"
                    >
                      {c.author.displayName}
                    </Link>
                    {c.author.isAdmin && <AdminFlower className="text-[13px]" />}
                    <span className="font-mono text-[11.5px] text-sand">{when(c.createdAt)}</span>
                  </div>
                  {/* whitespace-pre-line, so a note written in paragraphs keeps
                      them; break-words, so a pasted URL can't widen the page. */}
                  <p className="text-[15.5px] text-ink leading-[1.55] m-0 mt-1 whitespace-pre-line break-words">
                    {c.body}
                  </p>
                </div>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => void remove(c, own)}
                    aria-label={own ? t.comments.deleteAria : t.comments.deleteOtherAria}
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
