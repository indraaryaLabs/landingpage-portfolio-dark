import React, { useEffect, useRef } from 'react';
import { Star, CircleDot } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: '1',
    name: 'Will Smith',
    role: 'Harper Education',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    rating: 5.0,
    review: 'The designs exceeded our expectations! Every element felt purposeful, creating a seamless and visually stunning brand identity',
  },
  {
    id: '2',
    name: 'Ikta Sollork',
    role: 'PARAL CEO',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
    rating: 5.0,
    review: 'Working with this process was effortless. The vision was understood perfectly, and the designs truly represent my brand',
  },
  {
    id: '3',
    name: 'Liloch',
    role: 'AIO Founder',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
    rating: 5.0,
    review: 'Exceptional creativity and attention to detail! The final product not only looks great but also enhances user engagement',
  },
  {
    id: '4',
    name: 'Diane Swag',
    role: 'Swag Studio',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    rating: 5.0,
    review: "A game-changing experience! The design process was smooth, collaborative, and resulted in a brand presence we're proud of",
  },
];

const STATS = [
  { value: '30+', label: 'Projects Completed' },
  { value: '100%', label: 'Client Satisfaction' },
  { value: '4.9', label: 'Average Rating' },
];

function StickyTestimonialCard({ testimonial, index }) {
  const cardRef = useRef(null);
  const topOffset = 100 + index * 20;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
          if (ratio < 1 && ratio > 0) {
            card.style.transform = `scale(${0.95 + ratio * 0.05})`;
            card.style.filter = `brightness(${0.6 + ratio * 0.4})`;
          } else if (ratio >= 1) {
            card.style.transform = 'scale(1)';
            card.style.filter = 'brightness(1)';
          }
        });
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 19) }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        position: 'sticky',
        top: `${topOffset}px`,
        zIndex: index + 1,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          background: '#0d0d0d',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '24px',
          padding: '28px',
        }}
        className="group hover:border-white/[0.12] transition-all duration-500"
      >
        {/* Avatar + Name */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex items-center justify-center font-bold text-white text-xl"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: '#27272a',
            }}
          >
            {testimonial.name ? testimonial.name.charAt(0).toUpperCase() : ''}
          </div>
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em', marginBottom: '2px' }}>
              {testimonial.name}
            </h4>
            <p style={{ fontSize: '13px', color: '#71717a', margin: 0 }}>{testimonial.role}</p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.04)', marginBottom: '16px' }} />

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#a1a1aa' }}>{testimonial.rating}</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} style={{ width: '14px', height: '14px', color: '#eab308', fill: '#eab308' }} />
            ))}
          </div>
        </div>

        {/* Review */}
        <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: 1.7, margin: 0 }}>{testimonial.review}</p>
      </div>
    </div>
  );
}

export default function Testimonials({ testimonials = [], settings }) {
  const items = testimonials && testimonials.length > 0 ? testimonials : TESTIMONIALS;

  const badge = settings?.testimonials_badge || 'Happy Clients';
  const title = settings?.testimonials_title;
  const subhead = settings?.testimonials_subhead || 'Successfully delivered 30+ projects with 100% client satisfaction and a 4.9 average rating.';

  const statsList = [
    {
      value: settings?.testimonials_stat_1_val || '30+',
      label: settings?.testimonials_stat_1_lbl || 'Projects Completed'
    },
    {
      value: settings?.testimonials_stat_2_val || '100%',
      label: settings?.testimonials_stat_2_lbl || 'Client Satisfaction'
    },
    {
      value: settings?.testimonials_stat_3_val || '4.9',
      label: settings?.testimonials_stat_3_lbl || 'Average Rating'
    }
  ];

  const renderTitle = () => {
    if (title) {
      if (title.toLowerCase() === 'clients love me') {
        return (
          <>
            Clients <span className="italic font-serif font-normal text-zinc-500">Love me</span>
          </>
        );
      }
      return title;
    }
    return (
      <>
        Clients <span className="italic font-serif font-normal text-zinc-500">Love me</span>
      </>
    );
  };

  return (
    <section id="testimonials" className="section-wrapper flex flex-col items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full" style={{ alignItems: 'start' }}>
        {/* Left Column: Header, Stats, CTA */}
        <div className="flex flex-col justify-start relative lg:sticky lg:top-[100px] lg:self-start mb-8 lg:mb-0">
          {/* Badge */}
          <div
            className="inline-flex w-max items-center gap-2.5 px-4 py-2 rounded-full text-[13px] font-medium text-white mb-6 tracking-wide"
            style={{
              background: 'rgba(15, 15, 15, 0.8)',
              boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.05), 0 4px 10px rgba(0,0,0,0.5)',
              border: 'none',
            }}
          >
            <CircleDot className="w-4 h-4 text-white" strokeWidth={2.5} /> {badge}
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3">
            {renderTitle()}
          </h2>
          <p className="text-zinc-500 text-sm mb-10">{subhead}</p>

          {/* Stats */}
          <div className="flex gap-3 mb-8">
            {statsList.map((stat, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: '#0d0d0d',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  padding: '20px 16px',
                  textAlign: 'center',
                }}
                className="hover:border-white/[0.12] transition-all duration-300"
              >
                <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', color: '#71717a' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.04)', marginBottom: '24px' }} />

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <button
              onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{
                padding: '10px 20px',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '14px',
                fontWeight: 600,
                color: '#ffffff',
                background: 'transparent',
                cursor: 'pointer',
              }}
              className="hover:bg-white/[0.04] transition-all duration-300"
            >
              See All Projects
            </button>
            <button
              onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{
                padding: '10px 20px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#000000',
                background: '#ffffff',
                border: 'none',
                cursor: 'pointer',
              }}
              className="hover:bg-zinc-200 transition-all duration-300"
            >
              Contact Now
            </button>
          </div>
        </div>

        {/* Right Column: Sticky Stacking Testimonial Cards */}
        <div className="flex flex-col" style={{ gap: '16px', paddingBottom: '60px' }}>
          {items.map((t, index) => (
            <StickyTestimonialCard key={t.id} testimonial={t} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
