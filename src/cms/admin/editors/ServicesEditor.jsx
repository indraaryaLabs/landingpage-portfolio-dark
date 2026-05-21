import React, { useState, useEffect } from 'react';
import { getServices, createService, updateService, deleteService } from '../../../lib/supabaseApi';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, Trash2, Save } from 'lucide-react';

export default function ServicesEditor() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function load() {
    try { setItems(await getServices()); }
    catch { showToast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    try {
      const svc = await createService({
        title: 'New Service', price_prefix: 'Starting from',
        price: '$999', description: 'Service description...',
      });
      setItems(prev => [...prev, svc]);
      showToast('Service added', 'success');
    } catch (err) { showToast('Failed: ' + err.message, 'error'); }
  }

  function handleUpdate(id, field, value) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));
  }

  async function handleSave(item) {
    try {
      await updateService(item.id, {
        title: item.title, price_prefix: item.price_prefix,
        price: item.price, description: item.description,
      });
      showToast('Saved!', 'success');
    } catch (err) { showToast('Failed: ' + err.message, 'error'); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteService(deleteTarget);
      setItems(prev => prev.filter(it => it.id !== deleteTarget));
      showToast('Service deleted', 'success');
    } catch (err) { showToast('Failed: ' + err.message, 'error'); }
    finally { setDeleteTarget(null); }
  }

  if (loading) return <div className="admin-fade-in"><div className="admin-spinner" style={{ margin: '40px auto' }} /></div>;

  return (
    <div className="admin-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>Services & Pricing</h1>
          <p style={{ color: '#71717a', fontSize: 13 }}>Manage your service offerings</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleAdd}><Plus size={15} /> Add Service</button>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty"><p>No services yet.</p></div>
      ) : (
        <div className="admin-list">
          {items.map(item => (
            <div key={item.id} className="admin-card">
              <div className="admin-editor-grid">
                <div className="admin-field">
                  <label className="admin-label">Service Title</label>
                  <input className="admin-input" value={item.title} onChange={e => handleUpdate(item.id, 'title', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="admin-field">
                    <label className="admin-label">Price Prefix</label>
                    <input className="admin-input" value={item.price_prefix || ''} onChange={e => handleUpdate(item.id, 'price_prefix', e.target.value)} placeholder="Starting from" />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Price</label>
                    <input className="admin-input" value={item.price || ''} onChange={e => handleUpdate(item.id, 'price', e.target.value)} placeholder="$1,999" />
                  </div>
                </div>
                <div className="admin-field full-width">
                  <label className="admin-label">Description</label>
                  <textarea className="admin-textarea" value={item.description || ''} onChange={e => handleUpdate(item.id, 'description', e.target.value)} rows={2} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
                <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleSave(item)}><Save size={14} /> Save</button>
                <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDeleteTarget(item.id)} style={{ color: '#ef4444' }}><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal open={!!deleteTarget} title="Delete Service" message="This service will be permanently removed." onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
