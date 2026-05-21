import React, { useState, useRef, useEffect } from 'react';
import { Plus, X as XIcon, Star, CircleDot } from 'lucide-react';

const FEATURED_REVIEW = {
  name: 'Ryan',
  role: 'Education',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
  rating: 5.0,
  review: 'Exceptional creativity and attention to detail! The final product not only looks great but also enhances user engagement',
};

const FAQ_ITEMS = [
  {
    question: 'What is your core tech stack?',
    answer: "I specialize in modern frameworks including React, Tailwind CSS, Node.js, Python, PostgreSQL, and Supabase, utilizing tools like Google Antigravity to accelerate development.",
  },
  {
    question: 'Can you handle both front-end and back-end?',
    answer: "Yes, I provide end-to-end full-stack development, ensuring seamless integration between the database infrastructure and user interface.",
  },
  {
    question: 'Do you work with AI or Cloud systems?',
    answer: "Absolutely. I integrate AI workflows into applications and configure robust cloud architectures to ensure the systems are scalable and future-proof.",
  },
];

function FAQItem({ question, answer, isOpen, onToggle, index }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, answer]);

  return (
    <div
      style={{
        background: isOpen ? '#141414' : '#0d0d0d',
        border: `1px solid ${isOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="hover:border-white/[0.08]"
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontSize: '15px',
            fontWeight: 500,
            color: isOpen ? '#ffffff' : '#d4d4d8',
            transition: 'color 0.3s ease',
            letterSpacing: '-0.01em',
          }}
        >
          {question}
        </span>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginLeft: '16px',
            transition: 'all 0.3s ease',
            background: isOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
          }}
        >
          {isOpen ? (
            <XIcon style={{ width: '14px', height: '14px', color: '#a1a1aa', strokeWidth: 2 }} />
          ) : (
            <Plus style={{ width: '16px', height: '16px', color: '#71717a', strokeWidth: 2 }} />
          )}
        </div>
      </button>

      {/* Collapsible answer */}
      <div
        style={{
          maxHeight: isOpen ? `${height}px` : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div ref={contentRef} style={{ padding: '0 24px 20px 24px' }}>
          <p
            style={{
              fontSize: '14px',
              color: '#71717a',
              lineHeight: 1.7,
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ({ faqItems = [], settings }) {
  const [openIndex, setOpenIndex] = useState(0);
  const items = faqItems && faqItems.length > 0 ? faqItems : FAQ_ITEMS;

  const badge = settings?.faq_badge || 'FAQ Section';
  const title = settings?.faq_title;
  const desc = settings?.faq_desc || 'Get quick answers to your most pressing questions';

  const renderTitle = () => {
    if (title) {
      if (title.toLowerCase() === 'questions, answers') {
        return (
          <>
            Questions, <span className="italic font-serif font-normal text-zinc-500">Answers</span>
          </>
        );
      }
      return title;
    }
    return (
      <>
        Questions, <span className="italic font-serif font-normal text-zinc-500">Answers</span>
      </>
    );
  };

  return (
    <section className="section-wrapper flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full" style={{ alignItems: 'start' }}>
        {/* Left Column: Header + Featured Review + CTA (Sticky on Desktop) */}
        <div className="flex flex-col relative lg:sticky lg:top-[100px] lg:self-start mb-8 lg:mb-0">
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
          <p className="text-zinc-500 text-sm mb-10">{desc}</p>

          {/* Featured Review Card */}
          <div
            style={{
              background: '#0d0d0d',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '24px',
              padding: '28px',
              marginBottom: '32px',
            }}
            className="hover:border-white/[0.12] transition-all duration-500"
          >
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
                {FEATURED_REVIEW.name ? FEATURED_REVIEW.name.charAt(0).toUpperCase() : ''}
              </div>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em', marginBottom: '2px' }}>
                  {FEATURED_REVIEW.name}
                </h4>
                <p style={{ fontSize: '13px', color: '#71717a', margin: 0 }}>{FEATURED_REVIEW.role}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#a1a1aa' }}>{FEATURED_REVIEW.rating}</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} style={{ width: '14px', height: '14px', color: '#eab308', fill: '#eab308' }} />
                ))}
              </div>
            </div>

            {/* Review Text */}
            <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: 1.7, margin: 0 }}>{FEATURED_REVIEW.review}</p>
          </div>

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

        {/* Right Column: FAQ Accordion Items (individual cards) */}
        <div className="flex flex-col" style={{ gap: '8px' }}>
          {items.map((item, i) => (
            <FAQItem
              key={i}
              index={i}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
