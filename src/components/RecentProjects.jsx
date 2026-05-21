import React, { useState, useRef, useCallback } from 'react';
import { ArrowUpRight, CircleDot } from 'lucide-react';

const DEFAULT_PROJECTS = [
  {
    id: '1',
    title: 'Fade Template',
    category: 'Web Design',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'One Day We Met',
    category: 'Branding',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'AtomAI Platform',
    category: 'Product Design',
    image_url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Noir Portfolio',
    category: 'UI/UX Design',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
  },
];

function ProjectCard({ project, heightClass = "h-[300px]" }) {
  const cardRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [badgePos, setBadgePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const animRef = useRef(null);

  // Smooth follow with lerp (delay effect)
  const lerp = useCallback((start, end, factor) => {
    return start + (end - start) * factor;
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });
  };

  // Use requestAnimationFrame for smooth delayed follow
  React.useEffect(() => {
    const animate = () => {
      setBadgePos(prev => ({
        x: lerp(prev.x, cursorPos.x, 0.12),
        y: lerp(prev.y, cursorPos.y, 0.12),
      }));
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [cursorPos, lerp]);

  return (
    <div
      ref={cardRef}
      className={`relative rounded-[1.5rem] overflow-hidden group w-full ${heightClass}`}
      style={{
        cursor: 'pointer',
        background: '#0a0a0a',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06)',
        border: 'none',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image with padding/space around it — visible dark frame */}
      <div className="p-5 md:p-8 w-full h-full">
        <div className="relative rounded-2xl overflow-hidden w-full h-full">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover opacity-60 grayscale group-hover:opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Arrow button at bottom-left */}
      <div className="absolute bottom-5 left-5 z-20">
        <button
          onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <ArrowUpRight className="w-4 h-4 text-white" strokeWidth={1.5} />
        </button>
      </div>

      {/* Glassmorphism "View project" badge following cursor with delay */}
      <div
        className="absolute z-30 pointer-events-none"
        style={{
          left: badgePos.x,
          top: badgePos.y,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}
      >
        <div
          className="px-5 py-2.5 rounded-full text-[13px] font-semibold whitespace-nowrap"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transform: 'translateX(-50%)',
          }}
        >
          View project
        </div>
      </div>
    </div>
  );
}

export default function RecentProjects({ projects = [], gridOnly = false, settings }) {
  const items = [
    projects.find(p => p.slot_number === 1) || DEFAULT_PROJECTS[0],
    projects.find(p => p.slot_number === 2) || DEFAULT_PROJECTS[1],
    projects.find(p => p.slot_number === 3) || DEFAULT_PROJECTS[2],
    projects.find(p => p.slot_number === 4) || DEFAULT_PROJECTS[3],
  ];
  const badge = settings?.projects_badge || 'Recent Projects';
  const title = settings?.projects_title;
  const desc = settings?.projects_desc || 'Showcase of some of my recent sleek websites';

  const renderTitle = () => {
    if (title) {
      if (title.toLowerCase() === 'recent designs') {
        return (
          <>
            Recent <span className="italic font-serif font-normal text-zinc-500">Designs</span>
          </>
        );
      }
      return title;
    }
    return (
      <>
        Recent <span className="italic font-serif font-normal text-zinc-500">Designs</span>
      </>
    );
  };

  if (gridOnly) {
    return (
      <div className="flex flex-col md:flex-row gap-4 w-full mt-12 lg:mt-16">
        {/* Left Column */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <ProjectCard project={items[0]} heightClass="h-[300px] md:h-[480px]" />
          <ProjectCard project={items[2]} heightClass="h-[300px] md:h-[320px]" />
        </div>
        {/* Right Column */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <ProjectCard project={items[1]} heightClass="h-[300px] md:h-[280px]" />
          <ProjectCard project={items[3]} heightClass="h-[300px] md:h-[520px]" />
        </div>
      </div>
    );
  }

  return (
    <section id="projects" className="section-wrapper flex flex-col">
      {/* Header Row: Left-aligned content + Right-aligned buttons */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
        <div>
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[13px] font-medium text-white mb-6 tracking-wide"
            style={{
              background: 'rgba(15, 15, 15, 0.8)',
              boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.05), 0 4px 10px rgba(0,0,0,0.5)',
              border: 'none',
            }}
          >
            <CircleDot className="w-4 h-4 text-white" strokeWidth={2.5} /> {badge}
          </div>

          {/* Title + Arrow */}
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
              {renderTitle()}
            </h2>
            <button
              onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:bg-white/[0.04]"
              style={{
                background: 'rgba(15, 15, 15, 0.8)',
                boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.06)',
              }}
            >
              <ArrowUpRight className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
            </button>
          </div>

          <p className="text-zinc-500 text-sm">{desc}</p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:brightness-110"
            style={{
              background: 'linear-gradient(180deg, #1c1c1c 0%, #050505 100%)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05)',
              border: 'none',
            }}
          >
            See All Projects
          </button>
          <button onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all duration-300">
            Contact Now
          </button>
        </div>
      </div>

      {/* Criss-Cross Masonry Layout */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Left Column */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <ProjectCard project={items[0]} heightClass="h-[300px] md:h-[480px]" />
          <ProjectCard project={items[2]} heightClass="h-[300px] md:h-[320px]" />
        </div>
        {/* Right Column */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <ProjectCard project={items[1]} heightClass="h-[300px] md:h-[280px]" />
          <ProjectCard project={items[3]} heightClass="h-[300px] md:h-[520px]" />
        </div>
      </div>
    </section>
  );
}
