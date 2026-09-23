import { useEffect, useState } from 'react';
import { experience, profile, projects } from '../data/portfolio';
import '@fontsource-variable/inter-tight/wght.css';
import './portfolio.css';

// The supplied RECON export keeps these original Framer assets as temporary artwork.
// They are not presented as Indra's portrait or as screenshots of his projects.
const templateAssets = {
  portrait: 'https://framerusercontent.com/images/JQqsD7xecQfWDLwoSTpvjAMyVw.png?scale-down-to=512&width=768&height=768',
  reel: 'https://framerusercontent.com/assets/qrR62CWXqDhpxD9VshrTGooXZg.mp4',
  projects: [
    'https://framerusercontent.com/images/R1r7VFivZ1p7eirOLoMdE5NV80M.jpg?scale-down-to=1024',
    'https://framerusercontent.com/images/conknpf49hPAVpbVfu0eEPiE4SM.jpeg?scale-down-to=1024',
    'https://framerusercontent.com/images/h25SyziLUKTHENOdmXtNMuyOHdM.jpg?scale-down-to=1024',
  ],
};

function EmailButton({ compact = false }) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  return <button type="button" className={`recon-email${compact ? ' recon-email-compact' : ''}`} onClick={copyEmail} aria-label={copied ? 'Email address copied' : `Copy email address ${profile.email}`}>
    <span>{copied ? 'EMAIL COPIED!' : profile.email}</span>
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true"><rect x="7" y="7" width="9" height="10" rx="1" stroke="currentColor" strokeWidth="1.4" /><path d="M13 7V4.5A1.5 1.5 0 0 0 11.5 3h-7A1.5 1.5 0 0 0 3 4.5v8A1.5 1.5 0 0 0 4.5 14H7" stroke="currentColor" strokeWidth="1.4" /></svg>
  </button>;
}

function WorkCard({ project, index, image }) {
  return <article className={`recon-work-card recon-work-card-${index + 1}`}>
    <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} repository. ${project.summary}${image ? '' : ' Image is temporary template artwork.'}`}>
      <div className="recon-work-image"><img src={image || templateAssets.projects[index]} alt={image ? `${project.name} project screenshot` : 'Temporary artwork from the supplied portfolio template'} loading="lazy" decoding="async" width="450" height="310" /><div className="recon-work-overlay"><span>{project.category}</span><p>{project.summary}</p>{!image && <small>Template artwork · project image to be replaced</small>}</div></div>
      <div className="recon-work-caption"><strong>{project.name} <span aria-hidden="true">↗</span></strong></div>
    </a>
  </article>;
}

export default function Home() {
  const [projectImages, setProjectImages] = useState({});
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const syncScroll = () => setScrolled(window.scrollY > 16);
    syncScroll();
    window.addEventListener('scroll', syncScroll, { passive: true });
    return () => window.removeEventListener('scroll', syncScroll);
  }, []);

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) return;
    const section = document.getElementById('work');
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
      }).catch(() => { /* Keep the supplied template artwork when CMS is unavailable. */ });
    }, { rootMargin: '500px' });
    observer.observe(section);
    return () => { cancelled = true; observer.disconnect(); };
  }, []);

  return <div className="recon-site" id="top">
    <header className={`recon-nav${scrolled ? ' recon-nav-scrolled' : ''}`}><a className="recon-wordmark" href="#top">Indra Arya</a><nav aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a></nav><EmailButton compact /></header>
    <main>
      <section className="recon-hero" aria-labelledby="hero-title"><div className="recon-hero-inner"><div className="recon-portrait"><img src={templateAssets.portrait} alt="Template portrait placeholder; not a photo of Indra" width="350" height="350" fetchPriority="high" /></div><div className="recon-hero-copy"><h1 id="hero-title">Software<br />Engineer</h1><p>I build practical software across web, mobile, and data workflows.</p><p>My freelance work on PickFrame covered Go APIs, PostgreSQL, and React. I’m based in Kendari and open to junior roles across Indonesia.</p><a className="recon-hero-link" href="https://pickframe.satuarah.click" target="_blank" rel="noopener noreferrer">View live product <span aria-hidden="true">↗</span></a></div></div></section>
      <div className="recon-reel" aria-hidden="true"><video src={templateAssets.reel} autoPlay muted loop playsInline preload="metadata" /></div>
      <section className="recon-work" id="work" aria-labelledby="work-title"><div className="recon-work-title"><h2 id="work-title">Featured work</h2><p>(SCROLL TO EXPLORE)</p></div>{projects.map((project, index) => <WorkCard key={project.slot} project={project} index={index} image={projectImages[project.slot]} />)}</section>
      <section className="recon-about" id="about" aria-labelledby="about-title"><h2 id="about-title">About</h2><div className="recon-about-intro"><h3>Building useful digital products across interfaces, APIs, and data.</h3><div><p>I’m Indra, an Informatics graduate from UIN Sunan Kalijaga Yogyakarta. My freelance work on PickFrame covered a live product’s backend, database, and frontend.</p><p>My public projects include a mobile job tracker, a service-operations dashboard, and an e-commerce data pipeline. I’m available immediately for junior IT roles across Indonesia.</p></div></div><div className="recon-timeline">{experience.map(item => <article className="recon-timeline-row" key={item.company}><p>{item.period}</p><div><h3>{item.company}</h3><strong>{item.role} · {item.location}</strong><p>{item.description}</p>{item.link && <a href={item.link} target="_blank" rel="noopener noreferrer">View live product ↗</a>}</div></article>)}<article className="recon-timeline-row"><p>2021–2025</p><div><h3>UIN Sunan Kalijaga Yogyakarta</h3><strong>Bachelor of Informatics (S.Kom) · GPA 3.54/4.00</strong><p>Studied data structures, databases, web programming, and software engineering.</p></div></article></div><p className="recon-visual-note">The project images are temporary template artwork, not screenshots of these repositories.</p></section>
    </main>
    <footer className="recon-footer"><h2>Let’s get to know<br />each other</h2><EmailButton compact /><div className="recon-footer-bottom"><div><a href={profile.github} target="_blank" rel="noopener noreferrer">GH</a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">IN</a></div><span>© {new Date().getFullYear()} Indra Arya</span></div></footer>
  </div>;
}
