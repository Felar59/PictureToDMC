// Bilingual copy. `en` is the source of truth for the key set; `fr` is
// typed against it so a missing or misspelled key fails the build.
//
// Interpolated strings are functions rather than "{n}" placeholders — the
// types then guarantee every call site passes the right arguments.

export const en = {
  lang: { label: "Language", fr: "Français", en: "English", switchTo: "Passer en français" },

  nav: {
    howItWorks: "How it works",
    gallery: "Gallery",
    faq: "FAQ",
    convert: "Convert a photo",
    start: "Start a pattern",
    menu: "Menu",
  },

  home: {
    badge: "100% free · no account needed",
    heroTitleBefore: "Turn any photo into a ",
    heroTitleAccent: "cross-stitch",
    heroTitleAfter: " pattern",
    heroLead:
      "Upload a picture and we'll match every stitch to a real DMC thread color — then hand you a chart that's ready to hoop.",
    ctaUpload: "Upload a photo",
    ctaSample: "See a sample pattern",
    heroNote: "from photo to chart in about a minute ↷",
    demoPhoto: "your photo",
    demoPattern: "your pattern",
    demoPhotoPlaceholder: "drop a photo — pet, portrait, flowers…",
    demoMatched: (n: number) => `matched to ${n} DMC threads`,

    stepsKicker: "as easy as one, two, three (and four)",
    stepsTitle: "How it works",
    steps: [
      {
        title: "Upload a photo",
        body: "Any JPG or PNG — pets and portraits work beautifully.",
      },
      {
        title: "Adjust the pattern",
        body: "Choose the width in stitches and how many thread colors. Swap any thread you don't like.",
      },
      {
        title: "Download your chart",
        body: "A printable chart with the grid, the legend and the exact DMC threads to buy.",
      },
      {
        title: "Stitch & enjoy",
        body: "Pop it in a hoop and get comfy. The fun part is yours.",
      },
    ],

    features: [
      {
        title: "Swap any thread",
        body: "Don't like a matched color? Tap it and pick from the 589 official DMC shades.",
      },
      {
        title: "Use your own threads",
        body: "Already have a thread box? Give us your DMC codes and we'll only use those.",
      },
      {
        title: "See every color",
        body: "Hover a thread in the list and every stitch in that color lights up on the pattern.",
      },
    ],

    faqKicker: "the things people ask first",
    faqTitle: "Good to know",
    faq: [
      {
        q: "Is it really free?",
        a: "Yes — every pattern, every download, no account and no watermark. There's nothing to buy here.",
      },
      {
        q: "What happens to my photo?",
        a: "It's sent to our server, converted, and held in memory only while you're working on it. It is never written to disk and never shared.",
      },
      {
        q: "How many thread colors should I pick?",
        a: "Between 8 and 15 suits most photos. Fewer reads bolder and stitches faster; more keeps the detail but means more thread changes.",
      },
      {
        q: "Which files can I upload?",
        a: "JPG and PNG. Transparent PNGs work too — the transparent parts are simply left unstitched.",
      },
    ],

    ctaKicker: "ready when you are",
    ctaTitle: "Start your first pattern",
    ctaButton: "Upload a photo — it's free",
  },

  account: {
    signIn: "Sign in with Google",
    signInShort: "Sign in",
    signOut: "Sign out",
    myPieces: "My pieces",
    rename: "Change my name",
    renameLabel: "Your name in the gallery",
    renameHint: "Starts as your Google name. Change it to whatever you like.",
    panel: "My account",
    welcomeTitle: "Welcome — pick a name",
    welcomeLead:
      "This is the name on your pieces and your comments. Your Google name is filled in; change it if you'd rather not use it.",
    bioLabel: "A few words about you",
    bioHint: "Optional. It shows on your page.",
    bioPlaceholder: "What you stitch, how long you've been at it…",
    iconLabel: "Your mark",
    iconSoon: "For now it's drawn from your account. Marks to choose from are coming.",
    saveFailed: "That wasn't saved. Try again.",
    saving: "Saving…",
    saved: "saved",
    publicPage: "See my page",
    signInFirst: "Sign in to see your account.",
    save: "Save",
    cancel: "Cancel",
    signedInAs: "Signed in as",
    failed: "Sign-in didn't go through. Try again.",
    failedState: "That sign-in link had expired. Try again.",
    failedBanned: "This account has been suspended.",
    whySignIn: "Signing in is only needed to share a piece — converting is free and anonymous.",
    /** The badge's tooltip, and the pill's accessible name. No pronoun in it: the
     *  same badge is worn by whoever holds the role. */
    adminBadge: "Looks after the gallery",
    /** The word in the pill. Uppercased by the style. */
    adminLabel: "Admin",
    /** A name off the reserved list. "Try again" would be the wrong advice — the
     *  same name fails the same way — so it says what to do instead. */
    nameReserved: "That name is kept for the people who run the site. Pick another one!",
  },

  publish: {
    open: "Share this piece",
    title: "Share your piece",
    lead: "It goes in the gallery with your name on it. You can delete it whenever you like.",
    nameLabel: "Give it a title",
    namePlaceholder: "Milo in the window",
    categoryLabel: "Category",
    photoLabel: "Photo of the finished piece",
    photoHint: "Optional, and the nicest part — a snap of it in the hoop.",
    photoPick: "Choose a photo",
    photoChange: "Choose another",
    photoRemove: "Remove",
    patternPreview: "Your pattern",
    submit: "Publish",
    working: "Publishing…",
    needSignIn: "Sign in to share a piece",
    done: "Published — thank you!",
    failed: "It didn't publish. Try again.",
    tooBig: "That photo is too heavy, even after shrinking. Try a smaller one.",
    /** Not an error — there is simply no room until one of today's falls out of
     *  the window, so it says when rather than leaving you to guess. */
    dailyLimit: (limit: number, minutes: number) =>
      minutes < 90
        ? `${limit} pieces in a day is the most the gallery takes. There'll be room again in ${minutes} min.`
        : `${limit} pieces in a day is the most the gallery takes — nicely done! There'll be room again in about ${Math.round(minutes / 60)} h.`,
  },

  piece: {
    backToGallery: "Back to the gallery",
    notFound: "That piece isn't here any more.",
    patternNote: "redrawn from the maker's own grid",
    threads: {
      // Not "threads to buy": that frame belongs in the download dialog. This
      // section answers what the piece is made of.
      heading: "The threads in this piece",
      order: "most-used thread first",
    },
    photoAlt: (title: string) => `${title}, stitched`,
    patternAlt: (title: string) => `The grid for ${title}`,
    getChart: "Get the chart",
    seeStitched: "See it stitched",
    remove: "Delete this piece",
    removeConfirm: "Delete this piece for good? The chart and the comments go with it.",
    removeConfirmOther:
      "This piece isn't yours. Delete it for good anyway? You can, because you're an admin — the chart and the comments go with it.",
    removing: "Deleting…",
    removeFailed: "It wasn't deleted. Try again.",
    // Grouped: a four-figure count is common, and the rest of the app writes
    // "1,240" rather than "1240".
    stitches: (n: number) => `${n.toLocaleString("en")} st`,
  },

  profile: {
    notFound: "No such member.",
    joined: (when: string) => `Here since ${when}`,
    pieces: (n: number) => (n === 1 ? "1 piece" : `${n} pieces`),
    likes: (n: number) => (n === 1 ? "1 heart" : `${n} hearts`),
    emptyMine: "You haven't shared anything yet.",
    emptyTheirs: (who: string) => `${who} hasn't shared anything yet.`,
  },

  showcase: {
    kicker: "once it's on cloth",
    title: "Now, where will it live?",
    lead: "The same motif on the things stitchers most often make. Just for inspiration — one chart works for all of them.",
    products: [
      {
        name: "Embroidery hoop",
        tip: "The classic — stitch it, keep it in the hoop, hang it up.",
        fabric: "14-count aida",
      },
      {
        name: "Tote bag",
        tip: "Stitched on waste canvas, then worn everywhere.",
        fabric: "waste canvas",
      },
      {
        name: "T-shirt",
        tip: "A small motif over the chest — subtle and lovely.",
        fabric: "waste canvas",
      },
      { name: "Cushion", tip: "The cosy big project for the sofa.", fabric: "11-count aida" },
    ],
    skeins: (n: number) => `the chart comes with its DMC shopping list — ${n} skeins for this one`,
  },

  comments: {
    heading: "Comments",
    count: (n: number) => (n === 1 ? "1 comment" : `${n} comments`),
    empty: "No comments yet.",
    placeholder: "Your comment",
    send: "Post",
    sending: "Posting…",
    signIn: "Sign in to comment.",
    deleteAria: "Delete this comment",
    deleteOtherAria: "Delete this comment (admin)",
    confirmDeleteOther: (who: string) => `Delete ${who}'s comment? You're doing this as an admin.`,
    failed: "Your comment wasn't posted. Try again.",
    loading: "Loading comments…",
  },

  chart: {
    heading: "Your printable chart",
    preview: "Preview",
    previewHint: "your chart in miniature — the file prints larger and sharper",
    previewFailed: "Draw the preview again — your download works either way.",
    refresh: "Refresh the preview",
    backstitch: "Backstitch",
    backstitchHint: "Outlines the colour zones — the line you sew over the top",
    outlineColor: "Outline colour",
    legendTitle: (colours: number, stitches: number, w: number, h: number) =>
      `DMC · ${colours} ${colours === 1 ? "colour" : "colours"} · ${stitches.toLocaleString("en")} stitches · ${w} x ${h}`,
    countSuffix: "st",
    threads: (n: number) => (n === 1 ? "1 thread to buy" : `${n} threads to buy`),
    isolate: {
      hint: "click a thread to see it on its own",
      row: (num: string) => `Show only DMC ${num} on the grid`,
      planche: (num: string) => `DMC ${num} on its own`,
      canvas: (num: string) => `The grid with only DMC ${num} in colour`,
      // Says what the veil *is*. A first-timer cannot infer that the pale
      // stitches are the other colours rather than a fault.
      caption: "only this thread is in colour — the rest is faded back",
      close: "Show every colour",
      failed: "This thread's grid couldn't be drawn.",
      retry: "Try again",
    },
  },

  gallery: {
    kicker: "made by people like you",
    title: "The stitch gallery",
    lead: "Finished pieces stitched from patterns made here. Share yours when the last thread is knotted — we'd love to see it.",
    filters: {
      all: "All",
      pets: "Pets",
      flowers: "Flowers",
      landscapes: "Landscapes",
    },
    by: (who: string) => `by ${who}`,
    stitches: (w: number, h: number) => `${w} × ${h} st`,
    colors: (n: number) => `${n} colors`,
    more: (n: number) => `+${n}`,
    getPattern: "Get this pattern →",
    noPreview: "no picture yet",
    shareTitle: "Finished a piece?",
    shareBody: "Snap a photo of it in the hoop and add it to the gallery.",
    shareCta: "Share your stitch",
    shareNote: "no account needed — just a photo",
    showMore: "Show more pieces",
    empty: "Nothing in this category yet. Yours could be the first!",
    loading: "Fetching the gallery…",
    failed: "Couldn't load the gallery. Reload the page?",
    sortNew: "Newest",
    sortTop: "Most loved",
    likeAria: (title: string) => `Like “${title}”`,
    deleteAria: (title: string) => `Delete “${title}”`,
    confirmDelete: "Delete this piece for good?",
    confirmDeleteOther: "This piece isn't yours. Delete it for good anyway? You're an admin.",
    stitchCount: (n: number) => `${n} stitches`,
  },

  converter: {
    title: "Convert a photo",
    lead: "Settings on the left, your fabric in the middle, your threads on the right.",
    startOver: "Start over",

    upload: {
      drop: "Drop your photo here",
      browseBefore: "or ",
      browse: "browse your files",
      browseAfter: " · JPG or PNG",
      hint: "pets, portraits, gardens, holiday snaps — anything!",
      replace: "Choose another photo",
    },

    settings: { heading: "Pattern settings" },

    size: {
      stitchesWide: "Stitches wide",
      grid: (w: number, h: number) => `${w} × ${h} points`,
      total: (n: number) => `${n.toLocaleString("en")} stitches to sew`,
      split: (on: number, off: number) =>
        `${on.toLocaleString("en")} to sew · ${off.toLocaleString("en")} left bare`,
      transparentNote: "your PNG has transparent areas, they stay unstitched",
      unknown: "The height follows your photo's proportions.",
    },

    retouch: {
      heading: "Colours, mirror and background",
      vividness: "Colour brightness",
      vividnessSteps: ["Natural", "Vivid", "Very vivid"],
      mirror: "Mirror",
      mirrorH: "Left-right",
      mirrorV: "Top-bottom",
      removeBg: "Remove the background",
      removeBgHint: "Works on a plain background — sky, a wall, a sheet.",
    },

    colors: {
      threadColors: "Thread colors",
      outline: "Outline the piece",
      outlineHint: "A dark keyline around the stitched area",
    },

    custom: {
      heading: "Your own threads",
      open: "Use my own threads",
      title: "Your own threads",
      toggle: "Use my threads",
      toggleOn: "Your threads only",
      toggleOff: "All 589 DMC shades",
      listLabel: "Your DMC codes",
      emptyList: "No thread added yet",
      add: "Add",
      remove: "Remove",
      reset: "Clear all",
      inputLabel: "Enter a DMC code",
      placeholder: "e.g. 15, or 123, 16, 186",
      validate: "OK",
      cancel: "Cancel",
      notFound: "No such DMC code",
      already: "Already in your list",
      close: "Close",
    },

    canvas: {
      original: "Original",
      pattern: "Pattern",
      empty: "Your pattern will appear here",
      emptyHint: "upload a photo and press Create the pattern",
      note: "changes preview instantly — nothing is saved until you download",
      building: "Matching your threads…",
    },

    threads: {
      heading: "Your threads",
      count: (n: number) => `${n} colors`,
      empty: "Your DMC threads will be listed here.",
      hints: "Hover a thread to find it on the pattern · tap the wheel to swap it",
      swapAria: (code: string) => `Swap DMC ${code}`,
    },

    create: "Create the pattern",
    recreate: "Update the pattern",

    detail: {
      title: "Thread details",
      alternatives: "Suggested alternatives",
      findSimilar: "Find a similar thread",
      setColor: "Pick a specific code",
      replace: "Use this one",
      buy: "Buy this DMC thread",
      close: "Close",
    },

    download: {
      grid: "Grid",
      gridHint: "Draw the counting grid over the chart",
      legend: "Legend",
      legendHint: "List the DMC codes under the chart",
      background: "Background color",
      button: "Download the chart (PNG)",
      working: "Preparing…",
      note: "free forever — happy stitching!",
    },

    errors: {
      noImage: "Pick a photo first!",
      notEnoughCustom:
        "You asked for more colors than you have threads. Add more threads, or lower the color count.",
      tooFewColors:
        "This photo doesn't have enough distinct colors for that many threads. Try lowering the color count.",
      generic: "Something went wrong on our side. Try again in a moment.",
      network: "Couldn't reach the server. Check your connection and try again.",
      download: "The chart couldn't be generated. Try again.",
      retry: "Try again",
      dismiss: "Dismiss",
    },
  },

  footer: {
    tagline: "· made for stitchers",
    about: "About",
    faq: "FAQ",
    contact: "Contact",
    privacy: "Privacy",
    madeBy: "Made by",
  },

  notFound: {
    title: "This page slipped off the hoop",
    body: "The page you're after doesn't exist — or hasn't been stitched yet.",
    home: "Back to the homepage",
  },
}

