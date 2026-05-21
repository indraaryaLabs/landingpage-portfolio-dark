import React, { useState, useEffect } from 'react';
import { getFaqItems, createFaqItem, updateFaqItem, deleteFaqItem } from '../../../lib/supabaseApi';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, Trash2, Save } from 'lucide-react';

export default function FAQEditor() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function load() {
    try { setItems(await getFaqItems()); }
    catch { showToast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    try {
      const item = await createFaqItem({
        question: 'New Question?',
        answer: 'Answer goes here...',
        sort_order: items.length,
      });
      setItems(prev => [...prev, item]);
      showToast('FAQ item added', 'success');
    } catch (err) { showToast('Failed: ' + err.message, 'error'); }
  }

  function handleUpdate(id, field, value) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));
  }

  async function handleSave(item) {
    try {
      await updateFaqItem(item.id, {
        question: item.question,
        answer: item.answer,
        sort_order: item.sort_order,
      });
      showToast('Saved!', 'success');
    } catch (err) { showToast('Failed: ' + err.message, 'error'); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteFaqItem(deleteTarget);
      setItems(prev => prev.filter(it => it.id !== deleteTarget));
      showToast('FAQ item deleted', 'success');
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
    try {
      await Promise.all(newItems.map(it => updateFaqItem(it.id, { sort_order: it.sort_order })));
    } catch { showToast('Failed to reorder', 'error'); }
  }

  if (loading) return <div className="admin-fade-in"><div className="admin-spinner" style={{ margin: '40px auto' }} /></div>;

  return (
    <div className="admin-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>FAQ</h1>
          <p style={{ color: '#71717a', fontSize: 13 }}>Manage frequently asked questions</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleAdd}><Plus size={15} /> Add Question</button>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty"><p>No FAQ items yet. Add your first question!</p></div>
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
                  <div className="admin-field">
                    <label className="admin-label">Question</label>
                    <input className="admin-input" value={item.question} onChange={e => handleUpdate(item.id, 'question', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Answer</label>
                    <textarea className="admin-textarea" value={item.answer} onChange={e => handleUpdate(item.id, 'answer', e.target.value)} rows={3} />
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

      <ConfirmModal open={!!deleteTarget} title="Delete FAQ Item" message="This FAQ item will be permanently removed." onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
