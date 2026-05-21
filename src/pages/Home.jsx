import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import { ChevronDown } from 'lucide-react';
import AboutExperience from '../components/AboutExperience';
import ProcessSteps from '../components/ProcessSteps';
import DesignServices from '../components/DesignServices';
import RecentProjects from '../components/RecentProjects';
import WhyChooseMe from '../components/WhyChooseMe';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import { useSiteData } from '../hooks/useSiteData';

export default function Home() {
  const { settings, experiences, projects, processSteps, services, whyChooseMe, testimonials, faqItems, loading } = useSiteData();

  // Scroll-triggered reveal animations
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.01, rootMargin: '50px 0px 50px 0px' }
    );

    // Observe all section wrappers and reveal-on-scroll elements
    const elements = document.querySelectorAll('.section-wrapper, .reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    // Bottom blur: hide when user scrolls to very bottom
    const bottomBlur = document.getElementById('bottom-blur');
    const handleScroll = () => {
      if (!bottomBlur) return;
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (docHeight - scrollBottom < 100) {
        bottomBlur.style.opacity = '0';
      } else {
        bottomBlur.style.opacity = '1';
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#050505', color: '#fff',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 36, height: 36,
            border: '3px solid rgba(255,255,255,0.08)',
            borderTopColor: '#fff', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: '#71717a', fontSize: 14 }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <Navigation settings={settings} />
      <main className="relative z-10 pt-28 md:pt-32 px-0 max-w-[100vw] mx-auto flex flex-col" style={{ gap: 0 }}>
        {/* Section Awal - Hero & Gallery (no card bg) */}
        <div className="flex flex-col gap-0 pb-16 relative z-0 px-4 md:px-8 max-w-7xl mx-auto w-full">
          <Hero settings={settings} />
          <RecentProjects projects={projects} gridOnly={true} settings={settings} />
          {/* Bouncing Scroll Down Arrow */}
          <div className="flex justify-center mt-14">
            <button
              onClick={() => {
                const nextSection = document.getElementById('about-section');
                if (nextSection) {
                  nextSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex items-center justify-center text-white hover:text-white/70 transition-all animate-bounce cursor-pointer z-20"
              aria-label="Scroll down"
            >
              <ChevronDown className="w-7 h-7" strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Full-width section cards with 3D top-edge shadow */}
        <div className="section-card relative z-10 bg-[#0c0c0c] rounded-t-[2.5rem] -mt-4 border-t border-white/[0.06]" id="about-section">
          <div className="px-4 md:px-8 max-w-7xl mx-auto py-16 md:py-24">
            <AboutExperience settings={settings} experiences={experiences} />
          </div>
        </div>
        
        <div className="section-card relative z-20 bg-[#0a0a0a] rounded-t-[2.5rem] -mt-6 border-t border-white/[0.06]">
          <ProcessSteps steps={processSteps} settings={settings} />
        </div>
        
        <div className="section-card relative z-30 bg-[#0c0c0c] rounded-t-[2.5rem] -mt-6 border-t border-white/[0.06]">
          <div className="px-4 md:px-8 max-w-7xl mx-auto py-16 md:py-24">
            <DesignServices settings={settings} />
          </div>
        </div>

        <div className="section-card relative z-40 bg-[#0a0a0a] rounded-t-[2.5rem] -mt-6 border-t border-white/[0.06]">
          <div className="px-4 md:px-8 max-w-7xl mx-auto py-16 md:py-24">
            <RecentProjects projects={projects} settings={settings} />
          </div>
        </div>
        
        <div className="section-card relative z-50 bg-[#0c0c0c] rounded-t-[2.5rem] -mt-6 border-t border-white/[0.06]">
          <div className="px-4 md:px-8 max-w-7xl mx-auto py-16 md:py-24">
            <WhyChooseMe items={whyChooseMe} settings={settings} />
          </div>
        </div>
        
        <div className="section-card relative z-[60] bg-[#0a0a0a] rounded-t-[2.5rem] -mt-6 border-t border-white/[0.06]">
          <div className="px-4 md:px-8 max-w-7xl mx-auto py-16 md:py-24">
            <Testimonials testimonials={testimonials} settings={settings} />
          </div>
        </div>
        
        <div className="section-card relative z-[70] bg-[#0c0c0c] rounded-t-[2.5rem] -mt-6 border-t border-white/[0.06]">
          <div className="px-4 md:px-8 max-w-7xl mx-auto py-16 md:py-24">
            <FAQ faqItems={faqItems} settings={settings} />
          </div>
        </div>

        <div className="section-card relative z-[80] bg-[#0a0a0a] rounded-t-[2.5rem] -mt-6 border-t border-white/[0.06]">
          <div className="px-4 md:px-8 max-w-7xl mx-auto py-16 md:py-24 pb-24">
            <Footer services={services} settings={settings} />
          </div>
        </div>
      </main>

      {/* Bottom page blur/gradient fade - hides when user scrolls to bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 h-28 pointer-events-none z-40 transition-opacity duration-500"
        id="bottom-blur"
        style={{ background: 'linear-gradient(to top, #050505 0%, #050505 10%, transparent 100%)' }}
      ></div>
    </>
  );
}
