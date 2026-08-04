// Bilingual copy. `en` is the source of truth for the key set; `fr` is
// typed against it so a missing or misspelled key fails the build.
//
// Interpolated strings are functions rather than "{n}" placeholders — the
// types then guarantee every call site passes the right arguments.

export const en = {
  lang: { label: "Language", fr: "Français", en: "English", switchTo: "Passer en français" },

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
    patternPreview: "Your pattern",
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
      download: (num: string) => `Download DMC ${num} on its own`,
      saving: "Preparing…",
      // Says what it is for, which is the bit that is not obvious: two shades you
      // cannot tell apart on the full chart never have to be told apart at all.
      downloadHint: "one sheet per skein — handy for two shades that look alike",
      // Its own title, because the chart's would say "1 colour" and read as though
      // the whole piece took one thread.
      legendTitle: (num: string, stitches: number, w: number, h: number) =>
        `DMC ${num} alone · ${stitches.toLocaleString("en")} stitches · grid ${w} x ${h}`,
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
      "Picture to DMC is a small, free tool made by two people who kept wanting a chart from a photo and kept not finding one that was honest about the threads.",
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
  },

  notFound: {
    title: "Cette page a glissé du tambour",
    body: "La page que vous cherchez n'existe pas — ou n'a pas encore été brodée.",
    home: "Retour à l'accueil",
  },
}

export const dictionaries = { en, fr }
export type Lang = keyof typeof dictionaries
