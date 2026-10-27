import { useEffect, useMemo, useRef, useState } from 'react';
import { isTemplateProjectImage, safeWebUrl } from '../data/portfolioContent';

// Depth tunnel tuned to the reference: cards 240px apart on Z inside a scene tilted 45° back.
const SPACING = 240;
const MIN_LAYERS = 28;
const FRONT_LIMIT = 1400; // past this the card is below the fold, so it wraps to the back
const FADE_DEPTH = 5000; // distance at which a card is fully transparent
const BLUR_PER_PX = 0.0093;
const SCALE_PER_PX = 0.000098;
const SCROLL_TO_DEPTH = 1.2;
const DRIFT_PER_SECOND = 30;
const LIFT = 90;

function wrapDepth(value, span) {
  return ((((value - FRONT_LIMIT) % span) + span) % span) - span + FRONT_LIMIT;
}

function buildLayers(cards) {
  if (!cards.length) return [];
  const copies = Math.max(1, Math.ceil(MIN_LAYERS / cards.length));
  return Array.from({ length: copies * cards.length }, (_, layer) => ({ layer, index: layer % cards.length, primary: layer < cards.length }));
}

function GalleryCard({ project, primary, onEnter, onLeave, onFocus, cardRef }) {
  const image = safeWebUrl(project.imageUrl);
  const link = safeWebUrl(project.link);
  const isTemplate = isTemplateProjectImage(image);
  const label = `View ${project.name}${project.category ? `, ${project.category}` : ''}${isTemplate ? '. Image is temporary template artwork.' : ''}`;
  const body = image
    ? <img src={image} alt="" loading="lazy" decoding="async" draggable="false" />
    : <span className="recon-work-layer-fallback"><strong>{project.name}</strong>{project.category && <small>{project.category}</small>}</span>;
  const shared = { ref: cardRef, className: 'recon-work-layer', onPointerEnter: onEnter, onPointerLeave: onLeave, onFocus, onBlur: onLeave, 'aria-hidden': primary ? undefined : true, tabIndex: primary ? undefined : -1 };
  return link
    ? <a {...shared} href={link} target="_blank" rel="noopener noreferrer" aria-label={primary ? label : undefined} draggable="false">{body}</a>
    : <div {...shared} role={primary ? 'img' : undefined} aria-label={primary ? project.name : undefined}>{body}</div>;
}

export default function WorkGallery({ work }) {
  const cards = work.cards;
  const layers = useMemo(() => buildLayers(cards), [cards]);
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const sceneRef = useRef(null);
  const layerRefs = useRef([]);
  const motion = useRef({ hovered: null, nudge: 0, depths: [], lifts: [] });

  useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    if (!section || !scene || !layers.length) return undefined;
    const state = motion.current;
    const span = layers.length * SPACING;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let last = 0;
    let drift = 0;
    let offset = null;
    let shownIndex = -1;

    function render(now) {
      const elapsed = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      const still = reduceMotion.matches;
      if (!still && state.hovered === null) drift += DRIFT_PER_SECOND * elapsed;
      const target = -section.getBoundingClientRect().top * SCROLL_TO_DEPTH + drift + state.nudge;
      offset = offset === null || still ? target : offset + (target - offset) * 0.08;
      const lag = target - offset;
      scene.style.transform = `rotateX(${(-45 + Math.max(-1.5, Math.min(1.5, lag * 0.003))).toFixed(3)}deg)`;

      let nearest = 0;
      layers.forEach((item, layer) => {
        const element = layerRefs.current[layer];
        if (!element) return;
        const depth = wrapDepth(offset - layer * SPACING, span);
        const goal = state.hovered === layer ? 1 : 0;
        const lift = (state.lifts[layer] ?? 0) + (goal - (state.lifts[layer] ?? 0)) * (still ? 1 : 0.15);
        state.lifts[layer] = Math.abs(goal - lift) < 0.001 ? goal : lift;
        state.depths[layer] = depth;
        if (Math.abs(depth) < Math.abs(state.depths[nearest] ?? Infinity)) nearest = layer;
        const distance = Math.abs(depth);
        const opacity = Math.max(0, 1 - distance / FADE_DEPTH);
        const blur = distance * BLUR_PER_PX * (1 - state.lifts[layer]);
        element.style.visibility = opacity <= 0.01 ? 'hidden' : 'visible';
        element.style.opacity = Math.max(opacity, state.lifts[layer]).toFixed(3);
        element.style.filter = blur > 0.25 ? `blur(${blur.toFixed(2)}px)` : 'none';
        element.style.boxShadow = state.lifts[layer] > 0 ? `0 90px 180px rgba(0, 0, 0, ${(0.25 * state.lifts[layer]).toFixed(3)})` : 'none';
        element.style.transform = `translate(-50%, -50%) translateY(${(-LIFT * state.lifts[layer]).toFixed(2)}px) translateZ(${depth.toFixed(2)}px) scale(${(1 + depth * SCALE_PER_PX).toFixed(4)})`;
      });

      const nextIndex = layers[state.hovered ?? nearest].index;
      if (nextIndex !== shownIndex) {
        shownIndex = nextIndex;
        setActive(nextIndex);
      }
      frame = requestAnimationFrame(render);
    }

    // Only animate while the section is on screen.
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      last = 0;
      if (entry.isIntersecting) frame = requestAnimationFrame(render);
    }, { rootMargin: '200px 0px' });
    observer.observe(section);
    frame = requestAnimationFrame(render);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [layers]);

  function hover(layer) {
    motion.current.hovered = layer;
  }

  function focusLayer(layer) {
    // Bring a keyboard-focused card to the front of the tunnel.
    motion.current.nudge -= motion.current.depths[layer] ?? 0;
    motion.current.hovered = layer;
  }

  const current = cards[active] || cards[0];
  return <section className="recon-work" id="work" aria-labelledby="work-title" ref={sectionRef}>
    <div className="recon-work-stage">
      <div className="recon-work-viewport">
        <div className="recon-work-scene" ref={sceneRef}>
          {layers.map((item) => <GalleryCard key={item.layer} project={cards[item.index]} primary={item.primary} cardRef={(element) => { layerRefs.current[item.layer] = element; }} onEnter={() => hover(item.layer)} onLeave={() => hover(null)} onFocus={() => focusLayer(item.layer)} />)}
        </div>
      </div>
      <h2 id="work-title" className="recon-work-heading">{work.heading}</h2>
      {current && <div className="recon-work-active" aria-hidden="true">
        <span>({String(active + 1).padStart(2, '0')}/{String(cards.length).padStart(2, '0')})</span>
        <p>{current.name}</p>
        {current.category && <p className="recon-work-active-category">{current.category}</p>}
      </div>}
      {work.scrollLabel && <p className="recon-work-cue">{work.scrollLabel}</p>}
    </div>
  </section>;
}
