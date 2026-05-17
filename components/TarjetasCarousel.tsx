'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BEBAS = 'var(--font-bebas), "Bebas Neue", sans-serif';

// ── Tier system ─────────────────────────────────────────────
const TIER_DATA: Record<string, {
  color: string; light: string; shade: string; accent: string;
  next: string | null; threshold: number;
}> = {
  BRONCE:  { color: '#B07A4A', light: '#E8B98A', shade: '#7E5430', accent: '#E89A4A', next: 'PLATA',   threshold: 0    },
  PLATA:   { color: '#B0B5C5', light: '#E0E5F0', shade: '#7E8497', accent: '#A0E8F0', next: 'ORO',     threshold: 500  },
  ORO:     { color: '#F5C16C', light: '#FFE3AA', shade: '#B88838', accent: '#FF8E5C', next: 'PLATINO', threshold: 1000 },
  PLATINO: { color: '#C7D2FE', light: '#FFFFFF', shade: '#818CF8', accent: '#F0A8E1', next: null,      threshold: 2000 },
};

const NUMBER_BG: Record<string, string> = {
  BRONCE:  'linear-gradient(180deg, #FFFFFF 0%, #FFD8A8 35%, #E8B98A 65%, #B07A4A 100%)',
  PLATA:   'linear-gradient(180deg, #FFFFFF 0%, #E8EBF2 35%, #C9CFDC 65%, #9CA3B5 100%)',
  ORO:     'linear-gradient(180deg, #FFFFFF 0%, #FFEBC0 35%, #FFD089 65%, #DBA456 100%)',
  PLATINO: 'linear-gradient(180deg, #FFFFFF 0%, #E4E9FF 35%, #C7D2FE 65%, #818CF8 100%)',
};

// ── Foil emblems per tier ────────────────────────────────────
function TierEmblem({ tier, size = 140 }: { tier: string; size?: number }) {
  const t = TIER_DATA[tier] ?? TIER_DATA.ORO;
  const gid = `foil-${tier}`;
  const p = { width: size, height: size, viewBox: '0 0 100 100' as string, fill: 'none' as const };
  const defs = (
    <defs>
      <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={t.light}/>
        <stop offset="0.5" stopColor={t.color}/>
        <stop offset="1" stopColor={t.shade}/>
      </linearGradient>
      <linearGradient id={`${gid}-shine`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(255,255,255,0.4)"/>
        <stop offset="0.5" stopColor="rgba(255,255,255,0.1)"/>
        <stop offset="1" stopColor="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>
  );
  if (tier === 'BRONCE') return (
    <svg {...p}>{defs}
      <path d="M50 10 L82 22 V46 C82 68 66 84 50 90 C34 84 18 68 18 46 V22 Z" fill={`url(#${gid})`} stroke={t.light} strokeWidth="0.6"/>
      <path d="M50 10 L82 22 V46 C82 60 70 70 60 75 C60 60 50 45 50 30 Z" fill={`url(#${gid}-shine)`}/>
      <path d="M50 30 V72 M36 50 H64" stroke={t.shade} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
  if (tier === 'PLATA') return (
    <svg {...p}>{defs}
      <path d="M50 10 L82 22 V46 C82 68 66 84 50 90 C34 84 18 68 18 46 V22 Z" fill={`url(#${gid})`} stroke={t.light} strokeWidth="0.6"/>
      <path d="M50 10 L82 22 V46 C82 60 70 70 60 75 C60 60 50 45 50 30 Z" fill={`url(#${gid}-shine)`}/>
      <path d="M50 18 L74 27 V46 C74 63 62 76 50 81 C38 76 26 63 26 46 V27 Z" fill="none" stroke={t.light} strokeWidth="0.8" opacity="0.8"/>
      <path d="M50 38 L54 50 L66 54 L54 58 L50 70 L46 58 L34 54 L46 50 Z" fill={t.light} opacity="0.7"/>
    </svg>
  );
  if (tier === 'ORO') return (
    <svg {...p}>{defs}
      <path d="M16 70 L20 30 L36 50 L50 22 L64 50 L80 30 L84 70 Z" fill={`url(#${gid})`} stroke={t.light} strokeWidth="0.6"/>
      <path d="M16 70 L20 30 L36 50 L40 45 L40 70 Z" fill={`url(#${gid}-shine)`}/>
      <rect x="16" y="72" width="68" height="6" rx="1" fill={`url(#${gid})`} stroke={t.shade} strokeWidth="0.4"/>
      <circle cx="20" cy="30" r="3" fill={t.light}/>
      <circle cx="50" cy="22" r="3.5" fill={t.light}/>
      <circle cx="80" cy="30" r="3" fill={t.light}/>
      <path d="M44 55 L50 50 L56 55 L50 65 Z" fill={t.accent}/>
    </svg>
  );
  if (tier === 'PLATINO') return (
    <svg {...p}>{defs}
      <path d="M50 12 L74 22 L82 46 L74 70 L50 80 L26 70 L18 46 L26 22 Z" fill={`url(#${gid})`} stroke={t.light} strokeWidth="0.6"/>
      <path d="M50 12 L74 22 L82 46 L66 46 L66 38 L50 30 Z" fill={`url(#${gid}-shine)`}/>
      <path d="M50 28 L66 38 L66 58 L50 68 L34 58 L34 38 Z" fill="none" stroke={t.light} strokeWidth="0.9" opacity="0.9"/>
      <path d="M50 12 L50 28 M74 22 L66 38 M82 46 L66 38 M82 46 L66 58 M74 70 L66 58 M50 80 L50 68 M26 70 L34 58 M18 46 L34 58 M18 46 L34 38 M26 22 L34 38" stroke={t.shade} strokeWidth="0.5" opacity="0.6"/>
      <circle cx="14" cy="20" r="1.2" fill={t.accent}/>
      <circle cx="88" cy="40" r="1.2" fill={t.accent}/>
      <circle cx="12" cy="60" r="1.2" fill={t.light}/>
      <circle cx="86" cy="78" r="1.2" fill={t.light}/>
    </svg>
  );
  return null;
}

function TierIcon({ tier }: { tier: string }) {
  if (tier === 'BRONCE' || tier === 'PLATA') return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L4 5v6c0 5 3 9 8 11 5-2 8-6 8-11V5l-8-3z"/>
    </svg>
  );
  if (tier === 'ORO') return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zM5 18h14v2H5z"/>
    </svg>
  );
  if (tier === 'PLATINO') return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>
    </svg>
  );
  return null;
}

