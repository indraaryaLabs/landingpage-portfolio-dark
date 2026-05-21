import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, confirmLabel = 'Delete', danger = true }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: danger ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={20} style={{ color: danger ? '#ef4444' : '#3b82f6' }} />
          </div>
          <h3 style={{ margin: 0 }}>{title || 'Are you sure?'}</h3>
        </div>
        <p>{message || 'This action cannot be undone.'}</p>
        <div className="admin-modal-actions">
          <button className="admin-btn admin-btn-ghost" onClick={onCancel}>Cancel</button>
          <button
            className={`admin-btn ${danger ? 'admin-btn-danger' : 'admin-btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
