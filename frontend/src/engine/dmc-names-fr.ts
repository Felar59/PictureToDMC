/**
 * Les noms de fils en français.
 *
 * La charte DMC ne donne que l'anglais — « Pewter Gray - Very Dark » — parce que
 * c'est ce que contient le tableur, et l'interface les affichait tels quels à un
 * public francophone. Ce sont les seuls mots du site qui n'étaient pas traduits, et
 * ils sont partout : dans la liste des fils, dans la fiche d'un fil, sous une pièce
 * publiée, et dans la légende de la grille qu'on imprime.
 *
 * **Le numéro reste l'identifiant.** Ces noms sont des descriptions — c'est le 3799
 * qu'on achète, pas le « gris étain ». La légende de la grille imprime donc toujours
 * le numéro en premier et en gras, et la fiche d'un fil montre le nom anglais sous le
 * nom français : c'est celui qu'on retrouvera sur une carte de nuances ou dans un
 * catalogue de boutique.
 *
 * Ce sont des traductions idiomatiques, pas le catalogue français officiel de DMC —
 * lequel n'est pas dans ce dépôt. Là où le français a un usage établi en mercerie il
 * a été suivi : « bleu layette » plutôt que « bleu bébé », « vieux rose » plutôt que
 * « rose poussiéreux », « bleu bleuet », « gris étain », « terre cuite ».
 *
 * ## Comment un nom est construit
 *
 * 589 fils, mais seulement 143 expressions et 15 nuances : « Peacock Blue - Very
 * Dark » est une base et un degré de clarté. On traduit donc les deux séparément et
 * on recompose, ce qui tient dans 4 kB au lieu de 589 chaînes — et ce qui garantit
 * que « très foncé » est écrit pareil dans les 49 fils qui le portent.
 *
 * Les nuances restent au masculin singulier, invariables : en français un adjectif de
 * couleur qualifié par un autre adjectif ne s'accorde pas (« des yeux bleu clair »).
 * Il n'y a donc pas d'accord à gérer, et « Rose clair » est correct.
 */

/** Les degrés de clarté, du plus clair au plus foncé. */
const SHADES: Record<string, string> = {
  "Ultra Very Light": "ultra très clair",
  "Ultra Light": "ultra clair",
  "Very Light": "très clair",
  "Light Medium": "clair moyen",
  Light: "clair",
  "Medium Light": "moyen clair",
  Medium: "moyen",
  "Medium Dark": "moyen foncé",
  Dark: "foncé",
  "Very Dark": "très foncé",
  "Ultra Dark": "ultra foncé",
  "Ultra Very Dark": "ultra très foncé",
  Pale: "pâle",
  Bright: "vif",
  Deep: "profond",
}

/**
 * Les expressions de base.
 *
 * `Pink` et `Rose` tombent tous deux sur « Rose », et c'est volontaire : le français
 * n'a qu'un mot là où l'anglais en a deux. Les inventer différents mentirait sur la
 * couleur, et c'est le numéro qui distingue les fils de toute façon.
 */
