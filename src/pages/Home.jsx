import { useEffect, useState } from 'react';
import { defaultPortfolioContent, normalizePortfolioContent, safeWebUrl, templateMedia } from '../data/portfolioContent';
import '@fontsource-variable/inter-tight/wght.css';
import './portfolio.css';

function EmailButton({ email, compact = false }) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return <button type="button" className={`recon-email${compact ? ' recon-email-compact' : ''}`} onClick={copyEmail} aria-label={copied ? 'Email address copied' : `Copy email address ${email}`}>
    <span>{copied ? 'EMAIL COPIED!' : email}</span>
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true"><rect x="7" y="7" width="9" height="10" rx="1" stroke="currentColor" strokeWidth="1.4" /><path d="M13 7V4.5A1.5 1.5 0 0 0 11.5 3h-7A1.5 1.5 0 0 0 3 4.5v8A1.5 1.5 0 0 0 4.5 14H7" stroke="currentColor" strokeWidth="1.4" /></svg>
  </button>;
}

function WorkCard({ project, index }) {
  const image = safeWebUrl(project.imageUrl) || templateMedia.projects[index];
  const isTemplate = image === templateMedia.projects[index];
  const link = safeWebUrl(project.link) || defaultPortfolioContent.work.cards[index].link;
  return <article className={`recon-work-card recon-work-card-${index + 1}`}>
    <a href={link} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name}. ${project.summary}${isTemplate ? ' Image is temporary template artwork.' : ''}`}>
      <div className="recon-work-image"><img src={image} alt={isTemplate ? 'Temporary artwork from the supplied portfolio template' : project.imageAlt || `${project.name} project image`} loading="lazy" decoding="async" width="450" height="310" /><div className="recon-work-overlay"><span>{project.category}</span><p>{project.summary}</p>{isTemplate && <small>Template artwork · project image to be replaced</small>}</div></div>
      <div className="recon-work-caption"><strong>{project.name} <span aria-hidden="true">↗</span></strong></div>
    </a>
  </article>;
}

function HomePlaceholder() {
  return <div className="recon-site recon-loading" role="status" aria-label="Loading portfolio">
    <span className="recon-loading-label">Loading portfolio…</span>
    <div aria-hidden="true">
      <div className="recon-loading-nav"><span className="recon-loading-block recon-loading-brand" /><span className="recon-loading-block recon-loading-nav-links" /><span className="recon-loading-block recon-loading-contact" /></div>
      <div className="recon-loading-hero"><span className="recon-loading-block recon-loading-portrait" /><div className="recon-loading-copy"><span className="recon-loading-block recon-loading-heading" /><span className="recon-loading-block recon-loading-heading recon-loading-heading-short" /><span className="recon-loading-block recon-loading-line" /><span className="recon-loading-block recon-loading-line recon-loading-line-short" /></div></div>
      <div className="recon-loading-reel" />
    </div>
  </div>;
}

export default function Home() {
  const [content, setContent] = useState(() => import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY ? null : defaultPortfolioContent);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const syncScroll = () => setScrolled(window.scrollY > 16);
    syncScroll();
    window.addEventListener('scroll', syncScroll, { passive: true });
    return () => window.removeEventListener('scroll', syncScroll);
  }, []);

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) return;
    let cancelled = false;
    import('../lib/supabaseApi').then(async ({ getSiteSettings, getProjects }) => {
      const [settings, legacy] = await Promise.allSettled([getSiteSettings(), getProjects()]);
      if (cancelled) return;
      if (settings.status !== 'fulfilled' && legacy.status !== 'fulfilled') {
        setContent(defaultPortfolioContent);
        return;
      }
      setContent(normalizePortfolioContent(settings.status === 'fulfilled' ? settings.value?.portfolio_content : {}, legacy.status === 'fulfilled' ? legacy.value : []));
    }).catch(() => { if (!cancelled) setContent(defaultPortfolioContent); });
    return () => { cancelled = true; };
  }, []);

  if (!content) return <HomePlaceholder />;

  const portrait = safeWebUrl(content.hero.portraitUrl) || templateMedia.portrait;
  const reel = safeWebUrl(content.hero.reelUrl) || templateMedia.reel;
  const heroLink = safeWebUrl(content.hero.linkUrl) || defaultPortfolioContent.hero.linkUrl;
  const anyTemplateImages = content.work.cards.some((card, index) => (safeWebUrl(card.imageUrl) || templateMedia.projects[index]) === templateMedia.projects[index]);

  return <div className="recon-site" id="top">
    <header className={`recon-nav${scrolled ? ' recon-nav-scrolled' : ''}`}><a className="recon-wordmark" href="#top">{content.header.brand}</a><nav aria-label="Main navigation"><a href="#work">{content.header.workLabel}</a><a href="#about">{content.header.aboutLabel}</a></nav><EmailButton email={content.footer.email} compact /></header>
    <main>
      <section className="recon-hero" aria-labelledby="hero-title"><div className="recon-hero-inner"><div className="recon-portrait"><img src={portrait} alt={portrait === templateMedia.portrait ? defaultPortfolioContent.hero.portraitAlt : content.hero.portraitAlt || 'Portrait'} width="350" height="350" fetchPriority="high" /></div><div className="recon-hero-copy"><h1 id="hero-title">{content.hero.heading}</h1><p>{content.hero.lead}</p><p>{content.hero.description}</p><a className="recon-hero-link" href={heroLink} target="_blank" rel="noopener noreferrer">{content.hero.linkLabel} <span aria-hidden="true">↗</span></a></div></div></section>
      <div className="recon-reel" aria-hidden="true"><video src={reel} autoPlay muted loop playsInline preload="metadata" /></div>
      <section className="recon-work" id="work" aria-labelledby="work-title"><div className="recon-work-title"><h2 id="work-title">{content.work.heading}</h2><p>{content.work.scrollLabel}</p></div>{content.work.cards.map((project, index) => <WorkCard key={project.slot} project={project} index={index} />)}</section>
      <section className="recon-about" id="about" aria-labelledby="about-title"><h2 id="about-title">{content.about.heading}</h2><div className="recon-about-intro"><h3>{content.about.headline}</h3><div>{content.about.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></div><div className="recon-timeline">{content.about.timeline.map((item, index) => <article className="recon-timeline-row" key={item.id || index}><p>{item.period}</p><div><h3>{item.title}</h3><strong>{item.subtitle}</strong><p>{item.description}</p>{safeWebUrl(item.linkUrl) && <a href={safeWebUrl(item.linkUrl)} target="_blank" rel="noopener noreferrer">{item.linkLabel || 'View link'} ↗</a>}</div></article>)}</div>{anyTemplateImages && <p className="recon-visual-note">{content.about.imageNote}</p>}</section>
    </main>
    <footer className="recon-footer"><h2>{content.footer.heading}</h2><EmailButton email={content.footer.email} compact /><div className="recon-footer-bottom"><div>{safeWebUrl(content.footer.githubUrl) && <a href={safeWebUrl(content.footer.githubUrl)} target="_blank" rel="noopener noreferrer" aria-label="GitHub">{content.footer.githubLabel}</a>}{safeWebUrl(content.footer.linkedinUrl) && <a href={safeWebUrl(content.footer.linkedinUrl)} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">{content.footer.linkedinLabel}</a>}{safeWebUrl(content.footer.instagramUrl) && <a href={safeWebUrl(content.footer.instagramUrl)} target="_blank" rel="noopener noreferrer" aria-label="Instagram">{content.footer.instagramLabel}</a>}</div><span>© {new Date().getFullYear()} {content.footer.copyrightName}</span></div></footer>
  </div>;
}
