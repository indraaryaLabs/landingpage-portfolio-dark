import { useEffect, useState } from 'react';
import { ArrowUpRight, CircleDot } from 'lucide-react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import RecentProjects from '../components/RecentProjects';
import AboutExperience from '../components/AboutExperience';
import { profile, projects, skillGroups } from '../data/portfolio';
import '../index.css';

const proof = [
  { title: 'Product development', body: 'PickFrame: Go/Gin APIs, PostgreSQL/Supabase and a React interface for photography business workflows.', href: 'https://pickframe.satuarah.click', label: 'View live product' },
  { title: 'Public engineering work', body: 'Repositories cover a mobile job tracker, a service-operations dashboard and a tested data pipeline.', href: profile.github, label: 'Explore GitHub' },
];

export default function Home() {
  const [projectImages, setProjectImages] = useState({});

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) return;
    const section = document.getElementById('projects');
    if (!section) return;
    let cancelled = false;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      import('../lib/supabaseApi').then(({ getProjects }) => getProjects()).then(rows => {
        if (cancelled) return;
        const images = {};
        for (const project of projects) {
          const row = rows.find(item => Number(item.slot_number) === project.slot && item.project_link?.replace(/\/$/, '') === project.link);
          if (row?.image_url) images[project.slot] = row.image_url;
        }
        setProjectImages(images);
      }).catch(() => { /* Keep fallback artwork if CMS is unavailable. */ });
    }, { rootMargin: '400px' });
    observer.observe(section);
    return () => { cancelled = true; observer.disconnect(); };
  }, []);

  return <>
    <Navigation />
    <main id="top" className="relative z-10 pt-28 md:pt-32 max-w-[100vw] mx-auto flex flex-col">
      <div className="relative z-0 px-4 md:px-8 max-w-7xl mx-auto w-full pb-20"><Hero /></div>
      <div className="section-card relative z-10 bg-[#0a0a0a] rounded-t-[2.5rem] -mt-6 border-t border-white/[0.06]" id="projects">
        <div className="px-4 md:px-8 max-w-7xl mx-auto py-16 md:py-24"><RecentProjects projects={projects} projectImages={projectImages} /></div>
      </div>
      <div className="section-card relative z-20 bg-[#0c0c0c] rounded-t-[2.5rem] -mt-6 border-t border-white/[0.06]" id="about">
        <div className="px-4 md:px-8 max-w-7xl mx-auto py-16 md:py-24"><AboutExperience /></div>
      </div>
      <div className="section-card relative z-30 bg-[#0a0a0a] rounded-t-[2.5rem] -mt-6 border-t border-white/[0.06]" id="capabilities">
        <section className="px-4 md:px-8 max-w-7xl mx-auto py-16 md:py-24" aria-labelledby="capabilities-title">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[13px] font-medium text-white mb-6 tracking-wide bg-white/[0.04]"><CircleDot className="w-4 h-4" /> Technical focus</div>
          <h2 id="capabilities-title" className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">What I <span className="italic font-serif font-normal text-zinc-500">build with</span></h2>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mb-10 leading-relaxed">Technologies used in my freelance work and public projects—not a claim of expertise in every stack.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skillGroups.map((group, index) => <div key={group.title} className="rounded-[1.5rem] bg-[#0d0d0d] p-7 md:p-8 min-h-60 flex flex-col" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 8px 12px 30px rgba(0,0,0,0.5)' }}>
              <span className="text-xs text-zinc-400 mb-12">0{index + 1} / CAPABILITY</span><h3 className="text-xl font-semibold mb-3">{group.title}</h3><p className="text-sm text-zinc-400 leading-relaxed">{group.items}</p>
            </div>)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {proof.map(item => <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className="rounded-[1.5rem] bg-[#0d0d0d] p-7 md:p-8 group hover:bg-[#151515] transition-colors border border-white/[0.04]">
              <div className="flex items-start justify-between gap-4"><h3 className="text-lg font-semibold">{item.title}</h3><ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-white" /></div><p className="text-sm text-zinc-400 leading-relaxed mt-4 mb-6">{item.body}</p><span className="text-xs text-zinc-400">{item.label}</span>
            </a>)}
          </div>
        </section>
      </div>
      <div className="section-card relative z-40 bg-[#0c0c0c] rounded-t-[2.5rem] -mt-6 border-t border-white/[0.06]" id="contact">
        <footer className="px-4 md:px-8 max-w-7xl mx-auto py-16 md:py-24">
          <div className="rounded-[2rem] bg-[#0a0a0a] border border-white/[0.06] p-8 md:p-14 flex flex-col lg:flex-row justify-between gap-12">
            <div><div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[13px] font-medium bg-white/[0.04] mb-6"><CircleDot className="w-4 h-4" /> Let’s connect</div><h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-5">Let's build <span className="italic font-serif font-normal text-zinc-500">something useful.</span></h2><p className="text-zinc-400 max-w-xl leading-relaxed">Open to junior software engineering and related IT opportunities. Based in Kendari, available immediately and open to relocation.</p></div>
            <div className="flex flex-col justify-center gap-3 lg:min-w-72">
              <a className="rounded-full bg-white text-black px-6 py-3 font-semibold text-sm flex items-center justify-between hover:bg-zinc-200" href={`mailto:${profile.email}`}>Email me <ArrowUpRight size={17} /></a>
              <a className="rounded-full border border-white/15 px-6 py-3 font-medium text-sm flex items-center justify-between hover:bg-white/[0.04]" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={17} /></a>
              <a className="rounded-full border border-white/15 px-6 py-3 font-medium text-sm flex items-center justify-between hover:bg-white/[0.04]" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={17} /></a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs text-zinc-400 px-2 mt-12"><span>© {new Date().getFullYear()} {profile.name}</span><a href="#top" className="hover:text-white">Back to top ↑</a></div>
        </footer>
      </div>
    </main>
  </>;
}
