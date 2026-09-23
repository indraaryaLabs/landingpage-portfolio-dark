import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ToastProvider } from './components/Toast';
import { LayoutDashboard, FolderKanban, ExternalLink, LogOut, Menu, X } from 'lucide-react';
import '../admin.css';

const NAV_ITEMS = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Project Images', to: '/admin/projects', icon: FolderKanban },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
