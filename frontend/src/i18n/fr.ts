// La copie française, chargée avec l'application.
//
// Statique, contrairement à `en.ts` : c'est la langue par défaut du site, ses URL
// sont françaises et son public l'est aussi. Un visiteur francophone ne télécharge
// donc jamais l'anglais.
import type { Copy } from "./copy"

/**
 * Le nom, dans cette langue.
 *
 * Il vit ici et pas dans `lib/site.ts` parce qu'il se traduit — ce que la version
 * précédente de ce fichier affirmait le contraire. `lib/site.ts` garde la forme
 * française comme forme canonique : c'est elle que le serveur rend, elle qui part
 * dans `og:site_name`, et elle qui figure dans le sitemap et `llms.txt`. Une page
 * n'a qu'une adresse et qu'un nom canonique ; ce qu'on lit à l'écran suit la
 * langue.
 */
const NAME = "La Vall\u00e9e des Points de Croix"
const SHORT = "La Vall\u00e9e"

export const fr: Copy = {
  lang: { label: "Langue", fr: "Français", en: "English", switchTo: "Switch to English" },

  /**
   * Le nom, et les deux lignes du logo.
   *
   * `ofFirst` dit lequel des deux vient en premier. En français le lieu mène et le
   * complément suit ; en anglais le complément précède le nom (« Cross Stitch
   * Valley »), donc l'ordre s'inverse. C'est la seule différence entre les deux
   * logos : mêmes deux voix, même hiérarchie — le lieu reste le grand mot.
   */
  site: { name: NAME, short: SHORT, place: "LA VALL\u00c9E", of: "des points de croix", ofFirst: false },

  nav: {
    gallery: "Galerie",
    guide: "Comment faire",
    about: "Qui sommes-nous",
    faq: "FAQ",
    convert: "Convertir une photo",
    start: "Créer une grille",
    menu: "Menu",
  },

  home: {
    badge: "100 % gratuit",
    heroTitleBefore: "Transformez une photo en grille de ",
    heroTitleAccent: "point de croix",
    heroTitleAfter: "",
    heroLead:
      "Choisissez une image : chaque point est associé à une vraie couleur de fil DMC, directement dans votre navigateur, et vous repartez avec une grille prête à mettre au tambour.",
    ctaUpload: "Choisir une photo",
    ctaSample: "Voir un exemple",
    heroNote: "de la photo à la grille en une minute ↷",
    demoPhoto: "votre photo",
    demoPattern: "votre grille",
    demoTry: "Essayer cette photo — elle s'ouvre prête à convertir",
    demoPhotoAlt: "La photo d'une fraise",
    demoPatternAlt: "La même fraise en grille de point de croix, en 9 fils DMC, avec sa liste de fils",
    demoMatched: (n: number) => `associée à ${n} fils DMC`,

    stepsKicker: "aussi simple que un, deux, trois (et quatre)",
    stepsTitle: "Comment ça marche",
    steps: [
      {
        title: "Choisissez une photo",
        body: "Un JPG, un PNG ou un WebP — les animaux et les portraits rendent très bien. Elle reste sur votre machine.",
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
        body: "Une couleur ne vous plaît pas ? Cliquez dessus et choisissez parmi les 483 références DMC en coton mouliné.",
      },
      {
        title: "Utilisez vos propres fils",
        body: "Vous avez déjà une boîte à fils ? Donnez-nous vos références DMC, nous n'utiliserons que celles-là.",
      },
      {
        title: "Repérez chaque couleur",
        body: "Touchez un fil dans la liste : tous les points de cette couleur restent allumés sur la grille jusqu'à ce que vous le retouchiez.",
      },
    ],

    stepsMore: "Le guide complet, étape par étape",
    faqMore: "Toutes les questions et réponses",
    faqKicker: "les questions qui reviennent",
    faqTitle: "Bon à savoir",
    faq: [
      {
        q: "C'est vraiment gratuit ?",
        a: "Oui — toutes les grilles, tous les téléchargements, sans compte et sans filigrane. Il n'y a rien à acheter ici.",
      },
      {
        q: "Que devient ma photo ?",
        a: "Rien — elle ne quitte jamais votre ordinateur. Toute la conversion se fait dans votre navigateur : votre image n'est jamais envoyée, jamais stockée, jamais vue par nous. Partager un ouvrage envoie la grille, et rien d'autre.",
      },
      {
        q: "Combien de fils choisir ?",
        a: "Entre 8 et 15 convient à la plupart des photos. Moins donne un rendu plus graphique et se brode plus vite ; plus garde le détail mais multiplie les changements de fil.",
      },
      {
        q: "Quels fichiers puis-je envoyer ?",
        a: "Du JPG, du PNG, du WebP et de l'AVIF. Les PNG transparents fonctionnent aussi — les zones transparentes sont simplement laissées vides.",
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

    /**
     * Supprimer son compte.
     *
     * La page de confidentialité promet « sa suppression complète — compte,
     * publications et commentaires », donc c'est bien une suppression et pas une
     * anonymisation : la page dirait autre chose que ce que fait le code.
     *
     * Le dialogue chiffre ce qui va partir. « Tout supprimer » oblige à deviner
     * combien « tout » représente ; « vos 4 grilles et vos 12 commentaires » est le
     * même avertissement, sans la peur, et permet de remarquer avant de confirmer
     * que le compte n'est pas le bon.
     */
    danger: {
      heading: "Supprimer mon compte",
      lead: "Définitif. Rien ne peut être remis en place ensuite.",
      open: "Supprimer mon compte",
      dialogTitle: "Supprimer votre compte ?",
      /** Ce qui part, compté avant de demander. */
      whatGoes: "Voici ce qui sera effacé :",
      account: "Votre compte, votre nom et votre adresse e-mail",
      posts: (n: number) =>
        n === 0 ? "Aucune grille publiée" : n === 1 ? "Votre grille publiée" : `Vos ${n} grilles publiées`,
      comments: (n: number) =>
        n === 0 ? "Aucun commentaire" : n === 1 ? "Votre commentaire" : `Vos ${n} commentaires`,
      likes: (n: number) =>
        n === 0 ? "Aucun cœur donné" : n === 1 ? "Le cœur que vous avez donné" : `Les ${n} cœurs que vous avez donnés`,
      /** Le seul cas qui mérite d'être dit à voix haute : ce que les autres perdent. */
      irreversible:
        "Les personnes qui ont récupéré une de vos grilles la gardent — elle est déjà sur leur machine. Mais elle disparaît de la galerie pour tout le monde.",
      confirmLabel: "Pour confirmer, tapez SUPPRIMER",
      confirmWord: "SUPPRIMER",
      confirm: "Supprimer définitivement",
      cancel: "Annuler",
      working: "Suppression…",
      failed: "La suppression n'a pas abouti. Réessayez.",
      /** Après coup, sur la page d'accueil. */
      done: "Votre compte a été supprimé.",
    },
  },

  publish: {
    open: "Partager cet ouvrage",
    title: "Partager votre ouvrage",
    lead: "Il rejoint la galerie avec votre nom. Vous pourrez le supprimer quand vous voulez.",
    nameLabel: "Donnez-lui un titre",
    namePlaceholder: "Milo à la fenêtre",
    categoryLabel: "Catégorie",
    patternPreview: "Votre grille",
    photoLabel: "Photo de l'ouvrage brodé",
    photoOptional: "facultatif",
    photoNote: "Avec une photo, votre ouvrage apparaît dans les deux galeries.",
    submit: "Publier",
    working: "Publication…",
    needSignIn: "Connectez-vous pour partager un ouvrage",
    done: "Publié — merci !",
    failed: "La publication a échoué. Réessayez.",
    tooBig: "Cette grille est trop lourde à envoyer. Essayez avec moins de points.",
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
      all: (n: number) => `Voir les ${n} couleurs`,
      less: "Réduire",
    },
    photoAlt: (title: string) => `${title}, brodé`,
    patternAlt: (title: string) => `La grille de ${title}`,
    stitchNote: "un ouvrage terminé, partagé par qui l'a brodé",
    noChart: "Pas de grille avec celui-ci — il a été brodé d'après un modèle trouvé ailleurs.",
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
    /**
      * La ligne imprimée en haut de la grille.
      *
      * Elle commençait par « DMC ». C'était la signature du site sur un objet que
      * quelqu'un imprime, garde, et pose dans un tambour pendant quinze jours — et
      * elle était offerte à un fabricant de fil. Le nom court, parce que la ligne
      * porte déjà trois chiffres.
      */
    legendTitle: (colours: number, stitches: number, w: number, h: number) =>
      `${SHORT} · ${colours} ${colours === 1 ? "couleur" : "couleurs"} · ${stitches.toLocaleString("fr")} points · ${w} x ${h}`,
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
      download: (num: string) => `Télécharger le DMC ${num} seul`,
      saving: "Préparation…",
      downloadHint: "une feuille par écheveau — pratique pour deux teintes qui se ressemblent",
      // Ici « DMC » reste : c'est la référence du fil, pas une marque empruntée.
      legendTitle: (num: string, stitches: number, w: number, h: number) =>
        `${SHORT} · DMC ${num} seul · ${stitches.toLocaleString("fr")} points · ${w} x ${h}`,
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
    seePiece: "Voir cet ouvrage →",
    noPreview: "pas encore d'image",
    shareTitle: "Un ouvrage terminé ?",
    shareBody: "Prenez-le en photo dans son tambour et ajoutez-le à la galerie.",
    shareCta: "Partager votre broderie",
    shareNote: "sans compte — juste une photo",
    showMore: "Voir plus d'ouvrages",
    empty: "Rien dans cette catégorie pour l'instant. Le vôtre pourrait être le premier !",
    tabs: { patterns: "Les grilles", finished: "Les broderies" },
    patterns: {
      title: "La galerie de grilles",
      inviteTitle: "Créez-en une depuis une photo",
      inviteBody: "Convertissez une image et votre grille arrive ici, avec votre nom.",
      inviteCta: "Convertir une photo",
      emptyAll: "Aucune grille pour l'instant. La vôtre pourrait être la première !",
    },
    finished: {
      title: "Les broderies",
      // La seule chose que le titre ne dit pas déjà, et celle qui évite de croire
      // qu'on ne peut montrer que ce qu'on a converti ici.
      lead: "La grille peut venir d'ici ou d'ailleurs.",
      inviteTitle: "Un ouvrage terminé ?",
      inviteBody: "Une photo suffit. Pas besoin de grille, d'où qu'elle vienne.",
      inviteCta: "Ajouter votre photo",
      emptyAll: "Aucune broderie ici pour l'instant. Montrez la vôtre en premier !",
    },
    loading: "Chargement de la galerie…",
    failed: "Impossible de charger la galerie. Recharger la page ?",
    filterLabel: "Filtrer par sujet",
    // Chaque bouton de tri dit dans quel sens il trie : une flèche seule donne une
    // direction sans dire ce qu'elle ordonne. Celui qui est déjà choisi porte la
    // flèche ; le cliquer retourne l'ordre.
    sort: {
      label: "Trier",
      new: { desc: "Les plus récents", asc: "Les plus anciens" },
      top: { desc: "Les plus aimés", asc: "Les moins aimés" },
      reverse: (current: string) => `Trié par « ${current} ». Cliquez pour inverser l'ordre.`,
    },
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
      heading: "Modifier",
      vividness: "Éclat des couleurs",
      vividnessSteps: ["Naturel", "Vif", "Très vif"],
      rotation: "Tourner l'image",
      rotationHint: "Choisissez l'image qui est dans le bon sens.",
      rotationHintEmpty: "Ajoutez une photo pour choisir le sens.",
      rotationOptions: {
        0: "Comme votre photo",
        90: "Tournée vers la droite",
        180: "À l'envers",
        270: "Tournée vers la gauche",
      } as Record<number, string>,
      removeBg: "Retirer le fond",
      removeBgHint:
        "Marche sur fond uni — le temps de mise à jour de la grille est allongé.",
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
      toggleOff: "Les 483 références DMC",
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
      hints: "Touchez un fil pour le repérer sur la grille · la roue le remplace",
      pinAria: (code: string) => `Repérer le DMC ${code} sur la grille`,
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
    stitches: "Les broderies",
    guide: "Comment faire",
    about: "À propos",
    faq: "FAQ",
    contact: "Contact",
    privacy: "Confidentialité",
    madeBy: "Créé par",
  },

  aboutPage: {
    kicker: "qui est derrière tout ça",
    title: "Qui sommes-nous",
    lead:
      "La Vallée des Points de Croix est un petit outil gratuit, fait par deux personnes qui voulaient une grille à partir d'une photo et qui n'en trouvaient pas une seule honnête sur les fils.",
    blocks: [
      {
        heading: "Ça a commencé avec une photo",
        body:
          "Une photo de chien, un dimanche après-midi, et une soirée passée à compter les carreaux à la main. La première version était un script qui comptait à notre place. Tout ce qui a suivi, c'est la même idée, mieux habillée.",
      },
      {
        heading: "Chaque couleur est un fil qui existe",
        body:
          "Le convertisseur associe chaque point à l'une des 483 références DMC en coton mouliné, jugées comme l'œil juge une couleur et non comme une machine additionne des nombres. Ce que vous téléchargez donne de vraies références, avec le nombre de points de chacune — de quoi entrer en boutique avec la liste.",
      },
      {
        heading: "Gratuit, et ça ne changera pas",
        body:
          "Pas de compte pour convertir, pas de filigrane, rien à acheter. Se connecter sert à mettre un ouvrage terminé dans la galerie, et à rien d'autre.",
      },
      {
        heading: "Tout se passe dans votre navigateur",
        body:
          "Votre photo n'est jamais envoyée pour faire une grille : la conversion entière tourne sur votre machine. Partager un ouvrage envoie la grille, quelques kilo-octets, et la photo seulement si vous décidez d'en ajouter une.",
      },
    ],
    ctaTitle: "Essayez",
    ctaBody: "Choisissez une photo et voyez ce qu'elle donne en fil.",
    ctaButton: "Créer une grille",
  },

  faqPage: {
    kicker: "tout ce qu'on nous demande",
    title: "Questions et r\u00e9ponses",
    lead: "Comment fonctionne le convertisseur, \u00e0 quoi servent les r\u00e9glages, et ce que devient votre photo.",
    groups: [
      {
        heading: "L'essentiel",
        items: [
          {
            q: "C'est vraiment gratuit ?",
            a: "Oui. Toutes les grilles, tous les t\u00e9l\u00e9chargements, sans compte et sans filigrane. Il n'y a rien \u00e0 acheter et rien de gard\u00e9 pour une version payante.",
          },
          {
            q: "Que devient ma photo ?",
            a: "Rien \u2014 elle ne quitte jamais votre ordinateur. Toute la conversion se fait dans votre navigateur : votre image n'est jamais envoy\u00e9e, jamais stock\u00e9e, jamais vue par nous. Partager un ouvrage envoie la grille, et rien d'autre.",
          },
          {
            q: "Faut-il un compte ?",
            a: "Seulement pour mettre un ouvrage dans la galerie. Convertir une photo et t\u00e9l\u00e9charger sa grille ne demande rien du tout.",
          },
          {
            q: "Quels fichiers puis-je utiliser ?",
            a: "JPG, PNG, WebP et AVIF. Un PNG transparent fonctionne aussi \u2014 les zones transparentes restent simplement vides, ce qui donne le sujet sur la toile nue.",
          },
        ],
      },
      {
        heading: "Choisir les r\u00e9glages",
        items: [
          {
            q: "Combien de couleurs de fil choisir ?",
            a: "Entre 8 et 15 convient \u00e0 la plupart des photos. Moins donne un rendu plus graphique et se brode beaucoup plus vite ; plus garde le d\u00e9tail mais multiplie les changements de fil, et au-del\u00e0 d'une vingtaine les nuances ajout\u00e9es sont souvent des voisines qu'on ne distingue pas sur la toile.",
          },
          {
            q: "Quelle largeur choisir ?",
            a: "La largeur en points d\u00e9cide \u00e0 la fois du d\u00e9tail et de la taille finie. Un visage a besoin d'environ 80 points de large pour ressembler \u00e0 la personne ; un motif simple se contente de 40. Divisez le nombre de points par le compte de votre toile \u2014 80 points sur de l'aida 14 fils font un peu moins de 15 cm.",
          },
          {
            q: "Que veut dire \u00ab aida 14 fils \u00bb ?",
            a: "Le nombre de points par pouce (2,54 cm). Le 14 fils est le point de d\u00e9part habituel : confortable \u00e0 voir et \u00e0 broder. Un compte plus \u00e9lev\u00e9 donne une toile plus fine, un ouvrage plus petit et davantage de fatigue pour les yeux.",
          },
          {
            q: "\u00c0 quoi sert l'\u00e9clat des couleurs ?",
            a: "Les photos sont plus ternes que le fil. Associ\u00e9e fid\u00e8lement, une photo peu satur\u00e9e donne des nuances peu satur\u00e9es, et l'ouvrage fini peut para\u00eetre fade \u00e0 c\u00f4t\u00e9 de l'image d'origine. \u00ab Vif \u00bb rel\u00e8ve la couleur sans toucher \u00e0 la luminosit\u00e9 : c'est une correction, pas un filtre.",
          },
          {
            q: "Pourquoi retirer le fond prend-il plus de temps ?",
            a: "Parce qu'un vrai mod\u00e8le de segmentation passe sur votre photo, dans votre navigateur, pour trouver le sujet. Quelques secondes la premi\u00e8re fois \u2014 le mod\u00e8le doit \u00eatre t\u00e9l\u00e9charg\u00e9 \u2014 puis plus rapide. \u00c7a marche mieux sur un fond uni : un chat sur un tapis \u00e0 motifs ne se d\u00e9tachera pas proprement.",
          },
        ],
      },
      {
        heading: "La grille",
        items: [
          {
            q: "Qu'y a-t-il dans le fichier t\u00e9l\u00e9charg\u00e9 ?",
            a: "Un PNG avec votre motif dessin\u00e9 \u00e0 20 pixels par point, un quadrillage de comptage avec un trait plus \u00e9pais tous les dix points, et la liste des fils en dessous : chaque r\u00e9f\u00e9rence DMC, son nom, et le nombre de points qu'il vous faut.",
          },
          {
            q: "Peut-on avoir une couleur \u00e0 la fois ?",
            a: "Oui. Dans le panneau de t\u00e9l\u00e9chargement, cliquez sur un fil et vous obtenez ce fil seul, avec le contour de tout l'ouvrage autour pour situer les points. C'est la feuille \u00e0 suivre avec un \u00e9cheveau en main \u2014 et c'est comme \u00e7a qu'on distingue deux nuances presque identiques.",
          },
          {
            q: "Les couleurs sont-elles de vrais fils DMC ?",
            a: "Toutes. Le convertisseur associe parmi 483 r\u00e9f\u00e9rences DMC en coton moulin\u00e9, jug\u00e9es comme l'\u0153il juge une couleur et non comme une machine additionne des nombres. Les gammes m\u00e9tallis\u00e9e, satin\u00e9e et \u00c9toile sont volontairement \u00e9cart\u00e9es : elles partagent leurs codes avec le coton uni, et \u00eatre envoy\u00e9 acheter du noir brillant quand on voulait du noir n'aide personne.",
          },
          {
            q: "Puis-je n'utiliser que les fils que j'ai d\u00e9j\u00e0 ?",
            a: "Oui. Donnez vos r\u00e9f\u00e9rences DMC et rien d'autre ne sera utilis\u00e9.",
          },
          {
            q: "Puis-je vendre ce que je brode ?",
            a: "De notre c\u00f4t\u00e9, oui \u2014 la grille est \u00e0 vous. V\u00e9rifiez simplement que vous avez le droit d'utiliser la photo elle-m\u00eame, ce qui est une autre question et pas la n\u00f4tre.",
          },
        ],
      },
    ],
  },

  guide: {
    kicker: "de la photo au tambour",
    title: "Comment faire une grille de point de croix \u00e0 partir d'une photo",
    lead: "Tout, du d\u00e9but \u00e0 la fin : une minute de travail et quelques soir\u00e9es de broderie.",
    intro:
      "Une grille de point de croix est un quadrillage o\u00f9 chaque case dit quelle couleur de fil y mettre. Transformer une photo en grille demande deux d\u00e9cisions \u2014 quelle taille, et combien de couleurs \u2014 puis de lire le r\u00e9sultat. Cette page passe par les deux, et par les r\u00e9glages qui valent le d\u00e9tour ensuite.",
    steps: [
      {
        heading: "Choisir une photo qui survit \u00e0 la r\u00e9duction",
        body: "Une grille est une image en tr\u00e8s basse r\u00e9solution : 60 points de large, c'est 60 pixels d'information. Ce qui survit \u00e0 \u00e7a : un sujet net, du contraste, et peu de fond \u2014 un animal devant un mur, une fleur, un objet seul. Ce qui n'y survit pas : une sc\u00e8ne charg\u00e9e, un visage lointain, une texture fine. Si vous avez le choix, prenez celle o\u00f9 le sujet remplit le cadre.",
      },
      {
        heading: "Choisir la largeur en points",
        body: "Elle d\u00e9cide du d\u00e9tail et de la taille finie en m\u00eame temps. 40 points, c'est un petit motif ; 60 \u00e0 90 est la plage habituelle pour quelque chose de reconnaissable ; au-del\u00e0 de 150 vous vous engagez sur des mois. Divisez par le compte de votre toile pour la taille : 80 points sur de l'aida 14 fils font environ 14,5 cm.",
      },
      {
        heading: "Choisir le nombre de fils",
        body: "Huit \u00e0 quinze convient \u00e0 la plupart des photos. Moins est plus franc, plus rapide et souvent plus joli ; plus garde le d\u00e9tail au prix d'un changement de fil tous les quelques points. Le compteur indique combien de points prend chaque couleur, ce qui est la mesure honn\u00eate du travail auquel vous venez de dire oui.",
      },
      {
        heading: "Ajuster, si besoin",
        body: "Tournez l'image si elle sort d'un t\u00e9l\u00e9phone tenu de travers. Relevez l'\u00e9clat si le r\u00e9sultat para\u00eet d\u00e9lav\u00e9 \u00e0 c\u00f4t\u00e9 de la photo \u2014 le fil est plus satur\u00e9 qu'un \u00e9cran. Retirez le fond si vous voulez le sujet sur la toile nue. Chaque changement redessine la grille aussit\u00f4t : vous jugez au lieu d'imaginer.",
      },
      {
        heading: "Remplacer un fil qui ne vous pla\u00eet pas",
        body: "Touchez un fil dans la liste pour voir exactement quels points il couvre, et servez-vous de la roue \u00e0 c\u00f4t\u00e9 pour choisir une autre nuance dans toute la gamme DMC. \u00c7a vaut le coup pour les carnations et pour les ciels, o\u00f9 la correspondance la plus proche en chiffres n'est pas toujours celle qui rend bien.",
      },
      {
        heading: "T\u00e9l\u00e9charger la grille, et acheter le fil",
        body: "Le PNG contient le quadrillage, les traits de comptage et la liste des fils avec un nombre de points par couleur. Un \u00e9cheveau de coton moulin\u00e9 couvre environ 1 500 points \u00e0 deux brins sur du 14 fils : les comptes vous disent donc quoi acheter. Imprimez aussi grand que votre imprimante le permet \u2014 vous allez compter des cases dessus un bon moment.",
      },
      {
        heading: "Broder",
        body: "Commencez par le milieu et travaillez vers l'ext\u00e9rieur : une erreur de comptage ne pourra pas pousser le motif hors de la toile. Deux brins sur de l'aida 14 fils est le choix habituel. Croisez tous les points dans le m\u00eame sens \u2014 le bras du dessus toujours dans la m\u00eame direction \u2014 et la surface finie accroche la lumi\u00e8re r\u00e9guli\u00e8rement.",
      },
    ],
    ctaTitle: "Essayez sur une photo",
    ctaBody: "\u00c7a ne co\u00fbte rien et il faut une minute pour voir si votre image fonctionne.",
    ctaButton: "Cr\u00e9er une grille",
  },

  shareWork: {
    open: "Montrer votre broderie",
    title: "Montrer votre broderie",
    lead: "Une photo, un titre, et elle rejoint la galerie avec votre nom. La grille peut venir de n'importe où.",
    photoLabel: "Photo de votre ouvrage",
    pick: "Choisir une photo",
    change: "Changer de photo",
    hint: "JPG, PNG ou WebP · 6 Mo maxi",
    needPhoto: "La photo, c'est tout l'ouvrage — choisissez-en une pour continuer.",
    tooHeavy: "Cette photo dépasse 6 Mo. Essayez-en une plus légère.",
    unreadable: "Ce fichier n'a pas pu être lu. Essayez une autre photo.",
    done: "Elle est dans la galerie — merci !",
  },

  report: {
    open: "Signaler",
    title: "Signaler cet ouvrage",
    lead: "Ça part à l'équipe de la galerie, et elle ira voir.",
    reasonLabel: "Qu'est-ce qui ne va pas ?",
    reasons: {
      notMine: "Ce n'est pas son ouvrage",
      explicit: "Pas pour tout le monde",
      spam: "Spam",
      offTopic: "Rien à voir avec la broderie",
      other: "Autre chose",
    },
    noteLabel: "Quelque chose à ajouter ?",
    notePlaceholder: "Seulement si ça aide — une ligne suffit.",
    submit: "Envoyer le signalement",
    working: "Envoi…",
    done: "Envoyé. Merci de nous l'avoir dit.",
    close: "Fermer",
    failed: "Il n'est pas parti. Réessayez.",
  },

  reports: {
    title: "Ouvrages signalés",
    lead: "Les plus récents d'abord. Ouvrez l'ouvrage pour juger, puis supprimez-le ou classez le signalement.",
    empty: "Rien de signalé. Journée tranquille.",
    loading: "Chargement des signalements…",
    failed: "Impossible de charger les signalements.",
    forbidden: "Cette page est réservée aux admins.",
    reportedBy: (who: string) => `signalé par ${who}`,
    by: (who: string) => `par ${who}`,
    open: "Ouvrir l'ouvrage",
    dismiss: "Classer",
    dismissing: "Classement…",
    kind: { pattern: "grille", photo: "photo" },
    link: "Ouvrages signalés",
  },

  /**
   * La page de confidentialité.
   *
   * Écrite depuis le code, pas depuis un modèle : chaque phrase décrit ce que
   * `PythonDCA/api/db.py`, `auth.py` et `google.py` font réellement. C'est aussi, sans
   * le chercher, la page la plus convaincante du site — l'argument central est
   * vérifiable et aucun concurrent payant ne peut le tenir : la photo ne part jamais.
   *
   * Deux valeurs restent à compléter par Felix et sont marquées comme telles dans le
   * texte : l'identité du responsable de traitement et une adresse de contact. Un
   * lien GitHub n'est pas une adresse à laquelle exercer un droit.
   */
  privacyPage: {
    kicker: "ce que ce site sait de vous",
    title: "Confidentialité",
    lead:
      "Court, parce qu'il n'y a pas grand-chose à dire : votre photo ne quitte jamais votre navigateur, et le site ne vous suit pas.",
    updated: "Dernière mise à jour : 7 août 2026",
    blocks: [
      {
        heading: "Votre photo ne part pas",
        body:
          "Toute la conversion — la réduction, le choix des couleurs, la correspondance avec les fils DMC, le dessin de la grille — tourne sur votre machine, dans votre navigateur. Aucune image n'est envoyée à un serveur pour être convertie : il n'y a donc rien à conserver, rien à analyser et rien à perdre. Coupez votre connexion une fois la page chargée, la conversion fonctionne encore.",
      },
      {
        heading: "Sans compte, rien n'est enregistré",
        body:
          "Convertir une photo, télécharger une grille, parcourir la galerie : rien de tout cela ne demande de compte et rien n'en est enregistré côté serveur. Vos réglages en cours sont rangés dans le stockage local de votre navigateur, sur votre appareil, pour que vous retrouviez votre travail en revenant. Vider les données du site les efface.",
      },
      {
        heading: "Si vous vous connectez avec Google",
        body:
          "Se connecter ne sert qu'à une chose : publier dans la galerie et commenter. Google nous transmet alors votre nom, votre adresse e-mail et l'adresse de votre photo de profil. Nous gardons ces trois éléments, plus la date de création du compte, ainsi que la biographie et la marque que vous choisissez. Nous ne demandons rien d'autre à Google et nous ne voyons rien d'autre : ni vos contacts, ni votre agenda, ni vos fichiers.",
      },
      {
        heading: "Ce que vous publiez est public",
        body:
          "Une grille partagée, son titre, sa catégorie, la photo de l'ouvrage si vous en ajoutez une, vos commentaires et vos cœurs sont visibles de tous, avec votre nom. C'est ce qu'est une galerie. Vous pouvez supprimer vos propres publications et vos propres commentaires quand vous voulez.",
      },
      {
        heading: "Un seul cookie, et il ne suit rien",
        body:
          "Le cookie de session vous garde connecté. Il contient un jeton tiré au hasard qui ne veut rien dire ailleurs que sur ce site, le JavaScript de la page ne peut pas le lire, et la base ne range qu'une empreinte de ce jeton — une copie de la base ne permettrait donc de se connecter au nom de personne. Il dure 180 jours, et les sessions expirées sont effacées. Un second cookie, temporaire, existe le temps de l'aller-retour vers Google, pour empêcher qu'on vous fasse signer une connexion à votre insu. C'est tout : pas de cookie publicitaire, pas de cookie de mesure.",
      },
      {
        heading: "Aucun traqueur, aucune mesure d'audience",
        body:
          "Pas de Google Analytics, pas de pixel, pas de bouton de réseau social, aucun script tiers d'aucune sorte. Même les polices de caractères sont servies depuis ce serveur plutôt que par Google Fonts, précisément pour qu'aucune requête ne parte ailleurs pendant que vous lisez. Le site ne sait pas combien de personnes le visitent, et c'est un choix.",
      },
      {
        heading: "Combien de temps",
        body:
          "Votre compte et ce que vous avez publié restent tant que vous les gardez. Les sessions expirent au bout de 180 jours. Les journaux du serveur qui héberge le site retiennent des adresses IP quelques jours, comme tout serveur web, pour le diagnostic et la sécurité.",
      },
      {
        heading: "Vos droits",
        body:
          "Vous pouvez demander une copie de ce que le site détient sur vous, sa correction, ou sa suppression complète — compte, publications et commentaires. Écrivez à l'adresse ci-dessous et ce sera fait. Vous pouvez aussi tout supprimer vous-même, sans nous écrire : « Supprimer mon compte », en bas de votre page de compte. C'est immédiat et définitif. Vous pouvez aussi retirer à tout moment l'accès accordé à ce site depuis les paramètres de votre compte Google.",
      },
    ],
    contactHeading: "Nous écrire",
    contactBody:
      "Pour toute question sur cette page, ou pour exercer un de ces droits, écrivez à [ADRESSE À COMPLÉTER]. Le responsable du traitement est [IDENTITÉ À COMPLÉTER].",
    contactNote: "Les deux mentions entre crochets restent à remplir — voir ROADMAP.md.",
  },

  /**
   * Les pages de contenu.
   *
   * Trois questions qu'on tape dans un moteur avant de savoir que ce site existe :
   * comment on lit une grille, quelle photo donne quelque chose, et quelle toile
   * acheter. Le guide existant raconte le trajet du début à la fin ; celles-ci
   * répondent chacune à une question entière, ce qui est la forme qu'un moteur —
   * et une personne — cherche réellement.
   *
   * Écrites pour quelqu'un qui n'a jamais brodé, sans rien vendre : la moitié de ce
   * qui suit ne parle pas du convertisseur du tout. C'est voulu. Une page qui répond
   * vraiment est ce qui se partage et ce qui se cite ; une page qui ramène chaque
   * paragraphe au produit est ce qu'on quitte.
   */
  articles: {
    /** Le fil rouge en bas de chaque page : où aller ensuite. */
    relatedHeading: "À lire ensuite",
    ctaTitle: "Essayez sur une de vos photos",
    ctaBody: "Ça ne coûte rien, ça prend une minute, et la grille est à vous.",
    ctaButton: "Créer une grille",

    readChart: {
      kicker: "avant le premier point",
      title: "Comment lire une grille de point de croix",
      lead:
        "Une grille est un plan : chaque case dit où mettre quel fil. Une fois qu'on a compris quatre ou cinq conventions, toutes les grilles se ressemblent.",
      intro:
        "C'est la question qui arrête le plus de monde avant d'avoir commencé, et elle a une réponse courte. Une grille de point de croix n'est ni un dessin à reproduire à main levée ni une partition à déchiffrer : c'est un quadrillage où une case vaut un point, et où un symbole ou une couleur vous dit lequel. Le reste n'est que du comptage.",
      sections: [
        {
          heading: "Une case, un point",
          body:
            "La règle unique dont tout découle. Chaque petit carré de la grille correspond à un croix sur la toile, et il n'y a pas d'échelle à convertir : une grille de 60 cases de large fait 60 points de large, quelle que soit la taille du papier sur lequel elle est imprimée. Une case vide se laisse vide — c'est de la toile nue, pas une erreur.",
        },
        {
          heading: "Les symboles, et pourquoi ils existent",
          body:
            "Beaucoup de grilles montrent un symbole dans chaque case plutôt qu'une couleur. Ce n'est pas de la coquetterie : deux gris voisins sont indiscernables à l'impression, et surtout une grille en symboles reste lisible photocopiée en noir et blanc, ce que fait la moitié des brodeuses pour pouvoir barrer au crayon. Les grilles d'ici sont en couleurs, avec un contour optionnel qui redessine la silhouette — utile justement quand deux nuances se ressemblent trop.",
        },
        {
          heading: "Les traits de comptage",
          body:
            "Un trait plus épais tous les dix carreaux. Il ne veut rien dire pour la broderie : il est là uniquement pour compter par paquets de dix plutôt qu'un par un. La même chose se fait sur la toile avec un fil de bâti passé tous les dix fils, et c'est le conseil le plus rentable de cette page : dix minutes de bâti au début épargnent une soirée de décousage plus tard.",
        },
        {
          heading: "Commencer par le milieu",
          body:
            "Les grilles marquent leur centre, souvent par deux flèches sur les bords. On plie la toile en quatre pour trouver le sien, et on commence là. La raison est bête et suffisante : si vous démarrez dans un coin et que votre comptage dérive d'un point, le motif sort de la toile. En partant du milieu, une erreur se rattrape des deux côtés.",
        },
        {
          heading: "La légende",
          body:
            "C'est la liste de courses. Chaque ligne donne la référence du fil — c'est le numéro qui compte, pas le nom : « 310 » se vend partout, « Noir » ne veut rien dire au comptoir — et, sur les grilles d'ici, le nombre de points de cette couleur. Ce nombre vous dit quoi acheter : un écheveau de coton mouliné couvre environ 1 500 points à deux brins sur de la toile 14 fils.",
        },
        {
          heading: "Compter sans se perdre",
          body:
            "Comptez toujours depuis un repère déjà brodé, jamais depuis le bord de la toile. Un point posé est une certitude ; le bord est à vingt centimètres et à trois erreurs possibles. Travaillez couleur par couleur sur les grandes plages, et zone par zone sur les détails — et gardez un crayon pour barrer au fur et à mesure, parce que retrouver sa place est le vrai coût d'une pause.",
        },
        {
          heading: "Les points partiels et les contours",
          body:
            "Les grilles publiées ailleurs utilisent parfois des demi-points, des quarts de point, ou un trait de contour brodé au point arrière par-dessus le motif fini. Ce sont des raffinements de dessinateur. Les grilles d'ici n'en contiennent aucun : elles sont en points entiers, une case un point, ce qui les rend plus faciles à lire et un peu plus franches à l'œil.",
        },
      ],
    },

    choosePhoto: {
      kicker: "tout se joue ici",
      title: "Quelle photo donne une belle grille de point de croix",
      lead:
        "Le choix de la photo décide du résultat bien plus que les réglages. Voici ce qui survit à la réduction, et ce qui n'y survit jamais.",
      intro:
        "Une grille est une image en très basse définition : 70 points de large, c'est 70 pixels d'information, moins que la vignette d'une application. Tout ce qui demande du détail fin disparaît, et aucun réglage ne le fait revenir. En revanche une photo bien choisie donne quelque chose de reconnaissable, et souvent de plus joli que l'original — la réduction simplifie, et la simplification flatte.",
      sections: [
        {
          heading: "Le sujet doit remplir le cadre",
          body:
            "C'est le seul critère qui compte vraiment. Un chien qui occupe les trois quarts de l'image donne une grille lisible ; le même chien à dix mètres au milieu d'un jardin donne une tache brune. Si vous hésitez entre deux photos, prenez celle où le sujet est le plus gros, même si elle est moins nette : la netteté sera perdue de toute façon, le cadrage non. Recadrez avant de convertir.",
        },
        {
          heading: "Le contraste compte plus que la netteté",
          body:
            "Une photo légèrement floue mais bien contrastée donne une bonne grille. Une photo parfaitement nette dont le sujet a la même valeur que le fond — un chat noir sur un canapé foncé, une robe blanche sur un mur blanc — n'en donne aucune, parce que le convertisseur choisit ses couleurs par différence et qu'il n'y en a pas. Regardez votre photo en plissant les yeux : si le sujet se détache encore, c'est bon signe.",
        },
        {
          heading: "Les fonds chargés",
          body:
            "Une étagère, un feuillage, une rue : le convertisseur dépense ses couleurs à décrire ce désordre au lieu du sujet. Trois solutions, de la plus simple à la moins : recadrer serré, retirer le fond — l'outil le fait, avec un modèle qui tourne sur votre machine — ou baisser le nombre de fils jusqu'à ce que le fond s'aplatisse en une seule masse, ce qui est parfois joli.",
        },
        {
          heading: "Les animaux",
          body:
            "C'est le sujet qui rend le mieux, et de loin. Un pelage se réduit bien parce qu'il est fait de plages de valeurs proches plutôt que de détails ; les yeux et le museau fournissent les points sombres qui donnent une tête. Visez la photo de face, à hauteur de l'animal, prise dehors ou près d'une fenêtre. Un animal noir demande plus de fils que les autres, pas moins : c'est dans les gris très foncés que se joue tout le relief.",
        },
        {
          heading: "Les portraits, franchement",
          body:
            "C'est le sujet le plus difficile, et il vaut mieux le savoir avant. Un visage se lit sur des écarts de carnation minuscules, et l'œil humain remarque immédiatement qu'ils ne sont pas justes. En dessous de 90 points de large, un visage devient une personne vaguement ressemblante ; il faut souvent 120 et une quinzaine de fils pour retrouver quelqu'un. Un profil, une silhouette à contre-jour ou un portrait très contrasté en noir et blanc s'en sortent beaucoup mieux qu'un portrait de face en lumière douce.",
        },
        {
          heading: "Les fleurs, les objets, les paysages",
          body:
            "Une fleur seule, un bouquet, un vélo, une maison : tout ce qui a une forme franche et peu de fond fonctionne. Les paysages sont un cas à part — un panorama entier n'a pas de sujet, donc pas de grille ; mais un arbre isolé, une barque, une ligne d'horizon avec un phare, oui. Là encore : cherchez la forme, pas le détail.",
        },
        {
          heading: "Ce que les réglages peuvent rattraper, et ce qu'ils ne peuvent pas",
          body:
            "Ils peuvent redresser une photo prise de travers, relever l'éclat quand le rendu paraît délavé à côté de l'original, retirer le fond, et changer un fil qui ne vous plaît pas. Ils ne peuvent pas inventer du détail qui n'est pas dans l'image, ni séparer un sujet d'un fond de la même couleur. Le meilleur réglage reste une meilleure photo.",
        },
      ],
    },

    fabric: {
      kicker: "avant de commander",
      title: "Quelle toile choisir, et quelle taille fera la broderie",
      lead:
        "Le compte de la toile décide de la taille finie. Un calcul à une ligne vous dit ce que vous allez obtenir — et combien de fil acheter.",
      intro:
        "C'est la question qui vient juste après « quelle largeur en points », et les deux sont la même question vue des deux bouts. La grille donne un nombre de points ; la toile décide de la place que prend un point ; le produit des deux est votre broderie finie, en centimètres, sur la table.",
      sections: [
        {
          heading: "Ce qu'est le compte d'une toile",
          body:
            "Le nombre inscrit sur l'étiquette — 11, 14, 16, 18 — est le nombre de points par pouce. De la toile aida 14, la plus courante et la plus facile pour commencer, fait donc 14 points sur 2,54 cm, soit environ 5,5 points par centimètre. Plus le nombre est grand, plus les points sont petits : la broderie est plus fine, plus longue, et demande une meilleure vue.",
        },
        {
          heading: "Le calcul de la taille finie",
          body:
            "Divisez le nombre de points par le compte de la toile, en gardant les deux mêmes unités. En centimètres : largeur en points ÷ 5,5 pour de l'aida 14. Une grille de 80 × 100 points donne donc environ 14,5 × 18 cm sur du 14 fils, 18,5 × 23 cm sur du 11 fils, et 11,5 × 14 cm sur du 18 fils. La même grille, trois broderies de tailles très différentes : c'est la toile qui décide, pas la grille.",
        },
        {
          heading: "Les marges",
          body:
            "Ajoutez au moins 5 cm de toile de chaque côté, soit 10 cm à la largeur et 10 cm à la hauteur. Ce n'est pas du gaspillage : il faut de quoi tenir dans le tambour, de quoi encadrer ensuite, et de quoi rattraper si le motif s'est décalé. Une toile coupée au ras du motif est une broderie qu'on ne peut plus monter.",
        },
        {
          heading: "Combien de brins",
          body:
            "Le coton mouliné se vend en écheveaux de six brins qu'on sépare avant de broder. Deux brins sur de la toile 14 fils est le choix habituel : ça couvre bien sans faire de bourrelet. Sur du 11 fils on passe souvent à trois brins, sur du 16 ou du 18 fils à un seul. Si vos points laissent voir la toile entre eux, ajoutez un brin ; s'ils gonflent, enlevez-en un.",
        },
        {
          heading: "Combien de fil acheter",
          body:
            "Un écheveau de coton mouliné DMC fait 8 mètres et couvre environ 1 500 points à deux brins sur de la toile 14 fils. La légende des grilles d'ici donne le nombre de points de chaque couleur : divisez par 1 500, arrondissez au-dessus, et vous avez votre liste. En pratique la plupart des couleurs d'une grille tiennent dans un seul écheveau, et seules une ou deux — le fond, le gros du sujet — en demandent deux.",
        },
        {
          heading: "La couleur de la toile",
          body:
            "L'écru et le blanc sont les plus vendus, et l'écru pardonne davantage : le blanc pur fait ressortir le moindre trou laissé nu. Si votre motif a beaucoup de fond clair, une toile de la couleur de ce fond vous épargne des milliers de points — vous ne brodez alors que le sujet, et la toile fait le reste. C'est aussi ce que fait le retrait de fond de l'outil, mais en amont.",
        },
        {
          heading: "Un tableau pour aller vite",
          body:
            "Sur de l'aida 14 fils, marges comprises : 50 points font environ 9 cm de motif, soit une toile de 19 cm ; 70 points, 13 cm de motif et 23 cm de toile ; 100 points, 18 cm et 28 cm ; 150 points, 27 cm et 37 cm. Au-delà de 150 points de large, comptez en mois plutôt qu'en soirées.",
        },
      ],
    },
  },

  head: {
    home: {
      title: "Photo en grille de point de croix \u2014 gratuit, vrais fils DMC",
      description:
        "Transformez une photo en grille de point de croix imprimable, avec les vraies r\u00e9f\u00e9rences de fils DMC et le nombre de points de chacun. Gratuit, sans compte, et votre photo ne quitte jamais votre navigateur.",
    },
    convert: {
      title: "Convertir une photo en grille de point de croix",
      description:
        "D\u00e9posez une photo, choisissez la largeur en points et le nombre de fils, et t\u00e9l\u00e9chargez la grille imprimable avec sa liste de fils DMC. Tout se passe dans votre navigateur.",
    },
    gallery: {
      title: "Galerie de grilles de point de croix",
      description:
        "Les ouvrages partag\u00e9s par la communaut\u00e9 : parcourez les grilles, voyez les fils utilis\u00e9s, et r\u00e9cup\u00e9rez n'importe laquelle gratuitement.",
    },
    galleryStitches: {
      title: "Les broderies de la communaut\u00e9 au point de croix",
      description:
        "Des broderies termin\u00e9es, photographi\u00e9es par celles et ceux qui les ont brod\u00e9es \u2014 depuis des grilles faites ici, comme depuis des mod\u00e8les trouv\u00e9s ailleurs.",
    },
    about: {
      title: "Qui sommes-nous",
      description:
        "Un petit outil gratuit pour transformer une photo en grille de point de croix, fait par deux personnes. D'o\u00f9 il vient, et pourquoi tout tourne dans votre navigateur.",
    },
    account: {
      title: "Mon compte",
      description: "Votre nom dans la galerie, votre bio et votre marque.",
    },
    piece: {
      title: (title: string, maker: string) => `${title}, par ${maker} \u2014 grille de point de croix`,
      description: (maker: string, w: number, h: number, threads: number) =>
        `Une grille de point de croix partag\u00e9e par ${maker} : ${w} \u00d7 ${h} points en ${threads} fils DMC. R\u00e9cup\u00e9rez la grille gratuitement, avec la liste des fils et le nombre de points de chaque couleur.`,
    },
    pieceStitch: {
      title: (title: string, maker: string) => `${title}, brod\u00e9 par ${maker}`,
      description: (maker: string) =>
        `Une broderie termin\u00e9e, partag\u00e9e par ${maker} dans la galerie \u2014 photographi\u00e9e une fois le dernier n\u0153ud fait.`,
    },
    maker: {
      title: (maker: string) => `${maker} \u2014 ses grilles de point de croix`,
      description: (maker: string, pieces: number) =>
        pieces === 1
          ? `La grille que ${maker} a partag\u00e9e dans la galerie. \u00c0 r\u00e9cup\u00e9rer gratuitement, avec sa liste de fils DMC.`
          : `Les ${pieces} grilles que ${maker} a partag\u00e9es dans la galerie. \u00c0 r\u00e9cup\u00e9rer gratuitement, avec leur liste de fils DMC.`,
      /** Quand le membre n'a encore rien publi\u00e9. */
      empty: (maker: string) =>
        `${maker} n'a encore rien partag\u00e9 dans la galerie de La Vallée.`,
    },
    /** Ce que fait l'outil, pour le graphe SoftwareApplication. Court : ce sont des
     *  \u00e9tiquettes lues par une machine, pas une page de vente. */
    features: [
      "Convertit une photo en grille de point de croix",
      "Vraies r\u00e9f\u00e9rences de fils DMC",
      "Grille imprimable avec la liste des fils",
      "Tout tourne dans le navigateur",
    ],
  },

  notFound: {
    title: "Cette page a glissé du tambour",
    body: "La page que vous cherchez n'existe pas — ou n'a pas encore été brodée.",
    home: "Retour à l'accueil",
  },
}
