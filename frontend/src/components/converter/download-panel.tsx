import { useState } from "react"

import { DownloadGlyph } from "@/components/brand/icons"
import { Button } from "@/components/ui/button"
import { PanelTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useI18n } from "@/i18n"
import { ApiError, downloadChart } from "@/lib/api"

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <span>
        <span className="block text-[15px] font-bold text-bark">{label}</span>
        <span className="block text-[13px] text-stone">{hint}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  )
}

export function DownloadPanel({ onError }: { onError: (message: string) => void }) {
  const { t } = useI18n()
  const [grid, setGrid] = useState(true)
  const [legend, setLegend] = useState(true)
  const [backcolor, setBackcolor] = useState("#EBE2D7")
  const [busy, setBusy] = useState(false)

  const download = async () => {
    setBusy(true)
    try {
      const blob = await downloadChart({ grid, legend, backcolor })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "BroderieDMC.png"
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      onError(err instanceof ApiError && err.kind === "network" ? "network" : "download")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-blanc rounded-[18px] shadow-soft p-5 flex flex-col gap-4">
      <PanelTitle>{t.converter.download.heading}</PanelTitle>

      <ToggleRow
        label={t.converter.download.grid}
        hint={t.converter.download.gridHint}
        checked={grid}
        onChange={setGrid}
      />
      <ToggleRow
        label={t.converter.download.legend}
        hint={t.converter.download.legendHint}
        checked={legend}
        onChange={setLegend}
      />

      <label className="flex items-center justify-between gap-4">
        <span className="text-[15px] font-bold text-bark">{t.converter.download.background}</span>
        <span className="flex items-center gap-2.5">
          <span className="font-mono text-xs text-stone">{backcolor.toUpperCase()}</span>
          <input
            type="color"
            value={backcolor}
            onChange={(e) => setBackcolor(e.target.value)}
            className="w-12 h-9 rounded-[10px] border-[1.5px] border-edge-3 cursor-pointer bg-transparent p-0"
          />
        </span>
      </label>

      <Button size="block" onClick={download} disabled={busy}>
        <DownloadGlyph />
        {busy ? t.converter.download.working : t.converter.download.button}
      </Button>

      <p className="font-hand text-sm text-sand text-center m-0">{t.converter.download.note}</p>
    </div>
  )
}