/** Shape every locale must satisfy. Deliberately no `as const` on `en` —
 *  values widen to `string`, so `fr` must match the key set, not the words. */
export type Copy = typeof en

export const fr: Copy = {
  lang: { label: "Langue", fr: "Français", en: "English", switchTo: "Switch to English" },

  nav: {
    howItWorks: "Comment ça marche",
    gallery: "Galerie",
    faq: "FAQ",
    convert: "Convertir une photo",
    start: "Créer une grille",
    menu: "Menu",
  },

  home: {
    badge: "100 % gratuit · sans compte",
    heroTitleBefore: "Transformez une photo en grille de ",
    heroTitleAccent: "point de croix",
    heroTitleAfter: "",
    heroLead:
      "Envoyez une image : chaque point est associé à une vraie couleur de fil DMC, et vous repartez avec une grille prête à mettre au tambour.",
    ctaUpload: "Choisir une photo",
    ctaSample: "Voir un exemple",
    heroNote: "de la photo à la grille en une minute ↷",
    demoPhoto: "votre photo",
    demoPattern: "votre grille",
    demoPhotoPlaceholder: "une photo — animal, portrait, fleurs…",
    demoMatched: (n: number) => `associée à ${n} fils DMC`,

    stepsKicker: "aussi simple que un, deux, trois (et quatre)",
    stepsTitle: "Comment ça marche",
    steps: [
      {
        title: "Envoyez une photo",
        body: "Un JPG ou un PNG — les animaux et les portraits rendent très bien.",
      },
      {
        title: "Réglez la grille",
        body: "Choisissez la largeur en points et le nombre de fils. Remplacez ceux qui ne vous plaisent pas.",
      },
      {
        title: "Téléchargez la grille",
        body: "Une grille imprimable avec le quadrillage, la légende et les références DMC à acheter.",
      },
      {
        title: "Brodez tranquillement",
        body: "Mettez-la au tambour et installez-vous. Le plus agréable est pour vous.",
      },
    ],

    features: [
      {
        title: "Changez n'importe quel fil",
        body: "Une couleur ne vous plaît pas ? Cliquez dessus et choisissez parmi les 589 références DMC.",
      },
      {
        title: "Utilisez vos propres fils",
        body: "Vous avez déjà une boîte à fils ? Donnez-nous vos références DMC, nous n'utiliserons que celles-là.",
      },
      {
        title: "Repérez chaque couleur",
        body: "Survolez un fil dans la liste : tous les points de cette couleur s'allument sur la grille.",
      },
    ],

    faqKicker: "les questions qui reviennent",
    faqTitle: "Bon à savoir",
    faq: [
      {
        q: "C'est vraiment gratuit ?",
        a: "Oui — toutes les grilles, tous les téléchargements, sans compte et sans filigrane. Il n'y a rien à acheter ici.",
      },
      {
        q: "Que devient ma photo ?",
        a: "Elle est envoyée à notre serveur, convertie, et gardée en mémoire uniquement pendant que vous travaillez dessus. Elle n'est jamais écrite sur disque ni partagée.",
      },
      {
        q: "Combien de fils choisir ?",
        a: "Entre 8 et 15 convient à la plupart des photos. Moins donne un rendu plus graphique et se brode plus vite ; plus garde le détail mais multiplie les changements de fil.",
      },
      {
        q: "Quels fichiers puis-je envoyer ?",
        a: "Du JPG et du PNG. Les PNG transparents fonctionnent aussi — les zones transparentes sont simplement laissées vides.",
      },
    ],

    ctaKicker: "quand vous voulez",
    ctaTitle: "Créez votre première grille",
    ctaButton: "Choisir une photo — c'est gratuit",
  },

  account: {
    signIn: "Se connecter avec Google",
    signInShort: "Se connecter",
    signOut: "Se déconnecter",
    myPieces: "Mes ouvrages",
    rename: "Changer mon nom",
    renameLabel: "Votre nom dans la galerie",
    renameHint: "C'est votre nom Google au départ. Mettez ce que vous voulez.",
    panel: "Mon compte",
    welcomeTitle: "Bienvenue — choisissez un pseudo",
    welcomeLead:
      "C'est le nom qui apparaîtra sur vos ouvrages et vos commentaires. Votre nom Google est prérempli ; changez-le si vous préférez.",
    bioLabel: "Quelques mots sur vous",
    bioHint: "Facultatif. Ça s'affiche sur votre page.",
    bioPlaceholder: "Ce que vous brodez, depuis combien de temps…",
    iconLabel: "Votre marque",
    iconSoon: "Pour l'instant elle est tirée de votre compte. Des marques à choisir arrivent.",
    saveFailed: "Ça n'a pas été enregistré. Réessayez.",
    saving: "Enregistrement…",
    saved: "enregistré",
    publicPage: "Voir ma page",
    signInFirst: "Connectez-vous pour voir votre compte.",
    save: "Enregistrer",
    cancel: "Annuler",
    signedInAs: "Connecté en tant que",
    failed: "La connexion n'a pas abouti. Réessayez.",
    failedState: "Ce lien de connexion avait expiré. Réessayez.",
    failedBanned: "Ce compte a été suspendu.",
    whySignIn: "La connexion sert uniquement à partager un ouvrage — convertir reste libre et anonyme.",
    adminBadge: "Veille sur la galerie",
    adminLabel: "Admin",
    nameReserved: "Ce nom est réservé à l'équipe du site. Choisissez-en un autre !",
  },

  publish: {
    open: "Partager cet ouvrage",
    title: "Partager votre ouvrage",
    lead: "Il rejoint la galerie avec votre nom. Vous pourrez le supprimer quand vous voulez.",
    nameLabel: "Donnez-lui un titre",
    namePlaceholder: "Milo à la fenêtre",
    categoryLabel: "Catégorie",
    photoLabel: "Photo de l'ouvrage terminé",
    photoHint: "Facultatif, et c'est le plus beau — une photo dans le tambour.",
    photoPick: "Choisir une photo",
    photoChange: "En choisir une autre",
    photoRemove: "Retirer",
    patternPreview: "Votre grille",
    submit: "Publier",
    working: "Publication…",
    needSignIn: "Connectez-vous pour partager un ouvrage",
    done: "Publié — merci !",
    failed: "La publication a échoué. Réessayez.",
    tooBig: "Cette photo reste trop lourde même réduite. Essayez-en une plus petite.",
    dailyLimit: (limit: number, minutes: number) =>
      minutes < 90
        ? `${limit} ouvrages par jour, c'est le maximum. Il y aura de la place dans ${minutes} min.`
        : `${limit} ouvrages en une journée, joli rythme ! C'est le maximum : il y aura de la place dans ${Math.round(minutes / 60)} h environ.`,
  },

  piece: {
    backToGallery: "Retour à la galerie",
    notFound: "Cet ouvrage n'est plus là.",
    patternNote: "redessiné depuis la grille de son auteur",
    threads: {
      heading: "Les fils de cet ouvrage",
      order: "du fil le plus utilisé au moins utilisé",
    },
    photoAlt: (title: string) => `${title}, brodé`,
    patternAlt: (title: string) => `La grille de ${title}`,
    getChart: "Avoir la grille",
    seeStitched: "Voir sur un ouvrage",
    remove: "Supprimer cet ouvrage",
    removeConfirm:
      "Supprimer cet ouvrage définitivement ? La grille et les commentaires partent avec.",
    removeConfirmOther:
      "Cet ouvrage n'est pas le vôtre. Le supprimer définitivement quand même ? Vous pouvez, vous êtes admin — la grille et les commentaires partent avec.",
    removing: "Suppression…",
    removeFailed: "Il n'a pas été supprimé. Réessayez.",
    stitches: (n: number) => `${n.toLocaleString("fr")} pts`,
  },

  profile: {
    notFound: "Ce membre n'existe pas.",
    joined: (when: string) => `Ici depuis ${when}`,
    pieces: (n: number) => (n === 1 ? "1 ouvrage" : `${n} ouvrages`),
    likes: (n: number) => (n === 1 ? "1 cœur" : `${n} cœurs`),
    emptyMine: "Vous n'avez rien partagé pour l'instant.",
    emptyTheirs: (who: string) => `${who} n'a rien partagé pour l'instant.`,
  },

  showcase: {
    kicker: "une fois sur le tissu",
    title: "Et maintenant, elle vivra où ?",
    lead: "Le même motif sur ce que les brodeuses font le plus souvent. Juste pour l'inspiration — une seule grille suffit pour tous.",
    products: [
      {
        name: "Tambour à broder",
        tip: "Le classique — on brode, on laisse dans le tambour, on accroche.",
        fabric: "aida 14 fils",
      },
      {
        name: "Tote bag",
        tip: "Brodé sur canevas soluble, puis porté partout.",
        fabric: "canevas soluble",
      },
      {
        name: "T-shirt",
        tip: "Un petit motif sur la poitrine — discret et joli.",
        fabric: "canevas soluble",
      },
      { name: "Coussin", tip: "Le grand projet douillet pour le canapé.", fabric: "aida 11 fils" },
    ],
    skeins: (n: number) =>
      `la grille est livrée avec sa liste d'achat DMC — ${n} écheveaux pour celle-ci`,
  },

  comments: {
    heading: "Commentaires",
    count: (n: number) => (n === 1 ? "1 commentaire" : `${n} commentaires`),
    empty: "Aucun commentaire pour le moment.",
    placeholder: "Votre commentaire",
    send: "Publier",
    sending: "Publication…",
    signIn: "Connectez-vous pour commenter.",
    deleteAria: "Supprimer ce commentaire",
    deleteOtherAria: "Supprimer ce commentaire (admin)",
    confirmDeleteOther: (who: string) =>
      `Supprimer le commentaire de ${who} ? Vous le faites en tant qu'admin.`,
    failed: "Votre commentaire n'a pas été publié. Réessayez.",
    loading: "Chargement des commentaires…",
  },

  chart: {
    heading: "Votre grille imprimable",
    preview: "Aperçu",
    previewHint: "votre grille en réduction — le fichier est plus grand et plus net",
    previewFailed:
      "Redessinez l'aperçu — le téléchargement fonctionne dans tous les cas.",
    refresh: "Rafraîchir l'aperçu",
    backstitch: "Point de piqûre",
    backstitchHint: "Cerne les zones de couleur — le fil qu'on brode par-dessus",
    outlineColor: "Couleur du liseré",
    legendTitle: (colours: number, stitches: number, w: number, h: number) =>
      `DMC · ${colours} ${colours === 1 ? "couleur" : "couleurs"} · ${stitches.toLocaleString("fr")} points · ${w} x ${h}`,
    countSuffix: "pts",
    threads: (n: number) => (n === 1 ? "1 fil à acheter" : `${n} fils à acheter`),
    isolate: {
      hint: "cliquez sur un fil pour le voir seul sur la grille",
      row: (num: string) => `Voir seulement le DMC ${num} sur la grille`,
      planche: (num: string) => `Le DMC ${num} seul`,
      canvas: (num: string) => `Grille avec seulement le DMC ${num} en couleur`,
      caption: "seul ce fil est en couleur — le reste est estompé",
      close: "Voir toutes les couleurs",
      failed: "La grille de ce fil n'a pas pu être dessinée.",
      retry: "Réessayer",
    },
  },

  gallery: {
    kicker: "brodé par des gens comme vous",
    title: "La galerie",
    lead: "Des ouvrages terminés, brodés à partir de grilles créées ici. Partagez le vôtre une fois le dernier nœud fait — on adore les voir.",
    filters: {
      all: "Tout",
      pets: "Animaux",
      flowers: "Fleurs",
      landscapes: "Paysages",
    },
    by: (who: string) => `par ${who}`,
    stitches: (w: number, h: number) => `${w} × ${h} pts`,
    colors: (n: number) => `${n} couleurs`,
    more: (n: number) => `+${n}`,
    getPattern: "Obtenir cette grille →",
    noPreview: "pas encore d'image",
    shareTitle: "Un ouvrage terminé ?",
    shareBody: "Prenez-le en photo dans son tambour et ajoutez-le à la galerie.",
    shareCta: "Partager votre broderie",
    shareNote: "sans compte — juste une photo",
    showMore: "Voir plus d'ouvrages",
    empty: "Rien dans cette catégorie pour l'instant. Le vôtre pourrait être le premier !",
    loading: "Chargement de la galerie…",
    failed: "Impossible de charger la galerie. Recharger la page ?",
    sortNew: "Les plus récents",
    sortTop: "Les plus aimés",
    likeAria: (title: string) => `Aimer « ${title} »`,
    deleteAria: (title: string) => `Supprimer « ${title} »`,
    confirmDelete: "Supprimer définitivement cet ouvrage ?",
    confirmDeleteOther:
      "Cet ouvrage n'est pas le vôtre. Le supprimer définitivement quand même ? Vous êtes admin.",
    stitchCount: (n: number) => `${n} points`,
  },

  converter: {
    title: "Convertir une photo",
    lead: "Les réglages à gauche, votre toile au milieu, vos fils à droite.",
    startOver: "Tout recommencer",

    upload: {
      drop: "Déposez votre photo ici",
      browseBefore: "ou ",
      browse: "parcourez vos fichiers",
      browseAfter: " · JPG ou PNG",
      hint: "animaux, portraits, jardins, photos de vacances — tout marche !",
      replace: "Choisir une autre photo",
    },

    settings: { heading: "Réglages de la grille" },

    size: {
      stitchesWide: "Points en largeur",
      grid: (w: number, h: number) => `${w} × ${h} points`,
      total: (n: number) => `${n.toLocaleString("fr")} points à broder`,
      split: (on: number, off: number) =>
        `${on.toLocaleString("fr")} à broder · ${off.toLocaleString("fr")} laissés vides`,
      transparentNote: "votre PNG a des zones transparentes, elles restent vides",
      unknown: "La hauteur suit les proportions de votre photo.",
    },

    retouch: {
      heading: "Couleurs, miroir et fond",
      vividness: "Éclat des couleurs",
      vividnessSteps: ["Naturel", "Vif", "Très vif"],
      mirror: "Miroir",
      mirrorH: "Gauche-droite",
      mirrorV: "Haut-bas",
      removeBg: "Retirer le fond",
      removeBgHint: "Marche sur un fond uni — ciel, mur, drap.",
    },

    colors: {
      threadColors: "Nombre de fils",
      outline: "Cerner l'ouvrage",
      outlineHint: "Un liseré sombre autour de la zone brodée",
    },

    custom: {
      heading: "Vos propres fils",
      open: "Utiliser mes fils",
      title: "Vos propres fils",
      toggle: "Utiliser mes fils",
      toggleOn: "Vos fils uniquement",
      toggleOff: "Les 589 références DMC",
      listLabel: "Vos références DMC",
      emptyList: "Aucun fil ajouté pour l'instant",
      add: "Ajouter",
      remove: "Supprimer",
      reset: "Tout effacer",
      inputLabel: "Entrez une référence DMC",
      placeholder: "ex. 15, ou 123, 16, 186",
      validate: "OK",
      cancel: "Annuler",
      notFound: "Référence DMC introuvable",
      already: "Déjà dans votre liste",
      close: "Fermer",
    },

    canvas: {
      original: "Original",
      pattern: "Grille",
      empty: "Votre grille apparaîtra ici",
      emptyHint: "envoyez une photo puis cliquez sur Créer la grille",
      note: "l'aperçu se met à jour tout de suite — rien n'est enregistré tant que vous ne téléchargez pas",
      building: "Association des fils en cours…",
    },

    threads: {
      heading: "Vos fils",
      count: (n: number) => `${n} couleurs`,
      empty: "Vos fils DMC s'afficheront ici.",
      hints: "Survolez un fil pour le repérer sur la grille · cliquez sur la roue pour le remplacer",
      swapAria: (code: string) => `Remplacer le DMC ${code}`,
    },

    create: "Créer la grille",
    recreate: "Mettre à jour la grille",

    detail: {
      title: "Détail du fil",
      alternatives: "Alternatives suggérées",
      findSimilar: "Trouver un fil proche",
      setColor: "Choisir une référence précise",
      replace: "Utiliser celui-ci",
      buy: "Acheter ce fil DMC",
      close: "Fermer",
    },

    download: {
      grid: "Quadrillage",
      gridHint: "Tracer la grille de comptage sur l'image",
      legend: "Légende",
      legendHint: "Lister les références DMC sous la grille",
      background: "Couleur de fond",
      button: "Télécharger la grille (PNG)",
      working: "Préparation…",
      note: "gratuit pour toujours — bonne broderie !",
    },

    errors: {
      noImage: "Choisissez d'abord une photo !",
      notEnoughCustom:
        "Vous demandez plus de couleurs que vous n'avez de fils. Ajoutez des fils, ou baissez le nombre de couleurs.",
      tooFewColors:
        "Cette photo n'a pas assez de couleurs distinctes pour autant de fils. Essayez de baisser le nombre de couleurs.",
      generic: "Quelque chose s'est mal passé de notre côté. Réessayez dans un instant.",
      network: "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.",
      download: "La grille n'a pas pu être générée. Réessayez.",
      retry: "Réessayer",
      dismiss: "Fermer",
    },
  },

  footer: {
    tagline: "· fait pour les brodeuses et brodeurs",
    about: "À propos",
    faq: "FAQ",
    contact: "Contact",
    privacy: "Confidentialité",
    madeBy: "Créé par",
  },

  notFound: {
    title: "Cette page a glissé du tambour",
    body: "La page que vous cherchez n'existe pas — ou n'a pas encore été brodée.",
    home: "Retour à l'accueil",
  },
}

export const dictionaries = { en, fr }
export type Lang = keyof typeof dictionaries
