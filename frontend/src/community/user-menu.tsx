import { useEffect, useRef, useState } from "react"

import { StitchAvatar } from "@/components/brand/stitch-avatar"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"
import { useAuth } from "./auth-context"

/** Signed-out: one button. Signed-in: avatar with a small menu. */
export function UserMenu({ className }: { className?: string }) {
  const { t } = useI18n()
  const { user, googleEnabled, signIn, signOut, rename } = useAuth()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState("")
  const hostRef = useRef<HTMLDivElement | null>(null)

  // Click-outside and Escape, the two ways anyone expects a menu to close.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!hostRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  // undefined means we haven't heard back from /api/auth/me yet. Render nothing
  // rather than flashing "Sign in" at someone who already is.
  if (user === undefined) return <div className={className} style={{ width: 40 }} />

  if (!user) {
    if (!googleEnabled) return null
    return (
      <Button size="sm" variant="secondary" className={className} onClick={() => signIn()}>
        {t.account.signInShort}
      </Button>
    )
  }

  const submit = async () => {
    const name = draft.trim()
    if (name.length < 2) return
    await rename(name).catch(() => undefined)
    setEditing(false)
    setOpen(false)
  }

  return (
    <div ref={hostRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border-[1.5px] border-edge-3 bg-linen pl-1 pr-3 py-1 cursor-pointer transition-colors hover:border-taupe"
      >
        <StitchAvatar seed={user.id} size={28} />
        <span className="text-[13.5px] font-bold text-cocoa max-w-[110px] truncate">
          {user.displayName}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-[260px] bg-blanc border-[1.5px] border-edge-3 rounded-[16px] shadow-panel p-3 z-50 animate-stitch-in"
        >
          <div className="px-1 pb-2 border-b-2 border-dashed border-edge-2">
            <div className="text-[12px] uppercase tracking-[.06em] font-extrabold text-sand">
              {t.account.signedInAs}
            </div>
            <div className="text-[15px] font-bold truncate">{user.displayName}</div>
            {user.email && <div className="text-[12.5px] text-stone truncate">{user.email}</div>}
          </div>

          {editing ? (
            <div className="pt-3 flex flex-col gap-2">
              <label htmlFor="rename" className="text-[13px] font-bold text-cocoa">
                {t.account.renameLabel}
              </label>
              <input
                id="rename"
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void submit()}
                maxLength={40}
                className="text-[15px] bg-linen border-[1.5px] border-edge-3 rounded-[12px] px-3 py-2 outline-none focus:border-coral focus:bg-blanc"
              />
              <p className="text-[12.5px] text-stone m-0">{t.account.renameHint}</p>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => void submit()}>
                  {t.account.save}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setEditing(false)}
                >
                  {t.account.cancel}
                </Button>
              </div>
            </div>
          ) : (
            <div className="pt-2 flex flex-col">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setDraft(user.displayName)
                  setEditing(true)
                }}
                className="text-left text-[14.5px] font-bold text-cocoa hover:text-coral-deep px-1 py-2 cursor-pointer"
              >
                {t.account.rename}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => void signOut()}
                className="text-left text-[14.5px] font-bold text-cocoa hover:text-coral-deep px-1 py-2 cursor-pointer"
              >
                {t.account.signOut}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
