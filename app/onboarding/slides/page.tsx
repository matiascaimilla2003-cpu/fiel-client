'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// ── Ilustraciones SVG ────────────────────────────────────────

function SlideIllustration1() {
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
      <defs>
        <radialGradient id="halo1" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(99,102,241,0.55)"/>
          <stop offset="0.5" stopColor="rgba(99,102,241,0.15)"/>
          <stop offset="1" stopColor="rgba(99,102,241,0)"/>
        </radialGradient>
        <radialGradient id="core1" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#A5B4FC"/>
          <stop offset="0.6" stopColor="#6366F1"/>
          <stop offset="1" stopColor="#4F46E5"/>
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="118" fill="url(#halo1)"/>
      <circle cx="120" cy="120" r="104" stroke="rgba(99,102,241,0.18)" strokeWidth="1" strokeDasharray="1 5"/>
      <circle cx="120" cy="120" r="84"  stroke="rgba(99,102,241,0.28)" strokeWidth="1"/>
      <circle cx="120" cy="120" r="64"  stroke="rgba(129,140,248,0.45)" strokeWidth="1.4" strokeDasharray="3 6"/>
      <circle cx="120" cy="120" r="44"  stroke="rgba(129,140,248,0.7)"  strokeWidth="1.4"/>
      <g style={{ transformOrigin: '120px 120px', animation: 'spinSlow 18s linear infinite' }}>
        <circle cx="120" cy="16" r="3" fill="#A5B4FC"/>
        <circle cx="224" cy="120" r="2" fill="#818CF8" opacity="0.7"/>
      </g>
      <g style={{ transformOrigin: '120px 120px', animation: 'spinSlow 12s linear infinite reverse' }}>
        <circle cx="120" cy="36" r="4" fill="#818CF8"/>
        <circle cx="36"  cy="120" r="3" fill="#6366F1"/>
      </g>
      <g style={{ transformOrigin: '120px 120px', animation: 'spinSlow 8s linear infinite' }}>
        <circle cx="120" cy="56" r="5" fill="#6366F1"/>
        <circle cx="184" cy="120" r="3.5" fill="#818CF8"/>
        <circle cx="120" cy="184" r="3" fill="#A5B4FC" opacity="0.7"/>
      </g>
      <circle cx="120" cy="120" r="22" fill="url(#core1)"
        style={{ filter: 'drop-shadow(0 0 14px rgba(99,102,241,0.7))' }}/>
      <circle cx="120" cy="120" r="8" fill="#ffffff" opacity="0.85"/>
    </svg>
  );
}

