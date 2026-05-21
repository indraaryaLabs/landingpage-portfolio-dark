import React, { useState, useEffect } from 'react';
import { getProcessSteps, createProcessStep, updateProcessStep, deleteProcessStep } from '../../../lib/supabaseApi';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, Trash2, Save } from 'lucide-react';

export default function ProcessEditor() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function load() {
    try { setItems(await getProcessSteps()); }
    catch { showToast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    try {
      const step = await createProcessStep({
        step_number: String(items.length + 1).padStart(2, '0'),
        title: 'New Step',
        description: 'Describe this step...',
        sort_order: items.length,
      });
      setItems(prev => [...prev, step]);
      showToast('Step added', 'success');
    } catch (err) { showToast('Failed: ' + err.message, 'error'); }
  }

  function handleUpdate(id, field, value) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));
  }

  async function handleSave(item) {
    try {
      await updateProcessStep(item.id, {
        step_number: item.step_number, title: item.title,
        description: item.description, sort_order: item.sort_order,
      });
      showToast('Saved!', 'success');
    } catch (err) { showToast('Failed: ' + err.message, 'error'); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteProcessStep(deleteTarget);
      setItems(prev => prev.filter(it => it.id !== deleteTarget));
      showToast('Step deleted', 'success');
    } catch (err) { showToast('Failed: ' + err.message, 'error'); }
    finally { setDeleteTarget(null); }
  }

  async function moveItem(index, direction) {
    const newItems = [...items];
    const swapIdx = index + direction;
    if (swapIdx < 0 || swapIdx >= newItems.length) return;
    [newItems[index], newItems[swapIdx]] = [newItems[swapIdx], newItems[index]];
    newItems.forEach((it, i) => { it.sort_order = i; });
    setItems(newItems);
    try { await Promise.all(newItems.map(it => updateProcessStep(it.id, { sort_order: it.sort_order }))); }
    catch { showToast('Failed to reorder', 'error'); }
  }

  if (loading) return <div className="admin-fade-in"><div className="admin-spinner" style={{ margin: '40px auto' }} /></div>;

  return (
    <div className="admin-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>Process Steps</h1>
          <p style={{ color: '#71717a', fontSize: 13 }}>Define your workflow process</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleAdd}><Plus size={15} /> Add Step</button>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty"><p>No steps yet.</p></div>
      ) : (
        <div className="admin-list">
          {items.map((item, idx) => (
            <div key={item.id} className="admin-card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4 }}>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" onClick={() => moveItem(idx, -1)} disabled={idx === 0} style={{ padding: 2 }}>↑</button>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1} style={{ padding: 2 }}>↓</button>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 10 }}>
                    <div className="admin-field">
                      <label className="admin-label">Step #</label>
                      <input className="admin-input" value={item.step_number} onChange={e => handleUpdate(item.id, 'step_number', e.target.value)} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Title</label>
                      <input className="admin-input" value={item.title} onChange={e => handleUpdate(item.id, 'title', e.target.value)} />
                    </div>
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Description</label>
                    <textarea className="admin-textarea" value={item.description} onChange={e => handleUpdate(item.id, 'description', e.target.value)} rows={2} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, paddingTop: 20 }}>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" onClick={() => handleSave(item)}><Save size={14} /></button>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" onClick={() => setDeleteTarget(item.id)} style={{ color: '#ef4444' }}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal open={!!deleteTarget} title="Delete Step" message="This step will be permanently removed." onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
