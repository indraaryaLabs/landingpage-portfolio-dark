import React from 'react';
import { ArrowUpRight, Star, ChevronDown } from 'lucide-react';

export default function BentoGallery({ projects = [], settings }) {
  // Use projects for data
  const mainProject = projects[0] || null;
  const secondProject = projects[1] || null;

  const handleScrollDown = () => {
    // Scroll to next section (AboutExperience)
    const nextSection = document.getElementById('about-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section className="mt-12 lg:mt-16 flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          {/* Top Left - Large Card */}
          <div className="bg-[#0a0a0a] rounded-[2rem] h-[400px] lg:h-[450px] p-8 md:p-10 relative overflow-hidden group border border-white/10 flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900/40 to-transparent z-10"></div>
            {mainProject?.image_url ? (
              <img 
                src={mainProject.image_url}
                alt={mainProject.title || 'Project Main'} 
                className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
              />
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop" 
                alt="Project Main" 
                className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
              />
            )}
            
            <div className="relative z-20">
              <div className="inline-flex items-center gap-2 mb-4 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-white/80">Available for work</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.1] mb-6">
                Building brands<br/>to drive <span className="font-serif italic text-zinc-400 font-normal">Results</span>
              </h3>
              <div className="flex gap-3">
                <button onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-[#111] text-white px-5 py-3 rounded-full text-xs font-semibold border border-white/10 hover:bg-white hover:text-black transition-colors flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4" /> View Projects
                </button>
              </div>
            </div>
            
            {/* Overlay avatar top right */}
            <div className="absolute top-8 right-8 z-20 w-20 h-24 bg-zinc-800 rounded-xl border border-white/20 overflow-hidden shadow-2xl rotate-[5deg] hidden sm:block">
              {settings?.avatar_url ? (
                <img src={settings.avatar_url} className="w-full h-full object-cover grayscale opacity-80" alt="portrait" />
              ) : (
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-80" alt="portrait" />
              )}
            </div>
          </div>

          {/* Bottom Left - Small Card */}
          <div className="bg-[#111] rounded-[2rem] h-[200px] lg:h-[220px] relative overflow-hidden group border border-white/10">
             <img src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1000&auto=format&fit=crop" alt="Abstract" className="w-full h-full object-cover opacity-60 grayscale group-hover:scale-105 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none"></div>
             <button onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="absolute bottom-5 left-5 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center hover:bg-white text-white hover:text-black transition-colors z-20">
               <ArrowUpRight className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {/* Top Right - Small Card */}
          <div className="bg-zinc-200 rounded-[2rem] h-[200px] lg:h-[220px] relative overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop" alt="Design" className="w-full h-full object-cover mix-blend-multiply opacity-50 group-hover:scale-105 transition-transform duration-700" />
            <button onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="absolute bottom-5 right-5 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full border border-black/10 flex items-center justify-center hover:bg-black text-black hover:text-white transition-colors z-20">
               <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Right - Large Card */}
          <div className="bg-[#0a0a0a] rounded-[2rem] h-[400px] lg:h-[450px] p-8 md:p-10 relative overflow-hidden group border border-white/10 flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900/60 to-transparent z-10 pointer-events-none"></div>
            {secondProject?.image_url ? (
              <img src={secondProject.image_url} alt={secondProject.title || 'Project'} className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop" alt="Project Dashboard" className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:scale-105 transition-transform duration-700" />
            )}
            
            <div className="relative z-20 w-full">
               <div className="flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-md w-fit px-3 py-1.5 rounded-full border border-white/10">
                 <Star className="w-3 h-3 text-white fill-white" />
                 <span className="text-[10px] uppercase tracking-wider font-semibold text-white">AtomAI</span>
               </div>
               <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.2] mb-6">
                 Scale Business<br/>with Automation
               </h3>
               <button onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-white text-black px-5 py-3 rounded-full text-xs font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2">
                 Get Started Now
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bouncing Scroll Down Arrow */}
      <button
        onClick={handleScrollDown}
        className="mt-14 flex items-center justify-center text-white hover:text-white/70 transition-all animate-bounce cursor-pointer z-20"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-7 h-7" strokeWidth={3} />
      </button>
    </section>
  );
}

