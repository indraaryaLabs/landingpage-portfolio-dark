import { useEffect, useState } from 'react';
import { ArrowUpRight, Save, X } from 'lucide-react';
import { projects } from '../../../data/portfolio';
import { createProject, getProjects, updateProject } from '../../../lib/supabaseApi';
import ImageUpload from '../components/ImageUpload';
import { useToast } from '../components/Toast';

export default function ProjectsEditor() {
  const { showToast } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSlot, setEditingSlot] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProjects().then(setRows).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const currentProject = projects.find(project => project.slot === editingSlot);
  const rowFor = (project) => rows.find(row => Number(row.slot_number) === project.slot);
  const verifiedImageFor = (project) => {
    const row = rowFor(project);
    return row?.project_link?.replace(/\/$/, '') === project.link ? row.image_url || '' : '';
  };

  function openEditor(project) {
    setEditingSlot(project.slot);
    setImageUrl(verifiedImageFor(project));
  }

  async function save(e) {
    e.preventDefault();
    if (!currentProject || uploading || saving) return;
    setSaving(true);
    try {
      const existing = rowFor(currentProject);
      const payload = {
        slot_number: currentProject.slot,
        title: currentProject.name,
        category: currentProject.category,
        overlay_text: currentProject.summary,
        project_link: currentProject.link,
        image_url: imageUrl,
      };
      const updated = existing
        ? await updateProject(existing.id, payload)
        : await createProject(payload);
      setRows(previous => existing
        ? previous.map(row => row.id === existing.id ? updated : row)
        : [...previous, updated]);
      showToast(`${currentProject.name} image saved`, 'success');
      setEditingSlot(null);
    } catch (err) {
      showToast(`Could not save image: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="admin-loading">Loading project images…</div>;
  if (error) return <div className="admin-card"><h1>Project images unavailable</h1><p>{error}</p><p>Check the Supabase configuration before uploading files.</p></div>;

  return <div className="admin-fade-in">
    <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Project images</h1>
    <p style={{ color: '#a1a1aa', maxWidth: 680, lineHeight: 1.6, marginBottom: 30 }}>Upload real screenshots for the three verified projects. The public portfolio keeps its checked descriptions and shows a lightweight illustration until you save an image. Recommended: a clear 16:9 screenshot; the upload is resized for the web.</p>

    {currentProject && <form className="admin-card" onSubmit={save} style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}><h2 style={{ fontSize: 19, fontWeight: 700 }}>{currentProject.name}</h2><button type="button" className="admin-btn admin-btn-ghost admin-btn-icon" onClick={() => setEditingSlot(null)} aria-label="Close editor"><X size={17} /></button></div>
      <p style={{ color: '#a1a1aa', margin: '14px 0 20px' }}>{currentProject.summary}</p>
      <ImageUpload label={`Screenshot for ${currentProject.name}`} value={imageUrl} onChange={setImageUrl} onUploadingChange={setUploading} aspect="16/9" imagesOnly optimized />
      <p style={{ color: '#a1a1aa', fontSize: 12, marginTop: 12 }}>Choose a real project screenshot. Uploading stores the file; click Save to publish it on this project card. Remove clears the card image after Save.</p>
      <button className="admin-btn admin-btn-primary" type="submit" disabled={uploading || saving} style={{ marginTop: 20 }}><Save size={15} /> {saving ? 'Saving…' : uploading ? 'Uploading…' : 'Save project image'}</button>
    </form>}

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
      {projects.map(project => {
        const image = verifiedImageFor(project);
        return <article className="admin-card" key={project.slot} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ aspectRatio: '16 / 9', background: '#142019', border: '1px solid #34483a', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>{image ? <img src={image} alt={`${project.name} screenshot preview`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#a1a1aa', fontSize: 13 }}>No screenshot uploaded</span>}</div>
          <div><p style={{ color: '#a1a1aa', fontSize: 11, marginBottom: 6 }}>{project.category}</p><h2 style={{ fontSize: 18, fontWeight: 700 }}>{project.name}</h2></div>
          <p style={{ color: '#a1a1aa', fontSize: 13, lineHeight: 1.5, flex: 1 }}>{project.summary}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => openEditor(project)}>{image ? 'Replace image' : 'Add image'}</button><a href={project.link} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost admin-btn-sm">Repository <ArrowUpRight size={14} /></a></div>
        </article>;
      })}
    </div>
  </div>;
}
