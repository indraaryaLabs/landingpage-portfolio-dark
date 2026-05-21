import React, { useState, useEffect } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../../../lib/supabaseApi';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import ImageUpload from '../components/ImageUpload';
import { Plus, Trash2, Save, X, Pencil, Info } from 'lucide-react';

export default function ProjectsEditor() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // 'new' or number
  const [activeSlot, setActiveSlot] = useState(null); // 1, 2, 3, or 4
  const [deleteTarget, setDeleteTarget] = useState(null); // project object
  const [form, setForm] = useState({ title: '', category: '', overlay_text: '', image_url: '', project_link: '' });

  async function load() {
    try {
      const projects = await getProjects();
      setItems(projects);
    } catch (err) {
      showToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openNew(slotNum) {
    setActiveSlot(slotNum);
    setEditingId('new');
    setForm({ title: '', category: '', overlay_text: '', image_url: '', project_link: '' });
  }

  function openEdit(item, slotNum) {
    setActiveSlot(slotNum);
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      category: item.category || '',
      overlay_text: item.overlay_text || '',
      image_url: item.image_url || '',
      project_link: item.project_link || '',
    });
  }

  function closeEditor() {
    setEditingId(null);
    setActiveSlot(null);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.title || !form.image_url) {
      showToast('Title and image are required', 'error');
      return;
    }
    try {
      if (editingId === 'new') {
        const created = await createProject({ ...form, slot_number: activeSlot });
        setItems(prev => [...prev, created]);
        showToast(`Slot ${activeSlot} successfully updated!`, 'success');
      } else {
        const updated = await updateProject(editingId, form);
        setItems(prev => prev.map(it => it.id === editingId ? updated : it));
        showToast(`Slot ${activeSlot} successfully updated!`, 'success');
      }
      closeEditor();
    } catch (err) {
      showToast('Failed: ' + err.message, 'error');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteProject(deleteTarget.id);
      setItems(prev => prev.filter(it => it.id !== deleteTarget.id));
      showToast(`Slot cleared successfully!`, 'success');
    } catch (err) {
      showToast('Failed: ' + err.message, 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  if (loading) return <div className="admin-fade-in"><div className="admin-spinner" style={{ margin: '40px auto' }} /></div>;

  const slotMetadata = {
    1: { label: 'Slot 1 (Hero - Left Top)', dimensions: '480px Tall Grid Aspect' },
    2: { label: 'Slot 2 (Hero - Right Top)', dimensions: '280px Short Grid Aspect' },
    3: { label: 'Slot 3 (Gallery - Left Bottom)', dimensions: '320px Medium Grid Aspect' },
    4: { label: 'Slot 4 (Gallery - Right Bottom)', dimensions: '520px Extra Tall Grid Aspect' }
  };

  return (
    <div className="admin-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 10 }}>
            Portfolio Grid Slots
          </h1>
          <p style={{ color: '#71717a', fontSize: 13 }}>Assign projects directly to structured slots to preserve your grid layout order.</p>
        </div>
      </div>

      <div 
        style={{ 
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start'
        }}
      >
        <Info size={18} style={{ color: '#3b82f6', marginTop: 2, flexShrink: 0 }} />
        <div style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.5 }}>
          <strong>Zero-Collapse Design:</strong> The portfolio homepage gallery relies on a strict criss-cross height masonry layout. 
          If you delete or clear a slot below, the homepage will seamlessly display a beautiful seeded default placeholder in that slot 
          to keep the layout completely intact, rather than collapsing subsequent slots.
        </div>
      </div>

      {/* Editor Form Overlay/Container */}
      {editingId && (
        <div className="admin-card" style={{ marginBottom: 24, border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <div className="admin-card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>
            <h3 className="admin-card-title" style={{ fontSize: 16, fontWeight: 700 }}>
              {editingId === 'new' ? `Configure ${slotMetadata[activeSlot].label}` : `Edit ${slotMetadata[activeSlot].label}`}
            </h3>
            <button className="admin-btn admin-btn-ghost admin-btn-icon admin-btn-sm" onClick={closeEditor}><X size={16} /></button>
          </div>
          <form onSubmit={handleSave} style={{ marginTop: 16 }}>
            <div className="admin-editor-grid">
              <div className="admin-field">
                <label className="admin-label">Project Title *</label>
                <input className="admin-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Fade Template" required />
              </div>
              <div className="admin-field">
                <label className="admin-label">Category</label>
                <input className="admin-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Web Design" />
              </div>
              <div className="admin-field">
                <label className="admin-label">Overlay Text</label>
                <input className="admin-input" value={form.overlay_text} onChange={e => setForm(p => ({ ...p, overlay_text: e.target.value }))} placeholder="e.g. VISUAL CONCEPT" />
              </div>
              <div className="admin-field">
                <label className="admin-label">Project Link</label>
                <input className="admin-input" value={form.project_link} onChange={e => setForm(p => ({ ...p, project_link: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="admin-field full-width">
                <ImageUpload label="Project Image * (16:9 Aspect ratio cropper enabled)" value={form.image_url} onChange={(url) => setForm(p => ({ ...p, image_url: url }))} aspect="16/9" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={closeEditor}>Cancel</button>
              <button type="submit" className="admin-btn admin-btn-primary"><Save size={15} /> Save Slot {activeSlot}</button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of 4 slots */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {[1, 2, 3, 4].map(slotNum => {
          const proj = items.find(p => p.slot_number === slotNum || p.slotNumber === slotNum);
          const meta = slotMetadata[slotNum];

          if (proj) {
            return (
              <div 
                key={slotNum} 
                className="admin-card" 
                style={{ 
                  padding: 0, 
                  overflow: 'hidden', 
                  border: '1px solid rgba(255,255,255,0.06)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 320
                }}
              >
                <div>
                  {/* Image & Slot Number Badge */}
                  <div style={{ height: 160, background: '#0a0a0a', overflow: 'hidden', position: 'relative' }}>
                    <img src={proj.image_url} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                    <div 
                      style={{ 
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        background: '#3b82f6',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '4px 8px',
                        borderRadius: 20,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        boxShadow: '0 2px 8px rgba(59,130,246,0.4)'
                      }}
                    >
                      Slot {slotNum}
                    </div>
                  </div>
                  
                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      {meta.label}
                    </div>
                    <h4 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: '#fff' }}>{proj.title}</h4>
                    <p style={{ fontSize: 12, color: '#71717a', marginBottom: 6 }}>{proj.category || 'Uncategorized'}</p>
                    <div style={{ fontSize: 11, color: '#52525b', display: 'flex', gap: 4, alignItems: 'center' }}>
                      <span>Layout:</span>
                      <span style={{ color: '#a1a1aa' }}>{meta.dimensions}</span>
                    </div>
                  </div>
                </div>

                <div 
                  style={{ 
                    padding: 16, 
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                    background: 'rgba(255,255,255,0.01)',
                    display: 'flex', 
                    gap: 8,
                    alignItems: 'center'
                  }}
                >
                  <button 
                    className="admin-btn admin-btn-ghost admin-btn-sm" 
                    onClick={() => openEdit(proj, slotNum)}
                    style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 6 }}
                  >
                    <Pencil size={13} /> Edit Slot
                  </button>
                  <button 
                    className="admin-btn admin-btn-ghost admin-btn-sm" 
                    onClick={() => setDeleteTarget(proj)} 
                    style={{ color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 10px' }}
                    title="Clear Slot"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          } else {
            return (
              <div 
                key={slotNum} 
                className="admin-card" 
                style={{ 
                  border: '1px dashed rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 320,
                  background: 'rgba(255,255,255,0.01)',
                  color: '#71717a',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                <div 
                  style={{ 
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    background: 'rgba(255,255,255,0.06)',
                    color: '#71717a',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '4px 8px',
                    borderRadius: 20,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Slot {slotNum}
                </div>

                <div 
                  style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '50%', 
                    background: 'rgba(255,255,255,0.02)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginBottom: 16,
                    border: '1px solid rgba(255,255,255,0.04)'
                  }}
                >
                  <Plus size={20} style={{ color: '#52525b' }} />
                </div>
                
                <h4 style={{ fontWeight: 700, fontSize: 14, color: '#e4e4e7', marginBottom: 4 }}>{meta.label}</h4>
                <p style={{ fontSize: 12, color: '#71717a', marginBottom: 12 }}>Currently using default placeholder</p>
                <div style={{ fontSize: 11, color: '#52525b', marginBottom: 20 }}>
                  Dimensions: {meta.dimensions}
                </div>

                <button 
                  className="admin-btn admin-btn-primary admin-btn-sm" 
                  onClick={() => openNew(slotNum)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Plus size={13} /> Assign Project
                </button>
              </div>
            );
          }
        })}
      </div>

      <ConfirmModal 
        open={!!deleteTarget} 
        title="Clear Portfolio Slot" 
        message={`Are you sure you want to clear the project from this slot? The home page will gracefully display the standard default placeholder for this layout cell.`} 
        onConfirm={handleDelete} 
        onCancel={() => setDeleteTarget(null)} 
      />
    </div>
  );
}
