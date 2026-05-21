import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ToastProvider } from './components/Toast';
import { getUnreadMessageCount } from '../../lib/supabaseApi';
import {
  LayoutDashboard, Settings, Briefcase, FolderKanban,
  ListOrdered, Tag, ShieldCheck, Mail, ExternalLink,
  LogOut, Menu, X, MessageSquareQuote, HelpCircle
} from 'lucide-react';
import '../admin.css';

const NAV_ITEMS = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
  { type: 'label', text: 'Content' },
  { label: 'Site Settings', to: '/admin/settings', icon: Settings },
  { label: 'Experience', to: '/admin/experience', icon: Briefcase },
  { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
  { label: 'Process Steps', to: '/admin/process', icon: ListOrdered },
  { label: 'Services', to: '/admin/services', icon: Tag },
  { label: 'Why Choose Me', to: '/admin/why-me', icon: ShieldCheck },
  { type: 'label', text: 'Reviews & FAQ' },
  { label: 'Testimonials', to: '/admin/testimonials', icon: MessageSquareQuote },
  { label: 'FAQ', to: '/admin/faq', icon: HelpCircle },
  { type: 'label', text: 'Communication' },
  { label: 'Messages', to: '/admin/messages', icon: Mail, hasBadge: true },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getUnreadMessageCount().then(setUnreadCount).catch(() => {});
  }, []);

  async function handleLogout() {
    await signOut();
    navigate('/admin/login');
  }

  return (
    <ToastProvider>
      <div className="admin-root">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div className="admin-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-brand">
            <div className="brand-dot">IA</div>
            <span>IA CMS</span>
          </div>

          <nav className="admin-sidebar-nav">
            {NAV_ITEMS.map((item, i) => {
              if (item.type === 'label') {
                return <div key={i} className="nav-label">{item.text}</div>;
              }
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="nav-icon" />
                  {item.label}
                  {item.hasBadge && unreadCount > 0 && (
                    <span className="badge">{unreadCount}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="admin-sidebar-footer">
            <button className="admin-nav-item" onClick={handleLogout}>
              <LogOut className="nav-icon" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="admin-main">
          <header className="admin-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                className="admin-btn admin-btn-ghost admin-btn-icon admin-mobile-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <span className="admin-topbar-title">Dashboard</span>
            </div>

            <div className="admin-topbar-actions">
              <span style={{ fontSize: 12, color: '#71717a' }}>{user?.email}</span>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn-ghost admin-btn-sm"
              >
                <ExternalLink size={14} /> View Site
              </a>
            </div>
          </header>

          <main className="admin-content">
            <Outlet context={{ setUnreadCount }} />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
