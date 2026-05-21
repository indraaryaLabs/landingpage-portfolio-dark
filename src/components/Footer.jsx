import React, { useState } from 'react';
import { CircleDot } from 'lucide-react';
import { sendMessage } from '../lib/supabaseApi';
import logoImg from '../assets/logo-IA 1.1-bg-removed.png';

export default function Footer({ services = [], settings }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSending(true);
    try {
      await sendMessage({
        sender_name: formData.name,
        sender_email: formData.email,
        message: formData.message,
      });
      setSent(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  }

  // Social links from CMS
  const socialTwitter = settings?.social_twitter || '#';
  const socialInstagram = settings?.social_instagram || 'https://www.instagram.com/indraarrya/';
  const socialFacebook = settings?.social_facebook || '#';
  const socialWebsite = settings?.social_website || 'https://indraarya.vercel.app';

  const svcList = services.length > 0 ? services : [
    { id: 1, title: 'Full-Stack Development', description: 'Architecting scalable web and desktop applications tailored for business impact.' },
    { id: 2, title: 'IT & System Operations', description: 'Providing reliable infrastructure, QA testing, and maintenance to elevate technical operations.' },
  ];

  return (
    <footer id="contact" className="pb-8">
      {/* CTA Section */}
      <div className="section-wrapper bg-[#0a0a0a] border border-white/[0.06] rounded-[2rem] p-8 md:p-14 flex flex-col lg:flex-row items-start justify-between gap-12 relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-white opacity-[0.015] blur-[120px] rounded-full pointer-events-none"></div>

        {/* Left: Content */}
        <div className="relative z-10 flex-1">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[13px] font-medium text-white mb-6 tracking-wide"
            style={{
              background: 'rgba(15, 15, 15, 0.8)',
              boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.05), 0 4px 10px rgba(0,0,0,0.5)',
              border: 'none',
            }}
          >
            <CircleDot className="w-4 h-4 text-white" strokeWidth={2.5} /> Let's Connect
          </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-10">
            Let's Build <span className="italic font-serif font-normal text-zinc-500">Together</span>
          </h2>

          {/* Service Pricing List */}
          <div className="flex flex-col gap-6 w-full max-w-md">
            {svcList.map((svc) => (
              <div key={svc.id}>
                <div className="flex items-baseline gap-3 mb-1">
                  <h4 className="font-bold text-lg text-white">{svc.title}</h4>
                  {svc.price && <span className="text-xs text-zinc-500 border-b border-zinc-700 pb-0.5">{svc.price_prefix} {svc.price}</span>}
                </div>
                <p className="text-sm text-zinc-500">{svc.description}</p>
                <div className="w-full h-px bg-white/[0.04] mt-5"></div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex gap-3">
            <button onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-6 py-3 rounded-full border border-white/[0.1] text-sm font-semibold text-white hover:bg-white/[0.04] transition-all duration-300">
              See All Projects
            </button>
            <button onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all duration-300">
              Get Started Now
            </button>
          </div>
        </div>

        {/* Right: Portfolio Collage / Contact Form */}
        <div className="w-full lg:w-5/12 relative z-10 flex justify-center lg:justify-end">
          <div className="w-full max-w-sm bg-[#060606] border border-white/[0.06] rounded-[1.5rem] p-7 shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
            <h4 className="font-bold text-lg mb-5 text-white">Send a Message</h4>
            {sent ? (
              <div className="text-center py-6">
                <p className="text-emerald-500 font-semibold mb-1">✓ Message sent!</p>
                <p className="text-zinc-500 text-sm">We'll get back to you soon.</p>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/[0.15] transition-colors"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/[0.15] transition-colors"
                  required
                />
                <textarea
                  placeholder="Message"
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/[0.15] transition-colors resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-16 px-4">
        {/* Top Row: Logo + Social Icons */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex flex-col items-start gap-1 mb-4 md:mb-0">
            <div className="flex items-center gap-2 text-white font-bold text-lg cursor-pointer" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <img src={logoImg} alt="Logo" className="w-10 h-8 object-contain scale-[1.5]" />
              {settings?.hero_name || 'Indra Arya'}
            </div>
            {settings?.footer_desc && (
              <p className="text-xs text-zinc-500 max-w-xs mt-1 text-left">{settings.footer_desc}</p>
            )}
          </div>
          <div className="flex items-center gap-5 text-zinc-500">
            {/* X/Twitter */}
            <a href={socialTwitter} target={socialTwitter !== '#' ? '_blank' : undefined} rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="X/Twitter">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href={socialInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href={socialFacebook} target={socialFacebook !== '#' ? '_blank' : undefined} rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            {/* Website */}
            <a href={socialWebsite} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Website">
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" x2="22" y1="12" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Nav Links Row */}
        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-zinc-500 mb-8">
          <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">{settings?.footer_link_1_lbl || 'Profile'}</a>
          <a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">{settings?.footer_link_2_lbl || 'Services'}</a>
          <a href="#projects" onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">{settings?.footer_link_3_lbl || 'Projects'}</a>
          <a href="#testimonials" onClick={(e) => { e.preventDefault(); document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">{settings?.footer_link_4_lbl || 'Reviews'}</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">{settings?.footer_link_5_lbl || 'Contact'}</a>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/[0.04] mb-6"></div>

        {/* Copyright Row */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-zinc-600">
          <p>{settings?.footer_copy || '© 2026 Indra Arya'}</p>
          <div className="flex gap-6 mt-2 md:mt-0">
            <span>Made by <span className="text-zinc-500">{settings?.hero_name || 'Indra Arya'}</span></span>
            <span>Built with <span className="text-zinc-500">React</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
