/**
 * The name, in this language. See the note on the French copy.
 *
 * "Cross Stitch Valley" rather than a translation of the French, because it is the
 * name an English speaker would give the same place — and because "The Valley of
 * Cross Stitch" reads like a chapter heading.
 *
 * No separate short form: nineteen characters already fits a browser tab and the
 * line printed across a chart, so inventing one would be a second name to keep in
 * step for no gain.
 */
const NAME = "Cross Stitch Valley"
const SHORT = NAME

// La copie anglaise, et la référence pour le jeu de clés.
//
// Dans son propre fichier parce qu'elle est chargée à la demande : les deux
// langues réunies pesaient 52 kB dans le paquet que tout visiteur télécharge en
// premier, dont la moitié que personne ne lira jamais. Le site est
// francophone d'abord — `fr.ts` part avec l'application, ce fichier arrive quand
// il est demandé, et `Copy` continue de venir d'ici par un import de TYPE, qui ne
// laisse rien à l'exécution.
//
// Les chaînes interpolées sont des fonctions plutôt que des « {n} » : les types
// garantissent alors que chaque appel passe les bons arguments.

export const en = {
  lang: { label: "Language", fr: "Français", en: "English", switchTo: "Passer en français" },

  /**
   * The name, and the wordmark's two lines.
   *
   * `ofFirst` is true here and false in French, and that is the whole difference
   * between the two lockups. French leads with the place and follows with what is
   * in it; English puts the modifier in front of the noun. So the handwritten line
   * moves above the display line, reading order still gives "cross stitch valley",
   * and the big word is still the place.
   */
  site: { name: NAME, short: SHORT, place: "VALLEY", of: "cross stitch", ofFirst: true },

  nav: {
    gallery: "Gallery",
    guide: "How to",
    about: "About us",
    faq: "FAQ",
    convert: "Convert a photo",
    start: "Start a pattern",
    menu: "Menu",
  },

  home: {
    badge: "100% free",
    heroTitleBefore: "Turn any photo into a ",
    heroTitleAccent: "cross-stitch",
    heroTitleAfter: " pattern",
    heroLead:
      "Choose a picture and every stitch is matched to a real DMC thread colour, right here in your browser — then you leave with a chart that's ready to hoop.",
    ctaUpload: "Choose a photo",
    ctaSample: "See a sample pattern",
    heroNote: "from photo to chart in about a minute ↷",
    demoPhoto: "your photo",
    demoPattern: "your pattern",
    demoTry: "Try this photo — it opens ready to convert",
    demoPhotoAlt: "A photo of a strawberry",
    demoPatternAlt: "The same strawberry as a cross-stitch chart, in 9 DMC threads, with its thread list",
    demoMatched: (n: number) => `matched to ${n} DMC threads`,

    stepsKicker: "as easy as one, two, three (and four)",
    stepsTitle: "How it works",
    steps: [
      {
        title: "Choose a photo",
        body: "Any JPG, PNG or WebP — pets and portraits work beautifully. It stays on your machine.",
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
        body: "Don't like a matched color? Tap it and pick from the 483 plain-cotton DMC shades.",
      },
      {
        title: "Use your own threads",
        body: "Already have a thread box? Give us your DMC codes and we'll only use those.",
      },
      {
        title: "See every colour",
        body: "Tap a thread in the list and every stitch in that colour stays lit on the pattern until you tap it again.",
      },
    ],

    stepsMore: "The whole guide, step by step",
    faqMore: "All the questions and answers",
    faqKicker: "the things people ask first",
    faqTitle: "Good to know",
    faq: [
      {
        q: "Is it really free?",
        a: "Yes — every pattern, every download, no account and no watermark. There's nothing to buy here.",
      },
      {
        q: "What happens to my photo?",
        a: "Nothing — it never leaves your computer. The whole conversion runs in your browser, so your picture is never uploaded, never stored and never seen by us. Sharing a finished piece sends the grid, and only that.",
      },
      {
        q: "How many thread colors should I pick?",
        a: "Between 8 and 15 suits most photos. Fewer reads bolder and stitches faster; more keeps the detail but means more thread changes.",
      },
      {
        q: "Which files can I upload?",
        a: "JPG, PNG, WebP and AVIF. Transparent PNGs work too — the transparent parts are simply left unstitched.",
      },
    ],

    ctaKicker: "ready when you are",
    ctaTitle: "Start your first pattern",
    ctaButton: "Choose a photo — it's free",
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
    /** See the note on the French copy: the groups are named, the marks are not. */
    marks: {
      heading: "Your mark",
      lead: "It appears on your pieces and your comments.",
      change: "Choose another",
      groups: { flowers: "Flowers", animals: "Animals" },
      option: (group: string, n: number) => `${group}, mark ${n}`,
      note: "Every mark is a photograph reduced to 56 stitches and converted to real DMC threads — stitchable, like everything else here.",
    },
    saveFailed: "That wasn't saved. Try again.",
    saving: "Saving…",
    saved: "saved",
    publicPage: "See my page",
    signInFirst: "Sign in to see your account.",
    /** See the note on the French copy. */
    signInUnavailable:
      "Google sign-in is not configured on this server. That is normal locally — see DEV_LOGIN in PythonDCA/api/config.py.",
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

    /** Deleting your own account. See the note on the French copy: the privacy page
     *  promises deletion, so this deletes rather than anonymises. */
    danger: {
      heading: "Delete my account",
      lead: "Permanent. Nothing can be put back afterwards.",
      open: "Delete my account",
      dialogTitle: "Delete your account?",
      whatGoes: "Here is what will be erased:",
      account: "Your account, your name and your email address",
      posts: (n: number) =>
        n === 0 ? "No published charts" : n === 1 ? "Your published chart" : `Your ${n} published charts`,
      comments: (n: number) =>
        n === 0 ? "No comments" : n === 1 ? "Your comment" : `Your ${n} comments`,
      likes: (n: number) =>
        n === 0 ? "No hearts given" : n === 1 ? "The heart you gave" : `The ${n} hearts you gave`,
      irreversible:
        "Anyone who downloaded one of your charts keeps it — it is already on their machine. But it leaves the gallery for everybody.",
      confirmLabel: "To confirm, type DELETE",
      confirmWord: "DELETE",
      confirm: "Delete permanently",
      cancel: "Cancel",
      working: "Deleting…",
      failed: "That didn't go through. Try again.",
      done: "Your account has been deleted.",
    },
  },

  publish: {
    open: "Share this piece",
    title: "Share your piece",
    lead: "It goes in the gallery with your name on it. You can delete it whenever you like.",
    nameLabel: "Give it a title",
    namePlaceholder: "Milo in the window",
    categoryLabel: "Category",
    patternPreview: "Your pattern",
    // Optional on this path: the chart is the post, and a picture of it stitched
    // is the extra that puts the same piece in both galleries.
    photoLabel: "Photo of it stitched",
    photoOptional: "optional",
    photoNote: "With a photo, your piece shows up in both galleries.",
    submit: "Publish",
    working: "Publishing…",
    needSignIn: "Sign in to share a piece",
    done: "Published — thank you!",
    failed: "It didn't publish. Try again.",
    tooBig: "That pattern is too big to send. Try fewer stitches.",
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
      all: (n: number) => `See all ${n} colours`,
      less: "Show fewer",
    },
    photoAlt: (title: string) => `${title}, stitched`,
    patternAlt: (title: string) => `The grid for ${title}`,
    // A photo post has no grid behind it. Saying so beats a page that quietly
    // lacks the chart button every other piece has.
    stitchNote: "a finished piece, shared by whoever stitched it",
    noChart: "No chart with this one — it was stitched from a pattern found elsewhere.",
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
      `${SHORT} · ${colours} ${colours === 1 ? "colour" : "colours"} · ${stitches.toLocaleString("en")} stitches · ${w} x ${h}`,
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
      download: (num: string) => `Download DMC ${num} on its own`,
      saving: "Preparing…",
      // Says what it is for, which is the bit that is not obvious: two shades you
      // cannot tell apart on the full chart never have to be told apart at all.
      downloadHint: "one sheet per skein — handy for two shades that look alike",
      // Its own title, because the chart's would say "1 colour" and read as though
      // the whole piece took one thread.
      legendTitle: (num: string, stitches: number, w: number, h: number) =>
        `${SHORT} · DMC ${num} alone · ${stitches.toLocaleString("en")} stitches · grid ${w} x ${h}`,
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
    seePiece: "See this piece →",
    noPreview: "no picture yet",
    shareTitle: "Finished a piece?",
    shareBody: "Snap a photo of it in the hoop and add it to the gallery.",
    shareCta: "Share your stitch",
    shareNote: "no account needed — just a photo",
    showMore: "Show more pieces",
    empty: "Nothing in this category yet. Yours could be the first!",
    // Two galleries, one page. The same two words wherever they appear.
    tabs: { patterns: "Charts", finished: "Finished pieces" },
    patterns: {
      title: "The chart gallery",
      inviteTitle: "Make one from a photo",
      inviteBody: "Convert a picture and your chart lands here with your name on it.",
      inviteCta: "Convert a photo",
      emptyAll: "No charts yet. Yours could be the first!",
    },
    finished: {
      title: "Finished pieces",
      // The one thing this page's title does not already say, and the thing that
      // stops people assuming they may only post what they charted here.
      lead: "The chart can come from here or from anywhere.",
      inviteTitle: "Finished a piece?",
      inviteBody: "One photo is enough. No chart needed, wherever you got it.",
      inviteCta: "Add your photo",
      emptyAll: "No pieces here yet. Be the first to show yours!",
    },
    loading: "Fetching the gallery…",
    failed: "Couldn't load the gallery. Reload the page?",
    filterLabel: "Filter by subject",
    // Each sort button says which way it runs, because an arrow on its own tells
    // you a direction without telling you what is being ordered. The button that
    // is already chosen carries the arrow; clicking it turns the order around.
    sort: {
      label: "Sort",
      new: { desc: "Newest", asc: "Oldest" },
      top: { desc: "Most loved", asc: "Least loved" },
      reverse: (current: string) => `Sorted by “${current}”. Click to reverse the order.`,
    },
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
      heading: "Adjust",
      vividness: "Colour brightness",
      vividnessSteps: ["Natural", "Vivid", "Very vivid"],
      rotation: "Turn the picture",
      // Never an angle. "Pick the one that's the right way up" is the criterion as a
      // person states it, and it is judged against the picture beside it.
      rotationHint: "Pick the one that's the right way up.",
      rotationHintEmpty: "Add a photo to choose which way up.",
      rotationOptions: {
        0: "As your photo is",
        90: "Turned to the right",
        180: "Upside down",
        270: "Turned to the left",
      } as Record<number, string>,
      removeBg: "Remove the background",
      // Two facts, and the second is the one people were not told: cutting the
      // background out runs a model over the photograph, so the grid takes a few
      // seconds longer to come back. Saying so beats looking broken.
      removeBgHint: "Works on a plain background — the grid takes a little longer to build.",
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
      toggleOff: "All 483 DMC shades",
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
      hints: "Tap a thread to find it on the pattern · the wheel swaps it",
      pinAria: (code: string) => `Find DMC ${code} on the pattern`,
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
    /** The photo gallery. The chart gallery is in the header; this one is a
     *  secondary page by this footer's own definition, and it had exactly one
     *  inbound link in the whole site — the tab it sits behind. */
    stitches: "Finished pieces",
    guide: "How to",
    about: "About",
    faq: "FAQ",
    contact: "Contact",
    privacy: "Privacy",
    madeBy: "Made by",
  },

  /** Placeholder prose, structured but not final — Felix will supply the real
   *  copy. Written as something plausible rather than lorem ipsum, so the page can
   *  be judged as a page. */
  aboutPage: {
    kicker: "who is behind this",
    title: "Qui sommes-nous",
    lead:
      "Cross Stitch Valley is a small, free tool made by two people who kept wanting a chart from a photo and kept not finding one that was honest about the threads.",
    blocks: [
      {
        heading: "It started with one photograph",
        body:
          "A picture of a dog, a Sunday afternoon, and an evening lost to counting squares by hand. The first version was a script that did the counting. Everything since has been the same idea, better dressed.",
      },
      {
        heading: "Every colour is a thread you can buy",
        body:
          "The converter matches each stitch to one of the 483 plain-cotton DMC shades, judged the way an eye judges colour rather than the way a computer adds numbers. What you download names real references, with the number of stitches of each, so you can walk into a shop with the list.",
      },
      {
        heading: "Free, and staying that way",
        body:
          "No account to convert, no watermark, nothing to buy. Signing in exists so you can put a finished piece in the gallery, and that is all it is for.",
      },
      {
        heading: "It runs in your browser",
        body:
          "Your photograph is never uploaded to make a chart — the whole conversion happens on your own machine. Sharing a finished piece sends the grid, which is a few kilobytes, and the photograph only if you choose to add one.",
      },
    ],
    ctaTitle: "Have a go",
    ctaBody: "Pick a photograph and see what it looks like in thread.",
    ctaButton: "Make a chart",
  },

  /**
   * The FAQ page, and the guide.
   *
   * Both exist because a page that answers a question is what search rewards, and
   * because four questions on an anchor of the home page cannot be found by anyone
   * looking for one of them. Every answer here is true of the code as it stands —
   * the old FAQ said a photograph was uploaded to a server, which was once true and
   * had quietly stopped being so.
   */
  faqPage: {
    kicker: "everything people ask",
    title: "Questions and answers",
    lead: "How the converter works, what the settings do, and what happens to your photograph.",
    groups: [
      {
        heading: "The basics",
        items: [
          {
            q: "Is it really free?",
            a: "Yes. Every chart, every download, no account and no watermark. There is nothing to buy and nothing held back for a paid version.",
          },
          {
            q: "What happens to my photograph?",
            a: "Nothing \u2014 it never leaves your computer. The whole conversion runs in your browser, so your picture is never uploaded, never stored and never seen by us. Sharing a finished piece sends the grid, and only that.",
          },
          {
            q: "Do I need an account?",
            a: "Only to put a piece in the gallery. Converting a photograph and downloading its chart needs nothing at all.",
          },
          {
            q: "Which files can I use?",
            a: "JPG, PNG, WebP and AVIF. A transparent PNG works too \u2014 the transparent parts are simply left unstitched, so you get the subject on bare fabric.",
          },
        ],
      },
      {
        heading: "Choosing the settings",
        items: [
          {
            q: "How many thread colours should I pick?",
            a: "Between 8 and 15 suits most photographs. Fewer reads bolder and stitches much faster; more keeps fine detail but means more thread changes, and past about 20 the extra shades are usually neighbours you cannot tell apart on cloth.",
          },
          {
            q: "How wide should I make it?",
            a: "The width in stitches decides both the detail and the finished size. A face needs about 80 stitches across before it looks like the person; a simple motif is happy at 40. Divide the stitch count by your fabric's count for the size \u2014 80 stitches on 14-count aida is a little under 15 cm.",
          },
          {
            q: "What does aida count mean?",
            a: "The number of stitches per inch. 14-count is the usual starting point: comfortable to see and to work. A higher count is finer cloth, a smaller finished piece and more squinting.",
          },
          {
            q: "What is the vividness setting for?",
            a: "Photographs are duller than thread. Matched faithfully, a mid-saturation photo picks mid-saturation shades and the finished piece can read flat next to the picture it came from. Vivid lifts the colour without touching brightness, which is corrective rather than a filter.",
          },
          {
            q: "Why does removing the background take longer?",
            a: "Because it runs a real segmentation model over your photograph, in your browser, to find the subject. A few seconds the first time \u2014 the model has to be fetched \u2014 and quicker after. It works best on a plain background: a cat on a patterned rug will not come out cleanly.",
          },
        ],
      },
      {
        heading: "The chart itself",
        items: [
          {
            q: "What is in the file I download?",
            a: "A PNG with your pattern drawn at 20 pixels a stitch, a counting grid with a heavier rule every ten stitches, and the thread list underneath: every DMC reference, its name, and how many stitches of it you need.",
          },
          {
            q: "Can I get one colour at a time?",
            a: "Yes. In the download panel, click any thread and you get that thread on its own, with the outline of the whole piece around it so you can see where those stitches go. It is the sheet to work from with one skein in your hand \u2014 and it is how you tell two near-identical shades apart.",
          },
          {
            q: "Are the colours real DMC threads?",
            a: "Every one. The converter matches against 483 plain-cotton DMC shades, judged the way an eye judges colour rather than the way a computer adds numbers. Metallic, satin and \u00c9toile ranges are deliberately excluded \u2014 they share their colour codes with plain cotton, and being sent out for shiny black thread when you wanted black is not helpful.",
          },
          {
            q: "Can I use only the threads I already own?",
            a: "Yes. Give it your DMC references and it will match using nothing else.",
          },
          {
            q: "Can I sell what I stitch?",
            a: "As far as we are concerned, yes \u2014 the chart is yours. Do check you have the right to use the photograph itself, which is a separate question and not ours to answer.",
          },
        ],
      },
    ],
  },

  guide: {
    kicker: "from a photograph to a hoop",
    title: "How to make a cross-stitch chart from a photo",
    lead: "The whole thing, start to finish: about a minute of work and a few evenings of stitching.",
    intro:
      "A cross-stitch chart is a grid where every square tells you which colour of thread to put there. Turning a photograph into one means two decisions \u2014 how big, and how many colours \u2014 and then reading the answer. This page walks through both, and through the settings worth touching once you have.",
    steps: [
      {
        heading: "Pick a photograph that will survive being small",
        body: "A chart is a very low-resolution picture: 60 stitches across is 60 pixels of information. What survives that is a clear subject, good contrast, and not much background \u2014 a pet against a wall, a flower, a single object. What does not survive is a busy scene, a distant face, or fine texture. If you have a choice, take the one where the subject fills the frame.",
      },
      {
        heading: "Choose the width in stitches",
        body: "This decides the detail and the finished size at once. 40 stitches is a small motif, 60 to 90 is the usual range for something recognisable, and past 150 you are committing to months. Divide by your fabric's count for the size: 80 stitches on 14-count aida is about 14.5 cm across.",
      },
      {
        heading: "Choose how many threads",
        body: "Eight to fifteen suits most photographs. Fewer is bolder, faster and often prettier; more keeps detail at the cost of a thread change every few stitches. The counter tells you how many stitches each colour takes, which is the honest measure of how much work you have signed up for.",
      },
      {
        heading: "Adjust, if it needs it",
        body: "Turn the picture if it came off a phone sideways. Lift the vividness if the result looks washed out next to the photograph \u2014 thread is more saturated than a screen. Remove the background if you want the subject on bare cloth. Every change redraws the grid straight away, so you can judge it rather than imagine it.",
      },
      {
        heading: "Swap any thread you do not like",
        body: "Tap a thread in the list to see exactly which stitches it covers, and use the wheel beside it to pick a different shade from the full DMC chart. This is worth doing for skin tones and for skies, where the nearest match by number is not always the one that looks right.",
      },
      {
        heading: "Download the chart, and buy the thread",
        body: "The PNG holds the grid, the counting rules and the thread list with a stitch count per colour. One skein of stranded cotton covers roughly 1,500 stitches at two strands on 14-count, so the counts tell you what to buy. Print it as large as your printer allows \u2014 you will be counting squares on it for a while.",
      },
      {
        heading: "Stitch it",
        body: "Start in the middle and work outwards, so a miscount cannot push the design off the fabric. Two strands on 14-count aida is the usual choice. Cross every stitch the same way \u2014 top arm in the same direction throughout \u2014 and the finished surface catches the light evenly.",
      },
    ],
    ctaTitle: "Try it on a photograph",
    ctaBody: "It costs nothing and takes about a minute to see whether your picture works.",
    ctaButton: "Make a chart",
  },

  /**
   * What each route calls itself.
   *
   * Separate from the page copy because these are written for two readers who never
   * see the page: a search result and a shared link. A title is about 60 characters
   * before it is truncated and a description about 155, so each one leads with the
   * words somebody would have typed rather than with the site's name.
   */
  /** Publishing a photo on its own — the second gallery's own way in. */
  shareWork: {
    open: "Show your work",
    title: "Show your work",
    lead: "A photo, a title, and it joins the gallery with your name on it. The chart can come from anywhere.",
    photoLabel: "Photo of your piece",
    pick: "Choose a photo",
    change: "Choose another",
    hint: "JPG, PNG or WebP · 6 MB max",
    needPhoto: "The photo is the whole post — choose one to carry on.",
    tooHeavy: "That photo is over 6 MB. Try a smaller one.",
    unreadable: "That file could not be read. Try another photo.",
    done: "It is in the gallery — thank you!",
  },

  /** Flagging a piece. Free photos are why this exists. */
  report: {
    open: "Report",
    title: "Report this piece",
    lead: "It goes to the people who run the gallery, and they will look at it.",
    reasonLabel: "What is wrong with it?",
    reasons: {
      notMine: "It is not their work",
      explicit: "Not for everyone",
      spam: "Spam",
      offTopic: "Nothing to do with stitching",
      other: "Something else",
    },
    noteLabel: "Anything to add?",
    notePlaceholder: "Only if it helps — a line is plenty.",
    submit: "Send the report",
    working: "Sending…",
    done: "Sent. Thanks for telling us.",
    close: "Close",
    failed: "It was not sent. Try again.",
  },

  /** The queue, for whoever runs the place. */
  reports: {
    title: "Reported pieces",
    lead: "Newest first. Open the piece to judge it, then either delete it or clear the report.",
    empty: "Nothing reported. Quiet day.",
    loading: "Fetching the reports…",
    failed: "Could not load the reports.",
    forbidden: "This page is for admins.",
    reportedBy: (who: string) => `reported by ${who}`,
    by: (who: string) => `by ${who}`,
    open: "Open the piece",
    dismiss: "Clear",
    dismissing: "Clearing…",
    kind: { pattern: "chart", photo: "photo" },
    link: "Reported pieces",
  },

  /** The privacy page. See the note on the French copy: every sentence is drawn from
   *  the code, and the two bracketed values are Felix's to fill in. */
  privacyPage: {
    kicker: "what this site knows about you",
    title: "Privacy",
    lead:
      "Short, because there is not much to say: your photo never leaves your browser, and the site does not follow you around.",
    updated: "Last updated: 7 August 2026",
    blocks: [
      {
        heading: "Your photo does not leave",
        body:
          "The whole conversion — the downscale, the colour choice, the DMC thread matching, drawing the chart — runs on your machine, in your browser. No image is sent to a server to be converted, so there is nothing to keep, nothing to analyse and nothing to lose. Cut your connection once the page has loaded and the conversion still works.",
      },
      {
        heading: "Without an account, nothing is recorded",
        body:
          "Converting a photo, downloading a chart, browsing the gallery: none of it needs an account and none of it is recorded on the server. Your current settings are kept in your browser's local storage, on your device, so your work is still there when you come back. Clearing the site's data removes them.",
      },
      {
        heading: "If you sign in with Google",
        body:
          "Signing in does one thing: it lets you publish to the gallery and comment. Google then passes us your name, your email address and the address of your profile picture. We keep those three, plus the date the account was created, and the bio and mark you choose. We ask Google for nothing else and can see nothing else — not your contacts, not your calendar, not your files.",
      },
      {
        heading: "What you publish is public",
        body:
          "A shared chart, its title, its category, a photo of the finished piece if you add one, your comments and your hearts are visible to everyone, with your name on them. That is what a gallery is. You can delete your own posts and your own comments whenever you like.",
      },
      {
        heading: "One cookie, and it follows nothing",
        body:
          "The session cookie keeps you signed in. It holds a random token that means nothing anywhere but this site, the page's JavaScript cannot read it, and the database keeps only a fingerprint of that token — so a copy of the database would let nobody sign in as anybody. It lasts 180 days, and expired sessions are deleted. A second, temporary cookie exists for the round trip to Google, to stop anyone signing you in without your knowing. That is all: no advertising cookie, no analytics cookie.",
      },
      {
        heading: "No trackers, no analytics",
        body:
          "No Google Analytics, no pixel, no social network button, no third-party script of any kind. Even the fonts are served from this server rather than by Google Fonts, precisely so that no request goes elsewhere while you read. The site does not know how many people visit it, and that is a choice.",
      },
      {
        heading: "How long",
        body:
          "Your account and what you have published stay for as long as you keep them. Sessions expire after 180 days. The server logs of the host that runs this site hold IP addresses for a few days, as any web server does, for diagnosis and security.",
      },
      {
        heading: "Your rights",
        body:
          "You can ask for a copy of what the site holds about you, for it to be corrected, or for all of it to be deleted — account, posts and comments. Write to the address below and it will be done. You can also do all of it yourself without writing to anyone: “Delete my account”, at the foot of your account page. It is immediate and permanent. You can also withdraw this site's access at any time from your Google account settings.",
      },
    ],
    contactHeading: "Write to us",
    contactBody:
      "For anything about this page, or to exercise one of those rights, write to [ADDRESS TO FILL IN]. The data controller is [IDENTITY TO FILL IN].",
    contactNote: "Both bracketed values still need filling in — see ROADMAP.md.",
  },

  /** The content pages. See the note on the French copy — these answer a whole
   *  question each, and half of what is in them does not mention the tool. */
  articles: {
    relatedHeading: "Read next",
    ctaTitle: "Try it on one of your photos",
    ctaBody: "It costs nothing, it takes a minute, and the chart is yours.",
    ctaButton: "Make a chart",

    readChart: {
      kicker: "before the first stitch",
      title: "How to read a cross-stitch chart",
      lead:
        "A chart is a plan: each square says where to put which thread. Once four or five conventions make sense, every chart looks the same.",
      intro:
        "This is the question that stops most people before they have started, and it has a short answer. A cross-stitch chart is neither a drawing to copy freehand nor a score to decipher: it is a grid where one square is one stitch, and a symbol or a colour tells you which. The rest is counting.",
      sections: [
        {
          heading: "One square, one stitch",
          body:
            "The single rule everything follows from. Each little square on the chart is one cross on the fabric, and there is no scale to convert: a chart 60 squares wide is 60 stitches wide, whatever size paper it was printed on. An empty square is left empty — that is bare fabric, not a mistake.",
        },
        {
          heading: "Symbols, and why they exist",
          body:
            "Many charts show a symbol in each square rather than a colour. That is not fussiness: two neighbouring greys are indistinguishable in print, and a chart in symbols stays readable photocopied in black and white, which is what half of all stitchers do so they can cross squares off in pencil. Charts from here are in colour, with an optional keyline that redraws the silhouette — useful precisely when two shades are too close to tell apart.",
        },
        {
          heading: "The counting rules",
          body:
            "A heavier line every ten squares. It means nothing for the stitching: it is there only so you can count in tens rather than one at a time. The same thing is done on the fabric with a tacking thread run every ten threads, and it is the most profitable advice on this page: ten minutes of tacking at the start saves an evening of unpicking later.",
        },
        {
          heading: "Start from the middle",
          body:
            "Charts mark their centre, usually with two arrows on the edges. You fold the fabric in four to find its own, and start there. The reason is dull and sufficient: begin in a corner, drift by one stitch, and the motif runs off the fabric. From the middle, an error has somewhere to go on both sides.",
        },
        {
          heading: "The legend",
          body:
            "This is the shopping list. Each line gives the thread's reference — the number is what matters, not the name: \"310\" is sold everywhere, \"Black\" means nothing at a counter — and, on charts from here, how many stitches of that colour there are. That number tells you what to buy: one skein of stranded cotton covers about 1,500 stitches at two strands on 14-count.",
        },
        {
          heading: "Counting without losing your place",
          body:
            "Always count from something already stitched, never from the edge of the fabric. A stitch in place is a certainty; the edge is twenty centimetres and three possible mistakes away. Work colour by colour across large areas and area by area on detail — and keep a pencil to cross things off as you go, because finding your place again is the real cost of a break.",
        },
        {
          heading: "Fractional stitches and outlines",
          body:
            "Charts published elsewhere sometimes use half stitches, quarter stitches, or an outline worked in backstitch over the finished motif. Those are a designer's refinements. Charts from here contain none of them: they are whole stitches, one square one stitch, which makes them easier to read and a little bolder to look at.",
        },
      ],
    },

    choosePhoto: {
      kicker: "everything is decided here",
      title: "Which photo makes a good cross-stitch chart",
      lead:
        "The photograph decides the result far more than the settings do. Here is what survives being reduced to a grid, and what never does.",
      intro:
        "A chart is a very low-resolution image: 70 stitches wide is 70 pixels of information, less than an app icon. Anything that needs fine detail disappears, and no setting brings it back. A well-chosen photograph, though, gives something recognisable and often prettier than the original — reduction simplifies, and simplification flatters.",
      sections: [
        {
          heading: "The subject must fill the frame",
          body:
            "This is the only criterion that really counts. A dog filling three quarters of the picture makes a readable chart; the same dog ten metres away in a garden makes a brown smudge. If you are choosing between two photographs, take the one where the subject is biggest, even if it is less sharp: sharpness will be lost anyway, framing will not. Crop before you convert.",
        },
        {
          heading: "Contrast matters more than sharpness",
          body:
            "A slightly blurred but well-contrasted photograph makes a good chart. A perfectly sharp one whose subject sits at the same value as its background — a black cat on a dark sofa, a white dress against a white wall — makes none, because the converter picks its colours by difference and there is none. Squint at your photograph: if the subject still separates, that is a good sign.",
        },
        {
          heading: "Busy backgrounds",
          body:
            "A shelf, foliage, a street: the converter spends its colours describing that clutter instead of the subject. Three fixes, best first: crop tighter, remove the background — the tool does it, with a model that runs on your own machine — or drop the thread count until the background flattens into a single mass, which is sometimes rather good.",
        },
        {
          heading: "Animals",
          body:
            "This is the subject that works best, by a distance. Fur reduces well because it is made of areas of close values rather than of detail; eyes and nose supply the dark points that make it a face. Aim for a photograph taken head-on, at the animal's height, outdoors or near a window. A black animal needs more threads than others, not fewer: all the modelling lives in the very dark greys.",
        },
        {
          heading: "Portraits, honestly",
          body:
            "This is the hardest subject and it is better to know beforehand. A face reads on tiny differences in skin tone, and the human eye notices immediately when they are wrong. Below about 90 stitches wide, a face becomes someone vaguely similar; it often takes 120 and fifteen threads to get an actual person back. A profile, a backlit silhouette, or a very contrasty black-and-white portrait do far better than a front-lit face in soft light.",
        },
        {
          heading: "Flowers, objects, landscapes",
          body:
            "A single flower, a bunch, a bicycle, a house: anything with a clear shape and little background works. Landscapes are a special case — a whole panorama has no subject, so it makes no chart; but a lone tree, a boat, a horizon with a lighthouse on it, yes. Again: look for the shape, not the detail.",
        },
        {
          heading: "What the settings can rescue, and what they cannot",
          body:
            "They can straighten a photograph taken sideways, lift the colour when the result looks washed out beside the original, cut the background away, and swap a thread you dislike. They cannot invent detail that is not in the image, nor separate a subject from a background of the same colour. The best setting is still a better photograph.",
        },
      ],
    },

    fabric: {
      kicker: "before you order",
      title: "Which fabric to choose, and how big the piece will be",
      lead:
        "The fabric's count decides the finished size. A one-line sum tells you what you will get — and how much thread to buy.",
      intro:
        "This is the question that comes straight after \"how many stitches wide\", and the two are the same question from opposite ends. The chart gives a number of stitches; the fabric decides how much room a stitch takes; multiply them and you have your finished piece, in centimetres, on the table.",
      sections: [
        {
          heading: "What a fabric's count is",
          body:
            "The number on the label — 11, 14, 16, 18 — is stitches per inch. So 14-count aida, the commonest and the easiest to start on, is 14 stitches in 2.54 cm, about 5.5 per centimetre. The bigger the number, the smaller the stitches: finer work, longer work, and better eyesight required.",
        },
        {
          heading: "Working out the finished size",
          body:
            "Divide the number of stitches by the fabric's count, keeping the units the same. In centimetres: stitches ÷ 5.5 for 14-count. A chart of 80 × 100 stitches is therefore about 14.5 × 18 cm on 14-count, 18.5 × 23 cm on 11-count, and 11.5 × 14 cm on 18-count. One chart, three very different pieces: the fabric decides, not the chart.",
        },
        {
          heading: "Margins",
          body:
            "Add at least 5 cm of fabric on every side — 10 cm to the width and 10 cm to the height. This is not waste: you need enough to hold in the hoop, enough to frame afterwards, and enough to recover if the motif drifted. Fabric cut close to the motif is a piece that can never be mounted.",
        },
        {
          heading: "How many strands",
          body:
            "Stranded cotton is sold in skeins of six strands, separated before stitching. Two strands on 14-count is the usual choice: good coverage without bulk. On 11-count people often go to three, on 16 or 18 to one. If the fabric shows between your stitches, add a strand; if they look padded, take one away.",
        },
        {
          heading: "How much thread to buy",
          body:
            "One skein of DMC stranded cotton is 8 metres and covers about 1,500 stitches at two strands on 14-count. The legend on charts from here gives the stitch count for every colour: divide by 1,500, round up, and that is your list. In practice most colours in a chart fit in a single skein, and only one or two — the background, the bulk of the subject — need a second.",
        },
        {
          heading: "The colour of the fabric",
          body:
            "Ecru and white sell most, and ecru is the more forgiving: pure white shows up every hole left bare. If your motif has a lot of pale background, fabric the colour of that background saves you thousands of stitches — you stitch only the subject and the cloth does the rest. That is also what the tool's background removal does, but earlier.",
        },
        {
          heading: "A table, to be quick about it",
          body:
            "On 14-count aida, margins included: 50 stitches is about 9 cm of motif and a 19 cm piece of fabric; 70 stitches, 13 cm and 23 cm; 100 stitches, 18 cm and 28 cm; 150 stitches, 27 cm and 37 cm. Past 150 stitches wide, count in months rather than evenings.",
        },
      ],
    },
  },

  head: {
    home: {
      title: "Photo to cross-stitch pattern \u2014 free, real DMC threads",
      description:
        "Turn any photo into a printable cross-stitch chart, with the real DMC thread references and a stitch count for each. Free, no account, and your photo never leaves your browser.",
    },
    convert: {
      title: "Convert a photo into a cross-stitch chart",
      description:
        "Drop in a photo, choose the width in stitches and how many threads, and download the printable chart with its DMC thread list. It all happens in your browser.",
    },
    gallery: {
      title: "Cross-stitch pattern gallery",
      description:
        "Pieces shared by the community: browse the charts, see which threads they used, and take any of them for free.",
    },
    galleryStitches: {
      title: "Cross-stitch pieces stitched by the community",
      description:
        "Finished cross-stitch, photographed by the people who stitched it — from charts made here, and from charts found anywhere else.",
    },
    about: {
      title: "About us",
      description:
        "A small free tool for turning a photo into a cross-stitch chart, made by two people. Where it came from, and why everything runs in your browser.",
    },
    account: {
      title: "My account",
      description: "Your name in the gallery, your bio and your mark.",
    },
    /** A piece is the only thing on this site somebody has a reason to send to
     *  somebody else, so its title leads with the piece and its maker. */
    piece: {
      title: (title: string, maker: string) => `${title}, by ${maker} — cross-stitch chart`,
      description: (maker: string, w: number, h: number, threads: number) =>
        `A cross-stitch chart shared by ${maker}: ${w} \u00d7 ${h} stitches in ${threads} DMC threads. Take the chart for free, with the thread list and a stitch count for each colour.`,
    },
    /** A photo post has no measurements to quote, so its head talks about what it
     *  actually is: somebody's finished work. */
    pieceStitch: {
      title: (title: string, maker: string) => `${title}, stitched by ${maker}`,
      description: (maker: string) =>
        `A finished cross-stitch piece shared by ${maker} in the gallery — photographed once the last knot was tied.`,
    },
    maker: {
      title: (maker: string) => `${maker} — their cross-stitch charts`,
      description: (maker: string, pieces: number) =>
        pieces === 1
          ? `The chart ${maker} shared in the gallery. Free to take, with its DMC thread list.`
          : `The ${pieces} charts ${maker} shared in the gallery. Free to take, with their DMC thread lists.`,
      /** When the member has published nothing yet. */
      empty: (maker: string) => `${maker} hasn't shared anything in the Cross Stitch Valley gallery yet.`,
    },
    /** What the tool does, for the SoftwareApplication graph. Short: these are
     *  labels a machine reads, not a sales page. */
    features: [
      "Turns a photo into a cross-stitch chart",
      "Real DMC thread references",
      "Printable chart with its thread list",
      "Runs entirely in the browser",
    ],
  },

  notFound: {
    title: "This page slipped off the hoop",
    body: "The page you're after doesn't exist — or hasn't been stitched yet.",
    home: "Back to the homepage",
  },
}