const BASES: Record<string, string> = {
  Alizarian: "Alizarine",
  "Antique Blue": "Bleu ancien",
  "Antique Mauve": "Mauve ancien",
  "Antique Violet": "Violet ancien",
  "Apple Blossom": "Fleur de pommier",
  "Apple Green": "Vert pomme",
  Apricot: "Abricot",
  Aquamarine: "Aigue-marine",
  "Ash Gray": "Gris cendre",
  "Autumn Gold": "Or d'automne",
  "Avocado Green": "Vert avocat",
  "Avocado Green - BLACK": "Vert avocat noir",
  "Baby Blue": "Bleu layette",
  "Baby Green": "Vert layette",
  "Baby Pink": "Rose layette",
  "Beaver Gray": "Gris castor",
  "Beige Brown": "Brun beige",
  "Beige Gray": "Gris beige",
  Black: "Noir",
  "Black Brown": "Brun noir",
  Blue: "Bleu",
  // L'anglais met la teinte dominante en dernier, le français en premier : « Blue
  // Green » est un vert, donc « Vert bleu » — et « Green Gray » un gris, donc
  // « Gris vert ». Les deux existent dans la charte et ne sont pas la même couleur.
  "Blue Green": "Vert bleu",
  "Blue Violet": "Violet bleu",
  Blueberry: "Myrtille",
  "Bright Green": "Vert vif",
  "Bright Turquoise": "Turquoise vif",
  Brown: "Brun",
  "Brown Gray": "Gris brun",
  "Burnt Orange": "Orange brûlé",
  Canary: "Canari",
  Carnation: "Œillet",
  "Celadon Green": "Vert céladon",
  Chartreuse: "Chartreuse",
  Cocoa: "Cacao",
  "Coffee Brown": "Brun café",
  Copper: "Cuivre",
  Coral: "Corail",
  "Coral Red": "Rouge corail",
  "Cornflower Blue": "Bleu bleuet",
  Cranberry: "Canneberge",
  Cream: "Crème",
  "Cyclamen Pink": "Rose cyclamen",
  "Delft Blue": "Bleu de Delft",
  "Desert Sand": "Sable du désert",
  "Drab Brown": "Brun terne",
  Driftwood: "Bois flotté",
  "Dusty Rose": "Vieux rose",
  "Ecru/off-white": "Écru",
  Eggplant: "Aubergine",
  "Electric Blue": "Bleu électrique",
  "Emerald Green": "Vert émeraude",
  "Fern Green": "Vert fougère",
  "Forest Green": "Vert forêt",
  "Forget-me-not Blue": "Bleu myosotis",
  Fuchsia: "Fuchsia",
  Garnet: "Grenat",
  Geranium: "Géranium",
  "Golden Brown": "Brun doré",
  "Golden Olive": "Olive doré",
  "Golden Yellow": "Jaune doré",
  Grape: "Raisin",
  "Grass Green": "Vert gazon",
  "Gray Green": "Vert gris",
  Green: "Vert",
  "Green Gray": "Gris vert",
  "Hazelnut Brown": "Brun noisette",
  "Hunter Green": "Vert chasseur",
  Jade: "Jade",
  // Une nuance nommée d'après un vert franc irlandais : le nom voyage, comme
  // Wedgwood ou Delft, plutôt que de devenir un « vert vif » qui existe déjà.
  "Kelly Green": "Vert Kelly",
  "Khaki Brown": "Brun kaki",
  "Khaki Green": "Vert kaki",
  Lavender: "Lavande",
  "Lavender Blue": "Bleu lavande",
  Lemon: "Citron",
  Lilac: "Lilas",
  "Lime Green": "Vert lime",
  Mahogany: "Acajou",
  Mauve: "Mauve",
  Melon: "Melon",
  "Metallic Pearl - Gold": "Perle métallisé or",
  "Metallic Pearl - Silver": "Perle métallisé argent",
  "Mocha Beige": "Beige moka",
  "Mocha Brown": "Brun moka",
  "Moss Green": "Vert mousse",
  Mustard: "Moutarde",
  "Nile Green": "Vert Nil",
  "Off White": "Blanc cassé",
  "Old Gold": "Vieil or",
  "Olive Green": "Vert olive",
  Orange: "Orange",
  "Orange Spice": "Orange épicé",
  "Orange-red": "Rouge orangé",
  "Parrot Green": "Vert perroquet",
  Peach: "Pêche",
  "Peacock Blue": "Bleu paon",
  "Pearl Gray": "Gris perle",
  "Petrol Blue": "Bleu pétrole",
  "Pewter Gray": "Gris étain",
  "Pine Green": "Vert pin",
  Pink: "Rose",
  "Pistachio Green": "Vert pistache",
  Plum: "Prune",
  Pumpkin: "Citrouille",
  Raspberry: "Framboise",
  Red: "Rouge",
  "Red Copper": "Cuivre rouge",
  Rose: "Rose",
  Rosewood: "Bois de rose",
  "Royal Blue": "Bleu roi",
  Salmon: "Saumon",
  Seagreen: "Vert d'eau",
  "Shell Gray": "Gris coquille",
  "Shell Pink": "Rose coquille",
  Shrimp: "Crevette",
  "Silver Gray": "Gris argent",
  "Sky Blue": "Bleu ciel",
  "Snow White": "Blanc neige",
  "Steel Gray": "Gris acier",
  Straw: "Paille",
  Tan: "Havane",
  Tangerine: "Mandarine",
  Tawny: "Fauve",
  "Teal Green": "Vert sarcelle",
  "Tender Green": "Vert tendre",
  "Terra Cotta": "Terre cuite",
  Tin: "Étain",
  Topaz: "Topaze",
  Turquoise: "Turquoise",
  Violet: "Violet",
  Wedgewood: "Bleu Wedgwood",
  White: "Blanc",
  "White Lavender": "Blanc lavande",
  "White Tin": "Blanc étain",
  "White Violet": "Blanc violet",
  // Le nom sous licence a sa forme française, et c'est celle que tout le monde
  // connaît ici.
  "Winnie The Pooh Gold": "Or Winnie l'Ourson",
  "Winnie The Pooh Gold 2": "Or Winnie l'Ourson 2",
  "Winter White": "Blanc d'hiver",
  Yellow: "Jaune",
  "Yellow - Light Pale": "Jaune pâle clair",
  "Yellow - Ultra Pale": "Jaune ultra pâle",
  "Yellow Beige": "Beige jaune",
  "Yellow Green": "Vert jaune",
  "Yellow Plum": "Prune jaune",
}

/**
 * Le nom français d'un fil, ou son nom d'origine si on ne sait pas le dire.
 *
 * Rendre l'anglais tel quel plutôt qu'un mot à moitié traduit : un nom inconnu
 * signifie que la charte a changé, et « Peacock inconnu » serait pire que « Peacock
 * Blue ». C'est aussi ce qui rend `scripts/check-thread-names.mjs` utile — il
 * échoue si un seul fil n'a pas de nom français, donc le cas ne devrait jamais se
 * produire en production.
 */
export function frenchThreadName(name: string): string {
  const direct = BASES[name]
  if (direct) return direct

  const cut = name.lastIndexOf(" - ")
  if (cut > 0) {
    const base = BASES[name.slice(0, cut)]
    const shade = SHADES[name.slice(cut + 3)]
    if (base && shade) return `${base} ${shade}`
  }
  return name
}

/** Le nom à afficher pour une langue donnée. */
export function threadName(name: string, lang: string): string {
  return lang === "fr" ? frenchThreadName(name) : name
}

/** Pour le contrôle : rien d'autre n'a besoin de lire les tables. */
export const __tables = { BASES, SHADES }
