import { useCallback, useId, useRef, useState } from "react"

import { StitchMark } from "@/components/brand/icons"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"
import { cn } from "@/lib/utils"

export type LoadedPhoto = { dataUrl: string; width: number; height: number }

/**
 * Read a picked file into a data URL, measuring it on the way through: the
 * pattern's height follows the photo's ratio, and we want to be able to show
 * that before the server has seen anything.
 */
function readPhoto(file: File, onPhoto: (photo: LoadedPhoto) => void) {
  if (!file.type.startsWith("image/")) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target?.result
    if (typeof dataUrl !== "string") return
    const img = new Image()
    img.onload = () => onPhoto({ dataUrl, width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => onPhoto({ dataUrl, width: 0, height: 0 })
    img.src = dataUrl
  }
  reader.readAsDataURL(file)
}

/**
 * The dropzone IS a piece of aida fabric — the grid texture and the
 * stitch-dashed border say "your picture will land on cloth". It's the
 * largest element on the page and the only coral-bordered surface.
 */
export function PhotoDropzone({ onPhoto }: { onPhoto: (photo: LoadedPhoto) => void }) {
  const { t } = useI18n()
  const [dragging, setDragging] = useState(false)
  const inputId = useId()

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) readPhoto(file, onPhoto)
    },
    [onPhoto],
  )

  const stop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div
      className={cn(
        "relative aida [--aida-size:14px] [--aida-ink:.07] rounded-[22px] border-[2.5px] border-dashed",
        "flex flex-col items-center gap-3 p-7 text-center transition-colors cursor-pointer",
        dragging ? "border-coral bg-[#FBF5E9]" : "border-coral-dash bg-[#F7F1E5] hover:border-coral",
      )}
      onDragEnter={(e) => {
        stop(e)
        setDragging(true)
      }}
      onDragOver={stop}
      onDragLeave={(e) => {
        stop(e)
        setDragging(false)
      }}
      onDrop={onDrop}
    >
      <StitchMark size={40} />
      <div className="font-display font-semibold text-[20px] text-ink">
        {t.converter.upload.drop}
      </div>
      <div className="text-[15px] text-cocoa">
        {t.converter.upload.browseBefore}
        <label
          htmlFor={inputId}
          className="text-coral-deep font-bold underline decoration-dotted decoration-2 underline-offset-4 cursor-pointer"
        >
          {t.converter.upload.browse}
        </label>
        {t.converter.upload.browseAfter}
      </div>
      <div className="font-hand text-sm text-sand">{t.converter.upload.hint}</div>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="absolute inset-0 size-full opacity-0 cursor-pointer"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) readPhoto(file, onPhoto)
          e.target.value = ""
        }}
      />
    </div>
  )
}

/** Swap the photo out without going back to the empty dropzone. */
export function ReplacePhotoButton({
  onPhoto,
  className,
}: {
  onPhoto: (photo: LoadedPhoto) => void
  className?: string
}) {
  const { t } = useI18n()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className={className}
        onClick={() => inputRef.current?.click()}
      >
        {t.converter.upload.replace}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) readPhoto(file, onPhoto)
          e.target.value = ""
        }}
      />
    </>
  )
}
