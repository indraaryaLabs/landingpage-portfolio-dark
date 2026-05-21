import React, { useRef, useState, useEffect } from 'react';
import { Phone, Palette, Code2, Package, SmilePlus, CircleDot } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const DEFAULT_STEPS = [
  {
    id: '1',
    step_number: 1,
    title: "Context & Planning",
    description: 'Analyzing business requirements and evaluating system constraints to map out a scalable software architecture.',
    icon: 'phone',
  },
  {
    id: '2',
    step_number: 2,
    title: 'Prototyping & Design',
    description: "Drafting the technical blueprint, structuring relational database schemas, and designing high-fidelity UI logic.",
    icon: 'palette',
  },
  {
    id: '3',
    step_number: 3,
    title: 'Agile Execution',
    description: 'Writing clean, maintainable code across the stack, leveraging modern frameworks and AI-assisted workflows.',
    icon: 'code',
  },
  {
    id: '4',
    step_number: 4,
    title: 'QA & Deployment',
    description: 'Conducting rigorous quality assurance testing, deploying to secure servers, and monitoring system stability.',
    icon: 'package',
  },
];

const ICON_MAP = {
  phone: Phone,
  palette: Palette,
  code: Code2,
  package: Package,
};

function StepCard({ item, index }) {
  const IconComponent = ICON_MAP[item.icon] || Phone;
  return (
    <div
      className="relative bg-[#0a0a0a] rounded-[1.5rem] p-7 flex flex-col w-[340px] min-w-[340px] h-[300px] group flex-shrink-0"
      style={{
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 8px 12px 30px rgba(0,0,0,0.7)',
        border: 'none',
      }}
    >
      {/* Number Badge - top right */}
      <div
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-zinc-500"
        style={{
          background: 'rgba(15, 15, 15, 0.8)',
          boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.05)',
        }}
      >
        {item.step_number || index + 1}
      </div>

      {/* Icon */}
      <div className="mb-6 text-zinc-400 group-hover:text-white transition-colors duration-300">
        <IconComponent className="w-6 h-6" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold mb-3 tracking-tight text-white">{item.title}</h3>

      {/* Description */}
      <p className="text-zinc-500 text-sm leading-relaxed flex-grow">{item.description}</p>

      {/* Divider */}
      <div className="w-full h-px bg-white/[0.04] my-5"></div>

      {/* Step Label */}
      <span
        className="inline-flex w-max px-3 py-1 rounded-full text-[11px] font-medium text-zinc-500"
        style={{
          background: 'rgba(15, 15, 15, 0.8)',
          boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.04)',
        }}
      >
        Step {item.step_number || index + 1}
      </span>
    </div>
  );
}

export default function ProcessSteps({ steps = [], settings }) {
  const items = steps.length > 0 ? steps : DEFAULT_STEPS;
  const sectionRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });

  // Map vertical scroll to smooth horizontal glide into center
  const rawX = useTransform(scrollYProgress, [0, 0.5], ['100vw', '0vw']);
  const x = useSpring(rawX, {
    stiffness: 60,
    damping: 20,
    mass: 1,
    restDelta: 0.001
  });

  return (
    <section ref={sectionRef} className="relative" style={{ height: isMobile ? 'auto' : '200vh' }}>
      <div className={isMobile ? "flex flex-col items-center pt-20 pb-8 relative" : "sticky top-0 min-h-screen flex flex-col items-center pt-20 pb-8"}>
        <div className="section-wrapper flex flex-col items-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[13px] font-medium text-white mb-6 tracking-wide"
            style={{
              background: 'rgba(15, 15, 15, 0.8)',
              boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.05), 0 4px 10px rgba(0,0,0,0.5)',
              border: 'none',
            }}
          >
            <CircleDot className="w-4 h-4 text-white" strokeWidth={2.5} /> How it works
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-3 text-center">
            Systematic <span className="italic font-serif font-normal text-zinc-500">Engineering</span>
          </h2>
          <p className="text-zinc-500 text-sm mb-14 text-center">A structured development lifecycle guarantees reliable systems.</p>
        </div>

        {/* Scrolling Cards */}
        <div className="w-full px-4 md:px-8 overflow-x-clip">
          <motion.div
            className={isMobile ? "flex flex-col gap-5 w-full items-center" : "flex gap-5 w-max mx-auto"}
            style={isMobile ? {} : { x }}
          >
            {items.map((item, index) => (
              <StepCard key={item.id || index} item={item} index={index} />
            ))}
          </motion.div>
        </div>

        {/* CTA Bar */}
        <div className="px-4 md:px-8 mx-auto w-full mt-6" style={{ maxWidth: '780px' }}>
          <div
            className="w-full rounded-[1.5rem] p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-5"
            style={{
              background: '#0a0a0a',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 8px 12px 30px rgba(0,0,0,0.7)',
              border: 'none',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(15, 15, 15, 0.8)',
                  boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.05)',
                }}
              >
                <SmilePlus className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">I am with you in every step</h4>
                <p className="text-xs text-zinc-500">alongside you at each step for seamless experience</p>
              </div>
            </div>
            <div className="flex gap-3">
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
        </div>
      </div>
    </section>
  );
}
