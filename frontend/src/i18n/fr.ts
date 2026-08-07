// La copie française, chargée avec l'application.
//
// Statique, contrairement à `en.ts` : c'est la langue par défaut du site, ses URL
// sont françaises et son public l'est aussi. Un visiteur francophone ne télécharge
// donc jamais l'anglais.
import type { Copy } from "./copy"

export const fr: Copy = {
  lang: { label: "Langue", fr: "Français", en: "English", switchTo: "Switch to English" },

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
      download: (num: string) => `Télécharger le DMC ${num} seul`,
      saving: "Préparation…",
      downloadHint: "une feuille par écheveau — pratique pour deux teintes qui se ressemblent",
      legendTitle: (num: string, stitches: number, w: number, h: number) =>
        `DMC ${num} seul · ${stitches.toLocaleString("fr")} points · grille ${w} x ${h}`,
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
      "Picture to DMC est un petit outil gratuit, fait par deux personnes qui voulaient une grille à partir d'une photo et qui n'en trouvaient pas une seule honnête sur les fils.",
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
  },

  notFound: {
    title: "Cette page a glissé du tambour",
    body: "La page que vous cherchez n'existe pas — ou n'a pas encore été brodée.",
    home: "Retour à l'accueil",
  },
}
