import { useEffect } from "react"
import { useLocation } from "react-router-dom"

import { useI18n } from "@/i18n"

import { ORIGIN, SITE_NAME, absolute } from "./site"

/**
 * The document head, per route.
 *
 * A single-page app serves one `index.html` to every URL, so until now every route
 * had the same title and the same description — which is the same as having none:
 * a crawler, a search result, a shared link and a browser tab all showed "Picture to
 * DMC — vos photos en grilles de point de croix" whether you were on the gallery, a
 * published piece or the converter.
 *
 * Written by hand rather than with react-helmet or an equivalent. It is forty lines
 * of `document.head` for something a dependency would also have to be kept current,
 * audited and bundled for — and the awkward part of those libraries (server-side
 * rendering) is not a thing this app does.
 *
 * One caveat worth being honest about: this runs after the JavaScript does. Google
 * executes JS and will see it; a plain `curl`, and some social scrapers, will see
 * `index.html`'s defaults. That is why index.html keeps a sensible default set — the
 * per-route tags are an improvement on it, not a replacement for it.
 */

type Meta = {
  title: string
  description: string
  /** Overrides the route's own path, for a canonical that differs. */
  canonicalPath?: string
  /** Absolute or root-relative; defaults to the site's share image. */
  image?: string
  /** `website` for a page, `article` for a piece. */
  type?: "website" | "article"
  /**
   * What the share image shows, for someone who cannot see it.
   *
   * Not decoration: a link posted into a group chat is read aloud by a screen
   * reader from this string alone, and "image" is what it says without one.
   */
  imageAlt?: string
  /** ISO 8601. Only meaningful on an article, and cleared when the type is not. */
  publishedTime?: string
  /** Absolute URL of the person who made it. Articles only, same as above. */
  authorUrl?: string
  /** Structured data, already an object. Serialised into one script tag. */
  jsonLd?: object
  /** Keep a page out of the index — a member's account, for instance. */
  noindex?: boolean
}

const MANAGED = "data-head"

/**
 * Find the tag, or adopt the static one, or make it — in that order.
 *
 * The adoption step is the one that matters. index.html carries a default title,
 * description, canonical and og:* set, because a scraper that does not run JavaScript
 * has to be told something. Looking only for `[data-head]` meant this appended a
 * *second* canonical and a *second* description alongside those, so every page had
 * two of each and whichever a reader took first was the home page's — which is worse
 * than having had no per-route tags at all, since duplicate canonicals are a signal
 * in their own right.
 *
 * So an unmanaged match is claimed and rewritten in place, and after the first route
 * every tag on the page is one this owns.
 */
function upsert(selector: string, make: () => HTMLElement, apply: (el: HTMLElement) => void) {
  let el =
    document.head.querySelector<HTMLElement>(`${selector}[${MANAGED}]`) ??
    document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = make()
    document.head.appendChild(el)
  }
  el.setAttribute(MANAGED, "")
  apply(el)
}

function meta(attr: "name" | "property", key: string, content: string) {
  upsert(`meta[${attr}="${key}"]`, () => {
    const el = document.createElement("meta")
    el.setAttribute(attr, key)
    return el
  }, (el) => el.setAttribute("content", content))
}

export function useHead(m: Meta): void {
  const { pathname } = useLocation()
  // og:locale has to follow the toggle, so the language is part of what this
  // effect depends on — otherwise switching to English leaves the head claiming
  // fr_FR on every page until a navigation happens to rewrite it.
  const { lang } = useI18n()
  // Serialised so a caller can build the object inline without memoising it: these
  // are small, and a fresh object every render would otherwise rewrite the head on
  // every render.
  const key = JSON.stringify([m, pathname, lang])

  useEffect(() => {
    const canonical = absolute(m.canonicalPath ?? pathname)
    const image = m.image
      ? m.image.startsWith("http")
        ? m.image
        : `${ORIGIN}${m.image}`
      : `${ORIGIN}/og.png`

    document.title = m.title

    meta("name", "description", m.description)
    upsert(`link[rel="canonical"]`, () => {
      const el = document.createElement("link")
      el.setAttribute("rel", "canonical")
      return el
    }, (el) => el.setAttribute("href", canonical))

    meta("property", "og:title", m.title)
    meta("property", "og:description", m.description)
    meta("property", "og:url", canonical)
    meta("property", "og:type", m.type ?? "website")
    meta("property", "og:site_name", SITE_NAME)
    meta("property", "og:image", image)
    /**
     * The size of that image, stated rather than discovered.
     *
     * Every share image this site produces is 1200×630 — `og.png` and every card
     * `api/sharecard.py` draws — so this is a fact, not a hint. Facebook, LinkedIn
     * and WhatsApp lay the preview out before the image has finished downloading,
     * and without these they either guess small or reflow once it lands.
     */
    meta("property", "og:image:width", "1200")
    meta("property", "og:image:height", "630")
    meta("property", "og:image:alt", m.imageAlt ?? m.title)
    meta("property", "og:locale", lang === "fr" ? "fr_FR" : "en_GB")
    // Twitter reads og:* for most things but wants to be told the card is large.
    meta("name", "twitter:card", "summary_large_image")
    meta("name", "twitter:title", m.title)
    meta("name", "twitter:description", m.description)
    meta("name", "twitter:image", image)
    meta("name", "twitter:image:alt", m.imageAlt ?? m.title)

    /**
     * Article facts, and their removal.
     *
     * The removal is the part that matters. These are written on a piece's page and
     * would otherwise sit there through a client-side navigation to the FAQ, which
     * would then be published as an article written by whoever made the last chart
     * you looked at. Every other tag here is overwritten on the next route; these
     * are the only ones that have to be taken away.
     */
    const article = (m.type ?? "website") === "article"
    for (const [key, value] of [
      ["article:published_time", m.publishedTime],
      ["article:author", m.authorUrl],
    ] as const) {
      if (article && value) meta("property", key, value)
      else document.head.querySelector(`meta[property="${key}"]`)?.remove()
    }

    meta("name", "robots", m.noindex ? "noindex, follow" : "index, follow")

    // One script tag, replaced wholesale — appending would stack a page's worth of
    // stale graphs behind the current one as someone navigates.
    const existing = document.head.querySelector(`script[type="application/ld+json"][${MANAGED}]`)
    existing?.remove()
    if (m.jsonLd) {
      const script = document.createElement("script")
      script.type = "application/ld+json"
      script.setAttribute(MANAGED, "")
      script.textContent = JSON.stringify(m.jsonLd)
      document.head.appendChild(script)
    }
    // Nothing is torn down on unmount: the next route writes over every tag, and
    // removing them first would leave a frame with no description at all.
  }, [key, m, pathname, lang])
}
