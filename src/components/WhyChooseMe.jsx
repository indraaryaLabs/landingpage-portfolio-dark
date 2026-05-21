import React, { useEffect, useRef } from 'react';
import { Check, X, CircleDot } from 'lucide-react';

const COMPARISONS = [
  {
    pro: { title: 'Holistic Problem Solving', description: 'My cross-domain knowledge allows me to anticipate deployment issues and optimize code for scalable environments.' },
    con: { title: 'Code-Only Approach', description: 'Writing code without understanding infrastructure or data architecture often leads to critical integration failures.' },
  },
  {
    pro: { title: 'Seamless Team Integration', description: 'I communicate effectively with UI designers, back-end engineers, QA testers, and System Administrators.' },
    con: { title: 'Detached Communication', description: 'Lack of collaboration and technical empathy results in misaligned outcomes and delayed deliveries.' },
  },
  {
    pro: { title: 'End-to-End Accountability', description: 'From the first line of code to the final QA audit, I ensure every layer meets rigorous enterprise standards.' },
    con: { title: 'Unreliable Deployments', description: 'Inconsistent workflows and untested server deployments compromise the quality and security of the system.' },
  },
];

function StickyCard({ row, index, total }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When card is not fully in view (being covered), scale down
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

  const topOffset = 100 + index * 20; // Incremental sticky top offset

  return (
    <div
      ref={cardRef}
      className="why-sticky-card"
      style={{
        position: 'sticky',
        top: `${topOffset}px`,
        zIndex: index + 1,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{
          background: '#0d0d0d',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '24px',
          overflow: 'hidden',
        }}
      >
        {/* Pro Card */}
        <div style={{ padding: '40px 36px', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
            }}
          >
            <Check style={{ width: '16px', height: '16px', color: '#10b981', strokeWidth: 2.5 }} />
          </div>
          <h3
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '10px',
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
            }}
          >
            {row.pro.title}
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: '#71717a',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {row.pro.description}
          </p>
        </div>

        {/* Con Card */}
        <div style={{ padding: '40px 36px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(113, 113, 122, 0.15)',
              border: '1px solid rgba(113, 113, 122, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
            }}
          >
            <X style={{ width: '14px', height: '14px', color: '#71717a', strokeWidth: 2.5 }} />
          </div>
          <h3
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#e4e4e7',
              marginBottom: '10px',
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
            }}
          >
            {row.con.title}
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: '#52525b',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {row.con.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WhyChooseMe({ items = [], settings }) {
  // Build rows from CMS data if available, otherwise use hardcoded defaults
  let rows;
  if (items && items.length > 0) {
    const pros = items.filter(it => it.type === 'pro');
    const cons = items.filter(it => it.type === 'con');
    const maxLen = Math.max(pros.length, cons.length);
    rows = [];
    for (let i = 0; i < maxLen; i++) {
      rows.push({
        pro: pros[i] || { title: '', description: '' },
        con: cons[i] || { title: '', description: '' },
      });
    }
  } else {
    rows = COMPARISONS;
  }

  const badge = settings?.why_badge || 'Why choose me';
  const title = settings?.why_title;
  const desc = settings?.why_desc || 'Why Partner with Me for Engineering Excellence';

  const renderTitle = () => {
    if (title) {
      if (title.toLowerCase() === 'why me as a tech partner') {
        return (
          <>
            Why Me as a <span className="italic font-serif font-normal text-zinc-500">Tech Partner</span>
          </>
        );
      }
      return title;
    }
    return (
      <>
        Why Me as a <span className="italic font-serif font-normal text-zinc-500">Tech Partner</span>
      </>
    );
  };

  return (
    <section className="section-wrapper flex flex-col items-center">
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
      <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-3 text-center">
        {renderTitle()}
      </h2>
      <p className="text-zinc-500 text-sm mb-14 text-center">{desc}</p>

      {/* Sticky Stacking Card Rows */}
      <div className="flex flex-col w-full" style={{ gap: '16px', paddingBottom: '60px' }}>
        {rows.map((row, i) => (
          <StickyCard key={i} row={row} index={i} total={rows.length} />
        ))}
      </div>
    </section>
  );
}
