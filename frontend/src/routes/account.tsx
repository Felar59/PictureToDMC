import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { MarkPicker } from "@/community/mark-picker"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/community/auth-context"
import { DeleteAccountDialog } from "@/community/delete-account-dialog"
import { useI18n } from "@/i18n"
import { ApiError } from "@/lib/community"
import { paths } from "@/lib/routes"
import { useHead } from "@/lib/head"

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
  const [deleting, setDeleting] = useState(false)
  const { t } = useI18n()
  const { user, googleEnabled, signIn, signOut, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [search] = useSearchParams()
  const welcome = search.has("bienvenue")

  useHead({ title: t.head.account.title, description: t.head.account.description, noindex: true })

  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  // null is the mark drawn from the account, which is what everybody starts with.
  const [icon, setIcon] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  // The message itself, not a boolean: a reserved name and a dropped connection
  // are both "it didn't save", and only one of them is worth trying again.
  const [failed, setFailed] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  // Filled from the account once it has loaded, and only then: an input seeded
  // with an empty string and then reset under the cursor loses what was typed.
  const [seeded, setSeeded] = useState(false)
  useEffect(() => {
    if (!user || seeded) return
    setName(user.displayName)
    setBio(user.bio ?? "")
    setIcon(user.icon ?? null)
    setSeeded(true)
  }, [user, seeded])

  if (user === undefined) {
    return <p className="text-center text-cocoa py-24">{t.gallery.loading}</p>
  }

  if (!user) {
    return (
      <div className="text-center py-24 flex flex-col items-center gap-4">
        <p className="text-clay m-0">{t.account.signInFirst}</p>
        {/* A button that cannot work is worse than no button. When Google is not
            configured — which is every checkout of this repository, since the
            secret is not in it — clicking this used to return 503 and read as the
            site being broken. */}
        {googleEnabled ? (
          <Button onClick={() => signIn(paths.account)}>{t.account.signIn}</Button>
        ) : (
          <p className="font-hand text-[14px] text-sand m-0 max-w-[420px]">
            {t.account.signInUnavailable}
          </p>
        )}
      </div>
    )
  }

  const save = async () => {
    const trimmed = name.trim()
    if (trimmed.length < 2 || saving) return
    setSaving(true)
    setFailed(null)
    setSaved(false)
    try {
      await updateProfile({ displayName: trimmed, bio: bio.trim(), icon })
      // Straight into the gallery on the way in; on a later edit, stay put and
      // say it worked, because there is nowhere better to be.
      if (welcome) void navigate(paths.gallery, { replace: true })
      else setSaved(true)
    } catch (err) {
      const reserved = err instanceof ApiError && err.code === "reserved-name"
      setFailed(reserved ? t.account.nameReserved : t.account.saveFailed)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-[620px] px-5 sm:px-8 py-10">
      {!welcome && (
        <Link
          to={`/brodeur/${user.id}`}
          className="inline-flex items-center min-h-11 text-[14px] font-bold text-stone hover:text-coral-deep transition-colors"
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

        {/* The mark, now actually choosable. It saves with the rest of the form
            rather than on click: a mark is a matter of taste, and a picker that
            commits the moment you touch it is one you cannot browse. */}
        <div className="bg-linen rounded-chip px-4 py-4">
          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
            <span className="text-[14px] font-bold text-cocoa">{t.account.marks.heading}</span>
            <span className="text-[13px] text-stone">{t.account.marks.lead}</span>
          </div>
          <MarkPicker userId={user.id} value={icon} onChange={setIcon} disabled={saving} />
          <p className="font-hand text-[13px] text-sand m-0 mt-3">{t.account.marks.note}</p>
        </div>

        {failed && (
          <p role="alert" className="text-[14.5px] text-coral-deeper m-0">
            {failed}
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

      {/* The moderation queue, for whoever runs the place. The only link to it
          anywhere — the page itself is noindex, and the API refuses everyone
          else, so this is a shortcut rather than the lock. */}
      {user.isAdmin && (
        <div className="mt-6 pt-5 border-t-2 border-dashed border-edge-2">
          <Button asChild variant="secondary" size="sm">
            <Link to={paths.reports}>{t.reports.link}</Link>
          </Button>
        </div>
      )}

      {/* Signing out lives here now, not in a header dropdown — the pill in the
          header links straight to this page. Set apart from the form and quiet: it
          is the one thing on the page that throws work away, and it should not sit
          next to Save looking like a second way to finish. */}
      <div className="mt-6 pt-5 border-t-2 border-dashed border-edge-2 flex items-center justify-between gap-4 flex-wrap">
        <p className="font-hand text-[15px] text-sand m-0">{t.account.signedInAs} {user.email}</p>
        <Button variant="quiet" size="sm" onClick={() => void signOut()}>
          {t.account.signOut}
        </Button>
      </div>

      {/* Last on the page, and deliberately dull.
          The privacy policy says you may have everything erased, so there has to be
          a way to do it that is not writing an e-mail and waiting. It is quiet
          rather than red-and-shouting: this is a right, not a trap, and a wall of
          warning colour would make an ordinary decision feel like a mistake. The
          dialog is where the real weight sits, because that is where the numbers
          are and where the word has to be typed. */}
      <div className="mt-8 pt-5 border-t-2 border-dashed border-edge-2">
        <h2 className="text-[17px] m-0 mb-1">{t.account.danger.heading}</h2>
        <p className="text-[14.5px] text-cocoa m-0 mb-3">{t.account.danger.lead}</p>
        <Button variant="quiet" size="sm" onClick={() => setDeleting(true)}>
          {t.account.danger.open}
        </Button>
      </div>

      <DeleteAccountDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        // Straight to the home page with a word about what happened. Staying put
        // would leave the account page open for an account that no longer exists,
        // and a full navigation is also the simplest way to be sure nothing signed
        // in is still held anywhere in memory.
        onDeleted={() => {
          window.location.assign(`${paths.home}?compte=supprime`)
        }}
      />
    </div>
  )
}
