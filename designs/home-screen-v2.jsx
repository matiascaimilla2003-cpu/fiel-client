// CFIEL · Home + modals + Referidos
const { useState, useEffect, useMemo, useRef } = React;

// ───────── status bar ─────────
const StatusBar = () => (
  <div className="status-bar">
    <span>9:41</span>
    <div className="icons">
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><path d="M1 8h2v3H1zM5 6h2v5H5zM9 4h2v7H9zM13 2h2v9h-2z" fill="currentColor"/></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1 4.5C3 2.5 5.5 1.5 8 1.5s5 1 7 3M3 7c1.5-1.3 3-2 5-2s3.5.7 5 2M5.5 9.5c.7-.6 1.6-1 2.5-1s1.8.4 2.5 1"/></svg>
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="1" y="1" width="21" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" opacity="0.5"/><rect x="3" y="3" width="17" height="6" rx="1.2" fill="currentColor"/><rect x="23" y="4" width="1.5" height="4" rx="0.5" fill="currentColor" opacity="0.5"/></svg>
    </div>
  </div>
);

// ───────── topbar — simplified, only name ─────────
const TopBar = ({ userName = 'CARLOS' }) => (
  <div className="topbar">
    <h1>Hola, <span style={{ color: 'var(--indigo-light)' }}>{userName}</span></h1>
    <div style={{ display: 'flex', gap: 10 }}>
      <button className="icon-btn" aria-label="Notificaciones">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/>
        </svg>
        <span className="dot"/>
      </button>
      <div className="avatar">{userName[0]}</div>
    </div>
  </div>
);

// ───────── procedural QR (deterministic + finder patterns) ─────────
const ProceduralQR = ({ seed = 'CFIEL-F26E0B', cellSize = 10, dark = '#0a0a14', light = '#ffffff' }) => {
  const SIZE = 25;
  // deterministic pseudo-random from seed string
  const hash = (s, i) => {
    let h = 5381;
    for (let k = 0; k < s.length; k++) h = ((h << 5) + h + s.charCodeAt(k)) | 0;
    return Math.abs(((h ^ (i * 374761393)) * 668265263) | 0);
  };
  const cells = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      // skip finder pattern regions
      const inTL = x < 8 && y < 8;
      const inTR = x >= 17 && y < 8;
      const inBL = x < 8 && y >= 17;
      if (inTL || inTR || inBL) continue;
      // skip alignment block
      const inA = x >= 16 && x <= 20 && y >= 16 && y <= 20;
      if (inA) continue;
      // skip timing lines (row 6 / col 6)
      if (x === 6 || y === 6) continue;
      const on = hash(seed, x * 31 + y) % 100 < 48;
      if (on) cells.push({ x, y });
    }
  }
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE * cellSize} height={SIZE * cellSize} shapeRendering="crispEdges">
      <rect width={SIZE} height={SIZE} fill={light}/>
      {/* timing patterns */}
      {Array.from({ length: SIZE }).map((_, i) => {
        if (i < 8 || i > 16) return null;
        return [
          (i % 2 === 0) && <rect key={'t1'+i} x={i} y="6" width="1" height="1" fill={dark}/>,
          (i % 2 === 0) && <rect key={'t2'+i} x="6" y={i} width="1" height="1" fill={dark}/>,
        ];
      })}
      {/* finder patterns helper */}
      {[[0,0],[17,0],[0,17]].map(([fx,fy]) => (
        <g key={fx+'-'+fy}>
          <rect x={fx}     y={fy}     width="7" height="7" fill={dark}/>
          <rect x={fx+1}   y={fy+1}   width="5" height="5" fill={light}/>
          <rect x={fx+2}   y={fy+2}   width="3" height="3" fill={dark}/>
        </g>
      ))}
      {/* alignment */}
      <rect x="16" y="16" width="5" height="5" fill={dark}/>
      <rect x="17" y="17" width="3" height="3" fill={light}/>
      <rect x="18" y="18" width="1" height="1" fill={dark}/>
      {/* data modules */}
      {cells.map(c => <rect key={c.x+'-'+c.y} x={c.x} y={c.y} width="1" height="1" fill={dark}/>)}
    </svg>
  );
};

// ───────── tier system ─────────
// Each tier: primary color + chromatic accent + light/shade for foil gradient
const TIER_DATA = {
  BRONCE:  { color: '#B07A4A', light: '#E8B98A', shade: '#7E5430', accent: '#E89A4A', next: 'PLATA',   threshold: 0    },
  PLATA:   { color: '#B0B5C5', light: '#E0E5F0', shade: '#7E8497', accent: '#A0E8F0', next: 'ORO',     threshold: 500  },
  ORO:     { color: '#F5C16C', light: '#FFE3AA', shade: '#B88838', accent: '#FF8E5C', next: 'PLATINO', threshold: 1000 },
  PLATINO: { color: '#C7D2FE', light: '#FFFFFF', shade: '#818CF8', accent: '#F0A8E1', next: null,      threshold: 2000 },
};

