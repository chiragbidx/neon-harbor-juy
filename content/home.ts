// ─── Hero ───────────────────────────────────────────────────────────────────
export type HeroContent = {
  badgeInner: string;
  badgeOuter: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  heroImageLight: string;
  heroImageDark: string;
  heroImageAlt: string;
};

// ...types unchanged...

// ─── Defaults ───────────────────────────────────────────────────────────────

export const defaultHomeContent: HomeContent = {
  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    badgeInner: "New!",
    badgeOuter: "Meet MailSpark",
    titleBefore: "Effortless ",
    titleHighlight: "Email Marketing",
    titleAfter: " for Your Business",
    subtitle:
      "Grow your audience, automate campaigns, and track every click—MailSpark is the simple, beautiful way to send and analyze marketing emails.",
    primaryCta: { label: "Start Sending", href: "#pricing" },
    secondaryCta: { label: "See Features", href: "#features" },
    heroImageLight: "/hero-image-light.jpeg",
    heroImageDark: "/hero-image-dark.jpeg",
    heroImageAlt: "MailSpark app dashboard",
  },

  // ── Sponsors ─────────────────────────────────────────────────────────────
  sponsors: {
    heading: "Trusted by growing businesses",
    items: [
      { icon: "Mail", name: "SendGrid" },
      { icon: "BarChart", name: "AnalyticsPro" },
      { icon: "Rocket", name: "StartupHub" },
      { icon: "Zap", name: "DeliverFast" },
      { icon: "PenTool", name: "Brandly" },
    ],
  },

  // ── Benefits ─────────────────────────────────────────────────────────────
  benefits: {
    eyebrow: "Why MailSpark",
    heading: "Power your growth with easy email marketing",
    description:
      "Empower your team to manage contacts, launch campaigns, and understand your audience—all from a modern, intuitive dashboard.",
    items: [
      {
        icon: "Users",
        title: "Effortless Contacts",
        description: "Import, tag, and manage all your marketing contacts in one space.",
      },
      {
        icon: "Send",
        title: "Beautiful Campaigns",
        description: "Craft, schedule, and send engaging emails with simple controls.",
      },
      {
        icon: "BarChart2",
        title: "Track Performance",
        description: "See exactly who opened or clicked with actionable campaign analytics.",
      },
      {
        icon: "CheckCircle2",
        title: "High Deliverability",
        description: "Leverage trusted infrastructure to land in the inbox—not spam.",
      },
    ],
  },

  // ── Features ─────────────────────────────────────────────────────────────
  features: {
    eyebrow: "Features",
    heading: "All the essentials—none of the clutter",
    subtitle:
      "MailSpark combines clean UI, reliable sending, and analytics so you can focus on growing your business.",
    items: [
      { icon: "BookOpen", title: "Contacts & Tagging", description: "Build and filter your audience with tags and segmentation." },
      { icon: "Mail", title: "Campaign Builder", description: "Personalize, schedule, and send bulk campaigns easily." },
      { icon: "Zap", title: "Quick Send", description: "Instantly broadcast or schedule to the right recipients." },
      { icon: "BarChart", title: "Analytics", description: "See real-time opens, clicks, and delivery for every campaign." },
      { icon: "ShieldCheck", title: "Team-Safe", description: "All data and actions are securely scoped to your team." },
      { icon: "Check", title: "Accessible", description: "Built-in keyboard navigation and smart defaults for everyone." },
    ],
  },

  // ── Services (now How It Works) ──────────────────────────────────────────
  services: {
    eyebrow: "",
    heading: "",
    subtitle: "",
    items: [],
  },

  // ── Testimonials ─────────────────────────────────────────────────────────
  testimonials: {
    eyebrow: "Testimonials",
    heading: "What teams say about MailSpark",
    reviews: [
      { image: "/team1.jpg", name: "Priya S.", role: "Marketing Lead, ZenBridge", comment: "MailSpark makes running campaigns a joy. Our open rates are soaring and analytics are immediate.", rating: 5.0 },
      { image: "/team2.jpg", name: "Carlos D.", role: "Founder, AgileNow", comment: "Finally, an email SaaS my team can use without training. Our first campaign took 10 minutes to set up!", rating: 4.8 },
      { image: "/team3.jpg", name: "Lina B.", role: "Growth Manager, SparkWeb", comment: "The dashboard is intuitive and campaign tracking works perfectly for our needs.", rating: 4.9 },
      { image: "/team1.jpg", name: "Matt T.", role: "CEO, TrueInbox", comment: "Switched from bloated tools—MailSpark is focused and efficient.", rating: 5.0 },
      { image: "/team2.jpg", name: "Sara K.", role: "COO, BridgeSync", comment: "No more spreadsheet headaches for our contacts. Tags are a life-saver!", rating: 5.0 },
      { image: "/team3.jpg", name: "Eli R.", role: "Growth Marketer, Gatherly", comment: "MailSpark analytics helped us optimize for clicks in no time.", rating: 4.9 },
    ],
  },

  // ── Team (removed) ───────────────────────────────────────────────────────
  team: {
    eyebrow: "",
    heading: "",
    members: [],
  },

  // ── Pricing ──────────────────────────────────────────────────────────────
  pricing: {
    eyebrow: "Pricing",
    heading: "Simple pricing for every team",
    subtitle: "Start for free, upgrade as your audience grows—MailSpark plans are transparent and accessible.",
    priceSuffix: "/month",
    plans: [
      {
        title: "Free",
        popular: false,
        price: 0,
        description: "For individuals and new businesses. Unlimited campaigns up to 500 contacts.",
        buttonText: "Try free",
        benefits: [
          "Unlimited campaigns",
          "Up to 500 contacts",
          "Team dashboard",
          "Starter analytics",
          "Email support",
        ],
      },
      {
        title: "Growth",
        popular: true,
        price: 29,
        description: "For small teams ready for the next step. Scale up campaigns and audience size.",
        buttonText: "Start trial",
        benefits: [
          "5,000 contacts",
          "Tags & search",
          "Priority sending",
          "Full analytics",
          "Team collaboration",
        ],
      },
      {
        title: "Pro",
        popular: false,
        price: 89,
        description: "For growing marketers that need scale, speed, and robust analytics.",
        buttonText: "Contact sales",
        benefits: [
          "Unlimited contacts",
          "Advanced analytics",
          "API access",
          "Deliverability boosts",
          "White-label option",
        ],
      },
    ],
  },

  // ── Contact ──────────────────────────────────────────────────────────────
  contact: {
    eyebrow: "Contact",
    heading: "Contact the MailSpark team",
    description:
      "Have a question about pricing, campaigns, or migration? Our team is here to help you succeed with email marketing.",
    mailtoAddress: "hi@chirag.co",
    info: {
      address: { label: "Location", value: "Remote-first • Worldwide" },
      phone: { label: "Call us", value: "" },
      email: { label: "Email us", value: "hi@chirag.co" },
      hours: { label: "Hours", value: ["Mon - Fri", "8AM - 8PM UTC"] },
    },
    formSubjects: ["Support", "Pricing", "Features", "Migration", "Other"],
    formSubmitLabel: "Contact MailSpark",
  },

  // ── FAQ ──────────────────────────────────────────────────────────────────
  faq: {
    eyebrow: "FAQ",
    heading: "MailSpark Answers",
    items: [
      { question: "Is MailSpark right for my business?", answer: "MailSpark is designed for businesses and marketers who want a simple, reliable email solution—get started for free!" },
      { question: "Do you support bulk imports?", answer: "Yes! Import all your contacts in one go and start tagging immediately." },
      { question: "Can I see who opened or clicked?", answer: "Every campaign provides open and click analytics in your dashboard." },
      { question: "Can multiple teammates use one account?", answer: "Yes! Manage everything with your team in one workspace." },
      { question: "Is my data secure?", answer: "Absolutely. All MailSpark data is securely separated by team and never shared." },
    ],
  },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    brandName: "MailSpark",
    columns: [
      {
        heading: "Contact",
        links: [
          { label: "hi@chirag.co", href: "mailto:hi@chirag.co" },
          { label: "Support", href: "#contact" },
        ],
      },
      {
        heading: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        heading: "Help",
        links: [
          { label: "Contact Us", href: "#contact" },
          { label: "Docs", href: "https://nextjs.org/docs" },
        ],
      },
      {
        heading: "Social",
        links: [
          { label: "GitHub", href: "https://github.com" },
          { label: "X", href: "https://x.com" },
        ],
      },
    ],
    copyright: "\u00a9 2026 MailSpark. All rights reserved.",
    attribution: { label: "Built with Next.js", href: "https://nextjs.org" },
  },

  // ── Navbar ───────────────────────────────────────────────────────────────
  navbar: {
    brandName: "MailSpark",
    routes: [
      { href: "/#features", label: "Features" },
      { href: "/#contact", label: "Contact" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#faq", label: "FAQ" },
    ],
    featureDropdownLabel: "Features",
    featureImage: { src: "/demo-img.jpg", alt: "MailSpark sample dashboard" },
    features: [
      { title: "Contacts & Lists", description: "Import, tag, organize for targeted campaigns." },
      { title: "Easy Campaigns", description: "Create and send in minutes." },
      { title: "Real Analytics", description: "Understand opens and clicks per email." },
    ],
    signInLabel: "Sign in",
    signUpLabel: "Sign up",
    dashboardLabel: "Dashboard",
    githubLink: { href: "https://github.com", ariaLabel: "View on GitHub" },
  },
};

export function getHomeContent(): HomeContent {
  return defaultHomeContent;
}