function SlideIllustration2() {
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
      <defs>
        <linearGradient id="lidTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A5B4FC"/>
          <stop offset="1" stopColor="#6366F1"/>
        </linearGradient>
        <linearGradient id="faceLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4F46E5"/>
          <stop offset="1" stopColor="#6366F1"/>
        </linearGradient>
        <linearGradient id="faceRight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6366F1"/>
          <stop offset="1" stopColor="#3730A3"/>
        </linearGradient>
        <linearGradient id="lidEdge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A5B4FC"/>
          <stop offset="1" stopColor="#6366F1"/>
        </linearGradient>
        <radialGradient id="halo2" cx="0.5" cy="0.55" r="0.5">
          <stop offset="0" stopColor="rgba(99,102,241,0.5)"/>
          <stop offset="1" stopColor="rgba(99,102,241,0)"/>
        </radialGradient>
      </defs>
      <circle cx="120" cy="130" r="100" fill="url(#halo2)"/>
      <ellipse cx="120" cy="206" rx="70" ry="6" fill="rgba(99,102,241,0.25)"/>
      <path d="M120 116 L184 88 L184 168 L120 196 Z" fill="url(#faceRight)"/>
      <path d="M120 116 L56 88 L56 168 L120 196 Z" fill="url(#faceLeft)"/>
      <path d="M86 102 L86 182 L96 186 L96 106 Z" fill="#C7D2FE" opacity="0.95"/>
      <path d="M154 102 L154 182 L144 186 L144 106 Z" fill="#A5B4FC" opacity="0.95"/>
      <path d="M70 95 L100 107 L100 115 L70 103 Z" fill="#ffffff" opacity="0.18"/>
      <path d="M120 116 L56 88 L56 78 L120 106 Z" fill="url(#lidEdge)" opacity="0.9"/>
      <path d="M120 116 L184 88 L184 78 L120 106 Z" fill="#4338CA"/>
      <path d="M120 106 L184 78 L120 50 L56 78 Z" fill="url(#lidTop)"/>
      <path d="M86 92 L120 78 L154 92 L120 106 Z" fill="#C7D2FE" opacity="0.9"/>
      <path d="M120 50 L160 67 L130 79 L100 67 Z" fill="#ffffff" opacity="0.22"/>
      <g transform="translate(120 50)">
        <ellipse cx="-10" cy="-2" rx="10" ry="7" fill="#A5B4FC" transform="rotate(-20)"/>
        <ellipse cx="10"  cy="-2" rx="10" ry="7" fill="#A5B4FC" transform="rotate(20)"/>
        <circle cx="0" cy="0" r="4" fill="#C7D2FE"/>
      </g>
      <g stroke="#818CF8" strokeWidth="1.4" strokeLinecap="round" fill="none">
        <path d="M40 40 L40 50 M35 45 L45 45"/>
        <path d="M200 60 L200 68 M196 64 L204 64"/>
        <path d="M204 144 L204 152 M200 148 L208 148"/>
      </g>
      <circle cx="32" cy="126" r="2" fill="#818CF8"/>
      <circle cx="210" cy="96" r="2" fill="#A5B4FC"/>
    </svg>
  );
}

function SlideIllustration3() {
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
      <defs>
        <linearGradient id="stepTop4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A5B4FC"/>
          <stop offset="1" stopColor="#6366F1"/>
        </linearGradient>
        <linearGradient id="stepFace4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6366F1"/>
          <stop offset="1" stopColor="#4338CA"/>
        </linearGradient>
        <radialGradient id="topGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(99,102,241,0.7)"/>
          <stop offset="1" stopColor="rgba(99,102,241,0)"/>
        </radialGradient>
      </defs>
      <circle cx="180" cy="60" r="70" fill="url(#topGlow)"/>
      {[0, 1, 2, 3].map(i => {
        const dx = i * 38;
        const dy = -i * 30;
        const baseX = 24 + dx;
        const baseY = 170 + dy;
        const w = 44;
        const d = 18;
        const h = 24;
        const isTop = i === 3;
        const topFill   = isTop ? 'url(#stepTop4)' : `rgba(99,102,241,${0.10 + i * 0.05})`;
        const topStroke = isTop ? 'none' : `rgba(99,102,241,${0.35 + i * 0.08})`;
        const faceFill  = isTop ? 'url(#stepFace4)' : `rgba(99,102,241,${0.06 + i * 0.04})`;
        const faceStroke = isTop ? 'none' : `rgba(99,102,241,${0.30 + i * 0.07})`;
        const top   = `M${baseX} ${baseY} L${baseX+w} ${baseY-d} L${baseX+w*2} ${baseY} L${baseX+w} ${baseY+d} Z`;
        const front = `M${baseX} ${baseY} L${baseX+w} ${baseY+d} L${baseX+w} ${baseY+d+h} L${baseX} ${baseY+h} Z`;
        const side  = `M${baseX+w} ${baseY+d} L${baseX+w*2} ${baseY} L${baseX+w*2} ${baseY+h} L${baseX+w} ${baseY+d+h} Z`;
        return (
          <g key={i} style={isTop ? { filter: 'drop-shadow(0 0 16px rgba(99,102,241,0.7))' } : {}}>
            <path d={side}  fill={isTop ? '#3730A3' : 'rgba(0,0,0,0.35)'} stroke={faceStroke} strokeWidth="1"/>
            <path d={front} fill={faceFill} stroke={faceStroke} strokeWidth="1"/>
            <path d={top}   fill={topFill}  stroke={topStroke}  strokeWidth="1"/>
          </g>
        );
      })}
      <path d="M180 70 L168 22 L192 22 Z" fill="#A5B4FC" opacity="0.18"/>
      <path d="M180 70 L174 26 L186 26 Z" fill="#C7D2FE" opacity="0.35"/>
      <circle cx="180" cy="68" r="2.5" fill="#ffffff"/>
      <g stroke="#A5B4FC" strokeWidth="1.2" strokeLinecap="round">
        <path d="M180 56 L180 62 M180 74 L180 80 M168 68 L174 68 M186 68 L192 68"/>
      </g>
    </svg>
  );
}

