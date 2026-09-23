import { useEffect, useState } from 'react';
import { experience, profile, projects, skillGroups } from '../data/portfolio';
import '@fontsource-variable/inter-tight/wght.css';
import './portfolio.css';

function EmailButton({ className = '' }) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  return <button type="button" className={`lofi-email ${className}`} onClick={copyEmail} aria-label={copied ? 'Email address copied' : `Copy email address ${profile.email}`}>
    <span>{copied ? 'EMAIL COPIED' : profile.email}</span>
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><rect x="8" y="8" width="11" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.7" /><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v10A1.5 1.5 0 0 0 5.5 17H8" stroke="currentColor" strokeWidth="1.7" /></svg>
  </button>;
}

function ProjectArt({ project, image }) {
  if (image) return <img className="lofi-project-image" src={image} alt={`${project.name} project screenshot`} loading="lazy" decoding="async" width="1200" height="675" />;

  return <div className={`lofi-project-art lofi-project-art-${project.slot}`} aria-hidden="true">
    <span className="lofi-art-kicker">INDRA ARYA / PROJECT 0{project.slot}</span>
    <div className="lofi-art-center"><strong>{project.slot === 1 ? 'JEJAK\nKARIER' : project.slot === 2 ? 'RELIABILITY\nCOMMAND CENTER' : 'E-COMMERCE\nETL PIPELINE'}</strong><span className="lofi-art-mark">{project.slot === 1 ? '↗' : project.slot === 2 ? '◌' : '→'}</span></div>
    <span className="lofi-art-bottom">{project.stack.slice(0, 3).join(' / ')}</span>
  </div>;
}

function ProjectCard({ project, image }) {
  return <article className="lofi-project-card">
    <a className="lofi-project-link" href={project.link} target="_blank" rel="noopener noreferrer">
      <div className="lofi-project-media"><ProjectArt project={project} image={image} /></div>
      <div className="lofi-project-caption"><div><span className="lofi-meta">0{project.slot} / {project.category}</span><h3>{project.name}</h3><p>{project.summary}</p></div><span className="lofi-project-arrow" aria-hidden="true">↗</span></div>
    </a>
  </article>;
}

export default function Home() {
  const [projectImages, setProjectImages] = useState({});

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) return;
    const section = document.getElementById('teaser');
    if (!section) return;
    let cancelled = false;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      import('../lib/supabaseApi').then(({ getProjects }) => getProjects()).then(rows => {
        if (cancelled) return;
        const images = {};
        for (const project of projects) {
          const row = rows.find(item => Number(item.slot_number) === project.slot && item.project_link?.replace(/\/$/, '') === project.link);
          if (row?.image_url) images[project.slot] = row.image_url;
        }
        setProjectImages(images);
      }).catch(() => { /* Original project artwork remains when CMS is unavailable. */ });
    }, { rootMargin: '400px' });
    observer.observe(section);
    return () => { cancelled = true; observer.disconnect(); };
  }, []);

  return <div className="lofi-site" id="top">
    <header className="lofi-header"><a className="lofi-wordmark" href="#top">INDRA ARYA</a><nav aria-label="Main navigation"><a href="#work">WORK</a><a href="#about">ABOUT</a></nav><EmailButton className="lofi-header-email" /></header>
    <main>
      <section className="lofi-hero" aria-labelledby="lofi-title">
        <div className="lofi-hero-portrait"><img src="/indra-portrait-480.jpg" alt="Portrait of Indra Arya" width="480" height="480" fetchPriority="high" /></div>
        <div className="lofi-hero-copy"><h1 id="lofi-title">Software<br />Engineer</h1><p className="lofi-hero-lead">I build useful software across web, mobile, and data workflows.</p><p className="lofi-hero-secondary">At PickFrame, I worked across Go APIs and React. I’m now available for junior roles across Indonesia.</p><div className="lofi-hero-actions"><EmailButton /><a className="lofi-text-link" href="https://pickframe.satuarah.click" target="_blank" rel="noopener noreferrer">VIEW LIVE PRODUCT <span aria-hidden="true">↗</span></a></div></div>
      </section>
      <div className="lofi-teaser" id="teaser" aria-hidden="true">{projects.map(project => <div className="lofi-teaser-panel" key={project.slot}><ProjectArt project={project} image={projectImages[project.slot]} /></div>)}</div>

      <section className="lofi-work" id="work" aria-labelledby="work-title"><div className="lofi-work-heading"><h2 id="work-title">Featured work</h2><p>(SCROLL TO EXPLORE)</p></div>
        <a className="lofi-feature" href="https://pickframe.satuarah.click" target="_blank" rel="noopener noreferrer" aria-label="View the PickFrame live product">
          <span className="lofi-feature-top">SELECTED LIVE PRODUCT <span>2026 / FREELANCE</span></span>
          <span className="lofi-feature-center"><strong>PickFrame</strong><span aria-hidden="true">↗</span></span>
          <span className="lofi-feature-bottom">A photography business platform covering galleries, orders, invoices, subscriptions and an operator dashboard. Built across Go, PostgreSQL and React.</span>
        </a>
        <div className="lofi-project-grid">{projects.map(project => <ProjectCard key={project.slot} project={project} image={projectImages[project.slot]} />)}</div>
      </section>

      <section className="lofi-about" id="about" aria-labelledby="about-title"><h2 id="about-title">About</h2><div className="lofi-about-intro"><h3>Practical engineering, grounded in real product work.</h3><div><p>I’m Indra, an Informatics graduate from UIN Sunan Kalijaga Yogyakarta (2025, GPA 3.54/4.00). My freelance work on PickFrame covered a live product’s APIs, database and frontend; my public repositories show mobile, monitoring and data-pipeline projects.</p><p>I’m based in Kendari, available immediately, and open to on-site, hybrid or remote roles across Indonesia.</p></div></div><div className="lofi-timeline">{experience.map(item => <article className="lofi-timeline-row" key={item.company}><p className="lofi-timeline-date">{item.period}</p><div><h3>{item.company}</h3><p className="lofi-timeline-role">{item.role} · {item.location}</p><p className="lofi-timeline-description">{item.description}</p>{item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="lofi-timeline-link">VIEW PRODUCT ↗</a>}</div></article>)}<div className="lofi-timeline-row"><p className="lofi-timeline-date">2021–2025</p><div><h3>UIN Sunan Kalijaga Yogyakarta</h3><p className="lofi-timeline-role">Bachelor of Informatics (S.Kom) · GPA 3.54/4.00</p></div></div></div><div className="lofi-skills"><h3>Tools I use</h3><div>{skillGroups.map(group => <p key={group.title}><span>{group.title}</span>{group.items}</p>)}</div></div></section>
    </main>
    <footer className="lofi-footer" id="contact"><p className="lofi-footer-overline">LET’S GET TO KNOW EACH OTHER</p><h2>Have a role<br />in mind?</h2><EmailButton /><div className="lofi-footer-bottom"><span>© {new Date().getFullYear()} {profile.name}</span><div><a href={profile.github} target="_blank" rel="noopener noreferrer">GITHUB ↗</a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a><a href="#top">BACK TO TOP ↑</a></div></div></footer>
  </div>;
}
