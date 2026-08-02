import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { BrandMark } from "@/components/brand/logo"
import { PhotoSlot } from "@/components/brand/photo-slot"
import { Button } from "@/components/ui/button"
import { Pill } from "@/components/ui/pill"
import { useI18n } from "@/i18n"
import { gallerySamples, type GalleryCategory, type GallerySample } from "@/lib/gallery-samples"

// Five cards plus the share invitation fills two clean rows of three,
// which is exactly how the design lays the grid out.
const PAGE = 5

function GalleryCard({ item }: { item: GallerySample }) {
  const { t, lang } = useI18n()
  const rest = item.colors - item.palette.length

  return (
    <article className="bg-blanc rounded-[20px] shadow-card-sm p-3.5 flex flex-col gap-3 transition-shadow hover:shadow-lift">
      <PhotoSlot caption={item.caption[lang]} radius={14} className="w-full h-[230px]" />

      <div className="px-1">
        <h3 className="font-medium text-[16.5px] leading-tight">{item.title[lang]}</h3>
        <div className="text-[13px] text-stone mt-0.5 mb-2.5">{t.gallery.example}</div>

        <div className="flex items-center gap-1" aria-hidden="true">
          {item.palette.map((hex) => (
            <span
              key={hex}
              className="size-3.5 rounded"
              style={{
                background: hex,
                boxShadow: hex === "#FCFBF7" ? "inset 0 0 0 1px var(--color-edge-4)" : undefined,
              }}
            />
          ))}
          {rest > 0 && <span className="text-[11px] text-sand ml-0.5">{t.gallery.more(rest)}</span>}
        </div>
      </div>

      <div className="flex gap-1.5 px-1 pb-1 flex-wrap items-center">
        <span className="text-[11.5px] font-extrabold bg-linen rounded-full px-2.5 py-1 text-cocoa">
          {t.gallery.stitches(item.width, item.height)}
        </span>
        <span className="text-[11.5px] font-extrabold bg-linen rounded-full px-2.5 py-1 text-cocoa">
          {t.gallery.colors(item.colors)}
        </span>
        <Link
          to="/convert"
          className="text-[11.5px] font-extrabold text-coral-deep bg-coral-wash rounded-full px-2.5 py-1 hover:bg-coral hover:text-blanc transition-colors"
        >
          {t.gallery.getPattern}
        </Link>
      </div>
    </article>
  )
}

export default function Gallery() {
  const { t } = useI18n()
  const [filter, setFilter] = useState<GalleryCategory | "all">("all")
  const [shown, setShown] = useState(PAGE)

  const filters: { key: GalleryCategory | "all"; label: string }[] = [
    { key: "all", label: t.gallery.filters.all },
    { key: "pets", label: t.gallery.filters.pets },
    { key: "portraits", label: t.gallery.filters.portraits },
    { key: "flowers", label: t.gallery.filters.flowers },
    { key: "landscapes", label: t.gallery.filters.landscapes },
    { key: "little", label: t.gallery.filters.little },
  ]

  const matching = useMemo(
    () =>
      filter === "all"
        ? gallerySamples
        : gallerySamples.filter((g) => g.categories.includes(filter)),
    [filter],
  )

  const visible = matching.slice(0, shown)

  const pick = (key: GalleryCategory | "all") => {
    setFilter(key)
    setShown(PAGE)
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-20">
      {/* ---------------- header ---------------- */}
      <header className="text-center pt-12 lg:pt-13 pb-2.5">
        <div className="font-hand text-[17px] text-quill">{t.gallery.kicker}</div>
        <h1 className="text-[34px] sm:text-[40px] lg:text-[44px] mt-1.5 mb-3 tracking-[-.5px]">
          {t.gallery.title}
        </h1>
        <p className="text-[17px] leading-[1.6] text-clay mx-auto max-w-[560px] m-0">
          {t.gallery.lead}
        </p>
        <p className="font-hand text-[15px] text-sand mt-4 mb-0">{t.gallery.sampleNote}</p>
      </header>

      {/* ---------------- filters ---------------- */}
      <div className="flex justify-center gap-2 pt-6 pb-2 flex-wrap">
        {filters.map((f) => (
          <Pill key={f.key} selected={filter === f.key} onClick={() => pick(f.key)}>
            {f.label}
          </Pill>
        ))}
      </div>

      {/* ---------------- grid ---------------- */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-7 pb-7">
        {visible.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}

        {matching.length === 0 && (
          <p className="sm:col-span-2 lg:col-span-3 text-center text-cocoa py-10 m-0">
            {t.gallery.empty}
          </p>
        )}

        {/* the invitation sits inside the grid, not above it */}
        <div className="aida [--aida-size:14px] [--aida-ink:.06] bg-[#F7F1E5] border-[2.5px] border-dashed border-coral-dash rounded-[20px] flex flex-col items-center justify-center gap-3 p-6 text-center min-h-[300px]">
          <BrandMark size={72} />
          <h2 className="text-[21px] m-0">{t.gallery.shareTitle}</h2>
          <p className="text-[14.5px] leading-[1.55] text-cocoa max-w-[240px] m-0">
            {t.gallery.shareBody}
          </p>
          <Button size="sm" disabled title={t.gallery.soon}>
            {t.gallery.shareCta}
          </Button>
          <div className="font-hand text-[13.5px] text-sand">{t.gallery.soon}</div>
        </div>
      </div>

      {/* ---------------- show more ---------------- */}
      {shown < matching.length && (
        <div className="text-center pb-14">
          <Button variant="secondary" onClick={() => setShown((n) => n + PAGE)}>
            {t.gallery.showMore}
          </Button>
        </div>
      )}
      {shown >= matching.length && <div className="pb-14" />}
    </div>
  )
}
