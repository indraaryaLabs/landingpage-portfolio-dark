import { ArrowUpRight, CircleDot } from 'lucide-react';

function ProjectCard({ project, imageUrl, className }) {
  return <article className={`rounded-[1.5rem] overflow-hidden bg-[#080808] group border border-white/[0.04] ${className}`} style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06)' }}>
    <a href={project.link} target="_blank" rel="noopener noreferrer" className="block h-full">
      <div className="p-5 md:p-7 h-full">
        <div className="relative rounded-2xl overflow-hidden h-full min-h-72 bg-[#121212] border border-white/[0.04]">
          {imageUrl ? <img src={imageUrl} alt={`${project.name} project screenshot`} className="w-full h-full object-cover grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" loading="lazy" decoding="async" /> :
            <div className="w-full h-full min-h-72 flex flex-col justify-between p-7 md:p-9 bg-[radial-gradient(circle_at_75%_25%,#292929_0%,#111111_45%,#090909_100%)]">
              <span className="text-[11px] text-zinc-500 tracking-[0.25em] uppercase">{project.category}</span>
              <div><span className="text-6xl text-white/[0.06] font-semibold tracking-tighter leading-none">{project.number}</span><h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mt-1">{project.name}</h3></div>
              <span className="text-xs text-zinc-500">{project.stack.join(' · ')}</span>
            </div>}
          <span className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors"><ArrowUpRight size={17} /></span>
        </div>
      </div>
    </a>
  </article>;
}

export default function RecentProjects({ projects, projectImages }) {
  return <section aria-labelledby="projects-title" className="section-wrapper revealed">
    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
      <div>
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[13px] font-medium text-white mb-6 tracking-wide bg-white/[0.04]"><CircleDot className="w-4 h-4" /> Selected projects</div>
        <h2 id="projects-title" className="text-4xl md:text-6xl font-bold tracking-tighter mb-3">Work you can <span className="italic font-serif font-normal text-zinc-500">inspect.</span></h2>
        <p className="text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed">Three public repositories showing mobile product flows, service visibility and data processing. Each links to its source for a closer look.</p>
      </div>
      <a href="https://github.com/indraaryaLabs" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all flex items-center gap-2 shrink-0">All repositories <ArrowUpRight size={16} /></a>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-4"><ProjectCard project={projects[0]} imageUrl={projectImages[projects[0].slot]} className="h-[390px] md:h-[480px]" /><ProjectCard project={projects[2]} imageUrl={projectImages[projects[2].slot]} className="h-[390px] md:h-[390px]" /></div>
      <div className="flex flex-col gap-4"><ProjectCard project={projects[1]} imageUrl={projectImages[projects[1].slot]} className="h-[390px] md:h-[390px]" />
        <a href="https://pickframe.satuarah.click" target="_blank" rel="noopener noreferrer" className="rounded-[1.5rem] bg-[#101010] border border-white/[0.04] p-8 md:p-10 h-[280px] md:h-[480px] flex flex-col justify-between group hover:bg-[#161616] transition-colors" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06)' }}>
          <span className="text-xs text-zinc-400 tracking-[0.2em] uppercase">Freelance product · Mar–Apr 2026</span>
          <div><h3 className="text-3xl md:text-5xl font-semibold tracking-tight">PickFrame</h3><p className="text-zinc-400 max-w-md mt-4 text-sm leading-relaxed">A live photography business platform spanning galleries, orders, packages, invoices and an operator dashboard.</p></div>
          <span className="text-sm text-zinc-400 group-hover:text-white flex items-center gap-2">View live product <ArrowUpRight size={17} /></span>
        </a>
      </div>
    </div>
  </section>;
}
