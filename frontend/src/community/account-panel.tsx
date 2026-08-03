import { useCallback, useEffect, useState, type ReactNode } from "react"

import { StitchAvatar } from "@/components/brand/stitch-avatar"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { useI18n } from "@/i18n"
import { AccountPanelContext } from "./account-panel-context"
import { useAuth } from "./auth-context"

/**
 * The account panel: name, bio, and — later — a choice of mark.
 *
 * Mounted once, near the root, for two reasons. The header renders UserMenu twice
 * (the bar and the mobile sheet), so a dialog owned by the menu would exist twice
 * and both copies would open. And the panel has to be able to appear on its own,
 * the first time someone signs in, on whatever page they happened to be on.
 *
 * That first appearance is the point of `setUp`. A new account carries whatever
 * name Google reported, which plenty of people do not want on a craft gallery, so
 * the panel opens once to offer the choice. Saving anything marks the account as
 * set up on the server, so it never asks again — including if the name is kept as
 * it was.
 */

export function AccountPanelProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n()
  const { user, updateProfile } = useAuth()

  const [open, setOpen] = useState(false)
  const [firstRun, setFirstRun] = useState(false)
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)

  // A signed-in account that has never confirmed a name gets asked once.
  useEffect(() => {
    if (!user || user.setUp) return
    setName(user.displayName)
    setBio(user.bio ?? "")
    setFirstRun(true)
    setOpen(true)
  }, [user])

  const show = useCallback(() => {
    if (!user) return
    setName(user.displayName)
    setBio(user.bio ?? "")
    setFirstRun(false)
    setFailed(false)
    setOpen(true)
  }, [user])

  const save = async () => {
    const trimmed = name.trim()
    if (trimmed.length < 2 || saving) return
    setSaving(true)
    setFailed(false)
    try {
      await updateProfile({ displayName: trimmed, bio: bio.trim() })
      setOpen(false)
    } catch {
      setFailed(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AccountPanelContext.Provider value={{ open: show }}>
      {children}

      {user && (
        <Dialog
          open={open}
          // On the first run there is nothing to go back to, so closing it saves
          // the name that is already in the field rather than dropping the step
          // and asking again on the next page.
          onClose={() => (firstRun ? void save() : setOpen(false))}
          title={firstRun ? t.account.welcomeTitle : t.account.panel}
          className="max-w-md"
        >
          <div className="flex flex-col gap-5">
            {firstRun && (
              <p className="text-[15.5px] text-clay m-0 leading-[1.55]">{t.account.welcomeLead}</p>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="text-[13.5px] font-bold text-cocoa">{t.account.renameLabel}</span>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void save()}
                maxLength={40}
                className="text-[15.5px] bg-linen border-[1.5px] border-edge-3 rounded-field px-3.5 py-2.5 outline-none focus:border-coral focus:bg-blanc"
              />
              <span className="text-[12.5px] text-stone">{t.account.renameHint}</span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[13.5px] font-bold text-cocoa">{t.account.bioLabel}</span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t.account.bioPlaceholder}
                rows={3}
                maxLength={300}
                className="text-[15.5px] bg-linen border-[1.5px] border-edge-3 rounded-field px-3.5 py-2.5 outline-none resize-y placeholder:text-sand focus:border-coral focus:bg-blanc"
              />
              <span className="text-[12.5px] text-stone">{t.account.bioHint}</span>
            </label>

            {/* The mark is shown but not yet chosen: the field and the endpoint
                exist, the set of marks to pick from does not. Better to say so
                than to leave people wondering where it is. */}
            <div className="flex items-center gap-3.5 bg-linen rounded-chip px-3.5 py-3">
              <StitchAvatar seed={user.icon ?? user.id} size={44} />
              <span className="min-w-0">
                <span className="block text-[13.5px] font-bold text-cocoa">
                  {t.account.iconLabel}
                </span>
                <span className="block text-[12.5px] text-stone">{t.account.iconSoon}</span>
              </span>
            </div>

            {failed && (
              <p role="alert" className="text-[14px] text-coral-deeper m-0">
                {t.account.saveFailed}
              </p>
            )}

            <div className="flex gap-2.5">
              <Button
                size="block"
                onClick={() => void save()}
                disabled={saving || name.trim().length < 2}
              >
                {saving ? t.account.saving : t.account.save}
              </Button>
              {!firstRun && (
                <Button size="block" variant="secondary" onClick={() => setOpen(false)}>
                  {t.account.cancel}
                </Button>
              )}
            </div>
          </div>
        </Dialog>
      )}
    </AccountPanelContext.Provider>
  )
}
