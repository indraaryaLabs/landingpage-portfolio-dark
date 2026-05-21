import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getMessages, markMessageRead, deleteMessage } from '../../../lib/supabaseApi';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import { Trash2, Mail, MailOpen, Clock } from 'lucide-react';

export default function MessagesInbox() {
  const { showToast } = useToast();
  const { setUnreadCount } = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function load() {
    try { setMessages(await getMessages()); }
    catch { showToast('Failed to load messages', 'error'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const selected = messages.find(m => m.id === selectedId);

  async function handleSelect(msg) {
    setSelectedId(msg.id);
    if (!msg.status_read) {
      try {
        await markMessageRead(msg.id);
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status_read: true } : m));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) { console.error(err); }
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMessage(deleteTarget);
      setMessages(prev => prev.filter(m => m.id !== deleteTarget));
      if (selectedId === deleteTarget) setSelectedId(null);
      showToast('Message deleted', 'success');
    } catch (err) { showToast('Failed: ' + err.message, 'error'); }
    finally { setDeleteTarget(null); }
  }

  function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  if (loading) return <div className="admin-fade-in"><div className="admin-spinner" style={{ margin: '40px auto' }} /></div>;

  return (
    <div className="admin-fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>Messages</h1>
        <p style={{ color: '#71717a', fontSize: 13 }}>Contact form submissions from visitors</p>
      </div>

      {messages.length === 0 ? (
        <div className="admin-empty">
          <Mail size={40} className="empty-icon" />
          <p>No messages yet. They'll appear here when visitors use your contact form.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16, minHeight: 400 }}>
          {/* Message list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto', maxHeight: '70vh' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`admin-list-item message-item ${!msg.status_read ? 'unread' : ''}`}
                style={{
                  cursor: 'pointer', padding: '12px 16px', flexDirection: 'column', alignItems: 'stretch', gap: 4,
                  background: selectedId === msg.id ? 'rgba(59,130,246,0.08)' : undefined,
                  borderColor: selectedId === msg.id ? 'rgba(59,130,246,0.3)' : undefined,
                }}
                onClick={() => handleSelect(msg)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="message-sender" style={{ fontSize: 13, fontWeight: msg.status_read ? 500 : 700 }}>
                    {msg.status_read ? <MailOpen size={13} style={{ marginRight: 6, opacity: 0.4 }} /> : <Mail size={13} style={{ marginRight: 6, color: '#3b82f6' }} />}
                    {msg.sender_name}
                  </span>
                  <span style={{ fontSize: 10, color: '#52525b' }}>{formatDate(msg.created_at)}</span>
                </div>
                <p style={{ fontSize: 12, color: '#71717a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                  {msg.message}
                </p>
              </div>
            ))}
          </div>

          {/* Message detail */}
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
            {selected ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{selected.sender_name}</h3>
                    <p style={{ fontSize: 13, color: '#71717a' }}>{selected.sender_email}</p>
                  </div>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" onClick={() => setDeleteTarget(selected.id)} style={{ color: '#ef4444' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, fontSize: 11, color: '#52525b' }}>
                  <Clock size={12} /> {formatDate(selected.created_at)}
                </div>
                <div style={{ flex: 1, fontSize: 14, lineHeight: 1.7, color: '#d4d4d8', whiteSpace: 'pre-wrap' }}>
                  {selected.message}
                </div>
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <a href={`mailto:${selected.sender_email}`} className="admin-btn admin-btn-primary admin-btn-sm">
                    Reply via Email
                  </a>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525b', fontSize: 13 }}>
                Select a message to read
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmModal open={!!deleteTarget} title="Delete Message" message="This message will be permanently deleted." onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
