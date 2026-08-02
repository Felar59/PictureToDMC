import { useEffect, useState } from "react"

import { Bobbin } from "@/components/brand/bobbin"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { useI18n } from "@/i18n"
import { NOT_FOUND_NAME, addColor, findAlternatives, type DMCColor } from "@/lib/api"

export function ThreadDetailDialog({
  thread,
  threads,
  onClose,
  onReplace,
}: {
  thread: DMCColor | null
  threads: DMCColor[]
  onClose: () => void
  onReplace: (from: DMCColor, to: DMCColor) => void
}) {
  const { t } = useI18n()
  const [alternatives, setAlternatives] = useState<DMCColor[]>([])
  const [showInput, setShowInput] = useState(false)
  const [code, setCode] = useState("")
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  // A different thread means different suggestions.
  useEffect(() => {
    setAlternatives([])
    setShowInput(false)
    setCode("")
    setNotice(null)
  }, [thread?.num])

  if (!thread) return null

  const suggest = async () => {
    setBusy(true)
    setNotice(null)
    try {
      const { new_colors } = await findAlternatives(threads, thread)
      setAlternatives(new_colors)
    } catch {
      setNotice(t.converter.errors.generic)
    } finally {
      setBusy(false)
    }
  }

  const lookup = async () => {
    const wanted = code.trim()
    if (!wanted) return
    setBusy(true)
    setNotice(null)
    try {
      const { add_color } = await addColor(wanted)
      if (add_color.name === NOT_FOUND_NAME) {
        setNotice(t.converter.custom.notFound)
      } else if (threads.some((c) => c.num === add_color.num)) {
        setNotice(t.converter.custom.already)
      } else {
        setAlternatives((prev) => [...prev, add_color].slice(-3))
        setCode("")
        setShowInput(false)
      }
    } catch {
      setNotice(t.converter.errors.generic)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open onClose={onClose} title={t.converter.detail.title} className="max-w-2xl">
      <div className="flex flex-col gap-6">
        {/* the thread itself */}
        <div className="flex items-center gap-4">
          <Bobbin hex={thread.hex} width={54} height={72} radius={12} className="bobbin" />
          <div className="flex-1 min-w-0">
            <span className="inline-block text-sm font-extrabold bg-linen rounded-full px-3 py-1 mb-2">
              DMC {thread.num}
            </span>
            <p className="text-[18px] font-medium text-ink m-0">{thread.name}</p>
            <p className="text-sm text-stone font-mono m-0">{thread.hex}</p>
          </div>
        </div>

        {alternatives.length > 0 && (
          <div className="border-t-2 border-dashed border-edge-2 pt-5">
            <h3 className="text-[13px] font-extrabold tracking-[.06em] uppercase text-sand mb-3.5 font-body">
              {t.converter.detail.alternatives}
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {alternatives.map((alt) => (
                <div
                  key={alt.num}
                  className="flex flex-col items-center gap-3 p-4 rounded-[16px] bg-linen border-[1.5px] border-edge-3"
                >
                  <Bobbin hex={alt.hex} width={40} height={54} radius={10} />
                  <div className="text-center min-w-0 w-full">
                    <span className="inline-block text-xs font-extrabold bg-blanc border-[1.5px] border-edge-3 rounded-full px-2 py-0.5 mb-1">
                      DMC {alt.num}
                    </span>
                    <p className="text-sm font-medium truncate m-0">{alt.name}</p>
                    <p className="text-xs text-stone font-mono m-0">{alt.hex}</p>
                  </div>
                  <Button size="sm" className="w-full" onClick={() => onReplace(thread, alt)}>
                    {t.converter.detail.replace}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showInput && (
          <div className="border-t-2 border-dashed border-edge-2 pt-5">
            <label
              htmlFor="thread-code"
              className="block text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2"
            >
              {t.converter.custom.inputLabel}
            </label>
            <div className="flex gap-3 flex-wrap">
              <input
                id="thread-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && lookup()}
                placeholder="702"
                className="flex-1 min-w-[140px] text-base bg-linen border-[1.5px] border-edge-3 rounded-[14px] px-4 py-3 outline-none transition-colors focus:border-coral focus:bg-blanc"
              />
              <Button size="sm" onClick={lookup} disabled={busy}>
                {t.converter.custom.validate}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowInput(false)
                  setCode("")
                }}
              >
                {t.converter.custom.cancel}
              </Button>
            </div>
          </div>
        )}

        {notice && (
          <p className="bg-coral-wash border-[1.5px] border-coral-edge text-coral-deeper rounded-[14px] px-4 py-3 text-sm m-0">
            {notice}
          </p>
        )}

        <div className="flex gap-3 flex-wrap">
          <Button className="flex-1 min-w-[200px]" onClick={suggest} disabled={busy}>
            {t.converter.detail.findSimilar}
          </Button>
          <Button
            variant="secondary"
            className="flex-1 min-w-[200px]"
            onClick={() => setShowInput(true)}
          >
            {t.converter.detail.setColor}
          </Button>
        </div>

        <div className="border-t-2 border-dashed border-edge-2 pt-5">
          <Button asChild variant="secondary" size="block">
            <a
              href={`https://www.etsy.com/fr/search?q=DMC+${encodeURIComponent(thread.num)}&ref=search_bar`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {t.converter.detail.buy}
            </a>
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
