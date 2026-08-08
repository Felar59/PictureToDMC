import { useState } from "react"

import { ShareHoopGlyph } from "@/components/brand/icons"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Pill } from "@/components/ui/pill"
import type { Pattern } from "@/engine/convert"
import { cellsToBase64, patternThumbnail } from "@/engine/publish"
import { useI18n } from "@/i18n"
import * as api from "@/lib/community"
import { paths } from "@/lib/routes"
import { useAuth } from "./auth-context"
import { describeFailure } from "./failure"
import { PhotoField } from "./photo-field"

const CATEGORIES = ["pets", "flowers", "landscapes", "other"] as const

export function PublishDialog({
  pattern,
  open,
  onClose,
  onPublished,
}: {
  pattern: Pattern
  open: boolean
  onClose: () => void
  onPublished: (id: number) => void
}) {
  const { t } = useI18n()
  const { user, signIn } = useAuth()

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<string>("other")
  // Optional, and the one field that puts this piece in both galleries: the chart
  // in one, the finished work in the other.
  const [photo, setPhoto] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    if (!user) return signIn(paths.convert)
    setBusy(true)
    setError(null)
    try {
      const { id } = await api.publishPost({
        title: title.trim(),
        category,
        width: pattern.width,
        height: pattern.height,
        cells: cellsToBase64(pattern),
        threadCodes: pattern.threads.map((th) => th.num),
        thumbnail: patternThumbnail(pattern),
        photo: photo ?? undefined,
      })
      onPublished(id)
    } catch (err) {
      setError(describeFailure(err, t))
    } finally {
      setBusy(false)
    }
  }

  const canSubmit = title.trim().length >= 2 && !busy

  return (
    <Dialog open={open} onClose={onClose} title={t.publish.title}>
      <div className="flex flex-col gap-5">
        <p className="text-[15px] text-clay m-0">{t.publish.lead}</p>

        <div>
          <label
            htmlFor="post-title"
            className="block text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2"
          >
            {t.publish.nameLabel}
          </label>
          <input
            id="post-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.publish.namePlaceholder}
            maxLength={80}
            className="w-full text-base bg-linen border-[1.5px] border-edge-3 rounded-[14px] px-4 py-3 outline-none transition-colors focus:border-coral focus:bg-blanc"
          />
        </div>

        <div>
          <PhotoField
            label={t.publish.photoLabel}
            optional
            value={photo}
            onChange={setPhoto}
          />
          <p className="font-hand text-[14px] text-quill mt-2 m-0">{t.publish.photoNote}</p>
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
            {/* Only once there is something to publish — beside "Sign in first" the
                hoop would be promising an action that is still one step away. */}
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
