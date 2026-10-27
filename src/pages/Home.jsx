import { useEffect, useState } from 'react';
import WorkGallery from '../components/WorkGallery';
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
  const [navOnDark, setNavOnDark] = useState(false);

  useEffect(() => {
    const syncScroll = () => {
      setScrolled(window.scrollY > 16);
      // The header turns transparent while it sits over the dark work gallery.
      const work = document.getElementById('work')?.getBoundingClientRect();
      setNavOnDark(Boolean(work && work.top <= 38 && work.bottom >= 38));
    };
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

  const savedPortrait = safeWebUrl(content.hero.portraitUrl);
  const portrait = savedPortrait && savedPortrait !== templateMedia.portrait ? savedPortrait : '/images/portrait.webp';
  const reel = safeWebUrl(content.hero.reelUrl) || templateMedia.reel;
  const heroLink = safeWebUrl(content.hero.linkUrl) || defaultPortfolioContent.hero.linkUrl;

  return <div className="recon-site" id="top">
    <header className={`recon-nav${scrolled ? ' recon-nav-scrolled' : ''}${navOnDark ? ' recon-nav-dark' : ''}`}><a className="recon-wordmark" href="#top">{content.header.brand}</a><nav aria-label="Main navigation"><a href="#work">{content.header.workLabel}</a><a href="#about">{content.header.aboutLabel}</a></nav><EmailButton email={content.footer.email} compact /></header>
    <main>
      <section className="recon-hero" aria-labelledby="hero-title"><div className="recon-hero-inner"><div className="recon-portrait"><img src={portrait} alt={portrait === '/images/portrait.webp' ? defaultPortfolioContent.hero.portraitAlt : content.hero.portraitAlt || 'Portrait'} width="350" height="350" fetchPriority="high" onError={(event) => { if (event.currentTarget.getAttribute('src') !== '/images/portrait.webp') event.currentTarget.src = '/images/portrait.webp'; }} /></div><div className="recon-hero-copy"><h1 id="hero-title">{content.hero.heading}</h1><p>{content.hero.lead}</p><p>{content.hero.description}</p><a className="recon-hero-link" href={heroLink} target="_blank" rel="noopener noreferrer">{content.hero.linkLabel} <span aria-hidden="true">↗</span></a></div></div></section>
      <div className="recon-reel" aria-hidden="true"><video src={reel} autoPlay muted loop playsInline preload="metadata" /></div>
      <WorkGallery work={content.work} />
      <section className="recon-about" id="about" aria-labelledby="about-title"><h2 id="about-title">{content.about.heading}</h2><div className="recon-about-intro"><h3>{content.about.headline}</h3><div>{content.about.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></div><div className="recon-timeline">{content.about.timeline.map((item, index) => <article className="recon-timeline-row" key={item.id || index}><p>{item.period}</p><div><h3>{item.title}</h3><strong>{item.subtitle}</strong><p>{item.description}</p>{safeWebUrl(item.linkUrl) && <a href={safeWebUrl(item.linkUrl)} target="_blank" rel="noopener noreferrer">{item.linkLabel || 'View link'} ↗</a>}</div></article>)}</div></section>
    </main>
    <footer className="recon-footer"><h2>{content.footer.heading}</h2><EmailButton email={content.footer.email} compact /><div className="recon-footer-bottom"><div>{safeWebUrl(content.footer.githubUrl) && <a href={safeWebUrl(content.footer.githubUrl)} target="_blank" rel="noopener noreferrer" aria-label="GitHub">{content.footer.githubLabel}</a>}{safeWebUrl(content.footer.linkedinUrl) && <a href={safeWebUrl(content.footer.linkedinUrl)} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">{content.footer.linkedinLabel}</a>}{safeWebUrl(content.footer.instagramUrl) && <a href={safeWebUrl(content.footer.instagramUrl)} target="_blank" rel="noopener noreferrer" aria-label="Instagram">{content.footer.instagramLabel}</a>}</div><span>© {new Date().getFullYear()} {content.footer.copyrightName}</span></div></footer>
  </div>;
}
