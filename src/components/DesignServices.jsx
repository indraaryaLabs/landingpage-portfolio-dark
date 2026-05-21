import React from 'react';
import { Globe, Brush, Hexagon, PenTool, ArrowUpRight, ArrowRightLeft, Video, PenLine, Image, Code2, Search, Sparkles, Share2, Layout, Zap, CircleDot } from 'lucide-react';

const SERVICES = [
  {
    icon: Globe,
    title: 'Full-Stack Engineering',
    description: 'Architecting end-to-end applications with secure back-end logic and responsive front-end frameworks.',
    hasImages: true,
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=400&auto=format&fit=crop',
    ],
  },
  {
    icon: Hexagon,
    title: 'UI/UX Architecture',
    description: "Designing intuitive, user-centric interfaces optimized for efficient and accessible front-end implementation.",
    hasImages: false,
  },
  {
    icon: Brush,
    title: 'AI & Data Engineering',
    description: 'Future-proofing operations by integrating advanced AI workflows and structuring reliable data pipelines.',
    hasImages: false,
  },
  {
    icon: PenTool,
    title: 'DevSecOps & Infrastructure',
    description: 'Implementing automated QA testing, configuring cloud environments, and ensuring proactive system security.',
    hasImages: true,
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614854262318-831574f15f1f?q=80&w=400&auto=format&fit=crop',
    ],
  },
];

const MARQUEE_ROW_1 = [
  { icon: Code2, label: 'React' },
  { icon: Layout, label: 'Node.js' },
  { icon: Globe, label: 'Python' },
  { icon: Hexagon, label: 'PostgreSQL' },
];

const MARQUEE_ROW_2 = [
  { icon: Zap, label: 'Supabase' },
  { icon: Sparkles, label: 'Tailwind CSS' },
  { icon: Search, label: 'Machine Learning' },
  { icon: Share2, label: 'Cloud Infrastructure' },
];

function MarqueeRow({ items, direction = 'left', speed = 30 }) {
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div className="flex overflow-hidden w-full mask-marquee">
      <div
        className={`flex gap-4 py-2 whitespace-nowrap ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium flex-shrink-0 hover:text-white transition-all duration-300 cursor-default"
              style={{
                background: '#0a0a0a',
                color: '#8a8a8a',
                border: 'none',
              }}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ServiceCard({ svc, isLarge, settings }) {
  const Icon = svc.icon;

  const imgFit = settings?.services_img_fit || 'cover';
  const rawHeight = settings?.services_img_height;
  const rawWidth = settings?.services_img_width;

  const formatDimension = (val, defaultVal) => {
    if (!val) return `${defaultVal}px`;
    const trimmed = String(val).trim();
    if (/^\d+$/.test(trimmed)) {
      return `${trimmed}px`;
    }
    return trimmed;
  };

  const imgHeight = formatDimension(rawHeight, '150');
  const imgWidth = formatDimension(rawWidth, '220');

  return (
    <div
      className="rounded-[1.5rem] overflow-hidden group flex flex-col"
      style={{
        background: '#0a0a0a',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06)',
        border: 'none',
      }}
    >
      {/* Text Content */}
      <div className="p-7 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
          <h3 className="text-lg font-bold tracking-tight text-white">{svc.title}</h3>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{svc.description}</p>
      </div>

      {/* Image Gallery Marquee (for tall cards) */}
      {svc.hasImages && svc.images && svc.images.length > 0 && (
        <div className="mt-auto px-1 pb-1">
          <div
            className="relative overflow-hidden rounded-xl"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            }}
          >
            <div
              className="flex gap-3 animate-marquee-left"
              style={{ animationDuration: '20s', width: 'max-content' }}
            >
              {[...svc.images, ...svc.images, ...svc.images].map((img, idx) => (
                <div 
                  key={idx} 
                  className="flex-shrink-0 rounded-lg overflow-hidden"
                  style={{
                    width: imgWidth,
                    height: imgHeight
                  }}
                >
                  <img
                    src={img}
                    alt="Project showcase"
                    className="w-full h-full opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700"
                    style={{
                      objectFit: imgFit
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Arrow button at bottom-left */}
      <div className="px-7 pb-6 mt-auto">
        <button
          onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/[0.04]"
          style={{
            background: 'rgba(10, 10, 10, 0.6)',
            boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.06)',
          }}
        >
          <ArrowUpRight className="w-4 h-4 text-white" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

export default function DesignServices({ settings }) {
  const badge = settings?.services_badge || 'Technical Capabilities';
  const title = settings?.services_title;
  const desc = settings?.services_desc || 'Deep engineering expertise supported by broad IT operational capabilities.';

  const fsImages = settings?.services_fs_images_csv
    ? settings.services_fs_images_csv.split(',').map(s => s.trim()).filter(Boolean)
    : SERVICES[0].images;

  const devopsImages = settings?.services_devops_images_csv
    ? settings.services_devops_images_csv.split(',').map(s => s.trim()).filter(Boolean)
    : SERVICES[3].images;

  const servicesData = SERVICES.map((svc, index) => {
    if (index === 0) {
      return { ...svc, images: fsImages };
    }
    if (index === 3) {
      return { ...svc, images: devopsImages };
    }
    return svc;
  });

  const renderTitle = () => {
    if (title) {
      if (title.toLowerCase() === 'core competencies') {
        return (
          <>
            Core <span className="italic font-serif font-normal text-zinc-500">Competencies</span>
          </>
        );
      }
      return title;
    }
    return (
      <>
        Core <span className="italic font-serif font-normal text-zinc-500">Competencies</span>
      </>
    );
  };

  return (
    <section id="services" className="section-wrapper flex flex-col">
      {/* Header Row: Left-aligned badge/title + Right-aligned button */}
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

          {/* Title */}
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-3">
            {renderTitle()}
          </h2>
          <p className="text-zinc-500 text-sm">{desc}</p>
        </div>

        {/* Contact Button */}
        <button onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all duration-300 flex-shrink-0">
          Contact Now
        </button>
      </div>

      {/* Masonry / Staggered 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Left Column: Tall (Website Design) + Short (Graphic Design) */}
        <div className="flex flex-col gap-4">
          <ServiceCard svc={servicesData[0]} isLarge={true} settings={settings} />
          <ServiceCard svc={servicesData[2]} isLarge={false} settings={settings} />
        </div>
        {/* Right Column: Short (Logo Design) + Tall (Framer Design) */}
        <div className="flex flex-col gap-4">
          <ServiceCard svc={servicesData[1]} isLarge={false} settings={settings} />
          <ServiceCard svc={servicesData[3]} isLarge={true} settings={settings} />
        </div>
      </div>

      {/* Marquee Tags */}
      <div className="w-full mt-10 space-y-3">
        <MarqueeRow items={MARQUEE_ROW_1} direction="left" speed={35} />
        <MarqueeRow items={MARQUEE_ROW_2} direction="right" speed={40} />
      </div>
    </section>
  );
}
