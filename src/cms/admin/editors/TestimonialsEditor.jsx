import React, { useState, useEffect } from 'react';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../../lib/supabaseApi';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import ImageUpload from '../components/ImageUpload';
import { Plus, Trash2, Save, Star, X, Pencil } from 'lucide-react';

export default function TestimonialsEditor() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', avatar_url: '', rating: '5.0', review: '', sort_order: 0 });

  async function load() {
    try { setItems(await getTestimonials()); }
    catch (err) { showToast('Failed to load testimonials', 'error'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditingId('new');
    setForm({ name: '', role: '', avatar_url: '', rating: '5.0', review: '', sort_order: items.length });
  }

  function openEdit(item) {
    setEditingId(item.id);
    setForm({
      name: item.name || '', role: item.role || '',
      avatar_url: item.avatar_url || '', rating: String(item.rating || '5.0'),
      review: item.review || '', sort_order: item.sort_order || 0,
    });
  }

  function closeEditor() { setEditingId(null); }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name || !form.review) {
      showToast('Name and review are required', 'error');
      return;
    }
    try {
      const payload = { ...form, rating: parseFloat(form.rating) || 5.0 };
      if (editingId === 'new') {
        const created = await createTestimonial(payload);
        setItems(prev => [...prev, created]);
        showToast('Testimonial created!', 'success');
      } else {
        const updated = await updateTestimonial(editingId, payload);
        setItems(prev => prev.map(it => it.id === editingId ? updated : it));
        showToast('Testimonial updated!', 'success');
      }
      closeEditor();
    } catch (err) {
      showToast('Failed: ' + err.message, 'error');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteTestimonial(deleteTarget);
      setItems(prev => prev.filter(it => it.id !== deleteTarget));
      showToast('Testimonial deleted', 'success');
    } catch (err) {
      showToast('Failed: ' + err.message, 'error');
    } finally { setDeleteTarget(null); }
  }

  async function moveItem(index, direction) {
    const newItems = [...items];
    const swapIdx = index + direction;
    if (swapIdx < 0 || swapIdx >= newItems.length) return;
    [newItems[index], newItems[swapIdx]] = [newItems[swapIdx], newItems[index]];
    newItems.forEach((it, i) => { it.sort_order = i; });
    setItems(newItems);
    try {
      await Promise.all(newItems.map(it => updateTestimonial(it.id, { sort_order: it.sort_order })));
    } catch { showToast('Failed to reorder', 'error'); }
  }

  if (loading) return <div className="admin-fade-in"><div className="admin-spinner" style={{ margin: '40px auto' }} /></div>;

  return (
    <div className="admin-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>Testimonials</h1>
          <p style={{ color: '#71717a', fontSize: 13 }}>Manage client reviews and ratings</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openNew}><Plus size={15} /> Add Testimonial</button>
      </div>

      {/* Editor Form */}
      {editingId && (
        <div className="admin-card" style={{ marginBottom: 20 }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">{editingId === 'new' ? 'New Testimonial' : 'Edit Testimonial'}</h3>
            <button className="admin-btn admin-btn-ghost admin-btn-icon admin-btn-sm" onClick={closeEditor}><X size={16} /></button>
          </div>
          <form onSubmit={handleSave}>
            <div className="admin-editor-grid">
              <div className="admin-field">
                <label className="admin-label">Name *</label>
                <input className="admin-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="admin-field">
                <label className="admin-label">Role / Company</label>
                <input className="admin-input" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="CEO at Acme" />
              </div>
              <div className="admin-field">
                <label className="admin-label">Rating (1-5)</label>
                <input className="admin-input" type="number" min="1" max="5" step="0.1" value={form.rating} onChange={e => setForm(p => ({ ...p, rating: e.target.value }))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Sort Order</label>
                <input className="admin-input" type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="admin-field full-width">
                <label className="admin-label">Review Text *</label>
                <textarea className="admin-textarea" value={form.review} onChange={e => setForm(p => ({ ...p, review: e.target.value }))} rows={3} required />
              </div>
              <div className="admin-field full-width">
                <ImageUpload label="Avatar (optional)" value={form.avatar_url} onChange={(url) => setForm(p => ({ ...p, avatar_url: url }))} aspect="1/1" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={closeEditor}>Cancel</button>
              <button type="submit" className="admin-btn admin-btn-primary"><Save size={15} /> Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials List */}
      {items.length === 0 ? (
        <div className="admin-empty"><p>No testimonials yet. Add your first one!</p></div>
      ) : (
        <div className="admin-list">
          {items.map((item, idx) => (
            <div key={item.id} className="admin-card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4 }}>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" onClick={() => moveItem(idx, -1)} disabled={idx === 0} style={{ padding: 2 }}>↑</button>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1} style={{ padding: 2 }}>↓</button>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    {item.avatar_url ? (
                      <img src={item.avatar_url} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>
                        {item.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: '#71717a' }}>{item.role || 'No role'}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={12} style={{ color: '#eab308', fill: '#eab308' }} />
                      <span style={{ fontSize: 12, color: '#a1a1aa' }}>{item.rating}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.6, margin: 0 }}>{item.review}</p>
                </div>
                <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" onClick={() => openEdit(item)}><Pencil size={14} /></button>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" onClick={() => setDeleteTarget(item.id)} style={{ color: '#ef4444' }}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal open={!!deleteTarget} title="Delete Testimonial" message="This testimonial will be permanently removed." onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
