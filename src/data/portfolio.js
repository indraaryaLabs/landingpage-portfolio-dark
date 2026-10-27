export const profile = {
  name: 'Indra Arya Slamet Praditya',
  email: 'contact.indraarya@gmail.com',
  github: 'https://github.com/indraaryaLabs',
  linkedin: 'https://www.linkedin.com/in/indraaryaslametpraditya/',
  location: 'Kendari, Indonesia',
};

export const experience = [
  {
    role: 'Founder & Full-Stack Developer',
    company: 'PickFrame',
    period: 'Mar – Apr 2026',
    location: 'Own SaaS product · Remote',
    description: 'Built a SaaS workspace for photographers and studios covering scheduling, client galleries, invoices, payments and reports, now used by 100 active users. Wrote the Go API with JWT auth, rate limiting and PostgreSQL migrations, fixed a critical Row Level Security gap, and set up CI that runs 247 Go tests on every push.',
    link: 'https://pickframe.satuarah.click',
  },
  {
    role: 'Digital Content & Project Coordination Intern',
    company: 'PT Wesclic Indonesia Neotech',
    period: 'Aug – Nov 2025',
    location: 'Yogyakarta',
    description: 'Turned incomplete project requests into clear briefs by listing missing information, owners and acceptance details before work started, then tracked revisions and follow-ups across teams so the people delivering the work always had current information.',
  },
  {
    role: 'Capstone Developer (Android)',
    company: 'Bangkit Academy by Google, GoTo & Traveloka',
    period: 'Aug 2023 – Jan 2024',
    location: 'Mobile Development path · Online',
    description: 'Studied Android development with Kotlin in the Mobile Development path and graduated in January 2024. For the capstone, built Frency with a team: an Android app that translates sign language, using Kotlin for the app and TensorFlow Lite to run the model on the device.',
  },
];

export const projects = [
  {
    slot: 1,
    number: '01',
    name: 'PickFrame',
    category: 'SaaS product · Go, PostgreSQL, React',
    summary: 'A SaaS workspace for photographers and studios with 100 active users: scheduling, client galleries, invoices, payments and reports, built end to end with a Go API, PostgreSQL and a React PWA.',
    stack: ['Go', 'Gin', 'PostgreSQL', 'React', 'PWA'],
    link: 'https://pickframe.satuarah.click',
    art: 'systems',
  },
  {
    slot: 2,
    number: '02',
    name: 'Coffee Shop Point-of-Sale',
    category: 'Full-stack web app',
    summary: 'Recipe-based inventory with multi-item transactions: each checkout runs in one database transaction that checks and deducts stock, so two checkouts can never sell the same stock.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Drizzle ORM', 'Better Auth'],
    link: 'https://github.com/indraaryaLabs/coffee-shop-pos',
    art: 'systems',
  },
  {
    slot: 3,
    number: '03',
    name: 'Reliability Quality Suite',
    category: 'QA automation',
    summary: 'A test strategy, coverage matrix and Playwright suite for Reliability Command Center: API checks, browser journeys and an HTML report on every CI run.',
    stack: ['Playwright', 'TypeScript', 'GitHub Actions'],
    link: 'https://github.com/indraaryaLabs/reliability-quality-suite',
    art: 'data',
  },
  {
    slot: 4,
    number: '04',
    name: 'Reliability Command Center',
    category: 'Full-stack systems project',
    summary: 'A service dashboard that runs HTTP/TCP health checks, keeps logs, simulates failures and pushes live status updates to the browser over Server-Sent Events.',
    stack: ['React', 'TypeScript', 'Express', 'SSE'],
    link: 'https://github.com/indraaryaLabs/reliability-command-center',
    art: 'systems',
  },
  {
    slot: 5,
    number: '05',
    name: 'Jejak Karier',
    category: 'Mobile application',
    summary: 'A local-first job application tracker built with Expo, React Native, TypeScript and SQLite. Organizes applications across seven statuses without requiring an online account.',
    stack: ['React Native', 'Expo', 'TypeScript', 'SQLite'],
    link: 'https://github.com/indraaryaLabs/jejak-karier',
    art: 'mobile',
  },
];

export const skillGroups = [
  { title: 'Build', items: 'Go, TypeScript, JavaScript, Python, SQL, Kotlin, React, Next.js, React Native' },
  { title: 'Connect', items: 'Gin, GORM, Express, REST APIs, JWT auth, PostgreSQL, Supabase, SQLite' },
  { title: 'Check & ship', items: 'Go tests, Playwright, GitHub Actions CI, Docker, Git, Postman' },
];
