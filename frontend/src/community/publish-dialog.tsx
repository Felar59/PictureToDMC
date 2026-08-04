import { useRef, useState } from "react"

import { ShareHoopGlyph } from "@/components/brand/icons"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Pill } from "@/components/ui/pill"
import type { Pattern } from "@/engine/convert"
import { cellsToBase64, patternThumbnail, preparePhoto } from "@/engine/publish"
import { useI18n } from "@/i18n"
import * as api from "@/lib/community"
import { useAuth } from "./auth-context"

const CATEGORIES = ["pets", "flowers", "landscapes", "other"] as const

/**
 * Why the publish failed, in the member's own words.
 *
 * The daily limit is the one refusal that is not an error: nothing went wrong,
 * there is simply no room until tomorrow, and it says when. The server sends the
 * numbers because it owns the rule; the sentence is written here because only
 * this side knows the language.
 */
function describeFailure(err: unknown, t: ReturnType<typeof useI18n>["t"]): string {
  if (!(err instanceof api.ApiError)) return t.publish.failed
  if (err.status === 413) return t.publish.tooBig
  if (err.status === 429 && err.code === "daily-limit") {
    const limit = Number(err.data?.limit) || 5
    const minutes = Math.max(1, Number(err.data?.retryInMinutes) || 60)
    return t.publish.dailyLimit(limit, minutes)
  }
  return t.publish.failed
}

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
  const [photo, setPhoto] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const pickPhoto = async (file: File) => {
    setError(null)
    try {
      // Shrunk in the browser before it ever leaves: a modern phone photo is
      // 4-8 MB and the server caps the body at 6 MB.
      setPhoto(await preparePhoto(file))
    } catch {
      setError(t.publish.tooBig)
    }
  }

  const submit = async () => {
    if (!user) return signIn("/convert")
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
          <div className="text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2">
            {t.publish.categoryLabel}
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((key) => (
              <Pill key={key} selected={category === key} onClick={() => setCategory(key)}>
                {key === "other" ? t.gallery.filters.all : t.gallery.filters[key]}
              </Pill>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-1">
            {t.publish.photoLabel}
          </div>
          <p className="text-[13px] text-stone m-0 mb-2">{t.publish.photoHint}</p>
          {photo ? (
            <div className="flex items-center gap-3">
              <img
                src={photo}
                alt=""
                className="w-24 h-24 object-cover rounded-[12px] border-[1.5px] border-edge-3"
              />
              <div className="flex flex-col gap-2">
                <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
                  {t.publish.photoChange}
                </Button>
                <Button variant="quiet" size="sm" onClick={() => setPhoto(null)}>
                  {t.publish.photoRemove}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
              {t.publish.photoPick}
            </Button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void pickPhoto(file)
              e.target.value = ""
            }}
          />
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
