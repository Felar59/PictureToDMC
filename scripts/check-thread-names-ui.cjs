// Les noms de fils s'affichent-ils en francais, et l'anglais reste-t-il intact ?
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

  const open = async (path, lang) => {
    const context = await (browser.createBrowserContext?.() ?? browser.createIncognitoBrowserContext())
    const page = await context.newPage()
    await page.setViewport({ width: 1280, height: 1000 })
    await page.evaluateOnNewDocument((l) => {
      Object.defineProperty(navigator, "language", { get: () => l })
      Object.defineProperty(navigator, "languages", { get: () => [l] })
    }, lang)
    await page.setCookie({ name: "ptd_session", value: "tok-member", domain: "127.0.0.1", path: "/", httpOnly: true })
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle0" })
    await new Promise((r) => setTimeout(r, 900))
    return { page, context }
  }

  // 310 « Black » et 3799 « Pewter Gray - Very Dark » : un nom simple et un nom
  // compose, donc les deux chemins de la table.
  const { page: pub, context: c0 } = await open("/galerie", "fr-FR")
  const cells = Buffer.from([1, 2, 2, 1]).toString("base64")
  const posted = await pub.evaluate(async (b64) => {
    const r = await fetch("/api/posts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: "Deux fils", category: "other", width: 2, height: 2,
        cells: b64, threadCodes: ["310", "3799"],
      }),
    })
    return { status: r.status, json: await r.json().catch(() => null) }
  }, cells)
  check("piece de test publiee", posted.status === 201, JSON.stringify(posted.json))
  await c0.close()
  const id = posted.json?.id
  if (!id) {
    await browser.close()
    process.exit(2)
  }

  // ---- en francais ---------------------------------------------------------
  const { page: fr, context: c1 } = await open(`/piece/${id}`, "fr-FR")
  const frText = await fr.evaluate(() => document.body.innerText)
  check("« Noir » remplace « Black »", /Noir/.test(frText) && !/\bBlack\b/.test(frText), (frText.match(/Noir|Black/g) || []).join(" "))
  check(
    "« Gris étain très foncé » remplace « Pewter Gray - Very Dark »",
    /Gris étain très foncé/.test(frText) && !/Pewter/.test(frText),
    (frText.match(/Gris étain[^\n]*|Pewter[^\n]*/g) || []).join(" | "),
  )
  await c1.close()

  // ---- en anglais, rien ne change -----------------------------------------
  const { page: en, context: c2 } = await open(`/piece/${id}`, "en-US")
  const enText = await en.evaluate(() => document.body.innerText)
  check(
    "l'anglais garde les noms d'origine",
    /Pewter Gray - Very Dark/.test(enText) && /Black/.test(enText) && !/Gris étain/.test(enText),
    (enText.match(/Pewter[^\n]*/g) || []).join(" "),
  )
  await c2.close()

  // ---- la legende de la grille telechargee --------------------------------
  const { page: chart, context: c3 } = await open(`/piece/${id}`, "fr-FR")
  await chart.evaluate(() => {
    ;[...document.querySelectorAll("button")].find((b) => /Avoir la grille/.test(b.textContent))?.click()
  })
  await new Promise((r) => setTimeout(r, 1200))
  const inDialog = await chart.evaluate(() => document.querySelector(".dialog, [role=dialog]")?.innerText || document.body.innerText)
  check("la fiche de la grille parle francais", /Gris étain très foncé/.test(inDialog), (inDialog.match(/Gris étain[^\n]*|Pewter[^\n]*/g) || []).join(" | "))
  await c3.close()

  await browser.close()
  const bad = results.filter((r) => !r).length
  console.log(bad ? `\n${bad} echec(s)` : `\nTout passe. (${results.length} controles)`)
  process.exit(bad ? 1 : 0)
})()
