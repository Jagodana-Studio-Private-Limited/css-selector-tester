export const siteConfig = {
  name: "CSS Selector Tester",
  title: "CSS Selector Tester - Test & Debug CSS Selectors in Real-Time",
  description:
    "Test CSS selectors against custom HTML and instantly see which elements match. Debug selectors for class, ID, attribute, pseudo-class, and combinators — 100% browser-based.",
  url: "https://css-selector-tester.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "Code2",
  brandAccentColor: "#6366f1",

  keywords: [
    "css selector tester",
    "css selector debugger",
    "test css selectors",
    "css selector tool",
    "querySelectorAll",
    "css selector playground",
    "css selector validator",
    "css selector checker",
    "frontend developer tools",
    "css debugging",
  ],
  applicationCategory: "DeveloperApplication",

  themeColor: "#3b82f6",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: ["https://twitter.com/jagodana"],

  links: {
    github:
      "https://github.com/Jagodana-Studio-Private-Limited/css-selector-tester",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "CSS Selector Tester is a free, browser-based tool for developers to write, test, and debug CSS selectors against custom HTML in real-time — no login, no server.",
    featuresTitle: "Features",
    features: [
      "Real-time selector matching",
      "Visual element highlighting",
      "Match count & element preview",
      "Multiple selector syntax support",
    ],
  },

  hero: {
    badge: "CSS Developer Tool",
    titleLine1: "Test CSS Selectors",
    titleGradient: "In Real-Time",
    subtitle:
      "Paste your HTML, type a CSS selector, and instantly see which elements match — highlighted with match count and element preview. Supports all selector types.",
  },

  featureCards: [
    {
      icon: "⚡",
      title: "Instant Results",
      description:
        "See matches highlighted in real-time as you type — no button to click, no delay.",
    },
    {
      icon: "🎯",
      title: "All Selector Types",
      description:
        "Supports class, ID, attribute, pseudo-class, pseudo-element, combinators, and complex selectors.",
    },
    {
      icon: "🔒",
      title: "100% Private",
      description:
        "Everything runs in your browser. Your HTML never leaves your machine — no servers, no tracking.",
    },
  ],

  relatedTools: [
    {
      name: "Regex Playground",
      url: "https://regex-playground.tools.jagodana.com",
      icon: "🧪",
      description: "Build, test & debug regular expressions in real-time.",
    },
    {
      name: "CSS Specificity Calculator",
      url: "https://css-specificity-calculator.tools.jagodana.com",
      icon: "🔢",
      description: "Calculate CSS specificity scores for any selector.",
    },
    {
      name: "CSS nth-child Tester",
      url: "https://css-nth-child-tester.tools.jagodana.com",
      icon: "🎯",
      description: "Test and preview :nth-child() and :nth-of-type() patterns.",
    },
    {
      name: "HTML to Markdown Converter",
      url: "https://html-to-markdown-converter.tools.jagodana.com",
      icon: "📝",
      description: "Convert HTML to clean Markdown instantly.",
    },
    {
      name: "JSON Formatter",
      url: "https://json-formatter.tools.jagodana.com",
      icon: "📋",
      description: "Format, validate, and minify JSON data.",
    },
    {
      name: "CSS Flexbox Playground",
      url: "https://css-flexbox-playground.tools.jagodana.com",
      icon: "📦",
      description: "Interactive flexbox builder with live CSS output.",
    },
  ],

  howToSteps: [
    {
      name: "Enter HTML",
      text: "Paste or type your HTML markup in the HTML editor panel on the left.",
      url: "",
    },
    {
      name: "Type a CSS Selector",
      text: "Enter any CSS selector in the selector input field — class, ID, attribute, pseudo, combinator, or complex selectors.",
      url: "",
    },
    {
      name: "See Matches",
      text: "Matching elements are highlighted in the HTML preview instantly. The match count and element tags are shown for quick debugging.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  faq: [
    {
      question: "What CSS selectors are supported?",
      answer:
        "All standard CSS selectors are supported, including class selectors (.class), ID selectors (#id), element selectors (div, p), attribute selectors ([href]), pseudo-classes (:hover, :first-child, :nth-child()), combinators (> + ~), and complex combinations. It uses the browser's native querySelectorAll() engine, so anything valid in CSS works here.",
    },
    {
      question: "Why would I use a CSS selector tester?",
      answer:
        "A CSS selector tester helps you verify your selectors target exactly the right elements before writing your stylesheet. It's especially useful when working with complex selectors, debugging unexpected CSS behavior, learning selector syntax, or quickly finding elements in a document structure.",
    },
    {
      question: "Does my HTML get sent to a server?",
      answer:
        "No. Everything runs entirely in your browser using JavaScript. Your HTML is never sent to any server, which means it's safe to use with sensitive or proprietary markup.",
    },
    {
      question: "What is querySelectorAll() and how does this tool use it?",
      answer:
        "querySelectorAll() is a native browser DOM API that finds all elements matching a CSS selector. This tool uses it under the hood to evaluate your selector against a hidden copy of your HTML. If your selector works in this tool, it will work in real-world code using querySelectorAll() or getElementById().",
    },
    {
      question: "Can I test pseudo-class selectors like :hover or :focus?",
      answer:
        "Pseudo-classes that depend on user interaction (:hover, :focus, :active) cannot be statically evaluated because they require the element to be in that state. Structural pseudo-classes like :first-child, :nth-child(), :last-of-type, and :not() work perfectly.",
    },
  ],

  pages: {
    "/": {
      title:
        "CSS Selector Tester - Test & Debug CSS Selectors in Real-Time",
      description:
        "Test CSS selectors against custom HTML and instantly see which elements match. Debug selectors for class, ID, attribute, pseudo-class, and combinators — 100% browser-based.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
