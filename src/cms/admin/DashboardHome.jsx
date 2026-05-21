import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  getProjects, getExperiences, getProcessSteps, getServices,
  getMessages, getUnreadMessageCount, getTestimonials, getFaqItems
} from '../../lib/supabaseApi';
import { seedAllData } from '../../lib/seedData';
import {
  FolderKanban, Briefcase, ListOrdered, Tag, Mail,
  Settings, ArrowUpRight, MessageSquareQuote, HelpCircle, Database
} from 'lucide-react';

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projects: 0, experiences: 0, processSteps: 0,
    services: 0, messages: 0, unread: 0,
    testimonials: 0, faqItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const [proj, exp, steps, svc, msgs, unread, testimonials, faq] = await Promise.all([
          getProjects(), getExperiences(), getProcessSteps(),
          getServices(), getMessages().catch(() => []),
          getUnreadMessageCount().catch(() => 0),
          getTestimonials().catch(() => []),
          getFaqItems().catch(() => []),
        ]);
        setStats({
          projects: proj.length,
          experiences: exp.length,
          processSteps: steps.length,
          services: svc.length,
          messages: msgs.length,
          unread: unread,
          testimonials: testimonials.length,
          faqItems: faq.length,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const CARDS = [
    { label: 'Projects', value: stats.projects, icon: FolderKanban, color: '#3b82f6', to: '/admin/projects' },
    { label: 'Experiences', value: stats.experiences, icon: Briefcase, color: '#8b5cf6', to: '/admin/experience' },
    { label: 'Process Steps', value: stats.processSteps, icon: ListOrdered, color: '#f59e0b', to: '/admin/process' },
    { label: 'Services', value: stats.services, icon: Tag, color: '#22c55e', to: '/admin/services' },
    { label: 'Messages', value: stats.messages, icon: Mail, color: '#ec4899', to: '/admin/messages', extra: stats.unread > 0 ? `${stats.unread} unread` : null },
    { label: 'Testimonials', value: stats.testimonials, icon: MessageSquareQuote, color: '#f97316', to: '/admin/testimonials' },
    { label: 'FAQ Items', value: stats.faqItems, icon: HelpCircle, color: '#06b6d4', to: '/admin/faq' },
  ];

  return (
    <div className="admin-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>
          Welcome back 👋
        </h1>
        <p style={{ color: '#71717a', fontSize: 14 }}>{user?.email}</p>
      </div>

      <div className="admin-stats-grid">
        {CARDS.map((card) => (
          <Link key={card.label} to={card.to} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{ background: card.color + '15' }}>
                <card.icon size={18} style={{ color: card.color }} />
              </div>
              <div className="admin-stat-value">
                {loading ? '—' : card.value}
              </div>
              <div className="admin-stat-label">
                {card.label}
                {card.extra && (
                  <span style={{ color: '#ec4899', marginLeft: 6, fontWeight: 600 }}>
                    • {card.extra}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Link to="/admin/settings" className="admin-btn admin-btn-ghost admin-btn-sm">
            <Settings size={14} /> Edit Hero
          </Link>
          <Link to="/admin/projects" className="admin-btn admin-btn-ghost admin-btn-sm">
            <FolderKanban size={14} /> Manage Projects
          </Link>
          <Link to="/admin/messages" className="admin-btn admin-btn-ghost admin-btn-sm">
            <Mail size={14} /> View Messages
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-primary admin-btn-sm">
            <ArrowUpRight size={14} /> View Live Site
          </a>
        </div>
      </div>

      {/* Seed Data Section */}
      <div className="admin-card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Database Tools</h3>
        <p style={{ color: '#71717a', fontSize: 13, marginBottom: 16 }}>Populate all CMS tables with the current website default data. This will overwrite existing data in all tables.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            style={{ color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)' }}
            disabled={seeding}
            onClick={async () => {
              if (!confirm('This will overwrite ALL existing CMS data with website defaults. Continue?')) return;
              setSeeding(true);
              setSeedResult(null);
              try {
                const result = await seedAllData();
                setSeedResult(result);
                // Reload stats
                const [proj, exp, steps, svc, msgs, unread, testimonials, faq] = await Promise.all([
                  getProjects(), getExperiences(), getProcessSteps(),
                  getServices(), getMessages().catch(() => []),
                  getUnreadMessageCount().catch(() => 0),
                  getTestimonials().catch(() => []),
                  getFaqItems().catch(() => []),
                ]);
                setStats({
                  projects: proj.length, experiences: exp.length,
                  processSteps: steps.length, services: svc.length,
                  messages: msgs.length, unread,
                  testimonials: testimonials.length, faqItems: faq.length,
                });
              } catch (e) {
                setSeedResult({ error: e.message });
              } finally {
                setSeeding(false);
              }
            }}
          >
            {seeding ? <div className="admin-spinner" /> : <Database size={14} />}
            {seeding ? 'Seeding...' : 'Seed Default Data'}
          </button>
          {seedResult && (
            <div style={{ fontSize: 12, color: Object.values(seedResult).some(v => String(v).startsWith('ERROR')) ? '#ef4444' : '#22c55e' }}>
              {Object.entries(seedResult).map(([key, val]) => (
                <div key={key}>{key}: {val}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
