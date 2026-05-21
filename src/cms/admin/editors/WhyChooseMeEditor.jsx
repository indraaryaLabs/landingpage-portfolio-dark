import React, { useState, useEffect } from 'react';
import { getWhyChooseMe, createWhyChooseMe, updateWhyChooseMe, deleteWhyChooseMe } from '../../../lib/supabaseApi';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, Trash2, Save, CheckCircle2, X as XIcon } from 'lucide-react';

export default function WhyChooseMeEditor() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function load() {
    try { setItems(await getWhyChooseMe()); }
    catch { showToast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(type) {
    try {
      const item = await createWhyChooseMe({
        type,
        title: type === 'pro' ? 'New Advantage' : 'New Disadvantage',
        description: 'Description...',
      });
      setItems(prev => [...prev, item]);
      showToast('Card added', 'success');
    } catch (err) { showToast('Failed: ' + err.message, 'error'); }
  }

  function handleUpdate(id, field, value) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));
  }

  async function handleSave(item) {
    try {
      await updateWhyChooseMe(item.id, {
        type: item.type, title: item.title, description: item.description,
      });
      showToast('Saved!', 'success');
    } catch (err) { showToast('Failed: ' + err.message, 'error'); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteWhyChooseMe(deleteTarget);
      setItems(prev => prev.filter(it => it.id !== deleteTarget));
      showToast('Card deleted', 'success');
    } catch (err) { showToast('Failed: ' + err.message, 'error'); }
    finally { setDeleteTarget(null); }
  }

  const proItems = items.filter(it => it.type === 'pro');
  const conItems = items.filter(it => it.type === 'con');

  if (loading) return <div className="admin-fade-in"><div className="admin-spinner" style={{ margin: '40px auto' }} /></div>;

  function renderCard(item) {
    return (
      <div key={item.id} className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          {item.type === 'pro'
            ? <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
            : <XIcon size={18} style={{ color: '#ef4444' }} />
          }
          <span style={{ fontSize: 11, fontWeight: 600, color: item.type === 'pro' ? '#22c55e' : '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {item.type === 'pro' ? 'Advantage' : 'Disadvantage'}
          </span>
        </div>
        <div className="admin-field" style={{ marginBottom: 10 }}>
          <label className="admin-label">Title</label>
          <input className="admin-input" value={item.title} onChange={e => handleUpdate(item.id, 'title', e.target.value)} />
        </div>
        <div className="admin-field" style={{ marginBottom: 16 }}>
          <label className="admin-label">Description</label>
          <textarea className="admin-textarea" value={item.description} onChange={e => handleUpdate(item.id, 'description', e.target.value)} rows={2} />
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleSave(item)}><Save size={14} /> Save</button>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDeleteTarget(item.id)} style={{ color: '#ef4444' }}><Trash2 size={14} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>Why Choose Me</h1>
        <p style={{ color: '#71717a', fontSize: 13 }}>Manage pro/con comparison cards</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#22c55e' }}>✓ Advantages</h3>
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleAdd('pro')}><Plus size={14} /> Add</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {proItems.length === 0 ? <p style={{ color: '#52525b', fontSize: 13 }}>No advantage cards</p> : proItems.map(renderCard)}
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ef4444' }}>✗ Disadvantages</h3>
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleAdd('con')}><Plus size={14} /> Add</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {conItems.length === 0 ? <p style={{ color: '#52525b', fontSize: 13 }}>No disadvantage cards</p> : conItems.map(renderCard)}
          </div>
        </div>
      </div>

      <ConfirmModal open={!!deleteTarget} title="Delete Card" message="This card will be permanently removed." onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