// ── Datos de cada slide ─────────────────────────────────────

type SlideProof = { label: string; a: string; b: string };
type SlideListItem = { name: string; value: string };
type SlideTier = { current: string; progress: number };

interface SlideData {
  illu: React.FC;
  eyebrow: string;
  title: string;
  body: string;
  proof?: SlideProof;
  list?: SlideListItem[];
  tier?: SlideTier;
}

const SLIDES: SlideData[] = [
  {
    illu: SlideIllustration1,
    eyebrow: '01 — ACUMULA',
    title: 'GANA PUNTOS\nCON CADA COMPRA',
    body: 'Por cada peso que gastas, acumulas puntos. Sin tarjetas, sin papeles. Todo desde tu teléfono.',
    proof: { label: 'EJEMPLO', a: 'Compra $10.000', b: '+120 pts' },
  },
  {
    illu: SlideIllustration2,
    eyebrow: '02 — CANJEA',
    title: 'CANJEA PREMIOS\nREALES',
    body: 'Descuentos, bebidas gratis y packs especiales. Tus puntos valen plata de verdad.',
    list: [
      { name: 'Cerveza gratis', value: '800 pts' },
      { name: 'Descuento $3.000', value: '600 pts' },
      { name: 'Pack fin de semana', value: '1.500 pts' },
    ],
  },
  {
    illu: SlideIllustration3,
    eyebrow: '03 — SUBE DE NIVEL',
    title: 'SUBE DE NIVEL\nY DESBLOQUEA MÁS',
    body: 'Bronce, Plata, Oro, Platino. Mientras más compras, mejores beneficios y más puntos.',
    tier: { current: 'ORO', progress: 0.62 },
  },
];

// ── Estilos de card ─────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: 'rgba(99,102,241,0.10)',
  border: '1px solid rgba(99,102,241,0.20)',
  borderRadius: 16,
  padding: 16,
};

// ── Componente principal ────────────────────────────────────

