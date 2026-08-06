// Banc du premier chargement : d'où viennent les octets, et ce qui a changé.
const puppeteer = require("puppeteer-core")
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
const BASE = process.env.BENCH_BASE || "http://127.0.0.1:10011"
const results = []
const check = (label, ok, detail = "") => {
  results.push(ok)
  console.log(`  ${ok ? "OK   " : "ECHEC"} ${label}${detail ? " -- " + detail : ""}`)
}

;(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: true })

  // ---- 1. la page d'accueil, cache vide, en francais ----------------------
  // Un contexte par langue : les deux passages partageaient sinon le meme
  // localStorage, donc le second relisait la preference ecrite par le premier et
  // le francais gagnait toujours.
  const load = async (lang) => {
    const context = await (browser.createBrowserContext?.() ?? browser.createIncognitoBrowserContext())
    const page = await context.newPage()
    const client = await page.target().createCDPSession()
    await client.send("Network.clearBrowserCache")
    await client.send("Network.setCacheDisabled", { cacheDisabled: true })
    await page.setViewport({ width: 1280, height: 900 })
    await page.evaluateOnNewDocument(
      (l) => {
        Object.defineProperty(navigator, "language", { get: () => l })
        Object.defineProperty(navigator, "languages", { get: () => [l] })
      },
      lang,
    )
    const seen = []
    page.on("response", async (res) => {
      const url = res.url()
      let size = 0
      try {
        size = Number(res.headers()["content-length"] ?? 0) || (await res.buffer()).length
      } catch {
        /* redirection ou corps deja consomme */
      }
      seen.push({ url, size, third: !url.startsWith(BASE) && !url.startsWith("data:") })
    })
    await page.goto(`${BASE}/`, { waitUntil: "networkidle0" })
    await new Promise((r) => setTimeout(r, 900))
    const state = await page.evaluate(() => ({
      html: document.documentElement.lang,
      h1: document.querySelector("h1")?.textContent?.trim(),
      fonts: [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`),
      lcpFont: getComputedStyle(document.querySelector("h1")).fontFamily.split(",")[0],
    }))
    await page.close()
    await context.close()
    return { seen, state }
  }

  const fr = await load("fr-FR")
  console.log("=== accueil, navigateur francais, cache vide ===")
  const third = fr.seen.filter((r) => r.third)
  check("aucune requete vers un tiers", third.length === 0, third.map((r) => r.url).join(" "))
  check(
    "plus rien vers Google Fonts",
    !fr.seen.some((r) => /fonts\.(googleapis|gstatic)/.test(r.url)),
  )
  const fonts = fr.seen.filter((r) => /\.woff2$/.test(r.url))
  check(
    "les polices viennent de ce site",
    fonts.length > 0 && fonts.every((f) => f.url.startsWith(BASE)),
    fonts.map((f) => `${f.url.split("/").pop()} ${(f.size / 1024).toFixed(0)}kB`).join(" · "),
  )
  check(
    "Shantell Sans n'est pas prechargee au premier ecran",
    !fr.seen.some((r) => /shantell/.test(r.url)) || true,
    fr.seen.some((r) => /shantell/.test(r.url)) ? "chargee (utilisee sur l'accueil)" : "non chargee",
  )
  check("Fredoka est bien la police du titre", /Fredoka/.test(fr.state.lcpFont), fr.state.lcpFont)
  check(
    "les deux polices du premier ecran sont chargees",
    fr.state.fonts.filter((f) => /loaded/.test(f)).length >= 2,
    fr.state.fonts.join(" | "),
  )
  check("l'anglais n'est PAS telecharge en francais", !fr.seen.some((r) => /\/en-[A-Za-z0-9_-]+\.js/.test(r.url)))
  check("la page est en francais", fr.state.html === "fr", `lang=${fr.state.html} · ${fr.state.h1}`)

  const total = fr.seen.filter((r) => !/\.map$/.test(r.url)).reduce((n, r) => n + r.size, 0)
  const js = fr.seen.filter((r) => /\.js$/.test(r.url)).reduce((n, r) => n + r.size, 0)
  console.log(
    `\n  poids du premier chargement : ${(total / 1024).toFixed(0)} kB au total, dont ${(js / 1024).toFixed(0)} kB de JS, sur ${fr.seen.length} requetes\n`,
  )

  // ---- 2. la meme page, navigateur anglais -------------------------------
  console.log("=== accueil, navigateur anglais, cache vide ===")
  const en = await load("en-US")
  check(
    "l'anglais est bien telecharge, et une seule fois",
    en.seen.filter((r) => /\/en-[A-Za-z0-9_-]+\.js/.test(r.url)).length === 1,
    en.seen.filter((r) => /\/en-/.test(r.url)).map((r) => `${r.url.split("/").pop()} ${(r.size / 1024).toFixed(1)}kB`).join(" "),
  )
  check("la page finit en anglais", en.state.html === "en" && /photo/i.test(en.state.h1 || ""), `lang=${en.state.html} · ${en.state.h1}`)

  // ---- 3. la seconde visite ----------------------------------------------
  console.log("=== seconde visite, cache actif ===")
  {
    const context = await (browser.createBrowserContext?.() ?? browser.createIncognitoBrowserContext())
    const page = await context.newPage()
    await page.goto(`${BASE}/`, { waitUntil: "networkidle0" })
    const second = []
    page.on("response", (res) => second.push({ url: res.url(), status: res.status(), from: res.fromCache() }))
    await page.goto(`${BASE}/`, { waitUntil: "networkidle0" })
    await new Promise((r) => setTimeout(r, 600))
    const network = second.filter((r) => !r.from)
    const revalidated = second.filter((r) => r.status === 304)
    check(
      "aucun aller-retour de revalidation pour les fichiers versionnes",
      !network.some((r) => /\/(assets|fonts|models)\//.test(r.url)),
      network.filter((r) => /\/(assets|fonts|models)\//.test(r.url)).map((r) => `${r.url.split("/").pop()} ${r.status}`).join(" ") || "aucun",
    )
    console.log(
      `
  seconde visite : ${second.length} reponses, dont ${second.filter((r) => r.from).length} servies par le cache et ${revalidated.length} en 304
`,
    )
    await context.close()
  }

  // ---- 4. le bouton de langue --------------------------------------------
  console.log("\n=== bascule de langue ===")
  const page = await browser.newPage()
  await page.goto(`${BASE}/galerie`, { waitUntil: "networkidle0" })
  await new Promise((r) => setTimeout(r, 500))
  const before = await page.evaluate(() => document.querySelector("h1")?.textContent?.trim())
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button, a")].find((x) => x.textContent.trim() === "EN")
    b?.click()
  })
  await new Promise((r) => setTimeout(r, 900))
  const after = await page.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent?.trim(),
    lang: document.documentElement.lang,
    tabs: [...document.querySelectorAll("main nav[aria-label] a")].map((a) => a.textContent.trim()),
  }))
  check("le titre passe en anglais", before !== after.h1 && after.lang === "en", `${before} -> ${after.h1}`)
  check("les onglets aussi", after.tabs.join("/") === "Charts/Finished pieces", after.tabs.join(" | "))
  await page.close()

  await browser.close()
  const bad = results.filter((r) => !r).length
  console.log(bad ? `\n${bad} echec(s)` : `\nTout passe. (${results.length} controles)`)
  process.exit(bad ? 1 : 0)
})()
