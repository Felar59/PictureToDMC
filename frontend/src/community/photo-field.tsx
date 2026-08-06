import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { preparePhoto } from "@/engine/publish"
import { useI18n } from "@/i18n"

/** What the server accepts, so a picture that will be refused is refused here. */
const MAX_BYTES = 6 * 1024 * 1024

/**
 * Choosing a photo of a finished piece, with what it will look like once sent.
 *
 * One component for both publish paths — the chart's optional photo and the photo
 * that is the whole post — because a member picking a picture should meet the same
 * control either way, and because the awkward parts are the same awkward parts.
 *
 * Two of those are worth naming:
 *
 *  * The file input is reset on every pick. Without that, choosing the same file
 *    twice fires no `change` event at all, so a member who picked the wrong photo,
 *    corrected it in the file browser and picked again would see nothing happen.
 *  * The input never wraps the button. A click inside a label wrapping the input
 *    bubbles back out and re-opens the picker, which is how you get two dialogs.
 *
 * The picture is shrunk before it is shown, by `preparePhoto` — so the preview is
 * the bytes that will be published rather than a hopeful version of them.
 */
export function PhotoField({
  label,
  optional,
  value,
  onChange,
}: {
  label: string
  optional?: boolean
  /** A data URL, or null when nothing is chosen. */
  value: string | null
  onChange: (photo: string | null) => void
}) {
  const { t } = useI18n()
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pick = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const photo = await preparePhoto(file)
      // Belt and braces: the shrink puts a phone photo well under a megabyte, but
      // a refusal from the server after the upload has run is a worse way to
      // learn this than a sentence here.
      if (photo.length * 0.75 > MAX_BYTES) {
        setError(t.shareWork.tooHeavy)
        onChange(null)
      } else {
        onChange(photo)
      }
    } catch {
      setError(t.shareWork.unreadable)
      onChange(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa">
          {label}
        </span>
        {optional && <span className="font-hand text-[14px] text-sand">{t.publish.photoOptional}</span>}
      </div>

      {value && (
        <img
          src={value}
          alt=""
          className="w-full max-h-[240px] object-contain bg-linen rounded-[14px] border-[1.5px] border-edge-3 mb-2.5"
        />
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <Button type="button" variant="secondary" size="sm" disabled={busy} onClick={() => input.current?.click()}>
          {busy ? t.publish.working : value ? t.shareWork.change : t.shareWork.pick}
        </Button>
        <span className="font-hand text-[14px] text-sand">{t.shareWork.hint}</span>
      </div>

      {/* Outside every clickable thing, and cleared on each pick. */}
      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ""
          void pick(file)
        }}
      />

      {error && (
        <p role="alert" className="text-[13.5px] text-coral-deeper mt-2 m-0">
          {error}
        </p>
      )}
    </div>
  )
}
