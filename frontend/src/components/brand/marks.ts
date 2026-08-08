/**
 * The marks a member can choose instead of the one drawn from their account.
 *
 * Each is a photograph put through the same idea the site sells: reduced to 56
 * squares and quantised to real DMC threads, so an avatar here is something
 * somebody could actually stitch. That is what makes them read as sewing rather
 * than as low-resolution photographs — the giveaway is not the size, it is that
 * the colours snap to a palette of threads that exist. Roughly 2 kB each,
 * against 2 MB for the originals.
 *
 * The slugs are the photographers' names, which makes them stable and unique and
 * quietly credits the source. They are *not* shown to anyone: the marks are
 * grouped by subject and picked by eye, because at 56 squares I can tell a flower
 * from an animal but not a peony from an aster, and a label that names the wrong
 * flower is worse than no label at all.
 *
 * Three of the twenty supplied are missing on purpose. They came back as mud at
 * this size — no readable subject, whatever the thread count — and a mark that
 * looks like nothing is not a choice worth offering.
 */

export const MARK_GROUPS = {
  flowers: [
    "mikegz",
    "wyxina",
    "reinis",
    "marta",
    "tarikulraana",
    "badesaba",
    "berlinerlights",
    "cacito",
    "di",
    "cafer",
  ],
  animals: [
    "lucas",
    "paulo",
    "rumeysasurucu",
    "vinnyanugraha",
    "adrijana",
    "ellie",
    "ponvintage",
  ],
} as const

export type MarkGroup = keyof typeof MARK_GROUPS

/** Every slug, flattened — what the server validates against. */
export const MARK_SLUGS: readonly string[] = [
  ...MARK_GROUPS.flowers,
  ...MARK_GROUPS.animals,
]

/**
 * How a chosen mark is stored in `users.icon`.
 *
 * Prefixed rather than bare, because that column already holds a free string that
 * seeds the *drawn* mark. Without a prefix a member called their mark "lucas" and
 * a photograph appeared; with one, the two kinds of value cannot be confused, and
 * anything unrecognised falls back to the drawn mark rather than to a broken
 * image.
 */
export const MARK_PREFIX = "m:"

export function markSrc(slug: string): string {
  return `/marks/${slug}.png`
}

/** The slug inside an icon value, or null if this is not a picture mark. */
export function markSlug(icon: string | null | undefined): string | null {
  if (!icon || !icon.startsWith(MARK_PREFIX)) return null
  const slug = icon.slice(MARK_PREFIX.length)
  return MARK_SLUGS.includes(slug) ? slug : null
}
