import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight, Mail } from 'lucide-react';
import { experience, profile, projects, skillGroups } from '../data/portfolio';
import './portfolio.css';

function ExternalLink({ href, children, className = '', ...props }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
}

function SectionHeading({ number, title, note }) {
  return <div className="pf-section-heading">
    <div className="pf-section-index">{number} / {note}</div>
    <h2>{title}</h2>
  </div>;
}

export default function Home() {
  const [projectImages, setProjectImages] = useState({});

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) return;
    const section = document.getElementById('projects');
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
      }).catch(() => { /* CSS project artwork remains available when CMS is offline. */ });
    }, { rootMargin: '400px' });
    observer.observe(section);
    return () => { cancelled = true; observer.disconnect(); };
  }, []);

  return <div className="portfolio">
    <div className="pf-grain" aria-hidden="true" />
    <header className="pf-header">
      <a className="pf-mark" href="#top" aria-label="Back to top">IA<span>.</span></a>
      <nav aria-label="Main navigation">
        <a href="#work">Work</a><a href="#projects">Projects</a><a href="#about">About</a>
      </nav>
      <a className="pf-header-contact" href={`mailto:${profile.email}`}>Get in touch <ArrowUpRight size={16} /></a>
    </header>

    <main id="top">
      <section className="pf-hero" aria-labelledby="pf-title">
        <div className="pf-hero-topline"><span className="pf-availability"><span className="pf-dot" /> Available immediately</span><span>{profile.location} · Open to relocation</span></div>
        <div className="pf-hero-main">
          <div>
            <p className="pf-eyebrow">INDRA ARYA / SOFTWARE ENGINEER</p>
            <h1 id="pf-title">Software for<br /><em>real workflows.</em></h1>
            <p className="pf-hero-copy">I'm Indra, a junior software engineer. My freelance work on PickFrame spans Go APIs, PostgreSQL/Supabase and React. The projects below show how I approach mobile apps, service visibility and data processing.</p>
            <div className="pf-actions">
              <ExternalLink className="pf-button pf-button-primary" href="https://pickframe.satuarah.click">Explore live product <ArrowUpRight size={17} /></ExternalLink>
              <a className="pf-button pf-button-ghost" href="#projects">View selected projects <ArrowDown size={17} /></a>
            </div>
          </div>
          <div className="pf-hero-aside" aria-label="Professional focus">
            <div className="pf-orbit" aria-hidden="true"><span>IA</span></div>
            <p>ENGINEERING WITH CONTEXT<br />PRODUCT · SYSTEMS · DATA</p>
          </div>
        </div>
        <div className="pf-hero-bottom"><span>SELECTED WORK / 2025—2026</span><a href="#work">SCROLL TO EXPLORE <ArrowDown size={14} /></a></div>
      </section>

      <section className="pf-section pf-work" id="work">
        <SectionHeading number="01" note="EXPERIENCE" title={<>Real work.<br /><em>Clear scope.</em></>} />
        <div className="pf-work-list">{experience.map((item) => <article className="pf-work-item" key={item.company}>
          <div className="pf-work-meta"><span>{item.period}</span><span>{item.location}</span></div>
          <div><p className="pf-work-role">{item.role}</p><h3>{item.company}</h3><p className="pf-work-desc">{item.description}</p>
          {item.link && <ExternalLink href={item.link} className="pf-text-link">View product <ArrowUpRight size={15} /></ExternalLink>}</div>
        </article>)}</div>
      </section>

      <section className="pf-section pf-projects" id="projects">
        <SectionHeading number="02" note="SELECTED PROJECTS" title={<>Evidence over<br /><em>adjectives.</em></>} />
        <p className="pf-section-intro">Three public repositories that show how I approach mobile product flows, system visibility and data processing.</p>
        <div className="pf-project-grid">{projects.map((item) => <article className="pf-project" key={item.name}>
          <div className={`pf-project-art pf-art-${item.art}`} aria-hidden={!projectImages[item.slot]}>
            {projectImages[item.slot] ? <img className="pf-project-image" src={projectImages[item.slot]} alt={`${item.name} project screenshot`} width="800" height="450" loading="lazy" decoding="async" /> : null}
            {!projectImages[item.slot] && item.art === 'mobile' && <div className="pf-phone"><div className="pf-phone-bar" /><div className="pf-phone-title">Jejak Karier</div><div className="pf-phone-stat"><b>Applications</b><span>Track your next step</span></div><div className="pf-phone-row" /><div className="pf-phone-row short" /><div className="pf-phone-row" /></div>}
            {!projectImages[item.slot] && item.art === 'systems' && <div className="pf-system"><div className="pf-system-top">SERVICE STATUS <span>● LIVE</span></div><div className="pf-system-chart"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="pf-system-line"/><div className="pf-system-line short"/></div>}
            {!projectImages[item.slot] && item.art === 'data' && <div className="pf-data-visual"><span>EXTRACT</span><b>→</b><span>TRANSFORM</span><b>→</b><span>EXPORT</span><div className="pf-data-grid" /></div>}
          </div>
          <div className="pf-project-head"><span>{item.number} / {item.category}</span><ExternalLink href={item.link} className="pf-project-arrow" aria-label={`Open ${item.name} repository`}><ArrowUpRight size={20} /></ExternalLink></div>
          <h3>{item.name}</h3><p>{item.summary}</p><div className="pf-tags">{item.stack.map(tag => <span key={tag}>{tag}</span>)}</div>
          <ExternalLink href={item.link} className="pf-text-link">View repository <ArrowUpRight size={15} /></ExternalLink>
        </article>)}</div>
      </section>

      <section className="pf-section pf-about" id="about">
        <SectionHeading number="03" note="ABOUT & SKILLS" title={<>Curious by default.<br /><em>Grounded in delivery.</em></>} />
        <div className="pf-about-grid"><div><p className="pf-about-lead">I am an Informatics graduate from UIN Sunan Kalijaga Yogyakarta (2025, GPA 3.54/4.00).</p><p>My strongest evidence is a freelance full-stack product and hands-on projects across mobile, backend, system monitoring and data pipelines. I am currently seeking an entry-level software engineering role and am open to relocation across Indonesia.</p><div className="pf-education"><span>EDUCATION</span><strong>Bachelor of Informatics (S.Kom)</strong><span>UIN Sunan Kalijaga Yogyakarta · 2021–2025</span></div></div>
          <div className="pf-skills">{skillGroups.map(group => <div className="pf-skill-row" key={group.title}><h3>{group.title}</h3><p>{group.items}</p></div>)}</div></div>
      </section>

      <section className="pf-contact" id="contact"><div className="pf-contact-top"><span>04 / LET'S CONNECT</span><span>KENDARI · INDONESIA</span></div><h2>Have a role<br /><em>in mind?</em></h2><p>Open to junior software engineering and related IT opportunities.</p><a className="pf-contact-link" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={30} /></a></section>
    </main>
    <footer className="pf-footer"><span>© {new Date().getFullYear()} {profile.name}</span><div><ExternalLink href={profile.github}>GitHub <ArrowUpRight size={15} /></ExternalLink><ExternalLink href={profile.linkedin}>LinkedIn <ArrowUpRight size={15} /></ExternalLink><a href={`mailto:${profile.email}`}>Email <Mail size={15} /></a></div><a href="#top">Back to top ↑</a></footer>
  </div>;
}
