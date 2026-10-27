import { experience, profile, projects } from './portfolio';

export const templateMedia = {
  portrait: 'https://framerusercontent.com/images/JQqsD7xecQfWDLwoSTpvjAMyVw.png?scale-down-to=512&width=768&height=768',
  reel: 'https://framerusercontent.com/assets/qrR62CWXqDhpxD9VshrTGooXZg.mp4',
  projects: [
    'https://framerusercontent.com/images/R1r7VFivZ1p7eirOLoMdE5NV80M.jpg?scale-down-to=1024',
    'https://framerusercontent.com/images/conknpf49hPAVpbVfu0eEPiE4SM.jpeg?scale-down-to=1024',
    'https://framerusercontent.com/images/h25SyziLUKTHENOdmXtNMuyOHdM.jpg?scale-down-to=1024',
  ],
};

function experienceEntry(item, index) {
  return {
    id: `experience-${index + 1}`,
    period: item.period,
    title: item.company,
    subtitle: `${item.role} · ${item.location}`,
    description: item.description,
    linkLabel: item.link ? 'View PickFrame' : '',
    linkUrl: item.link || '',
  };
}

export const defaultPortfolioContent = {
  version: 1,
  header: { brand: 'Indra Arya', workLabel: 'Work', aboutLabel: 'About' },
  hero: {
    heading: 'Software\nEngineer',
    lead: 'I build software end to end with Go, PostgreSQL and React, and write the tests as part of the work.',
    description: 'My main work is PickFrame, a SaaS for photographers with 100 active users. I’m based in Kendari, available now and ready to relocate anywhere in Indonesia.',
    linkLabel: 'View PickFrame',
    linkUrl: 'https://pickframe.satuarah.click',
    portraitUrl: '',
    portraitAlt: 'Portfolio profile image',
    reelUrl: templateMedia.reel,
  },
  work: {
    heading: 'Featured work',
    scrollLabel: '(SCROLL TO EXPLORE)',
    cards: projects.map((project, index) => ({
      slot: project.slot,
      name: project.name,
      category: project.category,
      summary: project.summary,
      link: project.link,
      imageUrl: templateMedia.projects[index] || '',
      imageAlt: templateMedia.projects[index] ? 'Temporary artwork from the supplied portfolio template' : '',
    })),
  },
  about: {
    heading: 'About',
    headline: 'Building software end to end: the API, the database, the tests and the screens people use.',
    paragraphs: [
      'I’m Indra, a junior software engineer and Informatics graduate from UIN Sunan Kalijaga Yogyakarta. My main work is PickFrame, a SaaS for photographers and studios with 100 active users, including paying subscribers, that I built end to end with Go, PostgreSQL and React.',
      'I also build mobile apps with Kotlin and React Native, and I write automated tests as part of the work, not after it. I’m based in Kendari, available immediately and ready to relocate anywhere in Indonesia.',
    ],
    // Newest first by start date.
    timeline: [
      ...experience.slice(0, 2).map(experienceEntry),
      {
        id: 'training',
        period: '2024–2026',
        title: 'Training & certifications',
        subtitle: 'Dicoding · IBM Cognitive Class · The British Institute',
        description: 'Completed Generative AI Apps with Microsoft Azure and Data Science with Microsoft Fabric at Dicoding, and Python 101 for Data Science at IBM Cognitive Class, all in March 2026. Earlier, finished English for Business Communication at The British Institute with a score of 87.',
        linkLabel: '',
        linkUrl: '',
      },
      ...experience.slice(2).map((item, index) => experienceEntry(item, index + 2)),
      {
        id: 'education',
        period: '2021–2025',
        title: 'UIN Sunan Kalijaga Yogyakarta',
        subtitle: 'Bachelor of Informatics (S.Kom) · GPA 3.54/4.00',
        description: 'Completed a Bachelor of Informatics with a GPA of 3.54 out of 4.00. Coursework covered data structures, databases, web programming and software engineering, the groundwork for the backend, database and testing work I do today.',
        linkLabel: '',
        linkUrl: '',
      },
    ],
    imageNote: '',
  },
  footer: {
    heading: 'Let’s get to know\neach other',
    email: profile.email,
    githubUrl: profile.github,
    githubLabel: 'GH',
    linkedinUrl: profile.linkedin,
    linkedinLabel: 'IN',
    instagramUrl: 'https://www.instagram.com/indraarrya/',
    instagramLabel: 'IG',
    copyrightName: 'Indra Arya',
  },
};

export const isTemplateProjectImage = (url) => templateMedia.projects.includes(url);
export const projectTemplateImage = (slot) => templateMedia.projects[slot - 1] || '';

export function createProjectCard(slot) {
  return { slot, name: '', category: '', summary: '', link: '', imageUrl: '', imageAlt: '' };
}

export function normalizePortfolioContent(saved = {}, legacyProjects = []) {
  const source = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  // Saved content owns the full project list (any length); otherwise fall back to the default slots.
  const savedCards = Array.isArray(source.work?.cards) ? source.work.cards.filter((item) => item && typeof item === 'object') : null;
  const cards = (savedCards || defaultPortfolioContent.work.cards).map((item) => {
    const slot = Number(item.slot);
    const base = defaultPortfolioContent.work.cards.find((card) => card.slot === slot) || createProjectCard(slot);
    const legacy = legacyProjects.find((entry) => Number(entry.slot_number) === slot && entry.project_link?.replace(/\/$/, '') === base.link);
    return { ...base, ...(legacy?.image_url ? { imageUrl: legacy.image_url, imageAlt: `${base.name} project screenshot` } : {}), ...(savedCards ? item : {}), slot };
  });
  const seen = new Set();
  let nextSlot = Math.max(0, ...cards.map((card) => (Number.isInteger(card.slot) && card.slot > 0 ? card.slot : 0))) + 1;
  for (const card of cards) {
    if (!Number.isInteger(card.slot) || card.slot < 1 || seen.has(card.slot)) card.slot = nextSlot++;
    seen.add(card.slot);
  }

  return {
    version: 1,
    header: { ...defaultPortfolioContent.header, ...source.header },
    hero: { ...defaultPortfolioContent.hero, ...source.hero },
    work: { ...defaultPortfolioContent.work, ...source.work, cards },
    about: {
      ...defaultPortfolioContent.about,
      ...source.about,
      paragraphs: Array.isArray(source.about?.paragraphs) ? source.about.paragraphs : [...defaultPortfolioContent.about.paragraphs],
      timeline: Array.isArray(source.about?.timeline)
        ? source.about.timeline.map((entry, index) => ({ ...entry, id: entry?.id || `entry-${index + 1}` }))
        : defaultPortfolioContent.about.timeline.map((entry) => ({ ...entry })),
    },
    footer: { ...defaultPortfolioContent.footer, ...source.footer },
  };
}

export function safeWebUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}
