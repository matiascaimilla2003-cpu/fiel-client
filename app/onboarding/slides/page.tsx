'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

/* ── Contenido de cada slide ── */
const SLIDES: { icon: React.ReactElement; title: string; desc: string }[] = [
  {
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Gana puntos\ncon cada compra',
    desc: 'Por cada peso que gastas, acumulas puntos. Sin tarjetas, sin papeles. Todo desde tu teléfono.',
  },
  {
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"/>
        <rect x="2" y="7" width="20" height="5"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
    title: 'Canjea premios\nreales',
    desc: 'Descuentos, bebidas gratis y packs especiales. Tus puntos valen plata de verdad.',
  },
  {
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c0 4-4 7-4 11a4 4 0 0 0 8 0c0-4-4-7-4-11z"/>
        <path d="M12 13c0-2 1.5-3 1.5-5"/>
      </svg>
    ),
    title: 'Sube de nivel y\ndesbloquea más',
    desc: 'Bronce, Plata, Oro, Platino. Mientras más compras, mejores beneficios y más puntos.',
  },
];

function SlidePreview({ index }: { index: number }) {
  const cardStyle: React.CSSProperties = {
    background: '#141414',
    borderRadius: 20,
    border: '0.5px solid rgba(255,255,255,0.07)',
    padding: 16,
    width: '100%',
    textAlign: 'left',
  };

  if (index === 0) {
    return (
      <div style={cardStyle}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>
          Ejemplo
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Compra $10.000</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#2ECC71' }}>+120 pts</span>
        </div>
      </div>
    );
  }

  if (index === 1) {
    const items = [
      { label: 'Cerveza gratis',     pts: '800 pts'   },
      { label: 'Descuento $3.000',   pts: '600 pts'   },
      { label: 'Pack fin de semana', pts: '1.500 pts' },
    ];
    return (
      <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#fff' }}>{it.label}</span>
            <span style={{ fontSize: 12, color: '#818CF8', fontWeight: 600 }}>{it.pts}</span>
          </div>
        ))}
      </div>
    );
  }

  /* Slide 3 — barra de niveles */
  const levels = [
    { label: 'Bronce', active: false },
    { label: 'Plata',  active: false },
    { label: 'Oro ✓',  active: true  },
    { label: 'Platino', active: false },
  ];
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        {levels.map((lv, i) => (
          <span key={i} style={{
            fontSize: 11,
            color: lv.active ? '#818CF8' : 'rgba(255,255,255,0.28)',
            fontWeight: lv.active ? 600 : 400,
          }}>
            {lv.label}
          </span>
        ))}
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: '72%',
          background: 'linear-gradient(90deg, #6366F1, #818CF8)',
          borderRadius: 4,
        }} />
      </div>
    </div>
  );
}

export default function SlidesPage() {
  const router       = useRouter();
  const [cur, setCur] = useState(0);
  const [dir, setDir] = useState(1);
  const touchX       = useRef(0);

  const go = (next: number) => {
    if (next === cur) return;
    setDir(next > cur ? 1 : -1);
    setCur(next);
  };

  const goNext = () => {
    if (cur < 2) go(cur + 1);
    else router.push('/onboarding/registro');
  };

  const goPrev = () => { if (cur > 0) go(cur - 1); };

  return (
    <div style={{
      background: '#0a0a14',
      minHeight: '100dvh',
      maxWidth: 430,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── Área de slide con soporte touch ── */}
      <div
        style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const diff = touchX.current - e.changedTouches[0].clientX;
          if (diff > 50)  goNext();
          if (diff < -50) goPrev();
        }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={cur}
            custom={dir}
            initial={{ opacity: 0, x: dir * 44 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -44 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '28px 32px 0',
              textAlign: 'center',
            }}
          >
            {/* Ícono con glow */}
            <div style={{
              width: 96, height: 96,
              background: '#141414',
              borderRadius: 24,
              border: '0.5px solid rgba(99,102,241,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#818CF8', marginBottom: 26,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: -1, borderRadius: 24,
                background: 'radial-gradient(circle at 50% 0, rgba(99,102,241,0.2), transparent 60%)',
                pointerEvents: 'none',
              }} />
              {SLIDES[cur].icon}
            </div>

            {/* Título */}
            <div style={{
              fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
              fontSize: 32, color: '#fff', letterSpacing: 1,
              lineHeight: 1.05, marginBottom: 12,
              whiteSpace: 'pre-line',
            }}>
              {SLIDES[cur].title}
            </div>

            {/* Descripción */}
            <div style={{
              fontSize: 14, color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.65, marginBottom: 24, maxWidth: 280,
            }}>
              {SLIDES[cur].desc}
            </div>

            {/* Card de preview */}
            <SlidePreview index={cur} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Dots indicadores ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, padding: '20px 0 8px',
        flexShrink: 0,
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            onClick={() => go(i)}
            style={{
              width: i === cur ? 26 : 7,
              height: 7,
              borderRadius: 4,
              background: i === cur ? '#6366F1' : 'rgba(255,255,255,0.18)',
              transition: 'all 0.3s',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* ── Botones ── */}
      <div style={{ padding: '0 32px 32px', flexShrink: 0 }}>
        <button
          onClick={goNext}
          style={{
            background: '#fff', color: '#0a0a0a', border: 'none',
            borderRadius: 28, padding: 15,
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            width: '100%', fontFamily: 'inherit',
            marginBottom: 10, letterSpacing: '0.2px',
          }}
        >
          {cur < 2 ? 'Siguiente →' : 'Crear cuenta →'}
        </button>
        <button
          onClick={() => router.push('/onboarding/registro')}
          style={{
            background: 'transparent', color: 'rgba(255,255,255,0.55)',
            border: '0.5px solid rgba(255,255,255,0.13)',
            borderRadius: 28, padding: 14,
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
            width: '100%', fontFamily: 'inherit',
          }}
        >
          Omitir
        </button>
      </div>
    </div>
  );
}
