import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { StitchAvatar } from "@/components/brand/stitch-avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/community/auth-context"
import { useI18n } from "@/i18n"

/**
 * The account page: name, bio, and — later — a choice of mark.
 *
 * A page rather than a dialog. Everything here is worth its own address: it can
 * be linked to, it survives a reload, the browser's back button does what it
 * should, and a bio has room to be more than two lines.
 *
 * `?bienvenue` is how a brand-new account arrives. A new account carries whatever
 * name Google reported, which plenty of people do not want on a craft gallery, so
 * the first sign-in lands here once with that name filled in. Saving marks the
 * account as set up on the server, so it never asks again — including when the
 * name is kept exactly as it was.
 */
export default function Account() {
  const { t } = useI18n()
  const { user, signIn, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [search] = useSearchParams()
  const welcome = search.has("bienvenue")

  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)
  const [saved, setSaved] = useState(false)

  // Filled from the account once it has loaded, and only then: an input seeded
  // with an empty string and then reset under the cursor loses what was typed.
  const [seeded, setSeeded] = useState(false)
  useEffect(() => {
    if (!user || seeded) return
    setName(user.displayName)
    setBio(user.bio ?? "")
    setSeeded(true)
  }, [user, seeded])

  if (user === undefined) {
    return <p className="text-center text-cocoa py-24">{t.gallery.loading}</p>
  }

  if (!user) {
    return (
      <div className="text-center py-24 flex flex-col items-center gap-4">
        <p className="text-clay m-0">{t.account.signInFirst}</p>
        <Button onClick={() => signIn("/compte")}>{t.account.signIn}</Button>
      </div>
    )
  }

  const save = async () => {
    const trimmed = name.trim()
    if (trimmed.length < 2 || saving) return
    setSaving(true)
    setFailed(false)
    setSaved(false)
    try {
      await updateProfile({ displayName: trimmed, bio: bio.trim() })
      // Straight into the gallery on the way in; on a later edit, stay put and
      // say it worked, because there is nowhere better to be.
      if (welcome) void navigate("/gallery", { replace: true })
      else setSaved(true)
    } catch {
      setFailed(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-[620px] px-5 sm:px-8 py-10">
      {!welcome && (
        <Link
          to={`/brodeur/${user.id}`}
          className="inline-block text-[14px] font-bold text-stone hover:text-coral-deep transition-colors"
        >
          {t.account.publicPage} →
        </Link>
      )}

      <h1 className="text-[27px] sm:text-[32px] leading-[1.15] m-0 mt-4">
        {welcome ? t.account.welcomeTitle : t.account.panel}
      </h1>
      {welcome && (
        <p className="text-[16px] text-clay mt-3 mb-0 leading-[1.55]">{t.account.welcomeLead}</p>
      )}

      <div className="bg-blanc rounded-card shadow-soft p-5 sm:p-6 mt-6 flex flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-bold text-cocoa">{t.account.renameLabel}</span>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setSaved(false)
            }}
            maxLength={40}
            className="text-[16px] bg-linen border-[1.5px] border-edge-3 rounded-field px-3.5 py-2.5 outline-none focus:border-coral focus:bg-blanc"
          />
          <span className="text-[13px] text-stone">{t.account.renameHint}</span>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-bold text-cocoa">{t.account.bioLabel}</span>
          <textarea
            value={bio}
            onChange={(e) => {
              setBio(e.target.value)
              setSaved(false)
            }}
            placeholder={t.account.bioPlaceholder}
            rows={4}
            maxLength={300}
            className="text-[16px] bg-linen border-[1.5px] border-edge-3 rounded-field px-3.5 py-2.5 outline-none resize-y placeholder:text-sand focus:border-coral focus:bg-blanc"
          />
          <span className="text-[13px] text-stone">
            {t.account.bioHint} · {bio.length}/300
          </span>
        </label>

        {/* The mark is shown but not yet chosen: the column, the endpoint and the
            renderer all take it, the set to choose from does not exist. Better to
            say so than to leave people hunting for it. */}
        <div className="flex items-center gap-4 bg-linen rounded-chip px-4 py-3.5">
          <StitchAvatar seed={user.icon ?? user.id} size={52} />
          <span className="min-w-0">
            <span className="block text-[14px] font-bold text-cocoa">{t.account.iconLabel}</span>
            <span className="block text-[13px] text-stone">{t.account.iconSoon}</span>
          </span>
        </div>

        {failed && (
          <p role="alert" className="text-[14.5px] text-coral-deeper m-0">
            {t.account.saveFailed}
          </p>
        )}

        <div className="flex items-center gap-4 flex-wrap">
          <Button onClick={() => void save()} disabled={saving || name.trim().length < 2}>
            {saving ? t.account.saving : t.account.save}
          </Button>
          {saved && (
            <p role="status" className="font-hand text-[15px] text-nile-deep m-0">
              {t.account.saved}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
