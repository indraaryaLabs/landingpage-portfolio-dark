import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowDown, ArrowUp, ArrowUpRight, Check, Image as ImageIcon, Save, Video } from 'lucide-react';
import { defaultPortfolioContent, normalizePortfolioContent, safeWebUrl, templateMedia } from '../../data/portfolioContent';
import { getProjects, getSiteSettings, upsertSiteSettings, uploadMedia } from '../../lib/supabaseApi';
import ImageUpload from './components/ImageUpload';
import { useToast } from './components/Toast';

const SECTIONS = {
  overview: { number: '00', title: 'Portfolio overview', eyebrow: 'YOUR SITE AT A GLANCE' },
  hero: { number: '01', title: 'Header & hero', eyebrow: 'FIRST IMPRESSION' },
  work: { number: '02', title: 'Featured work', eyebrow: 'THREE PROJECT SLOTS' },
  about: { number: '03', title: 'About & experience', eyebrow: 'YOUR STORY' },
  footer: { number: '04', title: 'Footer & contact', eyebrow: 'STAY IN TOUCH' },
};

function Field({ label, value, onChange, hint, multiline = false, type = 'text', rows = 3, required = false }) {
  const id = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return <div className="admin-field">
    <label className="admin-label" htmlFor={id}>{label}</label>
    {multiline
      ? <textarea id={id} className="admin-textarea" value={value ?? ''} rows={rows} onChange={(event) => onChange(event.target.value)} required={required} />
      : <input id={id} className="admin-input" type={type} value={value ?? ''} onChange={(event) => onChange(event.target.value)} required={required} />}
    {hint && <p className="admin-hint">{hint}</p>}
  </div>;
}

function ImageSlot({ label, description, value, defaultUrl, onChange, aspect, onUploadingChange, isTemplate }) {
  return <div className="admin-media-slot">
    <div className="admin-media-intro"><div className="admin-media-icon"><ImageIcon size={20} strokeWidth={1.6} /></div><div><h3>{label}</h3><p>{description}</p></div></div>
    <ImageUpload label="Image file" value={value || defaultUrl} onChange={(next) => onChange(next || defaultUrl)} canRemove={!isTemplate} aspect={aspect} optimized onUploadingChange={onUploadingChange} />
    <p className="admin-hint">{isTemplate ? 'Currently using the original template artwork. Upload your own image, then Save to publish.' : 'Custom image selected. Save to publish any changes.'}</p>
  </div>;
}

function VideoSlot({ value, onChange, onUploadingChange }) {
  const [error, setError] = useState('');

  async function chooseVideo(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['video/mp4', 'video/webm'].includes(file.type)) {
      setError('Use an MP4 or WebM video.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('The video must be 50 MB or smaller.');
      return;
    }
    setError('');
    onUploadingChange(true);
    try {
      onChange(await uploadMedia(file));
    } catch (uploadError) {
      setError(uploadError.message || 'Upload failed.');
    } finally {
      onUploadingChange(false);
    }
  }

  const previewUrl = safeWebUrl(value) || templateMedia.reel;
  return <div className="admin-media-slot">
    <div className="admin-media-intro"><div className="admin-media-icon"><Video size={20} strokeWidth={1.6} /></div><div><h3>Showreel video</h3><p>The wide moving artwork between the hero and Featured work.</p></div></div>
    <video className="admin-video-preview" src={previewUrl} controls muted playsInline preload="metadata" aria-label="Showreel video preview" />
    <div className="admin-media-actions"><label className="admin-btn admin-btn-primary">Upload MP4 / WebM<input type="file" accept="video/mp4,video/webm" onChange={chooseVideo} hidden /></label><span>Up to 50 MB</span></div>
    <Field label="Video URL" value={value} onChange={onChange} hint="You may also paste an HTTPS video URL. Save after changing it." type="url" />
    {error && <p className="admin-inline-error" role="alert">{error}</p>}
  </div>;
}

