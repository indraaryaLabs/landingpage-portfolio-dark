import { ArrowUpRight, CircleDot } from 'lucide-react';
import { experience, profile } from '../data/portfolio';

export default function AboutExperience() {
  return <section aria-labelledby="about-title">
    <div className="flex flex-col items-center text-center mb-16">
      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[13px] font-medium text-white mb-6 tracking-wide bg-white/[0.04]"><CircleDot className="w-4 h-4" /> About me</div>
      <h2 id="about-title" className="text-4xl md:text-[56px] font-bold tracking-tighter mb-4 text-white leading-tight">Indra Arya, <span className="text-zinc-500 font-medium">behind the work.</span></h2>
      <p className="text-[15px] text-zinc-400 max-w-[530px] mx-auto">Informatics graduate with freelance full-stack experience and public projects built to solve practical problems.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 max-w-5xl mx-auto">
      <div className="lg:col-span-5 rounded-[2rem] p-5 flex flex-col self-start bg-[#0a0a0a]" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 8px 12px 30px rgba(0,0,0,0.7)' }}>
        <div className="rounded-2xl relative overflow-hidden bg-black aspect-square">
          <img src="/indra-portrait.jpg" alt="Portrait of Indra Arya" className="w-full h-full object-cover object-top grayscale opacity-90" loading="lazy" decoding="async" width="600" height="600" />
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-xs text-white font-semibold whitespace-nowrap"><span className="w-2 h-2 rounded-full bg-white" /> Available immediately</div>
        </div>
        <div className="mt-6 px-1"><h3 className="text-[26px] font-bold tracking-tight text-white leading-tight">Hello, I’m Indra.</h3><p className="text-[14px] text-zinc-400 mt-2">Junior software engineer based in Kendari, Indonesia. Open to relocation.</p></div>
        <div className="w-full h-px bg-white/[0.06] mt-6 mb-5" />
        <div className="flex flex-wrap gap-3 px-1 pb-2 text-sm"><a href={profile.github} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-4 py-2 hover:bg-white/[0.04]">GitHub ↗</a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-4 py-2 hover:bg-white/[0.04]">LinkedIn ↗</a></div>
      </div>

      <div className="lg:col-span-7 rounded-[2rem] p-7 md:p-8 flex flex-col bg-[#0a0a0a]" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 8px 12px 30px rgba(0,0,0,0.7)' }}>
        <p className="text-[15px] md:text-base text-zinc-400 leading-[1.8] mb-7">I graduated in Informatics from UIN Sunan Kalijaga Yogyakarta (2025, GPA 3.54/4.00). At PickFrame I worked across the backend and frontend of a live photography business platform, including client galleries, orders, invoices and operator workflows. My public projects let you inspect how I approach mobile apps, system monitoring and data pipelines.</p>
        <div className="flex flex-wrap gap-2 mb-7">{['Go / Gin', 'React', 'PostgreSQL', 'Supabase', 'TypeScript', 'Python'].map(skill => <span key={skill} className="px-4 py-2 rounded-xl text-xs font-medium bg-white/[0.035] text-zinc-400">{skill}</span>)}</div>
        <div className="w-full h-px bg-white/[0.06] mb-6" />
        <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-4">Professional experience</h3>
        <div className="flex flex-col gap-3">
          {experience.map(item => <div key={item.company} className="rounded-[1.2rem] bg-white/[0.025] px-5 py-5">
            <div className="flex flex-wrap justify-between gap-2 mb-2"><h4 className="font-semibold text-sm">{item.role}</h4><span className="text-xs text-zinc-400">{item.period}</span></div>
            <p className="text-sm text-zinc-300 mb-2">{item.company} · {item.location}</p><p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
            {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-zinc-300 mt-3 hover:text-white">View product <ArrowUpRight size={13} /></a>}
          </div>)}
        </div>
        <div className="w-full h-px bg-white/[0.06] my-6" />
        <div className="flex flex-wrap justify-between gap-2 text-sm"><span className="text-zinc-400">Education</span><span>Bachelor of Informatics · UIN Sunan Kalijaga · 2021–2025</span></div>
      </div>
    </div>
  </section>;
}
