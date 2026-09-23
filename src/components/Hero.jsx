import { ArrowUpRight, CircleDot } from 'lucide-react';

export default function Hero() {
  const name = 'Indra Arya';
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  const badge = 'Junior Software Engineer · Available immediately';
  const heading = 'I build practical software for real workflows. My freelance work on PickFrame spans Go APIs, PostgreSQL/Supabase and React; my public projects cover mobile, systems and data.';

  return (
    <>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[1000px] pointer-events-none z-[-1] overflow-hidden mask-image-b">
        <div className="absolute inset-0 bg-[#050505]"></div>
        {/* Top gradient overlay to mask video loop seam */}
        <div className="absolute top-0 left-0 right-0 h-[120px] z-[5]" style={{ background: 'linear-gradient(to bottom, #050505 0%, #050505 30%, transparent 100%)' }}></div>

        {/* Same monochrome smoke atmosphere, without the 11 MB autoplay video. */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.12] bg-cover bg-center hidden md:block" style={{ backgroundImage: 'url(/smoke-texture.png)' }} />

        {/* Shooting Stars (Dari kiri atas melintasi ke kanan bawah) */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden motion-reduce:hidden">
          <div className="shooting-star top-[5%] left-[-5%]" style={{ animationDelay: '0s' }}></div>
          <div className="shooting-star top-[25%] left-[10%]" style={{ animationDelay: '1.2s' }}></div>
          <div className="shooting-star top-[10%] left-[20%]" style={{ animationDelay: '2.4s' }}></div>
          <div className="shooting-star top-[40%] left-[5%]" style={{ animationDelay: '3.6s' }}></div>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative -mb-8 lg:-mb-16">
        <div className="flex flex-col items-start text-left">
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[13px] font-medium text-white mb-7 tracking-wide"
            style={{
              background: 'rgba(15, 15, 15, 0.8)',
              boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.05), 0 4px 10px rgba(0,0,0,0.5)',
              border: 'none',
              backdropFilter: 'blur(10px)',
            }}
          >
            <CircleDot className="w-3.5 h-3.5 text-white/80" strokeWidth={2.5} /> {badge}
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[80px] tracking-tight leading-[1] mb-5 flex items-center flex-wrap gap-x-3">
            <span className="text-white font-medium">{firstName}</span>
            <span className="text-zinc-500 font-normal">{lastName}</span>
            <button
              onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}
              aria-label="Learn about Indra"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/[0.02] active:scale-95 mt-1 md:mt-0 ml-2"
              style={{
                background: 'rgba(10, 10, 10, 0.4)',
                boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.08), 0 4px 10px rgba(0,0,0,0.5)',
                border: 'none',
              }}
            >
              <ArrowUpRight className="w-5 h-5 md:w-[22px] md:h-[22px] text-white" strokeWidth={1.5} />
            </button>
          </h1>

          <p className="text-sm md:text-base text-zinc-400 max-w-sm mb-8 leading-relaxed">
            {heading}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="px-8 py-3.5 rounded-full text-[14px] font-semibold text-white tracking-wide transition-all duration-300 active:scale-95 hover:brightness-110"
              style={{
                background: 'linear-gradient(180deg, #1c1c1c 0%, #050505 100%)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05)',
                border: 'none',
              }}
            >
              View projects
            </button>
            <button
              onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="px-8 py-3.5 rounded-full text-[14px] font-semibold text-black tracking-wide transition-all duration-300 hover:brightness-95 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(to bottom, #ffffff, #b0b0b0)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 6px 20px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)',
              }}
            >
              Get in touch
            </button>
          </div>
        </div>

        <div className="relative h-[450px] hidden lg:block perspective-1000">
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
            <path d="M50 150 Q 150 100 250 200" fill="transparent" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M150 280 Q 250 350 350 250" fill="transparent" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
          </svg>

          <div className="absolute top-[20%] left-[10%] bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] p-5 rounded-2xl shadow-2xl w-[260px] hover:border-white/[0.12] transition-all duration-300 z-20" style={{ transform: 'rotate(-8deg)' }}>
            <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-3">Freelance · 2026</p>
            <p className="text-[13px] font-normal text-white/80 leading-relaxed">PickFrame — Go/Gin REST APIs, PostgreSQL/Supabase and React for business workflows.</p>
          </div>

          <div className="absolute top-[50%] right-[5%] bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] p-5 rounded-2xl shadow-2xl w-[260px] hover:border-white/[0.12] transition-all duration-300 z-10" style={{ transform: 'rotate(6deg)' }}>
            <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-3">Public work · GitHub</p>
            <p className="text-[13px] font-normal text-white/80 leading-relaxed">A mobile job tracker, service-operations dashboard and tested Python ETL pipeline.</p>
          </div>

          <svg className="absolute top-[40%] left-[30%] w-6 h-6 text-white rotate-[-20deg]" style={{ animation: 'float 5s ease-in-out infinite 0.5s', '--r': '-20deg' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" fill="white" stroke="black" />
          </svg>

          <svg className="absolute top-[35%] right-[40%] w-5 h-5 text-zinc-400 rotate-[45deg]" style={{ animation: 'float 6.5s ease-in-out infinite 1.5s', '--r': '45deg' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" fill="transparent" stroke="currentColor" />
          </svg>
        </div>
      </section>
    </>
  );
}
