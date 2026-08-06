// Banc navigateur des deux galeries. Edge en headless, sur le vrai serveur.
//
//   NODE_PATH=<emoji-art>/node_modules node ptd-e2e.cjs
//
// Local uniquement : il publie de vrais posts dans la base pointée par PTD_DB.
const puppeteer = require("puppeteer-core")

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
const BASE = process.env.BENCH_BASE || "http://127.0.0.1:10011"
const SHOTS = process.env.BENCH_SHOTS || "."
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const results = []
const check = (label, ok, detail = "") => {
  results.push({ label, ok })
  console.log(`  ${ok ? "OK   " : "ECHEC"} ${label}${detail ? " -- " + detail : ""}`)
}

// Un JPEG 2x2, en data URL : ce que le champ photo produirait.
const TINY_JPEG =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAACAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiiv//Z"

;(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 1000 })

  const as = async (token) => {
    await page.setCookie({ name: "ptd_session", value: token, domain: "127.0.0.1", path: "/", httpOnly: true })
  }
  const post = (body) =>
    page.evaluate(async (b) => {
      const r = await fetch("/api/posts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(b),
      })
      return { status: r.status, json: await r.json().catch(() => null) }
    }, body)

  await page.goto(`${BASE}/galerie`, { waitUntil: "networkidle0" })

  // ---- une seule entree « Galerie » dans la barre --------------------------
  const navLinks = await page.evaluate(() =>
    [...document.querySelectorAll("header nav a, header a")].map((a) => a.textContent.trim()).filter(Boolean),
  )
  const galleryEntries = navLinks.filter((l) => /galerie|gallery/i.test(l))
  check("une seule entree Galerie dans la barre", galleryEntries.length === 1, navLinks.join(" | "))

  // ---- les deux onglets ----------------------------------------------------
  const tabs = await page.evaluate(() =>
    [...document.querySelectorAll('main nav[aria-label] a')].map((a) => ({
      text: a.textContent.trim(),
      href: new URL(a.href).pathname,
      current: a.getAttribute("aria-current"),
    })),
  )
  check("deux onglets dans la page", tabs.length === 2, JSON.stringify(tabs))
  check("l'onglet des grilles est actif sur /galerie", tabs[0]?.current === "page", tabs[0]?.text)
  check("le second onglet pointe vers /galerie/broderies", tabs[1]?.href === "/galerie/broderies", tabs[1]?.href)

  // ---- publier les trois formes -------------------------------------------
  await as("tok-member")
  await page.goto(`${BASE}/galerie`, { waitUntil: "networkidle0" })
  const cells = Buffer.from([1, 2, 2, 1]).toString("base64")
  const grid = { title: "Chat en grille", category: "pets", width: 2, height: 2, cells, threadCodes: ["310", "3799"] }
  let r = await post(grid)
  // La galerie n'accepte que cinq publications par compte et par 24 h, et le
  // compteur est en base : deux passages du banc sur la meme base et le troisieme
  // post est refuse. On le DIT au lieu de laisser onze controles echouer trente
  // lignes plus loin sur un faux motif.
  if (r.status === 429) {
    console.error("  Publication refusee (429) : la limite de 5/jour est atteinte sur cette base.")
    console.error("  Vide les posts de la base de test, puis relance :")
    console.error("    PTD_DB=<base> python -c \"from PythonDCA.api import db; db.connect().execute('DELETE FROM posts')\"")
    await browser.close()
    process.exit(2)
  }
  check("grille seule publiee", r.status === 201, JSON.stringify(r.json))
  const idPattern = r.json?.id
  r = await post({ ...grid, title: "Chat grille et photo", photo: TINY_JPEG })
  check("grille avec photo publiee", r.status === 201)
  const idBoth = r.json?.id
  r = await post({ title: "Ma broderie a moi", category: "flowers", kind: "photo", photo: TINY_JPEG })
  check("photo seule publiee", r.status === 201, JSON.stringify(r.json))
  const idPhoto = r.json?.id

  // ---- chaque post dans la bonne galerie ----------------------------------
  const titlesOn = async (path) => {
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle0" })
    await page.waitForSelector("article h3, .grid p", { timeout: 8000 })
    await sleep(500)
    return page.evaluate(() => [...document.querySelectorAll("article h3")].map((h) => h.textContent.trim()))
  }
  const onPatterns = await titlesOn("/galerie")
  check(
    "/galerie ne montre que les grilles",
    onPatterns.includes("Chat en grille") && onPatterns.includes("Chat grille et photo") && !onPatterns.includes("Ma broderie a moi"),
    onPatterns.join(" | "),
  )
  await page.screenshot({ path: `${SHOTS}/ptd-galerie-grilles.png` })

  const onStitches = await titlesOn("/galerie/broderies")
  check(
    "/galerie/broderies ne montre que les photos",
    onStitches.includes("Ma broderie a moi") && !onStitches.includes("Chat en grille"),
    onStitches.join(" | "),
  )
  const activeTab = await page.evaluate(
    () => document.querySelector('main nav[aria-label] a[aria-current="page"]')?.textContent.trim(),
  )
  check("un chargement a froid ouvre le bon onglet", activeTab === "Les broderies", activeTab)
  const heading = await page.evaluate(() => document.querySelector("h1")?.textContent.trim())
  check("l'en-tete est celui des broderies", heading === "Les broderies", heading)
  const navLit = await page.evaluate(() =>
    [...document.querySelectorAll("header a")].some(
      (a) => a.textContent.trim() === "Galerie" && a.getAttribute("aria-current") === "page",
    ),
  )
  check("l'entree Galerie reste allumee sur l'onglet broderies", navLit)
  await page.screenshot({ path: `${SHOTS}/ptd-galerie-broderies.png` })

  // ---- la carte photo : ni palette ni dimensions --------------------------
  const card = await page.evaluate(() => {
    const art = [...document.querySelectorAll("article")].find((a) => /Ma broderie/.test(a.textContent))
    return {
      chips: [...art.querySelectorAll("span.rounded-full")].map((s) => s.textContent.trim()),
      link: art.querySelector('a[href^="/piece/"]:last-of-type')?.textContent.trim(),
      hasImg: Boolean(art.querySelector("img")),
      text: art.textContent,
    }
  })
  check("aucun « null × null » sur la carte photo", !/null/.test(card.text), card.chips.join(" | "))
  check("aucune mention de couleurs sur la carte photo", !/couleurs/.test(card.text), card.chips.join(" | "))
  check("la photo est affichee", card.hasImg)
  check("le lien dit « Voir cet ouvrage »", /Voir cet ouvrage/.test(card.text))

  // ---- la page d'un post photo -------------------------------------------
  await page.goto(`${BASE}/piece/${idPhoto}`, { waitUntil: "networkidle0" })
  await sleep(600)
  const piece = await page.evaluate(() => ({
    body: document.body.innerText,
    canvas: Boolean(document.querySelector("canvas")),
    h1: document.querySelector("h1")?.textContent.trim(),
    title: document.title,
    og: document.querySelector('meta[property="og:description"]')?.content,
  }))
  check("la page existe (pas de « n'est plus la »)", !/n'est plus l/.test(piece.body), piece.h1)
  check("le titre de la piece s'affiche", piece.h1 === "Ma broderie a moi", piece.h1)
  check("aucune grille dessinee", !piece.canvas)
  check("aucun bouton « Avoir la grille »", !/Avoir la grille/.test(piece.body))
  check("aucune liste de fils", !/Les fils de cet ouvrage/.test(piece.body))
  check("l'absence de grille est expliquee", /Pas de grille avec celui-ci/.test(piece.body))
  check("le head parle de broderie, pas de points", /brod/i.test(piece.title) && !/null/.test(piece.og || ""), `${piece.title} :: ${(piece.og || "").slice(0, 60)}`)
  await page.screenshot({ path: `${SHOTS}/ptd-piece-photo.png`, fullPage: true })

  // ---- la page d'une grille, inchangee -----------------------------------
  await page.goto(`${BASE}/piece/${idPattern}`, { waitUntil: "networkidle0" })
  await sleep(600)
  const patternPage = await page.evaluate(() => ({
    canvas: Boolean(document.querySelector("canvas")),
    body: document.body.innerText,
    title: document.title,
  }))
  check("une grille dessine toujours sa grille", patternPage.canvas)
  check("elle garde « Avoir la grille »", /Avoir la grille/.test(patternPage.body))
  check("elle garde ses fils", /Les fils de cet ouvrage/.test(patternPage.body))
  check("son head parle de grille", /grille/i.test(patternPage.title), patternPage.title)

  // ---- signalement, depuis un autre compte -------------------------------
  await as("tok-other")
  await page.goto(`${BASE}/piece/${idPhoto}`, { waitUntil: "networkidle0" })
  await sleep(600)
  const clicked = await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => x.textContent.trim() === "Signaler")
    if (!b) return false
    b.click()
    return true
  })
  check("un membre voit Signaler sur l'ouvrage d'un autre", clicked)
  if (clicked) {
    await page.waitForSelector("#report-note", { timeout: 5000 })
    await page.evaluate(() => {
      const p = [...document.querySelectorAll("button")].find((x) => /Pas pour tout le monde/.test(x.textContent))
      p?.click()
      const el = document.querySelector("#report-note")
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set.call(el, "photo hors sujet")
      el.dispatchEvent(new Event("input", { bubbles: true }))
    })
    await page.screenshot({ path: `${SHOTS}/ptd-signalement.png` })
    await page.evaluate(() =>
      [...document.querySelectorAll("button")].find((x) => /Envoyer le signalement/.test(x.textContent))?.click(),
    )
    await sleep(700)
    const sent = await page.evaluate(() => document.body.innerText)
    check("le signalement est confirme a l'ecran", /Merci de nous l'avoir dit/.test(sent))
  }

  await as("tok-member")
  await page.goto(`${BASE}/piece/${idPhoto}`, { waitUntil: "networkidle0" })
  await sleep(600)
  const own = await page.evaluate(() => document.body.innerText)
  check("l'auteur ne voit pas Signaler sur son propre ouvrage", !/Signaler/.test(own))
  check("l'auteur voit Supprimer", /Supprimer cet ouvrage/.test(own))

  // ---- la file, cote admin -----------------------------------------------
  await as("tok-admin")
  await page.goto(`${BASE}/compte`, { waitUntil: "networkidle0" })
  await sleep(500)
  const adminLink = await page.evaluate(() =>
    [...document.querySelectorAll("a")].some((a) => /Ouvrages signal/.test(a.textContent)),
  )
  check("le compte admin propose la file", adminLink)

  await page.goto(`${BASE}/signalements`, { waitUntil: "networkidle0" })
  await sleep(600)
  const queue = await page.evaluate(() => ({
    body: document.body.innerText,
    rows: document.querySelectorAll("li").length,
    robots: document.querySelector('meta[name="robots"]')?.content,
  }))
  check("la file liste le signalement", /Ma broderie a moi/.test(queue.body) && queue.rows >= 1, `${queue.rows} ligne(s)`)
  check("elle dit qui a signale", /Passante/.test(queue.body), queue.body.split("\n").join(" ").slice(0, 150))
  check("le motif et la note sont visibles", /explicit/.test(queue.body) && /hors sujet/.test(queue.body))
  check("la page est en noindex", /noindex/.test(queue.robots || ""), queue.robots)
  await page.screenshot({ path: `${SHOTS}/ptd-file-admin.png`, fullPage: true })

  await page.evaluate(() =>
    [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Classer")?.click(),
  )
  await sleep(700)
  const cleared = await page.evaluate(() => document.body.innerText)
  check("classer vide la file", /Rien de signal/.test(cleared))

  // ---- la file est invisible pour un membre ------------------------------
  await as("tok-member")
  await page.goto(`${BASE}/signalements`, { waitUntil: "networkidle0" })
  await sleep(600)
  const asMember = await page.evaluate(() => document.body.innerText)
  check("un membre ne voit pas la file", /réserv/i.test(asMember), asMember.replace(/\n/g, " ").slice(-170))

  // ---- mobile : toujours une seule entree --------------------------------
  await page.setViewport({ width: 390, height: 844 })
  await page.goto(`${BASE}/galerie`, { waitUntil: "networkidle0" })
  await sleep(400)
  await page.evaluate(() =>
    [...document.querySelectorAll("button")].find((b) => /menu/i.test(b.getAttribute("aria-label") || b.textContent))?.click(),
  )
  await sleep(400)
  const mobile = await page.evaluate(() =>
    [...document.querySelectorAll("a")]
      .filter((a) => a.offsetParent !== null)
      .map((a) => a.textContent.trim())
      .filter((l) => /^Galerie$/.test(l)),
  )
  check("sur telephone aussi : une seule entree Galerie visible", mobile.length === 1, mobile.join(" | "))
  await page.screenshot({ path: `${SHOTS}/ptd-mobile.png` })

  // ---- la carte de partage d'un post photo -------------------------------
  const shareStatus = await page.evaluate(async (id) => {
    const r = await fetch(`/api/posts/${id}/share.png`)
    return { status: r.status, type: r.headers.get("content-type"), bytes: (await r.blob()).size }
  }, idPhoto)
  check("share.png repond pour un post photo", shareStatus.status === 200 && shareStatus.bytes > 0, JSON.stringify(shareStatus))
  const shareBoth = await page.evaluate(async (id) => {
    const r = await fetch(`/api/posts/${id}/share.png`)
    return { status: r.status, bytes: (await r.blob()).size }
  }, idBoth)
  check("share.png dessine toujours la grille quand il y en a une", shareBoth.status === 200 && shareBoth.bytes > 4000, JSON.stringify(shareBoth))

  await browser.close()
  const bad = results.filter((r) => !r.ok)
  console.log(bad.length ? `\n${bad.length} echec(s)` : `\nTout passe. (${results.length} controles)`)
  process.exit(bad.length ? 1 : 0)
})().catch((e) => {
  console.error("banc interrompu :", e.message)
  process.exit(2)
})