export default function SlidesPage() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const touchX = useRef(0);

  const go = (next: number) => {
    if (next === idx) return;
    setDir(next > idx ? 1 : -1);
    setIdx(next);
  };

  const goNext = () => {
    if (idx < 2) go(idx + 1);
    else router.push('/onboarding/registro');
  };

  const goPrev = () => {
    if (idx > 0) go(idx - 1);
    else router.push('/onboarding/registro');
  };

  const slide = SLIDES[idx];
  const Illu = slide.illu;

  return (
    <div style={{
      background: '#0a0a14',
      minHeight: '100dvh',
      maxWidth: 430,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px 0' }}>
        <span style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 14, letterSpacing: '0.3em', color: '#818CF8',
        }}>
          CFIEL
        </span>
        <button
          onClick={() => router.push('/onboarding/registro')}
          style={{
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.45)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '6px 0',
            fontFamily: 'inherit',
          }}
        >
          Omitir
        </button>
      </div>

      {/* Slide area */}
      <div
        style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const diff = touchX.current - e.changedTouches[0].clientX;
          if (diff > 50) goNext();
          if (diff < -50) goPrev();
        }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={idx}
            custom={dir}
            initial={{ opacity: 0, x: dir * 44 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -44 }}
            transition={{ duration: 0.38, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              padding: '24px 32px 0',
            }}
          >
            {/* Ilustración */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, marginBottom: 36 }}>
              <Illu/>
            </div>

            {/* Eyebrow */}
            <div style={{
              fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
              fontSize: 12, letterSpacing: '0.32em',
              color: '#818CF8', marginBottom: 12,
            }}>
              {slide.eyebrow}
            </div>

            {/* Título */}
            <h2 style={{
              fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
              fontSize: 44, lineHeight: 0.95,
              margin: '0 0 16px', color: '#fff',
              whiteSpace: 'pre-line',
            }}>
              {slide.title}
            </h2>

            {/* Cuerpo */}
            <p style={{
              fontSize: 15, lineHeight: 1.55,
              color: 'rgba(255,255,255,0.55)',
              margin: '0 0 28px',
            }}>
              {slide.body}
            </p>

            {/* Proof card */}
            {slide.proof && (
              <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                    fontSize: 11, letterSpacing: '0.2em',
                    color: 'rgba(255,255,255,0.35)', marginBottom: 4,
                  }}>
                    {slide.proof.label}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>{slide.proof.a}</div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                  fontSize: 26, color: '#818CF8',
                }}>
                  {slide.proof.b}
                </div>
              </div>
            )}

            {/* List card */}
            {slide.list && (
              <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 12, padding: 18 }}>
                {slide.list.map((it, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingBottom: i < (slide.list?.length ?? 0) - 1 ? 10 : 0,
                    borderBottom: i < (slide.list?.length ?? 0) - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}>
                    <span style={{ fontSize: 15, color: '#fff' }}>{it.name}</span>
                    <span style={{
                      fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                      fontSize: 18, letterSpacing: '0.04em', color: '#818CF8',
                    }}>
                      {it.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tier card */}
            {slide.tier && (
              <div style={{ ...cardStyle, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.45)' }}>TU NIVEL</span>
                  <span style={{
                    fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                    fontSize: 20, color: '#818CF8',
                  }}>
                    {slide.tier.current}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['BRONCE', 'PLATA', 'ORO', 'PLATINO'].map((n, i) => (
                    <div key={n} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{
                        height: 4, borderRadius: 100,
                        background: i <= 2
                          ? 'linear-gradient(90deg, #4F46E5, #818CF8)'
                          : 'rgba(255,255,255,0.08)',
                        marginBottom: 6,
                      }}/>
                      <div style={{
                        fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                        fontSize: 10, letterSpacing: '0.16em',
                        color: i === 2 ? '#818CF8' : 'rgba(255,255,255,0.35)',
                      }}>
                        {n}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '8px 0 16px' }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            onClick={() => go(i)}
            style={{
              cursor: 'pointer',
              height: 6,
              width: i === idx ? 28 : 6,
              borderRadius: 100,
              background: i === idx ? '#6366F1' : 'rgba(255,255,255,0.12)',
              boxShadow: i === idx ? '0 0 16px rgba(99,102,241,0.6)' : 'none',
              transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
            }}
          />
        ))}
      </div>

      {/* CTAs */}
      <div style={{ padding: '0 24px 36px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={goNext}
          style={{
            background: '#fff', color: '#0a0a14', border: 'none',
            borderRadius: 100, padding: '16px 24px',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            width: '100%', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {idx < 2 ? 'Siguiente' : 'Crear cuenta'}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </button>

        <button
          onClick={goPrev}
          style={{
            background: 'transparent', color: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 100, padding: '14px 24px',
            fontSize: 15, fontWeight: 500, cursor: 'pointer',
            width: '100%', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: idx === 0 ? 0.5 : 1,
          }}
        >
          {idx === 0 ? 'Omitir' : 'Atrás'}
        </button>
      </div>
    </div>
  );
}
