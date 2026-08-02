import { useState } from "react"

import { Bobbin } from "@/components/brand/bobbin"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { useI18n } from "@/i18n"
import { NOT_FOUND_NAME, addColor, type DMCColor } from "@/lib/api"

/** "123, 16,186" and "123,16, 186" must both work. */
function parseCodes(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

export function CustomThreadsDialog({
  open,
  onClose,
  enabled,
  onEnabledChange,
  threads,
  onThreadsChange,
}: {
  open: boolean
  onClose: () => void
  enabled: boolean
  onEnabledChange: (v: boolean) => void
  threads: DMCColor[]
  onThreadsChange: (next: DMCColor[]) => void
}) {
  const { t } = useI18n()
  const [mode, setMode] = useState<"add" | "remove" | null>(null)
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const submit = async () => {
    const codes = parseCodes(input)
    if (codes.length === 0) return

    if (mode === "remove") {
      onThreadsChange(threads.filter((c) => !codes.includes(c.num)))
      setInput("")
      setMode(null)
      return
    }

    setBusy(true)
    setNotice(null)

    // Resolve every code before touching state, so N concurrent responses
    // can't race each other into the list.
    const results = await Promise.all(
      codes.map(async (code) => {
        try {
          const { add_color } = await addColor(code)
          return add_color
        } catch {
          return null
        }
      }),
    )

    const next = [...threads]
    let missing = 0
    let duplicate = 0

    for (const color of results) {
      if (!color || color.name === NOT_FOUND_NAME) {
        missing++
      } else if (next.some((c) => c.num === color.num)) {
        duplicate++
      } else {
        next.push(color)
      }
    }

    onThreadsChange(next)
    setBusy(false)
    setInput("")
    if (missing > 0) setNotice(t.converter.custom.notFound)
    else if (duplicate > 0) setNotice(t.converter.custom.already)
    else setMode(null)
  }

  return (
    <Dialog open={open} onClose={onClose} title={t.converter.custom.title}>
      <div className="flex flex-col gap-5">
        {/* master switch */}
        <label className="flex items-center justify-between gap-4 bg-linen rounded-[16px] p-4 cursor-pointer">
          <span>
            <span className="block text-base font-bold text-bark">{t.converter.custom.toggle}</span>
            <span className="block text-sm text-stone">
              {enabled ? t.converter.custom.toggleOn : t.converter.custom.toggleOff}
            </span>
          </span>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </label>

        {/* the box of threads */}
        <div>
          <div className="text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2">
            {t.converter.custom.listLabel}
          </div>
          <div className="bg-linen border-[1.5px] border-edge-3 rounded-[16px] p-3 min-h-[120px] max-h-[220px] overflow-y-auto scroll-linen">
            {threads.length === 0 ? (
              <span className="text-sm text-stone">{t.converter.custom.emptyList}</span>
            ) : (
              <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                {threads.map((c) => (
                  <li
                    key={c.num}
                    className="flex items-center gap-2 rounded-[12px] bg-blanc border-[1.5px] border-edge-3 pl-2 pr-3 py-1.5"
                  >
                    <Bobbin hex={c.hex} width={16} height={22} radius={5} />
                    <span className="text-sm font-mono font-bold">{c.num}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {mode && (
          <div className="border-t-2 border-dashed border-edge-2 pt-5">
            <label
              htmlFor="custom-codes"
              className="block text-[13px] font-extrabold tracking-[.06em] uppercase text-cocoa mb-2"
            >
              {t.converter.custom.inputLabel}
            </label>
            <div className="flex gap-3 flex-wrap">
              <input
                id="custom-codes"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder={t.converter.custom.placeholder}
                className={`flex-1 min-w-[160px] text-base bg-linen border-[1.5px] rounded-[14px] px-4 py-3 outline-none transition-colors focus:bg-blanc ${
                  mode === "add" ? "border-edge-3 focus:border-coral" : "border-coral-edge focus:border-coral-deep"
                }`}
              />
              <Button size="sm" onClick={submit} disabled={busy}>
                {t.converter.custom.validate}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setMode(null)
                  setInput("")
                  setNotice(null)
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

        <div className="flex gap-2 flex-wrap pt-1">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 min-w-[110px]"
            onClick={() => {
              setMode("add")
              setNotice(null)
            }}
          >
            {t.converter.custom.add}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 min-w-[110px]"
            disabled={threads.length === 0}
            onClick={() => {
              setMode("remove")
              setNotice(null)
            }}
          >
            {t.converter.custom.remove}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 min-w-[110px]"
            disabled={threads.length === 0}
            onClick={() => {
              onThreadsChange([])
              setNotice(null)
            }}
          >
            {t.converter.custom.reset}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
