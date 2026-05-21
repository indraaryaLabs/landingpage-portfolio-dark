import React from 'react';
import { CircleDot } from 'lucide-react';

const DEFAULT_SKILLS = ['Product Design', 'UX Design', 'UI Design', 'Framer', 'Branding', 'Webflow'];

export default function AboutExperience({ settings, experiences = [] }) {
  // Use skills from CMS (comma-separated) or fall back to defaults
  const skills = settings?.skills_csv
    ? settings.skills_csv.split(',').map(s => s.trim()).filter(Boolean)
    : DEFAULT_SKILLS;

  // Profile image from CMS or fallback
  const profileImage = settings?.profile_image_url
    || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop';

  // About bio from CMS or fallback
  const aboutBio = settings?.about_bio
    || "I am Indra Arya, a dedicated Software Engineer based in Indonesia. My core expertise lies in Full-Stack Development, taking full ownership from database logic to user interfaces. Equipped with multidisciplinary IT capabilities—including AI integration, DevSecOps, and data engineering—I focus on delivering resilient, high-impact systems that drive modern tech operations.";

  // Social links from CMS or fallback
  const socialTwitter = settings?.social_twitter || '#';
  const socialInstagram = settings?.social_instagram || 'https://www.instagram.com/indraarrya/';
  const socialWebsite = settings?.social_website || 'https://indraarya.vercel.app';

  // Fallback experiences matching the user's reference screenshot perfectly
  const mockExperiences = [
    { id: '1', role: 'Freelance', company: 'GreenLeaf Co', year_label: '2021' },
    { id: '2', role: 'UX/UI Designer', company: 'UrbanFit Studio', year_label: '2022' },
    { id: '3', role: 'Product Designer', company: 'PixelCraft Studios', year_label: '2023' },
    { id: '4', role: 'Graphic Designer', company: 'VistaWorks', year_label: '2024' },
  ];

  const expList = experiences && experiences.length > 0 ? experiences : mockExperiences;

  return (
    <section id="about" className="w-full">
      {/* Top Header Section */}
      <div className="flex flex-col items-center text-center mb-16">
        <div 
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[13px] font-medium text-white mb-6 tracking-wide"
          style={{
            background: 'rgba(15, 15, 15, 0.8)',
            boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.05), 0 4px 10px rgba(0,0,0,0.5)',
            border: 'none',
          }}
        >
          <CircleDot className="w-4 h-4 text-white" strokeWidth={2.5} /> {settings?.about_badge || 'Tech Professional'}
        </div>
        
        <h2 className="text-4xl md:text-[56px] font-bold tracking-tighter mb-4 text-white leading-tight">
          {settings?.hero_name || 'Indra Arya'}, <span className="text-zinc-500 font-medium">{settings?.about_subhead || 'Your Engineer'}</span>
        </h2>
        
        <p className="text-[15px] text-zinc-500 max-w-[400px] mx-auto tracking-normal">
          {settings?.about_desc || 'A brief introduction to my technical expertise and engineering background.'}
        </p>
      </div>

      {/* Main Two Column Premium Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 max-w-5xl mx-auto">
        
        {/* Left Column: Profile Card */}
        <div 
          className="lg:col-span-5 rounded-[2rem] p-5 flex flex-col group self-start"
          style={{
            background: '#0a0a0a',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 8px 12px 30px rgba(0,0,0,0.7)',
            border: 'none',
          }}
        >
          <div>
            {/* Profile Image Wrapper for Shadow */}
            <div 
              className="rounded-2xl w-full relative"
              style={{
                boxShadow: '25px 25px 50px rgba(0,0,0,0.95)',
                paddingBottom: '100%'
              }}
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-black w-full h-full">
                <img 
                  src={profileImage} 
                  alt="Portrait" 
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
                {/* Floating Badge overlay - Centered with radar */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-xs text-white font-semibold whitespace-nowrap">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Available for work
                </div>
              </div>
            </div>

            {/* Intro Texts */}
            <div className="mt-5 px-1">
              <h3 className="text-[26px] font-bold tracking-tight text-white leading-tight">
                Hello I am {settings?.hero_name || 'Indra Arya'}
              </h3>
              <p className="text-[14px] text-white mt-2 font-medium">
                Software Engineer Based in Indonesia.
              </p>
            </div>
          </div>

          <div>
            {/* Social Icons Container */}
            <div className="flex items-center gap-5 mt-6 px-1 text-zinc-400">
              <a href={socialTwitter} target={socialTwitter !== '#' ? '_blank' : undefined} rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="X/Twitter">
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <div className="w-px h-4 bg-white/[0.15]"></div>
              <a href={socialInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-[18px] h-[18px] fill-none stroke-current stroke-[1.5]" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <div className="w-px h-4 bg-white/[0.15]"></div>
              <a href={socialWebsite} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Globe">
                <svg className="w-[18px] h-[18px] fill-none stroke-current stroke-[1.5]" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" x2="22" y1="12" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </a>
            </div>

            <div className="w-full h-px bg-white/[0.06] mt-6 mb-5 mx-1"></div>

            {/* Connect Button */}
            <div className="px-1 pb-2">
              <button 
                onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="w-max px-7 py-3.5 rounded-full text-white text-[14px] font-semibold tracking-wide transition-all duration-200 active:scale-95"
                style={{
                  background: 'linear-gradient(180deg, #1c1c1c 0%, #050505 100%)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05)',
                  border: 'none',
                }}
              >
                Connect with me
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Bio, Skills & Experiences */}
        <div 
          className="lg:col-span-7 rounded-[2rem] p-7 md:p-8 flex flex-col"
          style={{
            background: '#0a0a0a',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 8px 12px 30px rgba(0,0,0,0.7)',
            border: 'none',
          }}
        >
          
          <p className="text-[15px] md:text-base text-zinc-400 leading-[1.8] font-medium mb-8">
            {aboutBio}
          </p>

          <div className="w-full h-px bg-white/[0.06] mb-8"></div>

          {/* Skills Container */}
          <div className="flex flex-wrap gap-3 mb-6">
            {skills.map((skill) => (
              <span 
                key={skill} 
                className="px-5 py-2.5 rounded-[0.8rem] text-[14px] font-medium"
                style={{
                  background: '#0a0a0a',
                  color: '#8a8a8a',
                  border: 'none',
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Divider line above experiences */}
          <div className="w-full h-px bg-white/[0.06] mb-4"></div>

          {/* Experiences List */}
          <div className="flex flex-col gap-3 mt-auto">
            {expList.map((exp) => (
              <div 
                key={exp.id || exp.role} 
                className="flex items-center justify-between px-6 py-5 rounded-[1.2rem] group/row transition-all duration-200"
                style={{
                  background: '#0a0a0a',
                  border: 'none',
                }}
              >
                <span className="w-1/3 text-[14px] font-medium transition-colors" style={{ color: '#8a8a8a' }}>
                  {exp.role}
                </span>
                <span className="w-1/3 text-center text-[14px] font-medium transition-colors" style={{ color: '#8a8a8a' }}>
                  {exp.company}
                </span>
                <span className="w-1/3 text-right text-[14px] font-medium transition-colors" style={{ color: '#8a8a8a' }}>
                  {exp.year_label || exp.year}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

