import { Link } from "react-router-dom"

import { StitchAvatar } from "@/components/brand/stitch-avatar"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"
import { useAuth } from "./auth-context"

/**
 * Signed out: one button. Signed in: your mark and your name, linking to your
 * account.
 *
 * This used to open a two-item dropdown — "my account" and "sign out" — which is a
 * menu whose whole job was to offer a link to a page that could hold both. So the
 * pill goes straight there, and signing out lives on the page it belongs to. One
 * click instead of two, nothing to dismiss, and no click-outside or Escape handling
 * to get wrong.
 */
export function UserMenu({ className }: { className?: string }) {
  const { t } = useI18n()
  const { user, googleEnabled, signIn } = useAuth()

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

  return (
    <Link
      to="/compte"
      title={t.account.panel}
      className={`flex items-center gap-2 rounded-full border-[1.5px] border-edge-3 bg-linen pl-1 pr-3 py-1 transition-colors hover:border-taupe ${className ?? ""}`}
    >
      <StitchAvatar seed={user.icon ?? user.id} size={28} />
      <span className="text-[13.5px] font-bold text-cocoa max-w-[110px] truncate">
        {user.displayName}
      </span>
    </Link>
  )
}
