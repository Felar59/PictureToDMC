import { useState } from "react"

import { ShareHoopGlyph } from "@/components/brand/icons"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Pill } from "@/components/ui/pill"
import { useI18n } from "@/i18n"
import * as api from "@/lib/community"
import { paths } from "@/lib/routes"
import { useAuth } from "./auth-context"
import { describeFailure } from "./failure"
import { PhotoField } from "./photo-field"

const CATEGORIES = ["pets", "flowers", "landscapes", "other"] as const

/**
 * Publishing a photograph of finished work, with no chart behind it.
 *
 * The second way into the gallery, and the reason the pattern columns in the
 * database became nullable: somebody who stitched a chart bought elsewhere has
 * work worth showing, and a gallery that refused them would only ever have been a
 * subset of the chart gallery next to it.
 *
 * So the photo is not an attachment here — it is the post. The title and the
 * category are the same two questions the chart path asks, and nothing else is
 * required.
 */
export function ShareWorkDialog({
  open,
  onClose,
  onPublished,
}: {
  open: boolean
  onClose: () => void
  onPublished: (id: number) => void
}) {
  const { t } = useI18n()
  const { user, signIn } = useAuth()

  const [photo, setPhoto] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<string>("other")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    if (!user) return signIn(paths.galleryStitches)
    if (!photo) return setError(t.shareWork.needPhoto)
    setBusy(true)
    setError(null)
    try {
      const { id } = await api.publishPhoto({ title: title.trim(), category, photo })
      // Cleared on the way out: the dialog can be opened again in the same visit,
      // and it should not still be holding the last piece.
      setPhoto(null)
      setTitle("")
      onPublished(id)
    } catch (err) {
      setError(describeFailure(err, t))
    } finally {
      setBusy(false)
    }
  }

  const canSubmit = Boolean(photo) && title.trim().length >= 2 && !busy

  return (
    <Dialog open={open} onClose={onClose} title={t.shareWork.title}>
      <div className="flex flex-col gap-5">
        <p className="text-[15px] text-clay m-0">{t.shareWork.lead}</p>

        <PhotoField label={t.shareWork.photoLabel} value={photo} onChange={setPhoto} />

        <div>
          <label
            htmlFor="work-title"
            className="block text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2"
          >
            {t.publish.nameLabel}
          </label>
          <input
            id="work-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.publish.namePlaceholder}
            maxLength={80}
            className="w-full text-base bg-linen border-[1.5px] border-edge-3 rounded-[14px] px-4 py-3 outline-none transition-colors focus:border-coral focus:bg-blanc"
          />
        </div>

        <div>
          <div className="text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2">
            {t.publish.categoryLabel}
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((key) => (
              <Pill key={key} selected={category === key} onClick={() => setCategory(key)}>
                {t.gallery.filters[key]}
              </Pill>
            ))}
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="bg-coral-wash border-[1.5px] border-coral-edge text-coral-deeper rounded-[14px] px-4 py-3 text-sm m-0"
          >
            {error}
          </p>
        )}

        <div className="flex gap-3 flex-wrap pt-1">
          <Button className="flex-1 min-w-[160px]" onClick={() => void submit()} disabled={!canSubmit}>
            {user && !busy && <ShareHoopGlyph />}
            {busy ? t.publish.working : user ? t.publish.submit : t.publish.needSignIn}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            {t.account.cancel}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
