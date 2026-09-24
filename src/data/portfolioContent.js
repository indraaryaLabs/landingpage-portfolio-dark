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

export const defaultPortfolioContent = {
  version: 1,
  header: { brand: 'Indra Arya', workLabel: 'Work', aboutLabel: 'About' },
  hero: {
    heading: 'Software\nEngineer',
    lead: 'I build practical software across web, mobile, and data workflows.',
    description: 'My freelance work on PickFrame covered Go APIs, PostgreSQL, and React. I’m based in Indonesia and open to junior roles across the country.',
    linkLabel: 'View live product',
    linkUrl: 'https://pickframe.satuarah.click',
    portraitUrl: templateMedia.portrait,
    portraitAlt: 'Temporary portrait from the supplied portfolio template; not a photo of Indra',
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
      imageUrl: templateMedia.projects[index],
      imageAlt: 'Temporary artwork from the supplied portfolio template',
    })),
  },
  about: {
    heading: 'About',
    headline: 'Building useful digital products across interfaces, APIs, and data.',
    paragraphs: [
      'I’m Indra, an Informatics graduate from UIN Sunan Kalijaga Yogyakarta. My freelance work on PickFrame covered a live product’s backend, database, and frontend.',
      'My public projects include a mobile job tracker, a service-operations dashboard, and an e-commerce data pipeline. I’m available immediately for junior IT roles across Indonesia.',
    ],
    timeline: [
      ...experience.map((item, index) => ({
        id: `experience-${index + 1}`,
        period: item.period,
        title: item.company,
        subtitle: `${item.role} · ${item.location}`,
        description: item.description,
        linkLabel: item.link ? 'View live product' : '',
        linkUrl: item.link || '',
      })),
      {
        id: 'education',
        period: '2021–2025',
        title: 'UIN Sunan Kalijaga Yogyakarta',
        subtitle: 'Bachelor of Informatics (S.Kom) · GPA 3.54/4.00',
        description: 'Studied data structures, databases, web programming, and software engineering.',
        linkLabel: '',
        linkUrl: '',
      },
    ],
    imageNote: 'The project images are temporary template artwork, not screenshots of these repositories.',
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

export function normalizePortfolioContent(saved = {}, legacyProjects = []) {
  const source = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  const cards = defaultPortfolioContent.work.cards.map((card) => {
    const override = Array.isArray(source.work?.cards)
      ? source.work.cards.find((item) => Number(item?.slot) === card.slot) || {}
      : {};
    const legacy = legacyProjects.find((item) => Number(item.slot_number) === card.slot && item.project_link?.replace(/\/$/, '') === card.link);
    return { ...card, ...(legacy?.image_url ? { imageUrl: legacy.image_url, imageAlt: `${card.name} project screenshot` } : {}), ...override, slot: card.slot };
  });

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
