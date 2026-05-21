import React, { useState, useEffect } from 'react';
import { getSiteSettings, upsertSiteSettings } from '../../../lib/supabaseApi';
import { useToast } from '../components/Toast';
import ImageUpload from '../components/ImageUpload';
import ImageCollectionUpload from '../components/ImageCollectionUpload';
import { Save } from 'lucide-react';

export default function SettingsEditor() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [form, setForm] = useState({
    badge_text: '',
    hero_name: '',
    hero_heading: '',
    avatar_url: '',
    contact_email: '',
    profile_image_url: '',
    about_bio: '',
    skills_csv: '',
    social_twitter: '',
    social_instagram: '',
    social_facebook: '',
    social_website: '',
    // Floating comments
    hero_comment_1_text: '',
    hero_comment_1_author: '',
    hero_comment_2_text: '',
    hero_comment_2_author: '',
    // About Copy
    about_badge: '',
    about_subhead: '',
    about_desc: '',
    // Services Copy
    services_badge: '',
    services_title: '',
    services_desc: '',
    // Projects Copy
    projects_badge: '',
    projects_title: '',
    projects_desc: '',
    // Why Me Copy
    why_badge: '',
    why_title: '',
    why_desc: '',
    // Testimonials & Stats Copy
    testimonials_badge: '',
    testimonials_title: '',
    testimonials_subhead: '',
    testimonials_stat_1_val: '',
    testimonials_stat_1_lbl: '',
    testimonials_stat_2_val: '',
    testimonials_stat_2_lbl: '',
    testimonials_stat_3_val: '',
    testimonials_stat_3_lbl: '',
    // FAQ Copy
    faq_badge: '',
    faq_title: '',
    faq_desc: '',
    // Footer Copy
    footer_copy: '',
    footer_desc: '',
    // Navigation Bar Settings
    nav_logo_text: '',
    nav_link_1_lbl: '',
    nav_link_2_lbl: '',
    nav_link_3_lbl: '',
    nav_link_4_lbl: '',
    nav_btn_lbl: '',
    // Bottom Navigation Bar Settings
    footer_link_1_lbl: '',
    footer_link_2_lbl: '',
    footer_link_3_lbl: '',
    footer_link_4_lbl: '',
    footer_link_5_lbl: '',
    // Services images and resizing settings
    services_fs_images_csv: '',
    services_devops_images_csv: '',
    services_img_fit: 'cover',
    services_img_height: '',
    services_img_width: '',
  });

  useEffect(() => {
    getSiteSettings().then((data) => {
      if (data) {
        setForm({
          badge_text: data.badge_text || '',
          hero_name: data.hero_name || '',
          hero_heading: data.hero_heading || '',
          avatar_url: data.avatar_url || '',
          contact_email: data.contact_email || '',
          profile_image_url: data.profile_image_url || '',
          about_bio: data.about_bio || '',
          skills_csv: data.skills_csv || '',
          social_twitter: data.social_twitter || '',
          social_instagram: data.social_instagram || '',
          social_facebook: data.social_facebook || '',
          social_website: data.social_website || '',
          hero_comment_1_text: data.hero_comment_1_text || '',
          hero_comment_1_author: data.hero_comment_1_author || '',
          hero_comment_2_text: data.hero_comment_2_text || '',
          hero_comment_2_author: data.hero_comment_2_author || '',
          about_badge: data.about_badge || '',
          about_subhead: data.about_subhead || '',
          about_desc: data.about_desc || '',
          services_badge: data.services_badge || '',
          services_title: data.services_title || '',
          services_desc: data.services_desc || '',
          projects_badge: data.projects_badge || '',
          projects_title: data.projects_title || '',
          projects_desc: data.projects_desc || '',
          why_badge: data.why_badge || '',
          why_title: data.why_title || '',
          why_desc: data.why_desc || '',
          testimonials_badge: data.testimonials_badge || '',
          testimonials_title: data.testimonials_title || '',
          testimonials_subhead: data.testimonials_subhead || '',
          testimonials_stat_1_val: data.testimonials_stat_1_val || '',
          testimonials_stat_1_lbl: data.testimonials_stat_1_lbl || '',
          testimonials_stat_2_val: data.testimonials_stat_2_val || '',
          testimonials_stat_2_lbl: data.testimonials_stat_2_lbl || '',
          testimonials_stat_3_val: data.testimonials_stat_3_val || '',
          testimonials_stat_3_lbl: data.testimonials_stat_3_lbl || '',
          faq_badge: data.faq_badge || '',
          faq_title: data.faq_title || '',
          faq_desc: data.faq_desc || '',
          footer_copy: data.footer_copy || '',
          footer_desc: data.footer_desc || '',
          nav_logo_text: data.nav_logo_text || '',
          nav_link_1_lbl: data.nav_link_1_lbl || '',
          nav_link_2_lbl: data.nav_link_2_lbl || '',
          nav_link_3_lbl: data.nav_link_3_lbl || '',
          nav_link_4_lbl: data.nav_link_4_lbl || '',
          nav_btn_lbl: data.nav_btn_lbl || '',
          footer_link_1_lbl: data.footer_link_1_lbl || '',
          footer_link_2_lbl: data.footer_link_2_lbl || '',
          footer_link_3_lbl: data.footer_link_3_lbl || '',
          footer_link_4_lbl: data.footer_link_4_lbl || '',
          footer_link_5_lbl: data.footer_link_5_lbl || '',
          services_fs_images_csv: data.services_fs_images_csv || '',
          services_devops_images_csv: data.services_devops_images_csv || '',
          services_img_fit: data.services_img_fit || 'cover',
          services_img_height: data.services_img_height || '',
          services_img_width: data.services_img_width || '',
        });
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await upsertSiteSettings(form);
      showToast('Settings saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  function update(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  if (loading) return <div className="admin-fade-in"><div className="admin-spinner" style={{ margin: '40px auto' }} /></div>;

  return (
    <div className="admin-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>Global Site Settings</h1>
          <p style={{ color: '#71717a', fontSize: 13 }}>Manage every piece of copy, branding, headers, and metrics globally across the website.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <div className="admin-spinner" /> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="admin-tabs" style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12, overflowX: 'auto' }}>
        {[
          { id: 'hero', label: 'General & Hero' },
          { id: 'about_services', label: 'About & Services' },
          { id: 'projects_why', label: 'Projects & Why Me' },
          { id: 'testimonials_faq', label: 'Testimonials & FAQ & Footer' },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === t.id ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              color: activeTab === t.id ? '#ffffff' : '#a1a1aa',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        {/* Tab 1: General & Hero */}
        {activeTab === 'hero' && (
          <div className="admin-fade-in">
            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Hero Profile Settings</h3>
              <div className="admin-editor-grid">
                <div className="admin-field">
                  <label className="admin-label">Badge Text</label>
                  <input className="admin-input" value={form.badge_text} onChange={e => update('badge_text', e.target.value)} placeholder="Software Engineer" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Hero Name</label>
                  <input className="admin-input" value={form.hero_name} onChange={e => update('hero_name', e.target.value)} placeholder="Indra Arya" />
                </div>
                <div className="admin-field full-width">
                  <label className="admin-label">Hero Heading / Description</label>
                  <textarea className="admin-textarea" value={form.hero_heading} onChange={e => update('hero_heading', e.target.value)} placeholder="I engineer high-performance full-stack applications..." rows={3} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Contact Email</label>
                  <input className="admin-input" type="email" value={form.contact_email} onChange={e => update('contact_email', e.target.value)} placeholder="hello@example.com" />
                </div>
                <div className="admin-field">
                  <ImageUpload label="Avatar / Hero Photo" value={form.avatar_url} onChange={(url) => update('avatar_url', url)} aspect="1/1" />
                </div>
              </div>
            </div>

            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Floating Testimonial Comments</h3>
              <div className="admin-editor-grid">
                <div className="admin-field">
                  <label className="admin-label">Comment 1 Text</label>
                  <input className="admin-input" value={form.hero_comment_1_text} onChange={e => update('hero_comment_1_text', e.target.value)} placeholder="Working with him was a game changer!" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Comment 1 Author</label>
                  <input className="admin-input" value={form.hero_comment_1_author} onChange={e => update('hero_comment_1_author', e.target.value)} placeholder="pranavnb" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Comment 2 Text</label>
                  <input className="admin-input" value={form.hero_comment_2_text} onChange={e => update('hero_comment_2_text', e.target.value)} placeholder="We Increased our conversions by 200%" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Comment 2 Author</label>
                  <input className="admin-input" value={form.hero_comment_2_author} onChange={e => update('hero_comment_2_author', e.target.value)} placeholder="vijaynb" />
                </div>
              </div>
            </div>

            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Navigation Bar Settings</h3>
              <div className="admin-editor-grid">
                <div className="admin-field">
                  <label className="admin-label">Logo / Brand Text</label>
                  <input className="admin-input" value={form.nav_logo_text} onChange={e => update('nav_logo_text', e.target.value)} placeholder="Indra Arya" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">CTA Collaborate Label</label>
                  <input className="admin-input" value={form.nav_btn_lbl} onChange={e => update('nav_btn_lbl', e.target.value)} placeholder="Collaborate" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Link 1 Label</label>
                  <input className="admin-input" value={form.nav_link_1_lbl} onChange={e => update('nav_link_1_lbl', e.target.value)} placeholder="Profile" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Link 2 Label</label>
                  <input className="admin-input" value={form.nav_link_2_lbl} onChange={e => update('nav_link_2_lbl', e.target.value)} placeholder="Services" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Link 3 Label</label>
                  <input className="admin-input" value={form.nav_link_3_lbl} onChange={e => update('nav_link_3_lbl', e.target.value)} placeholder="Projects" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Link 4 Label</label>
                  <input className="admin-input" value={form.nav_link_4_lbl} onChange={e => update('nav_link_4_lbl', e.target.value)} placeholder="Contact" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: About & Services */}
        {activeTab === 'about_services' && (
          <div className="admin-fade-in">
            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>About Section</h3>
              <div className="admin-editor-grid">
                <div className="admin-field">
                  <label className="admin-label">Badge</label>
                  <input className="admin-input" value={form.about_badge} onChange={e => update('about_badge', e.target.value)} placeholder="Tech Professional" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Subheading</label>
                  <input className="admin-input" value={form.about_subhead} onChange={e => update('about_subhead', e.target.value)} placeholder="Your Engineer" />
                </div>
                <div className="admin-field full-width">
                  <label className="admin-label">Section Intro Text</label>
                  <input className="admin-input" value={form.about_desc} onChange={e => update('about_desc', e.target.value)} placeholder="A brief introduction to my technical expertise..." />
                </div>
                <div className="admin-field">
                  <ImageUpload label="Profile Card Image" value={form.profile_image_url} onChange={(url) => update('profile_image_url', url)} />
                </div>
                <div className="admin-field full-width">
                  <label className="admin-label">About Bio</label>
                  <textarea className="admin-textarea" value={form.about_bio} onChange={e => update('about_bio', e.target.value)} placeholder="Long profile description..." rows={4} />
                </div>
                <div className="admin-field full-width">
                  <label className="admin-label">Skills (comma-separated)</label>
                  <input className="admin-input" value={form.skills_csv} onChange={e => update('skills_csv', e.target.value)} placeholder="React, Node.js, Python..." />
                </div>
              </div>
            </div>

            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Services Section Header</h3>
              <div className="admin-editor-grid">
                <div className="admin-field">
                  <label className="admin-label">Badge</label>
                  <input className="admin-input" value={form.services_badge} onChange={e => update('services_badge', e.target.value)} placeholder="Technical Capabilities" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Title</label>
                  <input className="admin-input" value={form.services_title} onChange={e => update('services_title', e.target.value)} placeholder="Core Competencies" />
                </div>
                <div className="admin-field full-width">
                  <label className="admin-label">Description</label>
                  <input className="admin-input" value={form.services_desc} onChange={e => update('services_desc', e.target.value)} placeholder="Deep engineering expertise supported by broad IT capabilities." />
                </div>
              </div>
            </div>

            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Service Card Images & Resizing</h3>
              <p style={{ color: '#a1a1aa', fontSize: 12, marginTop: -15, marginBottom: 20, lineHeight: 1.5 }}>
                Manage the horizontal scrolling image galleries inside the "Full-Stack Engineering" and "DevSecOps & Infrastructure" cards. 
                Configure dynamic sizing (height, width) and scaling to fit the image frames perfectly.
              </p>
              <div className="admin-editor-grid">
                <div className="admin-field full-width">
                  <ImageCollectionUpload
                    label="Full-Stack Engineering Images"
                    value={form.services_fs_images_csv}
                    onChange={(val) => update('services_fs_images_csv', val)}
                  />
                </div>
                <div className="admin-field full-width">
                  <ImageCollectionUpload
                    label="DevSecOps & Infrastructure Images"
                    value={form.services_devops_images_csv}
                    onChange={(val) => update('services_devops_images_csv', val)}
                  />
                </div>
              </div>
            </div>

            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Social Links</h3>
              <div className="admin-editor-grid">
                <div className="admin-field">
                  <label className="admin-label">X / Twitter URL</label>
                  <input className="admin-input" value={form.social_twitter} onChange={e => update('social_twitter', e.target.value)} placeholder="https://x.com/username" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Instagram URL</label>
                  <input className="admin-input" value={form.social_instagram} onChange={e => update('social_instagram', e.target.value)} placeholder="https://instagram.com/username" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Facebook URL</label>
                  <input className="admin-input" value={form.social_facebook} onChange={e => update('social_facebook', e.target.value)} placeholder="https://facebook.com/username" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Website URL</label>
                  <input className="admin-input" value={form.social_website} onChange={e => update('social_website', e.target.value)} placeholder="https://yoursite.com" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Projects & Why Me */}
        {activeTab === 'projects_why' && (
          <div className="admin-fade-in">
            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Projects Section Header</h3>
              <div className="admin-editor-grid">
                <div className="admin-field">
                  <label className="admin-label">Badge</label>
                  <input className="admin-input" value={form.projects_badge} onChange={e => update('projects_badge', e.target.value)} placeholder="Recent Projects" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Title</label>
                  <input className="admin-input" value={form.projects_title} onChange={e => update('projects_title', e.target.value)} placeholder="Recent Designs" />
                </div>
                <div className="admin-field full-width">
                  <label className="admin-label">Description</label>
                  <input className="admin-input" value={form.projects_desc} onChange={e => update('projects_desc', e.target.value)} placeholder="Showcase of some of my recent sleek websites" />
                </div>
              </div>
            </div>

            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Why Me Section Header</h3>
              <div className="admin-editor-grid">
                <div className="admin-field">
                  <label className="admin-label">Badge</label>
                  <input className="admin-input" value={form.why_badge} onChange={e => update('why_badge', e.target.value)} placeholder="Why choose me" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Title</label>
                  <input className="admin-input" value={form.why_title} onChange={e => update('why_title', e.target.value)} placeholder="Why Me as a Tech Partner" />
                </div>
                <div className="admin-field full-width">
                  <label className="admin-label">Description</label>
                  <input className="admin-input" value={form.why_desc} onChange={e => update('why_desc', e.target.value)} placeholder="Why Partner with Me for Engineering Excellence" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Testimonials & FAQ & Footer */}
        {activeTab === 'testimonials_faq' && (
          <div className="admin-fade-in">
            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Testimonials Section Header</h3>
              <div className="admin-editor-grid">
                <div className="admin-field">
                  <label className="admin-label">Badge</label>
                  <input className="admin-input" value={form.testimonials_badge} onChange={e => update('testimonials_badge', e.target.value)} placeholder="Happy Clients" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Title</label>
                  <input className="admin-input" value={form.testimonials_title} onChange={e => update('testimonials_title', e.target.value)} placeholder="Clients Love me" />
                </div>
                <div className="admin-field full-width">
                  <label className="admin-label">Subheading Statement</label>
                  <textarea className="admin-textarea" value={form.testimonials_subhead} onChange={e => update('testimonials_subhead', e.target.value)} placeholder="Successfully delivered 30+ projects with 100% client satisfaction..." rows={2} />
                </div>
              </div>
            </div>

            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Testimonials Metrics & Stats Cards</h3>
              <div className="admin-editor-grid">
                {/* Stat 1 */}
                <div className="admin-field">
                  <label className="admin-label">Metric 1 Value</label>
                  <input className="admin-input" value={form.testimonials_stat_1_val} onChange={e => update('testimonials_stat_1_val', e.target.value)} placeholder="30+" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Metric 1 Label</label>
                  <input className="admin-input" value={form.testimonials_stat_1_lbl} onChange={e => update('testimonials_stat_1_lbl', e.target.value)} placeholder="Projects Completed" />
                </div>
                {/* Stat 2 */}
                <div className="admin-field">
                  <label className="admin-label">Metric 2 Value</label>
                  <input className="admin-input" value={form.testimonials_stat_2_val} onChange={e => update('testimonials_stat_2_val', e.target.value)} placeholder="100%" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Metric 2 Label</label>
                  <input className="admin-input" value={form.testimonials_stat_2_lbl} onChange={e => update('testimonials_stat_2_lbl', e.target.value)} placeholder="Client Satisfaction" />
                </div>
                {/* Stat 3 */}
                <div className="admin-field">
                  <label className="admin-label">Metric 3 Value</label>
                  <input className="admin-input" value={form.testimonials_stat_3_val} onChange={e => update('testimonials_stat_3_val', e.target.value)} placeholder="4.9" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Metric 3 Label</label>
                  <input className="admin-input" value={form.testimonials_stat_3_lbl} onChange={e => update('testimonials_stat_3_lbl', e.target.value)} placeholder="Average Rating" />
                </div>
              </div>
            </div>

            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>FAQ Section Header</h3>
              <div className="admin-editor-grid">
                <div className="admin-field">
                  <label className="admin-label">Badge</label>
                  <input className="admin-input" value={form.faq_badge} onChange={e => update('faq_badge', e.target.value)} placeholder="FAQ Section" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Title</label>
                  <input className="admin-input" value={form.faq_title} onChange={e => update('faq_title', e.target.value)} placeholder="Questions, Answers" />
                </div>
                <div className="admin-field full-width">
                  <label className="admin-label">Description</label>
                  <input className="admin-input" value={form.faq_desc} onChange={e => update('faq_desc', e.target.value)} placeholder="Get quick answers to your most pressing questions" />
                </div>
              </div>
            </div>

            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Bottom Navigation Bar</h3>
              <div className="admin-editor-grid">
                <div className="admin-field">
                  <label className="admin-label">Link 1 Label</label>
                  <input className="admin-input" value={form.footer_link_1_lbl} onChange={e => update('footer_link_1_lbl', e.target.value)} placeholder="Profile" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Link 2 Label</label>
                  <input className="admin-input" value={form.footer_link_2_lbl} onChange={e => update('footer_link_2_lbl', e.target.value)} placeholder="Services" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Link 3 Label</label>
                  <input className="admin-input" value={form.footer_link_3_lbl} onChange={e => update('footer_link_3_lbl', e.target.value)} placeholder="Projects" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Link 4 Label</label>
                  <input className="admin-input" value={form.footer_link_4_lbl} onChange={e => update('footer_link_4_lbl', e.target.value)} placeholder="Reviews" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Link 5 Label</label>
                  <input className="admin-input" value={form.footer_link_5_lbl} onChange={e => update('footer_link_5_lbl', e.target.value)} placeholder="Contact" />
                </div>
              </div>
            </div>

            <div className="admin-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Footer Settings</h3>
              <div className="admin-editor-grid">
                <div className="admin-field">
                  <label className="admin-label">Copyright Text</label>
                  <input className="admin-input" value={form.footer_copy} onChange={e => update('footer_copy', e.target.value)} placeholder="© 2026 Indra Arya" />
                </div>
                <div className="admin-field full-width">
                  <label className="admin-label">Brand Description</label>
                  <textarea className="admin-textarea" value={form.footer_desc} onChange={e => update('footer_desc', e.target.value)} placeholder="High-performance software engineer..." rows={2} />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