function SectionHeader({ section, dirty }) {
  const meta = SECTIONS[section];
  return <div className="admin-section-header"><div><p className="admin-eyebrow">{meta.number} / {meta.eyebrow}</p><h1>{meta.title}</h1></div><span className={`admin-state ${dirty ? 'admin-state-dirty' : ''}`}>{dirty ? 'UNSAVED CHANGES' : 'READY TO EDIT'}</span></div>;
}

function validateContent(content) {
  const required = [content.header.brand, content.hero.heading, content.hero.lead, content.work.heading, content.about.heading, content.footer.heading, content.footer.email];
  if (required.some((value) => !value?.trim())) throw new Error('Fill in all required headings and the contact email.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.footer.email)) throw new Error('Enter a valid contact email.');
  const links = [content.hero.linkUrl, content.footer.githubUrl, content.footer.linkedinUrl, content.hero.portraitUrl, content.hero.reelUrl,
    ...content.work.cards.flatMap((card) => [card.link, card.imageUrl]), ...content.about.timeline.map((entry) => entry.linkUrl)];
  if (links.some((url) => url && !safeWebUrl(url))) throw new Error('Links and media URLs must start with https:// or http://.');
  if (content.work.cards.some((card) => !card.name?.trim() || !card.link?.trim())) throw new Error('Every project needs a name and destination URL.');
  if (content.hero.portraitUrl !== templateMedia.portrait && content.hero.portraitUrl && !content.hero.portraitAlt?.trim()) throw new Error('Describe your new portrait in the alternative-text field.');
  if (content.work.cards.some((card, index) => card.imageUrl && card.imageUrl !== templateMedia.projects[index] && !card.imageAlt?.trim())) throw new Error('Add alternative text for each new project image.');
}

export default function PortfolioEditor() {
  const location = useLocation();
  const section = Object.hasOwn(SECTIONS, location.hash.slice(1)) ? location.hash.slice(1) : 'overview';
  const { showToast } = useToast();
  const [content, setContent] = useState(defaultPortfolioContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([getSiteSettings(), getProjects()]).then(([settings, legacy]) => {
      if (cancelled) return;
      if (settings.status === 'rejected') {
        setError(settings.reason?.message || 'Could not load portfolio content.');
      } else {
        setContent(normalizePortfolioContent(settings.value?.portfolio_content, legacy.status === 'fulfilled' ? legacy.value : []));
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function updatePart(part, key, value) {
    setContent((current) => ({ ...current, [part]: { ...current[part], [key]: value } }));
    setDirty(true);
  }

  function updateCard(slot, key, value) {
    setContent((current) => ({ ...current, work: { ...current.work, cards: current.work.cards.map((card) => card.slot === slot ? { ...card, [key]: value } : card) } }));
    setDirty(true);
  }

  function updatePortrait(value) {
    setContent((current) => ({ ...current, hero: { ...current.hero, portraitUrl: value, portraitAlt: value === templateMedia.portrait || !value ? defaultPortfolioContent.hero.portraitAlt : '' } }));
    setDirty(true);
  }

  function updateCardImage(slot, index, value) {
    setContent((current) => ({ ...current, work: { ...current.work, cards: current.work.cards.map((card) => card.slot === slot ? { ...card, imageUrl: value, imageAlt: value === templateMedia.projects[index] || !value ? defaultPortfolioContent.work.cards[index].imageAlt : '' } : card) } }));
    setDirty(true);
  }

  function updateParagraph(index, value) {
    setContent((current) => ({ ...current, about: { ...current.about, paragraphs: current.about.paragraphs.map((item, itemIndex) => itemIndex === index ? value : item) } }));
    setDirty(true);
  }

  function updateTimeline(id, key, value) {
    setContent((current) => ({ ...current, about: { ...current.about, timeline: current.about.timeline.map((item) => item.id === id ? { ...item, [key]: value } : item) } }));
    setDirty(true);
  }

  function addTimeline() {
    const entry = { id: `entry-${Date.now()}`, period: '', title: '', subtitle: '', description: '', linkLabel: '', linkUrl: '' };
    setContent((current) => ({ ...current, about: { ...current.about, timeline: [...current.about.timeline, entry] } }));
    setDirty(true);
  }

  function removeTimeline(id) {
    setContent((current) => ({ ...current, about: { ...current.about, timeline: current.about.timeline.filter((item) => item.id !== id) } }));
    setDirty(true);
  }

  function moveTimeline(id, direction) {
    setContent((current) => {
      const entries = [...current.about.timeline];
      const index = entries.findIndex((entry) => entry.id === id);
      const destination = index + direction;
      if (index < 0 || destination < 0 || destination >= entries.length) return current;
      [entries[index], entries[destination]] = [entries[destination], entries[index]];
      return { ...current, about: { ...current.about, timeline: entries } };
    });
    setDirty(true);
  }

  function onUploadingChange(active) {
    setUploadCount((count) => Math.max(0, count + (active ? 1 : -1)));
  }

  async function save(event) {
    event.preventDefault();
    if (saving || uploadCount > 0 || !dirty) return;
    try {
      validateContent(content);
      setSaving(true);
      await upsertSiteSettings({ portfolio_content: content });
      setDirty(false);
      setError('');
      showToast('Portfolio published successfully', 'success');
    } catch (saveError) {
      setError(saveError.message || 'Could not save portfolio content.');
      showToast('Could not publish changes', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="admin-loading">Loading your portfolio…</div>;

  return <form className="admin-editor" onSubmit={save}>
    <SectionHeader section={section} dirty={dirty} />
    {error && <div className="admin-alert" role="alert"><strong>Connection or validation issue</strong><p>{error}</p></div>}

    {section === 'overview' && <div className="admin-overview">
      <div className="admin-overview-lead"><p className="admin-eyebrow">YOUR EDITOR, YOUR STORY</p><h2>One site.<br />Every detail in your hands.</h2><p>Update the words, links, portrait, showreel, and project visuals without changing the approved landing-page composition. Template artwork stays in place until you replace it and save.</p><a className="admin-btn admin-btn-primary" href="/" target="_blank" rel="noopener noreferrer">View live preview <ArrowUpRight size={16} /></a></div>
      <div className="admin-overview-grid">{Object.entries(SECTIONS).filter(([key]) => key !== 'overview').map(([key, meta]) => <Link className="admin-overview-tile" to={`/admin#${key}`} key={key}><span>{meta.number} / {meta.eyebrow}</span><h3>{meta.title}</h3><p>{key === 'hero' ? 'Portrait, showreel, headline and introduction' : key === 'work' ? 'Three project images, descriptions and links' : key === 'about' ? 'Introduction, career timeline and education' : 'Contact email, social links and closing line'}</p><ArrowUpRight size={18} /></Link>)}</div>
      <p className="admin-proof-note"><Check size={15} /> Keep every professional claim accurate to your experience before publishing.</p>
    </div>}

    {section === 'hero' && <div className="admin-section-stack">
      <div className="admin-panel"><p className="admin-panel-index">HEADER</p><h2>Navigation</h2><div className="admin-editor-grid"><Field label="Wordmark" value={content.header.brand} onChange={(value) => updatePart('header', 'brand', value)} required /><Field label="Work link label" value={content.header.workLabel} onChange={(value) => updatePart('header', 'workLabel', value)} /><Field label="About link label" value={content.header.aboutLabel} onChange={(value) => updatePart('header', 'aboutLabel', value)} /></div></div>
      <div className="admin-panel"><p className="admin-panel-index">HERO</p><h2>Introduction</h2><div className="admin-editor-grid"><Field label="Main heading" value={content.hero.heading} onChange={(value) => updatePart('hero', 'heading', value)} multiline rows={2} hint="A line break in this field becomes a line break on the landing page." required /><Field label="Lead sentence" value={content.hero.lead} onChange={(value) => updatePart('hero', 'lead', value)} multiline rows={3} required /><Field label="Supporting paragraph" value={content.hero.description} onChange={(value) => updatePart('hero', 'description', value)} multiline rows={4} /><Field label="Link label" value={content.hero.linkLabel} onChange={(value) => updatePart('hero', 'linkLabel', value)} /><Field label="Link URL" value={content.hero.linkUrl} onChange={(value) => updatePart('hero', 'linkUrl', value)} type="url" /></div></div>
      <div className="admin-editor-grid admin-media-grid"><ImageSlot label="Hero portrait" description="Circular image at the beginning of the page. Square crop recommended." value={content.hero.portraitUrl} defaultUrl={templateMedia.portrait} onChange={updatePortrait} aspect="1/1" onUploadingChange={onUploadingChange} isTemplate={!content.hero.portraitUrl || content.hero.portraitUrl === templateMedia.portrait} /><VideoSlot value={content.hero.reelUrl} onChange={(value) => updatePart('hero', 'reelUrl', value)} onUploadingChange={onUploadingChange} /></div>
      <div className="admin-panel"><Field label="Portrait alternative text" value={content.hero.portraitAlt} onChange={(value) => updatePart('hero', 'portraitAlt', value)} hint="Describe the actual uploaded image. The template portrait is never described as your photo." /></div>
    </div>}

    {section === 'work' && <div className="admin-section-stack">
      <div className="admin-panel"><p className="admin-panel-index">FEATURED WORK</p><h2>Section title</h2><div className="admin-editor-grid"><Field label="Heading" value={content.work.heading} onChange={(value) => updatePart('work', 'heading', value)} required /><Field label="Scroll cue" value={content.work.scrollLabel} onChange={(value) => updatePart('work', 'scrollLabel', value)} /></div></div>
      {content.work.cards.map((card, index) => <div className="admin-panel" key={card.slot}><p className="admin-panel-index">PROJECT 0{index + 1}</p><h2>{card.name || `Project ${index + 1}`}</h2><div className="admin-project-layout"><ImageSlot label={`Project ${index + 1} image`} description="Actual project screenshot recommended. Cropped to the card's landscape frame." value={card.imageUrl} defaultUrl={templateMedia.projects[index]} onChange={(value) => updateCardImage(card.slot, index, value)} aspect="450/310" onUploadingChange={onUploadingChange} isTemplate={!card.imageUrl || card.imageUrl === templateMedia.projects[index]} /><div className="admin-project-fields"><Field label={`Project ${index + 1} name`} value={card.name} onChange={(value) => updateCard(card.slot, 'name', value)} required /><Field label={`Project ${index + 1} category`} value={card.category} onChange={(value) => updateCard(card.slot, 'category', value)} /><Field label={`Project ${index + 1} summary`} value={card.summary} onChange={(value) => updateCard(card.slot, 'summary', value)} multiline rows={4} /><Field label={`Project ${index + 1} URL`} value={card.link} onChange={(value) => updateCard(card.slot, 'link', value)} type="url" required /><Field label={`Project ${index + 1} image alt text`} value={card.imageAlt} onChange={(value) => updateCard(card.slot, 'imageAlt', value)} /></div></div></div>)}
    </div>}

    {section === 'about' && <div className="admin-section-stack">
      <div className="admin-panel"><p className="admin-panel-index">ABOUT</p><h2>Introduction</h2><div className="admin-editor-grid"><Field label="About heading" value={content.about.heading} onChange={(value) => updatePart('about', 'heading', value)} required /><Field label="About headline" value={content.about.headline} onChange={(value) => updatePart('about', 'headline', value)} multiline rows={3} /><Field label="About paragraph 1" value={content.about.paragraphs[0] || ''} onChange={(value) => updateParagraph(0, value)} multiline rows={5} /><Field label="About paragraph 2" value={content.about.paragraphs[1] || ''} onChange={(value) => updateParagraph(1, value)} multiline rows={5} /></div></div>
      <div className="admin-panel"><p className="admin-panel-index">TIMELINE</p><div className="admin-panel-heading"><h2>Experience & education</h2><button type="button" className="admin-btn admin-btn-ghost" onClick={addTimeline}>Add entry +</button></div><div className="admin-timeline-editor">{content.about.timeline.map((entry, index) => <div className="admin-timeline-card" key={entry.id}><div className="admin-panel-heading"><strong>Entry {String(index + 1).padStart(2, '0')}</strong><div className="admin-timeline-actions"><button type="button" onClick={() => moveTimeline(entry.id, -1)} disabled={index === 0} aria-label={`Move entry ${index + 1} up`}><ArrowUp size={15} /></button><button type="button" onClick={() => moveTimeline(entry.id, 1)} disabled={index === content.about.timeline.length - 1} aria-label={`Move entry ${index + 1} down`}><ArrowDown size={15} /></button><button type="button" className="admin-link-danger" onClick={() => removeTimeline(entry.id)}>Remove</button></div></div><div className="admin-editor-grid"><Field label={`Entry ${index + 1} period`} value={entry.period} onChange={(value) => updateTimeline(entry.id, 'period', value)} /><Field label={`Entry ${index + 1} organization`} value={entry.title} onChange={(value) => updateTimeline(entry.id, 'title', value)} /><Field label={`Entry ${index + 1} role or qualification`} value={entry.subtitle} onChange={(value) => updateTimeline(entry.id, 'subtitle', value)} /><Field label={`Entry ${index + 1} description`} value={entry.description} onChange={(value) => updateTimeline(entry.id, 'description', value)} multiline rows={3} /><Field label={`Entry ${index + 1} link label`} value={entry.linkLabel} onChange={(value) => updateTimeline(entry.id, 'linkLabel', value)} /><Field label={`Entry ${index + 1} URL`} value={entry.linkUrl} onChange={(value) => updateTimeline(entry.id, 'linkUrl', value)} type="url" /></div></div>)}</div></div>
      <div className="admin-panel"><Field label="Template image disclosure" value={content.about.imageNote} onChange={(value) => updatePart('about', 'imageNote', value)} multiline rows={2} hint="Shown only while at least one project still uses template artwork." /></div>
    </div>}

    {section === 'footer' && <div className="admin-section-stack"><div className="admin-panel"><p className="admin-panel-index">FOOTER</p><h2>Closing & contact</h2><div className="admin-editor-grid"><Field label="Closing heading" value={content.footer.heading} onChange={(value) => updatePart('footer', 'heading', value)} multiline rows={2} hint="A line break becomes a line break on the landing page." required /><Field label="Contact email" value={content.footer.email} onChange={(value) => updatePart('footer', 'email', value)} type="email" required /><Field label="GitHub URL" value={content.footer.githubUrl} onChange={(value) => updatePart('footer', 'githubUrl', value)} type="url" /><Field label="GitHub label" value={content.footer.githubLabel} onChange={(value) => updatePart('footer', 'githubLabel', value)} /><Field label="LinkedIn URL" value={content.footer.linkedinUrl} onChange={(value) => updatePart('footer', 'linkedinUrl', value)} type="url" /><Field label="LinkedIn label" value={content.footer.linkedinLabel} onChange={(value) => updatePart('footer', 'linkedinLabel', value)} /><Field label="Copyright name" value={content.footer.copyrightName} onChange={(value) => updatePart('footer', 'copyrightName', value)} /></div></div></div>}

    <div className="admin-savebar"><div><strong>{dirty ? 'Changes are not live yet.' : 'Your page is ready.'}</strong><span>{uploadCount > 0 ? 'Finish uploading before publishing.' : 'Review factual details before publishing.'}</span></div><button type="submit" className="admin-btn admin-btn-primary" disabled={!dirty || saving || uploadCount > 0}><Save size={16} /> {saving ? 'Publishing…' : uploadCount > 0 ? 'Uploading…' : 'Save & publish'}</button></div>
  </form>;
}