// ── Cinematic membership card ────────────────────────────────
interface PointsCardProps {
  points: number;
  tier: string;
  program: string;
  code: string;
  onTap: () => void;
}

const DUST = [
  { x: '14%', size: 1.6, delay: 0,   dur: 14 },
  { x: '38%', size: 1,   delay: 5,   dur: 18 },
  { x: '62%', size: 2,   delay: 2.5, dur: 12 },
  { x: '84%', size: 1.2, delay: 8,   dur: 16 },
  { x: '52%', size: 0.8, delay: 11,  dur: 20 },
];

const TWINKLES = [
  { x: '12%', y: '20%', size: 3,   delay: 0   },
  { x: '88%', y: '32%', size: 2,   delay: 0.8 },
  { x: '20%', y: '78%', size: 2,   delay: 1.6 },
  { x: '72%', y: '90%', size: 2.5, delay: 2.4 },
  { x: '50%', y: '12%', size: 1.5, delay: 3.2 },
];

function PointsCard({ points, tier, program, code, onTap }: PointsCardProps) {
  const t = TIER_DATA[tier] ?? TIER_DATA.ORO;
  const nextTier = t.next ? TIER_DATA[t.next] : null;
  const needed = nextTier ? Math.max(0, nextTier.threshold - points) : 0;
  const progress = nextTier
    ? Math.max(0, Math.min(1, (points - t.threshold) / (nextTier.threshold - t.threshold)))
    : 1;
  const pct = Math.round(progress * 100);
  const tc = t.color;
  const ac = t.accent;
  const formatted = points.toLocaleString('es-CL');

  return (
    <motion.div
      onTap={onTap}
      whileTap={{ scale: 0.99 }}
      style={{
        position: 'relative',
        borderRadius: 22,
        padding: 16,
        background: `
          radial-gradient(circle at 100% -10%, ${tc}40 0%, transparent 50%),
          radial-gradient(circle at -10% 30%, ${ac}30 0%, transparent 45%),
          radial-gradient(circle at 110% 110%, rgba(99,102,241,0.30) 0%, transparent 55%),
          linear-gradient(135deg, #1c1635 0%, #100f1f 50%, #0a0a18 100%)
        `,
        border: `1.5px solid ${tc}66`,
        boxShadow: `0 16px 48px ${tc}30, 0 0 0 0.5px ${ac}30, inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 0 1px rgba(99,102,241,0.08)`,
        overflow: 'hidden',
        cursor: 'pointer',
        userSelect: 'none' as const,
        animation: 'fadeUp 0.6s cubic-bezier(.2,.8,.2,1), borderBreath 4s ease-in-out infinite',
      }}
    >
      {/* Tier emblem watermark */}
      <div style={{
        position: 'absolute',
        right: -30, top: '50%', transform: 'translateY(-46%)',
        opacity: 0.22,
        pointerEvents: 'none',
        filter: `drop-shadow(0 0 14px ${tc}60) drop-shadow(0 0 4px ${ac}40)`,
      }}>
        <TierEmblem tier={tier} size={184}/>
      </div>

      {/* Grain overlay */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.10, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
        <filter id={`grain-${tier}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves={2} stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0"/>
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${tier})`}/>
      </svg>

      {/* Holo sheen */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(105deg, transparent 35%, ${tc}24 47%, rgba(255,255,255,0.24) 50%, ${tc}24 53%, transparent 65%)`,
        backgroundSize: '220% 100%',
        mixBlendMode: 'screen',
        animation: 'holoSheen 8s ease-in-out infinite',
        pointerEvents: 'none',
      }}/>

      {/* Prism sheen */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(115deg, transparent 38%, ${ac}1c 48%, rgba(255,255,255,0.12) 51%, ${ac}1c 54%, transparent 62%)`,
        backgroundSize: '240% 100%',
        mixBlendMode: 'screen',
        animation: 'prismShift 12s ease-in-out infinite',
        pointerEvents: 'none',
      }}/>

      {/* Dust particles */}
      {DUST.map((d, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: d.x, bottom: 0,
          width: d.size, height: d.size,
          background: 'white',
          borderRadius: '50%',
          boxShadow: `0 0 4px rgba(255,255,255,0.7), 0 0 8px ${ac}40`,
          animation: `dust ${d.dur}s linear ${d.delay}s infinite`,
          pointerEvents: 'none',
        }}/>
      ))}

      {/* PLATINO twinkles */}
      {tier === 'PLATINO' && TWINKLES.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: s.x, top: s.y,
          width: s.size * 2, height: s.size * 2,
          background: `radial-gradient(circle, ${tc} 0%, transparent 60%)`,
          borderRadius: '50%',
          animation: `twinkle 3.2s ease-in-out ${s.delay}s infinite`,
          pointerEvents: 'none',
        }}/>
      ))}

      {/* Edge glints */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 80, height: 1,
        background: `linear-gradient(90deg, transparent, ${t.light}, ${ac}, transparent)`,
        animation: 'edgeGlint 9s ease-in-out infinite',
        pointerEvents: 'none',
        filter: 'blur(0.5px)',
      }}/>
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 80, height: 1,
        background: `linear-gradient(270deg, transparent, ${t.light}, ${ac}, transparent)`,
        animation: 'edgeGlintRev 9s ease-in-out 4.5s infinite',
        pointerEvents: 'none',
        filter: 'blur(0.5px)',
      }}/>

      {/* CFIEL embossed label */}
      <div style={{ position: 'absolute', top: 12, right: 16, display: 'flex', alignItems: 'baseline', opacity: 0.85, zIndex: 2 }}>
        <span style={{ fontFamily: BEBAS, fontSize: 12, color: '#6366F1', textShadow: `0.5px 0 0 ${ac}80, -0.5px 0 0 #6366F180, 0 1px 0 rgba(0,0,0,0.5)` }}>C</span>
        <span style={{ fontFamily: BEBAS, fontSize: 12, color: '#fff', letterSpacing: '0.06em', textShadow: `0.5px 0 0 ${ac}55, -0.5px 0 0 ${tc}55, 0 1px 0 rgba(0,0,0,0.5)` }}>FIEL</span>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Spinning logo + program name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              position: 'absolute', inset: -2, borderRadius: 12,
              background: `conic-gradient(from 0deg, ${t.light}, ${tc}, ${t.shade}, ${tc}, ${t.light})`,
              filter: `drop-shadow(0 0 6px ${tc}cc)`,
              animation: 'spinSlow 16s linear infinite',
            }}/>
            <div style={{
              position: 'relative', width: 30, height: 30, borderRadius: 10,
              background: 'linear-gradient(135deg, #2a2540, #14121f)',
              border: '1.5px solid #0e0e1a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: BEBAS, fontSize: 13, color: '#A5B4FC',
            }}>TP</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 10, letterSpacing: '0.28em', color: '#8a8aa3', lineHeight: 1 }}>PROGRAMA FIDELIDAD</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3, lineHeight: 1 }}>{program}</div>
          </div>
        </div>

        {/* Tier pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 9px 3px 7px', borderRadius: 100,
          background: `linear-gradient(135deg, ${tc}30, ${ac}18)`,
          border: `1px solid ${tc}90`,
          fontFamily: BEBAS, fontSize: 10, letterSpacing: '0.16em',
          color: t.light,
          boxShadow: `0 0 14px ${tc}40, inset 0 1px 0 ${t.light}40`,
          marginBottom: 6,
          textShadow: `0 0 8px ${tc}80`,
        }}>
          <TierIcon tier={tier}/>
          NIVEL {tier}
        </div>

        {/* Points hero */}
        <div style={{ fontFamily: BEBAS, fontSize: 10, letterSpacing: '0.26em', color: '#8a8aa3' }}>
          PUNTOS ACUMULADOS
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <div style={{
            fontFamily: BEBAS, fontSize: 62, lineHeight: 0.9,
            background: NUMBER_BG[tier] ?? NUMBER_BG.ORO,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 18px ${tc}60) drop-shadow(0 1px 1px ${t.shade}80)`,
            letterSpacing: '-0.01em',
          }}>{formatted}</div>
          <div style={{ fontFamily: BEBAS, fontSize: 16, color: t.light, letterSpacing: '0.12em', textShadow: `0 0 10px ${tc}aa` }}>PTS</div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: '#8a8aa3' }}>
              {nextTier
                ? <span>Faltan <span style={{ fontFamily: BEBAS, color: t.light, fontSize: 13 }}>{needed.toLocaleString('es-CL')} pts</span> para <span style={{ fontFamily: BEBAS, color: nextTier.color, letterSpacing: '0.1em', fontSize: 13, textShadow: `0 0 8px ${nextTier.color}aa` }}>{t.next}</span></span>
                : <span>Estás en el <span style={{ fontFamily: BEBAS, color: tc, letterSpacing: '0.1em', fontSize: 13, textShadow: `0 0 8px ${tc}` }}>nivel máximo</span></span>
              }
            </span>
            <span style={{ fontFamily: BEBAS, fontSize: 13, color: nextTier ? nextTier.color : tc }}>{pct}%</span>
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: 0, width: `${pct}%`,
              background: nextTier
                ? `linear-gradient(90deg, ${tc} 0%, ${ac} 50%, ${nextTier.color} 100%)`
                : `linear-gradient(90deg, ${tc} 0%, ${t.light} 50%, #fff 100%)`,
              borderRadius: 100,
              boxShadow: `0 0 10px ${tc}aa`,
            }}/>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, width: `${pct}%`,
              background: 'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2.6s linear infinite',
              borderRadius: 100,
            }}/>
          </div>
        </div>

        {/* Footer: ID + SIM chip */}
        <div style={{
          marginTop: 12, paddingTop: 10,
          borderTop: `1px dashed ${tc}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontFamily: BEBAS, fontSize: 9, letterSpacing: '0.22em', color: '#5b5b75' }}>ID DE SOCIO</div>
            <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#fff', marginTop: 1, letterSpacing: '0.04em' }}>{code}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: t.light, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', textShadow: `0 0 6px ${tc}aa` }}>Ver QR</span>
            <div style={{
              width: 32, height: 22, borderRadius: 4,
              background: `linear-gradient(135deg, ${t.light} 0%, ${tc} 50%, ${t.shade} 100%)`,
              position: 'relative',
              border: `1px solid ${t.light}40`,
              boxShadow: `inset 0 1px 0 ${t.light}55, 0 0 12px ${tc}55`,
            }}>
              <div style={{ position: 'absolute', inset: 4, borderRadius: 2, border: `1px solid ${t.shade}40` }}/>
              <div style={{ position: 'absolute', top: 10, left: 4, right: 4, height: 1, background: t.shade, opacity: 0.5 }}/>
              <div style={{ position: 'absolute', left: 15, top: 4, bottom: 4, width: 1, background: t.shade, opacity: 0.5 }}/>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Public component ─────────────────────────────────────────
interface Props {
  puntos: number;
  nivel: 'bronce' | 'plata' | 'oro' | 'platino';
  progreso: number;
  empresa?: string;
  onQROpen: () => void;
}

export default function TarjetasCarousel({ puntos, nivel, empresa = 'Tío Polo', onQROpen }: Props) {
  const [code, setCode] = useState('CFIEL-000000');
  const tier = nivel.toUpperCase();

  useEffect(() => {
    const stored =
      localStorage.getItem('cfiel_codigo_referido') ??
      localStorage.getItem('cfiel_user_id');
    if (stored) {
      setCode(stored.startsWith('CFIEL-') ? stored : `CFIEL-${stored.slice(0, 6).toUpperCase()}`);
    }
  }, []);

  return (
    <div style={{ marginBottom: 14 }}>
      <PointsCard
        points={puntos}
        tier={tier}
        program={empresa}
        code={code}
        onTap={onQROpen}
      />
    </div>
  );
}