// Foil-gradient emblems — multi-stop gradient for metallic look
const TierEmblem = ({ tier, size = 140 }) => {
  const t = TIER_DATA[tier] || TIER_DATA.ORO;
  const gid = `foil-${tier}`;
  const props = { width: size, height: size, viewBox: '0 0 100 100', fill: 'none' };
  const Defs = (
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
  if (tier === 'BRONCE') {
    return (
      <svg {...props}>{Defs}
        <path d="M50 10 L82 22 V46 C82 68 66 84 50 90 C34 84 18 68 18 46 V22 Z" fill={`url(#${gid})`} stroke={t.light} strokeWidth="0.6"/>
        <path d="M50 10 L82 22 V46 C82 60 70 70 60 75 C60 60 50 45 50 30 Z" fill={`url(#${gid}-shine)`}/>
        <path d="M50 30 V72 M36 50 H64" stroke={t.shade} strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    );
  }
  if (tier === 'PLATA') {
    return (
      <svg {...props}>{Defs}
        <path d="M50 10 L82 22 V46 C82 68 66 84 50 90 C34 84 18 68 18 46 V22 Z" fill={`url(#${gid})`} stroke={t.light} strokeWidth="0.6"/>
        <path d="M50 10 L82 22 V46 C82 60 70 70 60 75 C60 60 50 45 50 30 Z" fill={`url(#${gid}-shine)`}/>
        <path d="M50 18 L74 27 V46 C74 63 62 76 50 81 C38 76 26 63 26 46 V27 Z" fill="none" stroke={t.light} strokeWidth="0.8" opacity="0.8"/>
        <path d="M50 38 L54 50 L66 54 L54 58 L50 70 L46 58 L34 54 L46 50 Z" fill={t.light} opacity="0.7"/>
      </svg>
    );
  }
  if (tier === 'ORO') {
    return (
      <svg {...props}>{Defs}
        <path d="M16 70 L20 30 L36 50 L50 22 L64 50 L80 30 L84 70 Z" fill={`url(#${gid})`} stroke={t.light} strokeWidth="0.6"/>
        <path d="M16 70 L20 30 L36 50 L40 45 L40 70 Z" fill={`url(#${gid}-shine)`}/>
        <rect x="16" y="72" width="68" height="6" rx="1" fill={`url(#${gid})`} stroke={t.shade} strokeWidth="0.4"/>
        <circle cx="20" cy="30" r="3" fill={t.light}/>
        <circle cx="50" cy="22" r="3.5" fill={t.light}/>
        <circle cx="80" cy="30" r="3" fill={t.light}/>
        <path d="M44 55 L50 50 L56 55 L50 65 Z" fill={t.accent}/>
      </svg>
    );
  }
  if (tier === 'PLATINO') {
    return (
      <svg {...props}>{Defs}
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
  }
  return null;
};

// Number gradient per tier
const NUMBER_BG = {
  BRONCE:  'linear-gradient(180deg, #FFFFFF 0%, #FFD8A8 35%, #E8B98A 65%, #B07A4A 100%)',
  PLATA:   'linear-gradient(180deg, #FFFFFF 0%, #E8EBF2 35%, #C9CFDC 65%, #9CA3B5 100%)',
  ORO:     'linear-gradient(180deg, #FFFFFF 0%, #FFEBC0 35%, #FFD089 65%, #DBA456 100%)',
  PLATINO: 'linear-gradient(180deg, #FFFFFF 0%, #E4E9FF 35%, #C7D2FE 65%, #818CF8 100%)',
};

// ───────── HERO points card — Cinematic membership card ─────────
const PointsCard = ({ points = 1000, tier = 'ORO', program = 'Tío Polo', code = 'CFIEL-F26E0B', onTap }) => {
  const t = TIER_DATA[tier] || TIER_DATA.ORO;
  const next = t.next ? TIER_DATA[t.next] : null;
  const needed = next ? Math.max(0, next.threshold - points) : 0;
  const progress = next ? Math.max(0, Math.min(1, (points - t.threshold) / (next.threshold - t.threshold))) : 1;
  const pct = Math.round(progress * 100);
  const tierColor = t.color;
  const accent = t.accent;
  const formatted = points.toLocaleString('es-CL');

  return (
    <div className="tap-card" onClick={onTap} style={{
      position: 'relative',
      borderRadius: 22,
      padding: 16,
      // Iridescent multi-stop background: tier color + accent + indigo + base
      background: `
        radial-gradient(circle at 100% -10%, ${tierColor}40 0%, transparent 50%),
        radial-gradient(circle at -10% 30%, ${accent}30 0%, transparent 45%),
        radial-gradient(circle at 110% 110%, rgba(99,102,241,0.30) 0%, transparent 55%),
        linear-gradient(135deg, #1c1635 0%, #100f1f 50%, #0a0a18 100%)
      `,
      border: `1.5px solid ${tierColor}66`,
      boxShadow: `0 16px 48px ${tierColor}30, 0 0 0 0.5px ${accent}30, inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 0 1px rgba(99,102,241,0.08)`,
      overflow: 'hidden',
      animation: 'fadeUp 0.6s cubic-bezier(.2,.8,.2,1), borderBreath 4s ease-in-out infinite',
    }}>
      {/* Layer 1: tier emblem watermark with FOIL gradient */}
      <div style={{
        position: 'absolute',
        right: -30, top: '50%', transform: 'translateY(-46%)',
        opacity: 0.22,
        pointerEvents: 'none',
        filter: `drop-shadow(0 0 14px ${tierColor}60) drop-shadow(0 0 4px ${accent}40)`,
      }}>
        <TierEmblem tier={tier} size={184}/>
      </div>

      {/* Layer 2: grain */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.10, mixBlendMode: 'overlay', pointerEvents: 'none', borderRadius: 'inherit' }}>
        <filter id={`grain-${tier}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0"/>
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${tier})`}/>
      </svg>

      {/* Layer 3a: main holographic sheen (tier color) */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        background: `linear-gradient(105deg, transparent 35%, ${tierColor}24 47%, rgba(255,255,255,0.24) 50%, ${tierColor}24 53%, transparent 65%)`,
        backgroundSize: '220% 100%',
        mixBlendMode: 'screen',
        animation: 'holoSheen 8s ease-in-out infinite',
        pointerEvents: 'none',
      }}/>
      {/* Layer 3b: prismatic accent sheen — runs at different timing for chromatic shift */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        background: `linear-gradient(115deg, transparent 38%, ${accent}1c 48%, rgba(255,255,255,0.12) 51%, ${accent}1c 54%, transparent 62%)`,
        backgroundSize: '240% 100%',
        mixBlendMode: 'screen',
        animation: 'prismShift 12s ease-in-out infinite',
        pointerEvents: 'none',
      }}/>

      {/* Layer 4: drifting dust particles (all tiers, atmospheric) */}
      {[
        { x: '14%', size: 1.6, delay: 0,    dur: 14 },
        { x: '38%', size: 1,   delay: 5,    dur: 18 },
        { x: '62%', size: 2,   delay: 2.5,  dur: 12 },
        { x: '84%', size: 1.2, delay: 8,    dur: 16 },
        { x: '52%', size: 0.8, delay: 11,   dur: 20 },
      ].map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: p.x, bottom: 0,
          width: p.size, height: p.size,
          background: 'white',
          borderRadius: '50%',
          boxShadow: `0 0 4px rgba(255,255,255,0.7), 0 0 8px ${accent}40`,
          animation: `dust ${p.dur}s linear ${p.delay}s infinite`,
          pointerEvents: 'none',
        }}/>
      ))}

      {/* Layer 5: PLATINO twinkles */}
      {tier === 'PLATINO' && (
        <>
          {[
            { x: '12%', y: '20%', size: 3,   delay: 0   },
            { x: '88%', y: '32%', size: 2,   delay: 0.8 },
            { x: '20%', y: '78%', size: 2,   delay: 1.6 },
            { x: '72%', y: '90%', size: 2.5, delay: 2.4 },
            { x: '50%', y: '12%', size: 1.5, delay: 3.2 },
          ].map((s, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: s.x, top: s.y,
              width: s.size * 2, height: s.size * 2,
              background: `radial-gradient(circle, ${tierColor} 0%, transparent 60%)`,
              borderRadius: '50%',
              animation: `twinkle 3.2s ease-in-out ${s.delay}s infinite`,
              pointerEvents: 'none',
            }}/>
          ))}
        </>
      )}

      {/* Layer 6: corner light glints */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 80, height: 1,
        background: `linear-gradient(90deg, transparent, ${t.light}, ${accent}, transparent)`,
        animation: 'edgeGlint 9s ease-in-out infinite',
        pointerEvents: 'none',
        filter: 'blur(0.5px)',
      }}/>
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 80, height: 1,
        background: `linear-gradient(270deg, transparent, ${t.light}, ${accent}, transparent)`,
        animation: 'edgeGlintRev 9s ease-in-out 4.5s infinite',
        pointerEvents: 'none',
        filter: 'blur(0.5px)',
      }}/>

      {/* ─── CFIEL embossed with chromatic split ─── */}
      <div style={{
        position: 'absolute', top: 12, right: 16,
        display: 'flex', alignItems: 'baseline',
        opacity: 0.85, zIndex: 2,
      }}>
        <span className="bebas" style={{
          fontSize: 12, color: 'var(--indigo)',
          textShadow: `0.5px 0 0 ${accent}80, -0.5px 0 0 #6366F180, 0 1px 0 rgba(0,0,0,0.5)`,
        }}>C</span>
        <span className="bebas" style={{
          fontSize: 12, color: '#fff', letterSpacing: '0.06em',
          textShadow: `0.5px 0 0 ${accent}55, -0.5px 0 0 ${tierColor}55, 0 1px 0 rgba(0,0,0,0.5)`,
        }}>FIEL</span>
      </div>

      {/* ─── content ─── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              position: 'absolute', inset: -2, borderRadius: 12,
              background: `conic-gradient(from 0deg, ${t.light}, ${tierColor}, ${t.shade}, ${tierColor}, ${t.light})`,
              filter: `drop-shadow(0 0 6px ${tierColor}cc)`,
              animation: 'spinSlow 16s linear infinite',
            }}/>
            <div style={{
              position: 'relative', width: 30, height: 30, borderRadius: 10,
              background: 'linear-gradient(135deg, #2a2540, #14121f)',
              border: '1.5px solid #0e0e1a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Bebas Neue', fontSize: 13, color: 'var(--indigo-pale)',
            }}>TP</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="bebas" style={{ fontSize: 10, letterSpacing: '0.28em', color: 'var(--text-muted)', lineHeight: 1 }}>PROGRAMA FIDELIDAD</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3, lineHeight: 1 }}>{program}</div>
          </div>
        </div>

        {/* tier pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 9px 3px 7px',
          borderRadius: 100,
          background: `linear-gradient(135deg, ${tierColor}30, ${accent}18)`,
          border: `1px solid ${tierColor}90`,
          fontFamily: 'Bebas Neue', fontSize: 10, letterSpacing: '0.16em',
          color: t.light,
          boxShadow: `0 0 14px ${tierColor}40, inset 0 1px 0 ${t.light}40`,
          marginBottom: 6,
          textShadow: `0 0 8px ${tierColor}80`,
        }}>
          <TierIcon tier={tier}/>
          NIVEL {tier}
        </div>

        {/* points hero — tier-themed gradient */}
        <div className="bebas" style={{ fontSize: 10, letterSpacing: '0.26em', color: 'var(--text-muted)', marginBottom: 0 }}>
          PUNTOS ACUMULADOS
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <div className="bebas" style={{
            fontSize: 62, lineHeight: 0.9, margin: 0,
            background: NUMBER_BG[tier] || NUMBER_BG.ORO,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 18px ${tierColor}60) drop-shadow(0 1px 1px ${t.shade}80)`,
            letterSpacing: '-0.01em',
          }}>{formatted}</div>
          <div className="bebas" style={{
            fontSize: 16, color: t.light,
            letterSpacing: '0.12em',
            textShadow: `0 0 10px ${tierColor}aa`,
          }}>PTS</div>
        </div>

        {/* progress */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {next
                ? <>Faltan <span className="bebas" style={{ color: t.light, fontSize: 13 }}>{needed.toLocaleString('es-CL')} pts</span> para <span className="bebas" style={{ color: next.color, letterSpacing: '0.1em', fontSize: 13, textShadow: `0 0 8px ${next.color}aa` }}>{t.next}</span></>
                : <>Estás en el <span className="bebas" style={{ color: tierColor, letterSpacing: '0.1em', fontSize: 13, textShadow: `0 0 8px ${tierColor}` }}>nivel máximo</span></>
              }
            </span>
            <span className="bebas" style={{ fontSize: 13, color: next ? next.color : tierColor }}>{pct}%</span>
          </div>
          <div style={{
            height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 100,
            overflow: 'hidden', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              width: `${pct}%`,
              background: next
                ? `linear-gradient(90deg, ${tierColor} 0%, ${accent} 50%, ${next.color} 100%)`
                : `linear-gradient(90deg, ${tierColor} 0%, ${t.light} 50%, #fff 100%)`,
              borderRadius: 100,
              boxShadow: `0 0 10px ${tierColor}aa`,
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

        {/* dashed footer */}
        <div style={{
          marginTop: 12, paddingTop: 10,
          borderTop: `1px dashed ${tierColor}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div className="bebas" style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--text-dim)' }}>ID DE SOCIO</div>
            <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#fff', marginTop: 1, letterSpacing: '0.04em' }}>{code}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 9, color: t.light, fontWeight: 600,
              letterSpacing: '0.10em', textTransform: 'uppercase',
              textShadow: `0 0 6px ${tierColor}aa`,
            }}>Ver QR</span>
            {/* SIM chip with foil gradient + highlight */}
            <div style={{
              width: 32, height: 22, borderRadius: 4,
              background: `linear-gradient(135deg, ${t.light} 0%, ${tierColor} 50%, ${t.shade} 100%)`,
              position: 'relative',
              border: `1px solid ${t.light}40`,
              boxShadow: `inset 0 1px 0 ${t.light}55, 0 0 12px ${tierColor}55`,
            }}>
              <div style={{ position: 'absolute', inset: 4, borderRadius: 2, border: `1px solid ${t.shade}40` }}/>
              <div style={{ position: 'absolute', top: 10, left: 4, right: 4, height: 1, background: t.shade, opacity: 0.5 }}/>
              <div style={{ position: 'absolute', left: 15, top: 4, bottom: 4, width: 1, background: t.shade, opacity: 0.5 }}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tier pill icon
const TierIcon = ({ tier }) => {
  if (tier === 'BRONCE')   return <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 5v6c0 5 3 9 8 11 5-2 8-6 8-11V5l-8-3z"/></svg>;
  if (tier === 'PLATA')    return <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 5v6c0 5 3 9 8 11 5-2 8-6 8-11V5l-8-3z"/></svg>;
  if (tier === 'ORO')      return <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zM5 18h14v2H5z"/></svg>;
  if (tier === 'PLATINO')  return <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>;
  return null;
};

// ───────── promo card ─────────
const PromoCard = () => (
  <div className="card tap-card" style={{
    marginTop: 14,
    display: 'flex', alignItems: 'center', gap: 14,
    background: 'linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(99,102,241,0.10) 40%, rgba(99,102,241,0.04) 100%)',
    border: '1px solid rgba(139,92,246,0.30)',
    animation: 'fadeUp 0.6s cubic-bezier(.2,.8,.2,1) 0.1s both',
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 14,
      background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', flexShrink: 0,
      boxShadow: '0 6px 20px rgba(139,92,246,0.4)',
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="bebas" style={{ fontSize: 11, letterSpacing: '0.28em', color: 'var(--indigo-light)', marginBottom: 2 }}>PROMO ACTIVA</div>
      <div style={{ fontSize: 15, fontWeight: 600 }}>2x1 en cervezas Heineken</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Quedan 3 días · Hasta el <span style={{ color: '#fff' }}>19 may</span></div>
    </div>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  </div>
);

// ───────── streak card (tappable) ─────────
const StreakCard = ({ days = 5, todayPts = 50, onTap }) => {
  const slots = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    if (i < days) return 'done';
    if (i === days) return 'today';
    return 'future';
  }), [days]);

  return (
    <div className="card tap-card" onClick={onTap} style={{
      marginTop: 12,
      animation: 'fadeUp 0.6s cubic-bezier(.2,.8,.2,1) 0.15s both',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'radial-gradient(circle at 50% 60%, rgba(99,102,241,0.35), rgba(99,102,241,0.05))',
          border: '1px solid rgba(99,102,241,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--indigo-light)', flexShrink: 0,
          boxShadow: 'inset 0 0 16px rgba(99,102,241,0.2)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ filter: 'drop-shadow(0 0 6px rgba(99,102,241,0.7))' }}>
            <path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4-.5 2 .5 3 1 3-.5-3 0-7 2-10z"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div className="bebas" style={{ fontSize: 11, letterSpacing: '0.28em', color: 'var(--text-muted)' }}>TU RACHA</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span className="bebas" style={{ fontSize: 32, color: '#fff', lineHeight: 1 }}>{days}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>días seguidos</span>
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 10px',
          borderRadius: 100,
          background: 'rgba(34,197,94,0.12)',
          border: '1px solid rgba(34,197,94,0.35)',
          color: '#4ADE80',
          fontSize: 12, fontWeight: 600,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          +{todayPts} hoy
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {slots.map((state, i) => {
          const label = ['L','M','M','J','V','S','D'][i];
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: '100%', height: 30,
                borderRadius: 8,
                background: state === 'done'
                  ? 'linear-gradient(180deg, #6366F1, #4F46E5)'
                  : state === 'today'
                    ? 'rgba(99,102,241,0.12)'
                    : 'rgba(255,255,255,0.04)',
                border: state === 'today' ? '1.5px solid var(--indigo)' : state === 'done' ? '1px solid rgba(165,180,252,0.4)' : '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: state === 'done' ? '0 4px 12px rgba(99,102,241,0.35)' : state === 'today' ? '0 0 0 4px rgba(99,102,241,0.15)' : 'none',
                animation: state === 'today' ? 'glowPulse 2s ease-in-out infinite' : 'none',
              }}>
                {state === 'done' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                )}
                {state === 'today' && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--indigo)', boxShadow: '0 0 8px var(--indigo)' }}/>
                )}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
                color: state === 'done' ? 'var(--indigo-light)' : state === 'today' ? '#fff' : 'var(--text-dim)',
              }}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ───────── mission card ─────────
const MissionCard = ({ title = 'EL MÁS CHULITO', progress = 0.25, current = 1, total = 4, daysLeft = 8, reward = 300, onTap }) => {
  const pct = Math.round(progress * 100);
  return (
    <div className="card tap-card" onClick={onTap} style={{
      animation: 'fadeUp 0.6s cubic-bezier(.2,.8,.2,1) 0.2s both',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.05))',
          border: '1px solid rgba(99,102,241,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--indigo-light)', flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1.5"/>
            <circle cx="19" cy="21" r="1.5"/>
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="bebas" style={{ fontSize: 20, margin: 0, lineHeight: 1.05, letterSpacing: '0.04em' }}>{title}</h3>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            <span style={{ color: '#fff', fontWeight: 600 }}>{current} de {total}</span> · {daysLeft} días restantes
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '7px 11px',
          borderRadius: 100,
          background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
          color: '#fff',
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 14, letterSpacing: '0.04em',
          boxShadow: '0 4px 14px rgba(99,102,241,0.45)',
        }}>+{reward} PTS</div>
      </div>
      <div style={{
        height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: 'linear-gradient(90deg, #4F46E5, #818CF8)',
          borderRadius: 100,
          boxShadow: '0 0 12px rgba(99,102,241,0.5)',
        }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{pct}% completada</span>
        <span style={{ fontSize: 11, color: 'var(--indigo-light)', fontWeight: 600 }}>Ver detalle →</span>
      </div>
    </div>
  );
};

// ───────── referral CTA ─────────
const ReferralCard = ({ onTap }) => (
  <div className="tap-card" onClick={onTap} style={{
    marginTop: 12,
    position: 'relative', overflow: 'hidden',
    borderRadius: 22,
    padding: 16,
    background: 'linear-gradient(135deg, #2a2540 0%, #14121f 100%)',
    border: '1px solid rgba(139,92,246,0.30)',
    display: 'flex', alignItems: 'center', gap: 14,
    animation: 'fadeUp 0.6s cubic-bezier(.2,.8,.2,1) 0.25s both',
  }}>
    <svg style={{ position: 'absolute', top: -20, right: -10, opacity: 0.4 }} width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="80" cy="40" r="35" stroke="rgba(139,92,246,0.4)" strokeWidth="1" strokeDasharray="2 4"/>
      <circle cx="80" cy="40" r="20" stroke="rgba(139,92,246,0.5)" strokeWidth="1"/>
      <circle cx="80" cy="40" r="6" fill="#8B5CF6"/>
    </svg>
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: 'rgba(139,92,246,0.18)',
      border: '1px solid rgba(139,92,246,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#C4B5FD', flexShrink: 0,
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    </div>
    <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>Trae un amigo</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        Ganas <span className="bebas" style={{ color: '#C4B5FD', fontSize: 15, letterSpacing: '0.04em' }}>+250 PTS</span> por cada referido
      </div>
    </div>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  </div>
);

// ───────── bottom nav ─────────
const BottomNav = ({ active = 'inicio', onChange }) => {
  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: active === 'inicio'
        ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2h-3v-7H10v7H5a2 2 0 0 1-2-2v-9z"/></svg>
        : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></svg>
    },
    { id: 'beneficios', label: 'Beneficios', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    )},
    { id: 'historial', label: 'Historial', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    )},
    { id: 'perfil', label: 'Perfil', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 21a8 8 0 0 1 16 0"/>
      </svg>
    )},
  ];
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <div key={t.id} className={`nav-item ${active === t.id ? 'active' : ''}`} onClick={() => onChange?.(t.id)}>
          <div className="nav-icon">{t.icon}</div>
          <span className="nav-label">{t.label}</span>
        </div>
      ))}
    </nav>
  );
};

// ═══════════════════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════════════════

const Modal = ({ children, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

// ───── QR modal ─────
const QrModal = ({ onClose, userName = 'CARLOS', tier = 'ORO', code = 'CFIEL-F26E0B' }) => (
  <Modal onClose={onClose}>
    <div className="bebas" style={{ fontSize: 11, letterSpacing: '0.32em', color: 'var(--text-muted)', textAlign: 'center' }}>
      TU QR PERSONAL
    </div>
    <div className="bebas" style={{
      fontSize: 34, textAlign: 'center', marginTop: 4, marginBottom: 14,
      background: 'linear-gradient(180deg, #fff, #818CF8)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      letterSpacing: '0.04em',
    }}>{userName}</div>

    {/* QR with corner brackets */}
    <div style={{ position: 'relative', alignSelf: 'center' }}>
      <div style={{
        padding: 14, borderRadius: 18, background: '#fff',
        boxShadow: '0 12px 40px rgba(99,102,241,0.4), 0 0 0 1px rgba(99,102,241,0.3)',
        animation: 'fadeUp 0.5s ease 0.1s both',
      }}>
        <ProceduralQR seed={code} cellSize={9}/>
      </div>
      {/* corner brackets indigo */}
      {[[0,0,'TL'],[1,0,'TR'],[0,1,'BL'],[1,1,'BR']].map(([rx, ry, k]) => (
        <div key={k} style={{
          position: 'absolute',
          width: 22, height: 22,
          [rx === 0 ? 'left' : 'right']: -10,
          [ry === 0 ? 'top' : 'bottom']: -10,
          borderRadius: 6,
          border: '2.5px solid var(--indigo)',
          borderRight: rx === 0 ? '2.5px solid var(--indigo)' : 'none',
          borderLeft:  rx === 1 ? '2.5px solid var(--indigo)' : 'none',
          borderBottom: ry === 0 ? '2.5px solid var(--indigo)' : 'none',
          borderTop:    ry === 1 ? '2.5px solid var(--indigo)' : 'none',
          boxShadow: '0 0 12px rgba(99,102,241,0.5)',
        }}/>
      ))}
    </div>

    {/* meta row */}
    <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
      <div>
        <div className="bebas" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-dim)' }}>ID</div>
        <div style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--text)', marginTop: 2 }}>{code}</div>
      </div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '5px 10px',
        borderRadius: 100,
        background: 'rgba(245,193,108,0.12)',
        border: '1px solid rgba(245,193,108,0.4)',
        fontFamily: 'Bebas Neue', fontSize: 12, letterSpacing: '0.16em',
        color: 'var(--gold)',
      }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zM5 18h14v2H5z"/></svg>
        NIVEL {tier}
      </div>
    </div>

    <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', margin: '14px 0 0', lineHeight: 1.5 }}>
      Muéstralo en caja para sumar puntos a cada compra
    </p>

    <button className="modal-close-pill" onClick={onClose}>Cerrar</button>
  </Modal>
);

// ───── Streak modal ─────
const StreakModal = ({ onClose, days = 5, todayPts = 50, untilDouble = 9 }) => (
  <Modal onClose={onClose}>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, position: 'relative' }}>
      <div style={{
        position: 'absolute', inset: '-20px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.35), transparent 60%)',
        pointerEvents: 'none',
      }}/>
      <div style={{
        width: 64, height: 64, borderRadius: 18,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(99,102,241,0.08))',
        border: '1px solid rgba(99,102,241,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--indigo-light)',
        boxShadow: 'inset 0 0 24px rgba(99,102,241,0.2), 0 8px 24px rgba(99,102,241,0.3)',
        position: 'relative',
        animation: 'float 3s ease-in-out infinite',
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{ filter: 'drop-shadow(0 0 10px rgba(99,102,241,0.8))' }}>
          <path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4-.5 2 .5 3 1 3-.5-3 0-7 2-10z"/>
        </svg>
      </div>
    </div>

    <h2 className="bebas" style={{ fontSize: 30, textAlign: 'center', margin: '8px 0 6px', letterSpacing: '0.03em' }}>
      ¡<span style={{ color: 'var(--indigo-light)' }}>{days}</span> DÍAS SEGUIDOS!
    </h2>
    <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', margin: 0, lineHeight: 1.55 }}>
      Cada día que abres la app sumas puntos bonus<br/>automáticamente. Sigue así.
    </p>

    {/* bonus pill */}
    <div style={{
      marginTop: 18, padding: '14px 18px', borderRadius: 16,
      background: 'rgba(99,102,241,0.10)',
      border: '1.5px solid rgba(99,102,241,0.45)',
      textAlign: 'center',
      boxShadow: 'inset 0 0 24px rgba(99,102,241,0.10)',
    }}>
      <div className="bebas" style={{
        fontSize: 38, lineHeight: 1, color: 'var(--indigo-light)',
        textShadow: '0 0 24px rgba(99,102,241,0.6)',
        letterSpacing: '0.04em',
      }}>+{todayPts} PTS</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Bonus de hoy ya acreditado</div>
    </div>

    {/* milestone */}
    <div style={{
      marginTop: 14, padding: '12px 14px', borderRadius: 14,
      background: 'rgba(245,193,108,0.08)',
      border: '1px dashed rgba(245,193,108,0.35)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--gold)">
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zM5 18h14v2H5z"/>
      </svg>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1 }}>
        <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{untilDouble} días más</span> y desbloqueas <span style={{ color: '#fff', fontWeight: 600 }}>bonus doble</span>
      </div>
    </div>

    <button className="modal-close-pill" onClick={onClose}>¡Vamos!</button>
  </Modal>
);

// ───── Missions modal ─────
const MissionsModal = ({ onClose }) => {
  const missions = [
    { title: 'EL MÁS CHULITO', sub: 'Para los valientes', days: 8, reward: 300, progress: 0.25 },
    { title: 'FIN DE SEMANA', sub: 'Visita 3 días seguidos', days: 5, reward: 200, progress: 0.66 },
    { title: 'AMIGO INFIEL', sub: 'Trae a tu primer referido', days: 30, reward: 500, progress: 0 },
  ];
  return (
    <Modal onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
        <h2 className="bebas" style={{ fontSize: 30, margin: 0, letterSpacing: '0.03em' }}>MISIONES</h2>
        <span className="bebas" style={{ fontSize: 12, letterSpacing: '0.2em', color: 'var(--indigo-light)', marginTop: 8, padding: '4px 10px', background: 'rgba(99,102,241,0.12)', borderRadius: 100, border: '1px solid rgba(99,102,241,0.3)' }}>
          {missions.length} ACTIVAS
        </span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '6px 0 16px' }}>Completa misiones y gana puntos extra</p>

      <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {missions.map((m, i) => {
          const pct = Math.round(m.progress * 100);
          return (
            <div key={i} style={{
              padding: 14, borderRadius: 16,
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.22)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(99,102,241,0.18)',
                  border: '1px solid rgba(99,102,241,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--indigo-light)', flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1.5"/>
                    <circle cx="19" cy="21" r="1.5"/>
                    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="bebas" style={{ fontSize: 16, letterSpacing: '0.04em' }}>{m.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                    {m.sub} · <span style={{ color: '#fff' }}>{m.days} días</span>
                  </div>
                </div>
                <div style={{
                  padding: '4px 9px',
                  borderRadius: 100,
                  background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                  color: '#fff',
                  fontFamily: 'Bebas Neue', fontSize: 13, letterSpacing: '0.04em',
                  boxShadow: '0 4px 10px rgba(99,102,241,0.3)',
                }}>+{m.reward} PTS</div>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: 'linear-gradient(90deg, #4F46E5, #818CF8)',
                  borderRadius: 100,
                  boxShadow: pct > 0 ? '0 0 8px rgba(99,102,241,0.5)' : 'none',
                }}/>
              </div>
            </div>
          );
        })}
      </div>

      <button className="modal-close-pill" onClick={onClose}>Cerrar</button>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════
// REFERIDOS — full screen
// ═══════════════════════════════════════════════════════════
const ReferidosScreen = ({ onBack, code = 'CFIEL-F26E0B' }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      animation: 'fadeUp 0.4s cubic-bezier(.2,.8,.2,1)',
      zIndex: 50,
    }} data-screen-label="Referidos">
      <StatusBar/>

      {/* Header */}
      <div style={{ padding: '6px 20px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
        <button onClick={onBack} style={{
          background: 'transparent', border: 'none', color: '#fff',
          display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
          padding: '8px 4px',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Volver</span>
        </button>
      </div>

      <div style={{ padding: '8px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h1 className="bebas" style={{ fontSize: 36, margin: 0, letterSpacing: '0.04em' }}>REFERIDOS</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>Invita amigos · Ganan ustedes dos</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 100px' }}>
        {/* Invitation code hero */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          borderRadius: 22, padding: 20,
          background: `
            radial-gradient(circle at 100% 0%, rgba(139,92,246,0.30) 0%, transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(99,102,241,0.25) 0%, transparent 55%),
            linear-gradient(135deg, #1a1530 0%, #100f1f 100%)
          `,
          border: '1.5px solid rgba(129,140,248,0.35)',
          boxShadow: '0 16px 48px rgba(99,102,241,0.2)',
        }}>
          <svg style={{ position: 'absolute', top: -10, right: -20, opacity: 0.45 }} width="140" height="140" viewBox="0 0 140 140" fill="none">
            {[0,1,2,3].map(i => (
              <circle key={i} cx="100" cy="40" r={20 + i*14} stroke="rgba(165,180,252,0.25)" strokeWidth="0.8" strokeDasharray={i % 2 ? '2 6' : '0'}/>
            ))}
          </svg>

          <div className="bebas" style={{ fontSize: 11, letterSpacing: '0.32em', color: 'var(--text-muted)' }}>
            TU CÓDIGO DE INVITACIÓN
          </div>
          <div className="bebas" style={{
            fontSize: 38, margin: '6px 0 4px',
            background: 'linear-gradient(90deg, #fff 0%, #818CF8 70%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '0.06em',
            filter: 'drop-shadow(0 0 18px rgba(99,102,241,0.4))',
          }}>{code}</div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 14px' }}>
            Tu amigo recibe <span className="indigo-light" style={{ fontWeight: 600 }}>+200 pts</span> · Tú ganas <span className="indigo-light" style={{ fontWeight: 600 }}>+250 pts</span>
          </p>

          {/* WhatsApp button */}
          <button style={{
            width: '100%', height: 50,
            borderRadius: 14,
            background: 'linear-gradient(180deg, #25D366 0%, #1DA851 100%)',
            color: '#fff', border: 'none', cursor: 'pointer',
            fontFamily: 'DM Sans', fontSize: 15, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 8px 24px rgba(37,211,102,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            Compartir por WhatsApp
          </button>

          {/* Copy code button */}
          <button onClick={handleCopy} style={{
            marginTop: 8, width: '100%', height: 46,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            color: copied ? '#4ADE80' : '#fff',
            cursor: 'pointer',
            fontFamily: 'DM Sans', fontSize: 14, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s ease',
          }}>
            {copied ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Copiado al portapapeles
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copiar código
              </>
            )}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 14 }}>
          {[
            { label: 'INVITADOS', value: 0 },
            { label: 'REGISTRADOS', value: 0 },
            { label: 'PTS GANADOS', value: 0 },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '14px 10px', borderRadius: 16,
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.18)',
              textAlign: 'center',
            }}>
              <div className="bebas" style={{
                fontSize: 36, lineHeight: 1, color: s.value > 0 ? 'var(--indigo-light)' : 'var(--text)',
                textShadow: s.value > 0 ? '0 0 14px rgba(99,102,241,0.5)' : 'none',
              }}>{s.value}</div>
              <div className="bebas" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Friends list / empty state */}
        <div className="section-label" style={{ marginBottom: 8 }}>
          <span>Amigos invitados</span>
        </div>
        <div style={{
          padding: '32px 20px',
          borderRadius: 18,
          background: 'rgba(255,255,255,0.02)',
          border: '1px dashed rgba(99,102,241,0.18)',
          textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'rgba(99,102,241,0.10)',
            border: '1px solid rgba(99,102,241,0.25)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', marginBottom: 12,
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Aún no has invitado amigos</div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>
            Comparte tu código y gana <span className="indigo-light" style={{ fontWeight: 600 }}>250 pts</span> por cada amigo que se registre
          </p>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════════════════════════════
const HomeScreen = ({ userName = 'CARLOS', initialModal = null, initialScreen = 'home', tier = 'ORO', points = 1000 }) => {
  const [modal, setModal] = useState(initialModal); // 'qr' | 'streak' | 'missions' | null
  const [screen, setScreen] = useState(initialScreen); // 'home' | 'referidos'
  const [navTab, setNavTab] = useState('inicio');

  return (
    <div className="home-screen" data-screen-label="Home">
      {/* ambient background glow */}
      <div style={{
        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 60%)',
        pointerEvents: 'none',
      }}/>

      <StatusBar/>
      <TopBar userName={userName}/>

      <div className="home-scroll">
        <PointsCard points={points} tier={tier} onTap={() => setModal('qr')}/>
        <PromoCard/>
        <StreakCard days={5} todayPts={50} onTap={() => setModal('streak')}/>

        <div className="section-label">
          <span>Misión activa</span>
          <span className="right" onClick={() => setModal('missions')}>Ver todas <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span>
        </div>
        <MissionCard onTap={() => setModal('missions')}/>

        <ReferralCard onTap={() => setScreen('referidos')}/>
        <div style={{ height: 12 }}/>
      </div>

      <BottomNav active={navTab} onChange={setNavTab}/>

      {/* Modals */}
      {modal === 'qr' && <QrModal onClose={() => setModal(null)} userName={userName}/>}
      {modal === 'streak' && <StreakModal onClose={() => setModal(null)} days={5}/>}
      {modal === 'missions' && <MissionsModal onClose={() => setModal(null)}/>}

      {/* Referidos full screen */}
      {screen === 'referidos' && <ReferidosScreen onBack={() => setScreen('home')}/>}
    </div>
  );
};

Object.assign(window, { HomeScreen });
