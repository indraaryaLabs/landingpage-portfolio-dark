export const profile = {
  name: 'Indra Arya Slamet Praditya',
  email: 'contact.indraarya@gmail.com',
  github: 'https://github.com/indraaryaLabs',
  linkedin: 'https://www.linkedin.com/in/indraaryaslametpraditya/',
  location: 'Kendari, Indonesia',
};

export const experience = [
  {
    role: 'Freelance Full-Stack Developer',
    company: 'PickFrame',
    period: 'Mar – Apr 2026',
    location: 'Remote',
    description: 'Built and maintained a photography business platform spanning client galleries, orders, packages, invoices, subscriptions and an operator dashboard. Worked across Go/Gin REST APIs, PostgreSQL/Supabase and a React/Vite interface. Implemented authentication, row-level security, rate limiting, transaction safeguards, automated tests and GitHub Actions CI.',
    link: 'https://pickframe.satuarah.click',
  },
  {
    role: 'Digital Content & Project Coordination Intern',
    company: 'PT Wesclic Indonesia Neotech',
    period: 'Aug – Nov 2025',
    location: 'Yogyakarta',
    description: 'Coordinated incoming project requests, identified missing scope or assets, tracked revisions, and supported social-media concepts and company-event documentation.',
  },
];

export const projects = [
  {
    slot: 1,
    number: '01',
    name: 'Jejak Karier',
    category: 'Mobile application',
    summary: 'A local-first job application tracker built with Expo, React Native, TypeScript and SQLite. Organizes applications across seven statuses without requiring an online account.',
    stack: ['React Native', 'Expo', 'TypeScript', 'SQLite'],
    link: 'https://github.com/indraaryaLabs/jejak-karier',
    art: 'mobile',
  },
  {
    slot: 2,
    number: '02',
    name: 'Reliability Command Center',
    category: 'Full-stack systems project',
    summary: 'A service-operations dashboard with health checks, logs, failure simulation and live updates over Server-Sent Events.',
    stack: ['React', 'TypeScript', 'Express', 'SSE'],
    link: 'https://github.com/indraaryaLabs/reliability-command-center',
    art: 'systems',
  },
  {
    slot: 3,
    number: '03',
    name: 'E-commerce ETL Pipeline',
    category: 'Data engineering project',
    summary: 'A Python pipeline for extracting up to 50 pages of product data, cleaning and transforming records, and exporting structured output with automated tests.',
    stack: ['Python', 'pandas', 'BeautifulSoup', 'pytest'],
    link: 'https://github.com/indraaryaLabs/etl-pipeline-ecommerce',
    art: 'data',
  },
];

export const skillGroups = [
  { title: 'Build', items: 'Go, Gin, React, React Native, TypeScript, JavaScript, Python' },
  { title: 'Connect', items: 'REST APIs, PostgreSQL, Supabase, SQLite, Express' },
  { title: 'Check & ship', items: 'Automated tests, pytest, GitHub Actions, Git, debugging' },
];
