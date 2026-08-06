// Le contrat qu'une langue doit remplir.
//
// `import type`, et c'est tout l'intérêt : la déclaration est effacée à la
// compilation, donc `fr.ts` peut être typé d'après l'anglais sans que la copie
// anglaise se retrouve dans le paquet initial.
import type { en } from "./en"

/** Forme que toute langue doit satisfaire. Volontairement pas de `as const` sur
 *  `en` : les valeurs s'élargissent en `string`, donc une langue doit respecter le
 *  jeu de clés, pas les mots. */
export type Copy = typeof en

export type Lang = "fr" | "en"
