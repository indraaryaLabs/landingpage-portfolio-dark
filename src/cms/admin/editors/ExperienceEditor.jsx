import React, { useState, useEffect } from 'react';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../../../lib/supabaseApi';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';

export default function ExperienceEditor() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function load() {
    try {
      const data = await getExperiences();
      setItems(data);
    } catch (err) {
      showToast('Failed to load experiences', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    try {
      const newItem = await createExperience({
        role: 'New Role',
        company: 'Company Name',
        year_label: new Date().getFullYear().toString(),
        sort_order: items.length,
      });
      setItems(prev => [...prev, newItem]);
      showToast('Experience added', 'success');
    } catch (err) {
      showToast('Failed to add: ' + err.message, 'error');
    }
  }

  async function handleUpdate(id, field, value) {
    const updated = items.map(it => it.id === id ? { ...it, [field]: value } : it);
    setItems(updated);
  }

  async function handleSave(item) {
    try {
      await updateExperience(item.id, {
        role: item.role,
        company: item.company,
        year_label: item.year_label,
        sort_order: item.sort_order,
      });
      showToast('Saved!', 'success');
    } catch (err) {
      showToast('Failed to save: ' + err.message, 'error');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteExperience(deleteTarget);
      setItems(prev => prev.filter(it => it.id !== deleteTarget));
      showToast('Experience deleted', 'success');
    } catch (err) {
      showToast('Failed to delete: ' + err.message, 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  async function moveItem(index, direction) {
    const newItems = [...items];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= newItems.length) return;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    newItems.forEach((item, i) => { item.sort_order = i; });
    setItems(newItems);
    try {
      await Promise.all(newItems.map(it => updateExperience(it.id, { sort_order: it.sort_order })));
    } catch (err) {
      showToast('Failed to reorder', 'error');
    }
  }

  if (loading) return <div className="admin-fade-in"><div className="admin-spinner" style={{ margin: '40px auto' }} /></div>;

  return (
    <div className="admin-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>Experience</h1>
          <p style={{ color: '#71717a', fontSize: 13 }}>Manage your work history</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleAdd}>
          <Plus size={15} /> Add Experience
        </button>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty"><p>No experiences yet. Add your first one!</p></div>
      ) : (
        <div className="admin-list">
          {items.map((item, idx) => (
            <div key={item.id} className="admin-list-item">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" onClick={() => moveItem(idx, -1)} disabled={idx === 0} style={{ padding: 2 }}>↑</button>
                <button className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1} style={{ padding: 2 }}>↓</button>
              </div>
              <div className="item-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'center' }}>
                <input className="admin-input" value={item.role} onChange={e => handleUpdate(item.id, 'role', e.target.value)} placeholder="Role" />
                <input className="admin-input" value={item.company} onChange={e => handleUpdate(item.id, 'company', e.target.value)} placeholder="Company" />
                <input className="admin-input" value={item.year_label} onChange={e => handleUpdate(item.id, 'year_label', e.target.value)} placeholder="Year" style={{ width: 80 }} />
              </div>
              <div className="item-actions">
                <button className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" onClick={() => handleSave(item)}><Save size={14} /></button>
                <button className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" onClick={() => setDeleteTarget(item.id)} style={{ color: '#ef4444' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Experience"
        message="This experience entry will be permanently removed."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
