import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { ToastProvider } from './components/Toast';
import '../admin.css';

const NAV_ITEMS = [
  { label: 'Overview', section: 'overview', number: '00' },
  { label: 'Header & hero', section: 'hero', number: '01' },
  { label: 'Featured work', section: 'work', number: '02' },
  { label: 'About & experience', section: 'about', number: '03' },
  { label: 'Footer & contact', section: 'footer', number: '04' },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeSection = location.hash.slice(1) || 'overview';

  async function handleLogout() {
    await signOut();
    navigate('/admin/login');
  }

  return <ToastProvider><div className="admin-root">
    {sidebarOpen && <button type="button" className="admin-sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Close section menu" />}
    <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Portfolio editor sections">
      <Link className="admin-sidebar-brand" to="/admin" onClick={() => setSidebarOpen(false)}><span className="brand-dot"><img src="/favicon-cropped.png" alt="" aria-hidden="true" /></span><span>INDRA ARYA<small>PORTFOLIO STUDIO</small></span></Link>
      <div className="admin-sidebar-caption">EDIT THE LANDING PAGE</div>
      <nav className="admin-sidebar-nav" aria-label="Editor navigation">
        {NAV_ITEMS.map((item) => <Link key={item.section} to={item.section === 'overview' ? '/admin' : `/admin#${item.section}`} className={`admin-nav-item ${activeSection === item.section ? 'active' : ''}`} aria-current={activeSection === item.section ? 'page' : undefined} onClick={() => setSidebarOpen(false)}><span className="admin-nav-number">{item.number}</span><span>{item.label}</span><span className="admin-nav-arrow">↗</span></Link>)}
      </nav>
      <div className="admin-sidebar-footer"><span>Signed in as</span><strong>{user?.email}</strong><button type="button" className="admin-logout" onClick={handleLogout}><LogOut size={15} /> Sign out</button></div>
    </aside>
    <div className="admin-main">
      <header className="admin-topbar"><div className="admin-topbar-start"><button type="button" className="admin-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? 'Close section menu' : 'Open section menu'}>{sidebarOpen ? <X size={20} /> : <Menu size={20} />}</button><span className="admin-topbar-title">CONTENT STUDIO <span>/</span> {NAV_ITEMS.find((item) => item.section === activeSection)?.label || 'Overview'}</span></div><a className="admin-preview-link" href="/" target="_blank" rel="noopener noreferrer">View site <ArrowUpRight size={16} /></a></header>
      <main className="admin-content"><Outlet /></main>
    </div>
  </div></ToastProvider>;
}
