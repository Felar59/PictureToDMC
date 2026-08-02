import type { Lang } from "@/i18n/dictionary"

export type GalleryCategory = "pets" | "portraits" | "flowers" | "landscapes" | "little"

export type GallerySample = {
  id: string
  title: Record<Lang, string>
  caption: Record<Lang, string>
  categories: GalleryCategory[]
  width: number
  height: number
  colors: number
  /** First five threads of the palette, for the card's palette strip. */
  palette: string[]
}

/**
 * Sample patterns, shown until sharing opens with accounts.
 *
 * Deliberately NOT presented as community submissions: no invented member
 * names and no invented like counts, since this ships on a live site. Swap
 * this array for the real feed once accounts exist — the card only needs
 * a title, a category, dimensions and a palette.
 */
export const gallerySamples: GallerySample[] = [
  {
    id: "milo",
    title: { fr: "Milo à la fenêtre", en: "Milo in the window" },
    caption: { fr: "chat tigré, au tambour", en: "tabby cat, in the hoop" },
    categories: ["pets"],
    width: 120,
    height: 120,
    colors: 14,
    palette: ["#E3B04B", "#B98A4E", "#6B5A48", "#F3ECDC", "#33261A"],
  },
  {
    id: "peonies",
    title: { fr: "Les pivoines de mamie", en: "Grandma's peonies" },
    caption: { fr: "pivoines roses", en: "pink peonies" },
    categories: ["flowers"],
    width: 90,
    height: 110,
    colors: 18,
    palette: ["#E0574B", "#F0938A", "#6FAE7C", "#4E8A5F", "#F3ECDC"],
  },
  {
    id: "lighthouse",
    title: { fr: "Phare breton", en: "Brittany lighthouse" },
    caption: { fr: "phare et mer agitée", en: "lighthouse and rough sea" },
    categories: ["landscapes"],
    width: 140,
    height: 100,
    colors: 12,
    palette: ["#7FB5C8", "#5E93A8", "#D9463F", "#FCFBF7", "#6B5A48"],
  },
  {
    id: "lea",
    title: { fr: "Léa, six mois", en: "Léa, six months" },
    caption: { fr: "portrait de bébé", en: "baby portrait" },
    categories: ["portraits", "little"],
    width: 100,
    height: 100,
    colors: 16,
    palette: ["#F0938A", "#E3B04B", "#A387C6", "#F3ECDC", "#6B5A48"],
  },
  {
    id: "max",
    title: { fr: "Max, le vieux copain", en: "Old friend Max" },
    caption: { fr: "golden retriever", en: "golden retriever" },
    categories: ["pets"],
    width: 130,
    height: 130,
    colors: 15,
    palette: ["#E3B04B", "#DA9A26", "#B98A4E", "#F3ECDC", "#4A3C2D"],
  },
  {
    id: "hydrangea",
    title: { fr: "Hortensias de juin", en: "June hydrangeas" },
    caption: { fr: "hortensias bleus", en: "blue hydrangeas" },
    categories: ["flowers"],
    width: 110,
    height: 110,
    colors: 13,
    palette: ["#7FB5C8", "#A387C6", "#6FAE7C", "#4E8A5F", "#F3ECDC"],
  },
]
