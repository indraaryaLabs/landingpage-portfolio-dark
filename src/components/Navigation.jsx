import React, { useState, useEffect } from 'react';
import { Send, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo-IA 1.1-bg-removed.png';

export default function Navigation({ settings }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const siteName = settings?.hero_name?.split(' ')[0] || 'Polo';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoStyle = {
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.35))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const navLinkStyle = {
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.72), rgba(255,255,255,0.28))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const navLinkHoverStyle = {
    background: 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0.7))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const handleNavHover = (e, isHover) => {
    const style = isHover ? navLinkHoverStyle : navLinkStyle;
    Object.assign(e.currentTarget.style, style);
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between px-8 py-2.5 rounded-full transition-all duration-300 w-full max-w-[780px] bg-white/[0.04] backdrop-blur-md border border-white/[0.08] shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-2 font-semibold text-[18px] tracking-tight cursor-pointer" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <img src={logoImg} alt="Logo" className="w-16 h-12 object-contain scale-[1.85] mr-[-12px] -ml-2 -translate-y-1 select-none" />
            <span style={logoStyle}>{settings?.nav_logo_text || 'Indra Arya'}</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-[16px] font-medium tracking-wide">
            <a
              href="#about"
              onClick={(e) => scrollToSection(e, 'about')}
              className="transition-all duration-300 cursor-pointer"
              style={navLinkStyle}
              onMouseEnter={(e) => handleNavHover(e, true)}
              onMouseLeave={(e) => handleNavHover(e, false)}
            >{settings?.nav_link_1_lbl || 'Profile'}</a>
            <a
              href="#services"
              onClick={(e) => scrollToSection(e, 'services')}
              className="transition-all duration-300 cursor-pointer"
              style={navLinkStyle}
              onMouseEnter={(e) => handleNavHover(e, true)}
              onMouseLeave={(e) => handleNavHover(e, false)}
            >{settings?.nav_link_2_lbl || 'Services'}</a>
            <a
              href="#projects"
              onClick={(e) => scrollToSection(e, 'projects')}
              className="transition-all duration-300 cursor-pointer"
              style={navLinkStyle}
              onMouseEnter={(e) => handleNavHover(e, true)}
              onMouseLeave={(e) => handleNavHover(e, false)}
            >{settings?.nav_link_3_lbl || 'Projects'}</a>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className="transition-all duration-300 cursor-pointer"
              style={navLinkStyle}
              onMouseEnter={(e) => handleNavHover(e, true)}
              onMouseLeave={(e) => handleNavHover(e, false)}
            >{settings?.nav_link_4_lbl || 'Contact'}</a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <button onClick={(e) => scrollToSection(e, 'contact')} className="group flex items-center gap-1.5 text-[14px] font-medium bg-transparent hover:bg-white/10 border border-white/15 hover:border-white/30 text-white/70 hover:text-white px-5 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              <Send className="w-4 h-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-12" /> {settings?.nav_btn_lbl || 'Collaborate'}
            </button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#050505] z-40 flex flex-col items-center justify-center gap-8 text-2xl font-medium pt-20">
          <a href="#about" onClick={(e) => scrollToSection(e, 'about')}>{settings?.nav_link_1_lbl || 'Profile'}</a>
          <a href="#services" onClick={(e) => scrollToSection(e, 'services')}>{settings?.nav_link_2_lbl || 'Services'}</a>
          <a href="#projects" onClick={(e) => scrollToSection(e, 'projects')}>{settings?.nav_link_3_lbl || 'Projects'}</a>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>{settings?.nav_link_4_lbl || 'Contact'}</a>
          <button onClick={(e) => scrollToSection(e, 'contact')} className="bg-white text-black px-8 py-4 rounded-full mt-4">{settings?.nav_btn_lbl || 'Collaborate'}</button>
        </div>
      )}
    </>
  );
}
