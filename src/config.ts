// Personal details. This is the only file you edit by hand — projects, stats and
// articles are generated automatically by scripts/sync.ts.
export const site = {
  name: "Bhavana Acharya",
  title: "Senior Engineer",
  tagline: "Building useful products, end to end.",
  intro:
    "Engineer with 6+ years of production experience in React and TypeScript, building digital products. Focused on product engineering, full-stack development and AI-powered applications — from idea to shipped product.",

  githubUsername: "Bhavana123456",
  // Your Medium handle without the @, e.g. "bhavnaacharya". Leave empty to hide articles.
  mediumUsername: "bhavanaacharya80",

  // Leave any link empty to hide it from the contact card.
  links: {
    email: "bhavanaacharya80@gmail.com",
    linkedin: "",
    github: "https://github.com/Bhavana123456",
    resume: "", // e.g. "/resume.pdf" after placing the file in public/
  },

  techStack: ["React", "TypeScript", "JavaScript", "Python", "FastAPI", "Docker", "GitHub"],

  exploring: [
    "Product Engineering",
    "AI-powered Products",
    "LLM Applications",
    "Full-stack Development",
    "Product Management",
    "Backend & APIs",
  ],

  // Contact form endpoint (static hosting has no server). Create a free form at
  // https://formspree.io and paste its endpoint, e.g. "https://formspree.io/f/abcdwxyz".
  contactFormEndpoint: "",

  // "What I've shipped" — production work, described without company-private details.
  // Fill in problem / contribution / decision (1–2 sentences each); empty fields are hidden.
  shipped: [
    {
      title: "AI feature UI integration",
      problem: "Users reviewing healthcare payments needed relevant policy information without leaving the workflow they were already in.",
      contribution: "Built the UI and API integration for an AI-powered policy retrieval feature, surfacing payment-integrity policies inside existing screens.",
      decision: "Embedded retrieval directly into existing workflows instead of a separate tool, so answers appear where the decision is being made.",
    },
    {
      title: "Data-heavy workflows",
      problem: "Payment-integrity work involves high-value, sensitive healthcare data (Medicare, Medicaid) where a confusing screen means costly mistakes.",
      contribution: "Shipped 20+ production features across 3–5 client implementations — data-intensive React and TypeScript interfaces backed by REST APIs.",
      decision: "Worked spec-first: each feature starts from a written spec, so implementation, expected behaviour and code review stay aligned across clients.",
    },
    {
      title: "Rendering performance & observability",
      problem: "A procurement and supplier-onboarding portal had to stay fast and dependable on both desktop and mobile (PWA).",
      contribution: "Architected the portal and optimised rendering and load behaviour; set up Datadog dashboards and alerts for production monitoring.",
      decision: "Used custom hooks, memoisation and code splitting to cut unnecessary re-renders and initial load, and added monitoring so regressions show up early.",
    },
    {
      title: "Reusable React component systems",
      problem: "Teams kept rebuilding the same UI patterns, which slowed delivery and made screens inconsistent.",
      contribution: "Built a Storybook-documented component library (file uploaders, dynamic tables, configurable cards), migrated class components to hooks, and mentored developers through reviews and React/TypeScript training.",
      decision: "Moved state to Redux and Context API with function components and hooks, so shared components stay simple and data flow is predictable.",
    },
  ],
};
