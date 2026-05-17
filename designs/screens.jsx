// CFIEL onboarding screens - all 4 screens

const { useState, useEffect, useRef, useMemo } = React;

// ============================================================
// Reusable bits
// ============================================================

const StatusBar = ({ light = true }) => (
  <div className="status-bar">
    <span>9:41</span>
    <div className="icons">
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><path d="M1 8h2v3H1zM5 6h2v5H5zM9 4h2v7H9zM13 2h2v9h-2z" fill="currentColor"/></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1 4.5C3 2.5 5.5 1.5 8 1.5s5 1 7 3M3 7c1.5-1.3 3-2 5-2s3.5.7 5 2M5.5 9.5c.7-.6 1.6-1 2.5-1s1.8.4 2.5 1"/></svg>
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="1" y="1" width="21" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" opacity="0.5"/><rect x="3" y="3" width="17" height="6" rx="1.2" fill="currentColor"/><rect x="23" y="4" width="1.5" height="4" rx="0.5" fill="currentColor" opacity="0.5"/></svg>
    </div>
  </div>
);

// the CFIEL wordmark — the "C" is filled indigo, the rest is white outlined
const CfielMark = ({ size = 88, animate = true }) => (
  <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0, lineHeight: 1 }}>
    <span className="bebas" style={{
      fontSize: size, color: 'var(--indigo)',
      textShadow: animate ? '0 0 60px rgba(99,102,241,0.6), 0 0 24px rgba(99,102,241,0.4)' : 'none',
      fontWeight: 400,
    }}>C</span>
    <span className="bebas" style={{ fontSize: size, color: '#fff', fontWeight: 400 }}>FIEL</span>
  </div>
);

// ============================================================
// SCREEN 1 — SPLASH
// ============================================================

const SplashScreen = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  return (
    <div className="cfiel-screen">
      <StatusBar />

      {/* Stripe-style perspective grid + indigo halo behind the C */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* perspective grid — receding floor */}
        <svg style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '70%',
          opacity: 0.7,
        }} viewBox="0 0 430 600" preserveAspectRatio="xMidYMax slice" fill="none">
          <defs>
            <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(99,102,241,0)"/>
              <stop offset="0.35" stopColor="rgba(99,102,241,0.25)"/>
              <stop offset="1" stopColor="rgba(99,102,241,0.55)"/>
            </linearGradient>
            <mask id="gridMask">
              <rect width="430" height="600" fill="url(#gridFade)"/>
            </mask>
          </defs>
          <g mask="url(#gridMask)" stroke="rgba(129,140,248,0.55)" strokeWidth="0.6">
            {/* horizontal receding lines — get denser toward horizon (top) */}
            {Array.from({length: 14}).map((_, i) => {
              // exponential spacing so lines crowd near the horizon
              const t = Math.pow(i / 13, 1.8);
              const y = 600 - t * 600;
              return <line key={'h'+i} x1="-200" y1={y} x2="630" y2={y}/>;
            })}
            {/* vanishing lines fanning out from a vanishing point at (215, 280) */}
            {Array.from({length: 21}).map((_, i) => {
              const xBottom = -200 + (830 / 20) * i;
              return <line key={'v'+i} x1="215" y1="280" x2={xBottom} y2="620"/>;
            })}
          </g>
        </svg>

        {/* horizon glow line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 'calc(38% - 1px)',
          height: 1, background: 'linear-gradient(90deg, transparent, rgba(129,140,248,0.5), transparent)',
          boxShadow: '0 0 24px rgba(99,102,241,0.4)',
        }}/>

        {/* indigo halo behind the C */}
        <div style={{
          position: 'absolute',
          left: 'calc(50% - 92px)', top: 'calc(38% - 64px)',
          width: 360, height: 360,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(99,102,241,0.45) 0%, rgba(99,102,241,0.16) 28%, transparent 60%)',
          filter: 'blur(12px)',
          animation: 'glowPulse 4s ease-in-out infinite',
        }}/>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '0 32px', position: 'relative', zIndex: 2,
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}>
        {/* Hero mark */}
        <div style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(.2,.8,.2,1) 0.1s',
          marginBottom: 16,
        }}>
          <CfielMark size={120}/>
        </div>

        {/* eyebrow */}
        <div className="bebas" style={{
          letterSpacing: '0.5em', fontSize: 12,
          color: 'var(--text-muted)', marginBottom: 64,
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
        }}>
          SISTEMA DE PUNTOS
        </div>

        {/* headline */}
        <h1 className="bebas" style={{
          fontSize: 56, lineHeight: 0.95, textAlign: 'center',
          margin: '0 0 20px', color: '#fff',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.8s cubic-bezier(.2,.8,.2,1) 0.45s',
        }}>
          CADA COMPRA<br/>
          <span style={{
            background: 'linear-gradient(90deg, #fff 0%, #818CF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>TE DA MÁS</span>
        </h1>

        <p className="muted" style={{
          fontSize: 15, lineHeight: 1.55, textAlign: 'center',
          maxWidth: 300, margin: 0,
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.8s ease 0.6s',
        }}>
          Acumula puntos, sube de nivel y canjea<br/>
          beneficios reales en tus locales favoritos.
        </p>
      </div>

      {/* CTAs */}
      <div style={{
        padding: '0 24px 36px', display: 'flex', flexDirection: 'column', gap: 10,
        position: 'relative', zIndex: 2,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.8s cubic-bezier(.2,.8,.2,1) 0.75s',
      }}>
        <button className="btn-indigo">
          Comenzar gratis
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </button>
        <button className="btn-ghost">Ya tengo cuenta</button>
        <div style={{ textAlign: 'center', marginTop: 6 }} className="dim">
          <span style={{ fontSize: 12, letterSpacing: '0.04em' }}>Hecho en Chile · Sin tarjetas físicas</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SCREEN 2 — SLIDES
// ============================================================

const SlideIllustration1 = () => (
  // Concentric rings with orbiting points
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
    {/* outer halo */}
    <circle cx="120" cy="120" r="118" fill="url(#halo1)"/>
    {/* concentric rings — varying stroke styles */}
    <circle cx="120" cy="120" r="104" stroke="rgba(99,102,241,0.18)" strokeWidth="1" strokeDasharray="1 5"/>
    <circle cx="120" cy="120" r="84"  stroke="rgba(99,102,241,0.28)" strokeWidth="1"/>
    <circle cx="120" cy="120" r="64"  stroke="rgba(129,140,248,0.45)" strokeWidth="1.4" strokeDasharray="3 6"/>
    <circle cx="120" cy="120" r="44"  stroke="rgba(129,140,248,0.7)"  strokeWidth="1.4"/>
    {/* spinning orbit groups */}
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
    {/* glowing core */}
    <circle cx="120" cy="120" r="22" fill="url(#core1)"
      style={{ filter: 'drop-shadow(0 0 14px rgba(99,102,241,0.7))' }}/>
    <circle cx="120" cy="120" r="8" fill="#ffffff" opacity="0.85"/>
  </svg>
);

const SlideIllustration2 = () => (
  // Minimalist isometric 3D gift box with shine
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
    {/* halo */}
    <circle cx="120" cy="130" r="100" fill="url(#halo2)"/>
    {/* ground reflection */}
    <ellipse cx="120" cy="206" rx="70" ry="6" fill="rgba(99,102,241,0.25)" filter="blur(2px)"/>

    {/* isometric box — coordinates designed for a clean isometric look */}
    {/* right face */}
    <path d="M120 116 L184 88 L184 168 L120 196 Z" fill="url(#faceRight)"/>
    {/* left face */}
    <path d="M120 116 L56 88 L56 168 L120 196 Z" fill="url(#faceLeft)"/>
    {/* ribbon vertical strip front-left */}
    <path d="M86 102 L86 182 L96 186 L96 106 Z" fill="#C7D2FE" opacity="0.95"/>
    {/* ribbon vertical strip front-right */}
    <path d="M154 102 L154 182 L144 186 L144 106 Z" fill="#A5B4FC" opacity="0.95"/>
    {/* shine on left face */}
    <path d="M70 95 L100 107 L100 115 L70 103 Z" fill="#ffffff" opacity="0.18"/>

    {/* lid edge (left) */}
    <path d="M120 116 L56 88 L56 78 L120 106 Z" fill="url(#lidEdge)" opacity="0.9"/>
    {/* lid edge (right) */}
    <path d="M120 116 L184 88 L184 78 L120 106 Z" fill="#4338CA"/>
    {/* lid top */}
    <path d="M120 106 L184 78 L120 50 L56 78 Z" fill="url(#lidTop)"/>
    {/* ribbon top diagonal */}
    <path d="M86 92 L120 78 L154 92 L120 106 Z" fill="#C7D2FE" opacity="0.9"/>
    {/* lid top shine */}
    <path d="M120 50 L160 67 L130 79 L100 67 Z" fill="#ffffff" opacity="0.22"/>

    {/* bow */}
    <g transform="translate(120 50)">
      <ellipse cx="-10" cy="-2" rx="10" ry="7" fill="#A5B4FC" transform="rotate(-20)"/>
      <ellipse cx="10"  cy="-2" rx="10" ry="7" fill="#A5B4FC" transform="rotate(20)"/>
      <circle cx="0" cy="0" r="4" fill="#C7D2FE"/>
    </g>

    {/* sparkles */}
    <g stroke="#818CF8" strokeWidth="1.4" strokeLinecap="round" fill="none">
      <path d="M40 40 L40 50 M35 45 L45 45"/>
      <path d="M200 60 L200 68 M196 64 L204 64"/>
      <path d="M204 144 L204 152 M200 148 L208 148"/>
    </g>
    <circle cx="32" cy="126" r="2" fill="#818CF8"/>
    <circle cx="210" cy="96" r="2" fill="#A5B4FC"/>
  </svg>
);

const SlideIllustration3 = () => (
  // Stairway of levels, last step illuminated indigo
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
    {/* halo behind top step */}
    <circle cx="180" cy="60" r="70" fill="url(#topGlow)"/>

    {/* 4 isometric steps, ascending L→R. Each step = top rhombus + front face + side face. */}
    {[0,1,2,3].map(i => {
      // each step is offset right + up
      const dx = i * 38;
      const dy = -i * 30;
      const baseX = 24 + dx;
      const baseY = 170 + dy;
      const w = 44;     // top width
      const d = 18;     // depth (z-offset)
      const h = 24;     // riser height
      const isTop = i === 3;
      const topFill = isTop ? 'url(#stepTop4)' : 'rgba(99,102,241,' + (0.10 + i * 0.05) + ')';
      const topStroke = isTop ? 'none' : 'rgba(99,102,241,' + (0.35 + i * 0.08) + ')';
      const faceFill = isTop ? 'url(#stepFace4)' : 'rgba(99,102,241,' + (0.06 + i * 0.04) + ')';
      const faceStroke = isTop ? 'none' : 'rgba(99,102,241,' + (0.30 + i * 0.07) + ')';
      // top rhombus
      const top = `M${baseX} ${baseY} L${baseX + w} ${baseY - d} L${baseX + w*2} ${baseY} L${baseX + w} ${baseY + d} Z`;
      // front face
      const front = `M${baseX} ${baseY} L${baseX + w} ${baseY + d} L${baseX + w} ${baseY + d + h} L${baseX} ${baseY + h} Z`;
      // right side
      const side = `M${baseX + w} ${baseY + d} L${baseX + w*2} ${baseY} L${baseX + w*2} ${baseY + h} L${baseX + w} ${baseY + d + h} Z`;
      return (
        <g key={i} style={isTop ? { filter: 'drop-shadow(0 0 16px rgba(99,102,241,0.7))' } : {}}>
          {/* right side darker */}
          <path d={side}  fill={isTop ? '#3730A3' : 'rgba(0,0,0,0.35)'} stroke={faceStroke} strokeWidth="1"/>
          <path d={front} fill={faceFill} stroke={faceStroke} strokeWidth="1"/>
          <path d={top}   fill={topFill}  stroke={topStroke}  strokeWidth="1"/>
        </g>
      );
    })}

    {/* light beam from top step */}
    <path d="M180 70 L168 22 L192 22 Z" fill="#A5B4FC" opacity="0.18"/>
    <path d="M180 70 L174 26 L186 26 Z" fill="#C7D2FE" opacity="0.35"/>
    {/* star/spark on top step */}
    <circle cx="180" cy="68" r="2.5" fill="#ffffff"/>
    <g stroke="#A5B4FC" strokeWidth="1.2" strokeLinecap="round">
      <path d="M180 56 L180 62 M180 74 L180 80 M168 68 L174 68 M186 68 L192 68"/>
    </g>
  </svg>
);

const slidesData = [
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

const SlidesScreen = () => {
  const [idx, setIdx] = useState(0);
  const [dragX, setDragX] = useState(0);
  const startX = useRef(null);

  const next = () => idx < 2 ? setIdx(idx + 1) : null;
  const prev = () => idx > 0 ? setIdx(idx - 1) : null;

  const onPointerDown = (e) => { startX.current = e.clientX ?? e.touches?.[0].clientX; };
  const onPointerMove = (e) => {
    if (startX.current == null) return;
    const x = e.clientX ?? e.touches?.[0].clientX;
    setDragX(x - startX.current);
  };
  const onPointerUp = () => {
    if (Math.abs(dragX) > 60) {
      if (dragX < 0) next();
      else prev();
    }
    startX.current = null;
    setDragX(0);
  };

  const slide = slidesData[idx];
  const Illu = slide.illu;

  return (
    <div className="cfiel-screen">
      <StatusBar/>

      {/* Top bar — skip top-right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 24px 0' }}>
        <div className="bebas indigo-light" style={{ fontSize: 14, letterSpacing: '0.3em' }}>
          CFIEL
        </div>
        <button style={{
          background: 'transparent', border: 'none', color: 'var(--text-muted)',
          fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '6px 0',
        }}>Omitir</button>
      </div>

      {/* slide content w/ swipe */}
      <div
        style={{ flex: 1, display: 'flex', flexDirection: 'column', userSelect: 'none', touchAction: 'pan-y' }}
        onMouseDown={onPointerDown} onMouseMove={onPointerMove} onMouseUp={onPointerUp} onMouseLeave={onPointerUp}
        onTouchStart={onPointerDown} onTouchMove={onPointerMove} onTouchEnd={onPointerUp}
      >
        <div key={idx} style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          padding: '24px 32px 0',
          transform: `translateX(${dragX * 0.4}px)`,
          animation: 'fadeUp 0.5s cubic-bezier(.2,.8,.2,1)',
        }}>
          {/* illustration */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, marginBottom: 36 }}>
            <Illu/>
          </div>

          {/* eyebrow */}
          <div className="bebas indigo-light" style={{
            fontSize: 12, letterSpacing: '0.32em', marginBottom: 12, textAlign: 'left',
          }}>{slide.eyebrow}</div>

          {/* title */}
          <h2 className="bebas" style={{
            fontSize: 44, lineHeight: 0.95, margin: '0 0 16px', whiteSpace: 'pre-line',
          }}>{slide.title}</h2>

          {/* body */}
          <p className="muted" style={{ fontSize: 15, lineHeight: 1.55, margin: '0 0 28px' }}>{slide.body}</p>

          {/* proof / list / tier */}
          {slide.proof && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="bebas" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--text-dim)', marginBottom: 4 }}>{slide.proof.label}</div>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{slide.proof.a}</div>
              </div>
              <div className="bebas indigo-light" style={{ fontSize: 26 }}>{slide.proof.b}</div>
            </div>
          )}
          {slide.list && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 18 }}>
              {slide.list.map((it, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < slide.list.length - 1 ? 10 : 0, borderBottom: i < slide.list.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ fontSize: 15 }}>{it.name}</span>
                  <span className="bebas indigo-light" style={{ fontSize: 18, letterSpacing: '0.04em' }}>{it.value}</span>
                </div>
              ))}
            </div>
          )}
          {slide.tier && (
            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="muted" style={{ fontSize: 12, letterSpacing: '0.18em' }}>TU NIVEL</span>
                <span className="bebas indigo-light" style={{ fontSize: 20 }}>{slide.tier.current}</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['BRONCE','PLATA','ORO','PLATINO'].map((n, i) => (
                  <div key={n} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{
                      height: 4, borderRadius: 100,
                      background: i <= 2 ? 'linear-gradient(90deg, #4F46E5, #818CF8)' : 'rgba(255,255,255,0.08)',
                      marginBottom: 6,
                    }}/>
                    <div className="bebas" style={{
                      fontSize: 10, letterSpacing: '0.16em',
                      color: i === 2 ? 'var(--indigo-light)' : 'var(--text-dim)',
                    }}>{n}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* dots indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '8px 0 16px' }}>
        {[0,1,2].map(i => (
          <div key={i} onClick={() => setIdx(i)} style={{
            cursor: 'pointer',
            height: 6,
            width: i === idx ? 28 : 6,
            borderRadius: 100,
            background: i === idx ? 'var(--indigo)' : 'rgba(255,255,255,0.12)',
            transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
            boxShadow: i === idx ? '0 0 16px rgba(99,102,241,0.6)' : 'none',
          }}/>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '0 24px 36px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn-primary" onClick={next} disabled={false}>
          {idx < 2 ? 'Siguiente' : 'Crear cuenta'}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </button>
        <button className="btn-ghost" onClick={prev} disabled={idx === 0} style={idx === 0 ? { opacity: 0.5 } : {}}>
          {idx === 0 ? 'Omitir' : 'Atrás'}
        </button>
      </div>
    </div>
  );
};

// ============================================================
// SCREEN 3 — REGISTRO (4 pasos)
// ============================================================

const RegistroScreen = () => {
  const [step, setStep] = useState(0); // 0..3
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birth, setBirth] = useState({ d: '', m: '', y: '' });
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpRefs = useRef([]);

  const validators = [
    () => name.trim().length >= 2,
    () => phone.replace(/\s/g,'').length >= 8,
    () => birth.d && birth.m && birth.y && +birth.y >= 1900,
    () => otp.every(c => c.length === 1),
  ];
  const canContinue = validators[step]();

  const next = () => canContinue && step < 3 && setStep(step + 1);
  const back = () => step > 0 ? setStep(step - 1) : null;

  const handleOtp = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const arr = [...otp]; arr[i] = val; setOtp(arr);
    if (val && i < 3) otpRefs.current[i+1]?.focus();
  };

  const stepLabels = ['NOMBRE', 'TELÉFONO', 'NACIMIENTO', 'VERIFICACIÓN'];
  const stepHelpers = [
    'Así te saludaremos cuando entres.',
    'Te enviaremos un código por SMS. Sin spam, prometido.',
    'Usamos esto para regalos en tu mes.',
    'Ingresa el código de 4 dígitos que enviamos.',
  ];

  return (
    <div className="cfiel-screen">
      <StatusBar/>

      {/* Header: back + close */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 24px' }}>
        <button onClick={back} style={{
          background: 'transparent', border: 'none', color: 'var(--text)',
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
          padding: 4, opacity: step === 0 ? 0.4 : 1,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Volver</span>
        </button>
        <div className="bebas muted" style={{ fontSize: 12, letterSpacing: '0.2em' }}>
          {step+1} <span style={{ opacity: 0.4 }}>/ 4</span>
        </div>
      </div>

      {/* Title + progress */}
      <div style={{ padding: '12px 24px 24px' }}>
        <div className="bebas indigo-light" style={{ fontSize: 12, letterSpacing: '0.32em', marginBottom: 6 }}>
          PASO {step+1} · {stepLabels[step]}
        </div>
        <h1 className="bebas" style={{ fontSize: 42, lineHeight: 0.95, margin: '0 0 6px' }}>CREAR CUENTA</h1>
        <p className="muted" style={{ fontSize: 14, margin: 0 }}>Menos de 1 minuto · 4 pasos rápidos</p>

        {/* 4-segment progress */}
        <div className="seg-progress" style={{ marginTop: 24 }}>
          {[0,1,2,3].map(i => (
            <div className="seg-bar" key={i}>
              <div className="seg-bar-fill" style={{
                transform: i < step ? 'scaleX(1)' : i === step ? 'scaleX(1)' : 'scaleX(0)',
                opacity: i <= step ? 1 : 0,
                background: i < step
                  ? 'linear-gradient(90deg, #4F46E5, #6366F1)'
                  : 'linear-gradient(90deg, #6366F1, #818CF8, #6366F1)',
                backgroundSize: i === step ? '200% 100%' : '100% 100%',
                animation: i === step ? 'shimmer 2s linear infinite' : 'none',
              }}/>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div style={{ flex: 1, padding: '12px 24px', overflow: 'hidden' }}>
        <div key={step} style={{ animation: 'fadeUp 0.4s cubic-bezier(.2,.8,.2,1)' }}>
          {step === 0 && (
            <div className="input-wrap">
              <label className="input-label">Tu nombre</label>
              <input className="input-field" placeholder="Ej: Carlos Morales" value={name} onChange={(e) => setName(e.target.value)} autoFocus/>
              <span className="input-help">{stepHelpers[0]}</span>

              <div style={{ height: 8 }}/>

              <label className="input-label">¿Tienes un código de invitación? <span style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--text-dim)' }}>(opcional)</span></label>
              <input className="input-field" placeholder="Ej: CFIEL-04863C"/>
            </div>
          )}

          {step === 1 && (
            <div className="input-wrap">
              <label className="input-label">Tu teléfono</label>
              <div style={{
                display: 'flex', alignItems: 'center',
                height: 64, background: 'rgba(255,255,255,0.02)',
                border: '1px solid ' + (phone ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.06)'),
                borderRadius: 16, padding: '0 20px', gap: 14,
                transition: 'all 0.2s ease',
                boxShadow: phone ? '0 0 0 4px rgba(99,102,241,0.12)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingRight: 14, borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{
                    width: 22, height: 16, borderRadius: 2,
                    background: 'linear-gradient(180deg, #fff 50%, #D52B1E 50%)',
                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)',
                    position: 'relative',
                  }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: 9, height: 8, background: '#0033A0' }}/>
                    <div style={{ position: 'absolute', top: 2, left: 3, width: 3, height: 3, background: '#fff', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}/>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>+56</span>
                </div>
                <input
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 18, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}
                  placeholder="9 8765 4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, ''))}
                />
                {phone && validators[1]() && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                )}
              </div>
              <span className="input-help">{stepHelpers[1]}</span>
            </div>
          )}

          {step === 2 && (
            <div className="input-wrap">
              <label className="input-label">Fecha de nacimiento</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input className="input-field" placeholder="DD" maxLength={2} style={{ textAlign: 'center', flex: 1 }} value={birth.d} onChange={(e) => setBirth({...birth, d: e.target.value.replace(/\D/g,'')})}/>
                <input className="input-field" placeholder="MM" maxLength={2} style={{ textAlign: 'center', flex: 1 }} value={birth.m} onChange={(e) => setBirth({...birth, m: e.target.value.replace(/\D/g,'')})}/>
                <input className="input-field" placeholder="AAAA" maxLength={4} style={{ textAlign: 'center', flex: 1.5 }} value={birth.y} onChange={(e) => setBirth({...birth, y: e.target.value.replace(/\D/g,'')})}/>
              </div>
              <span className="input-help">{stepHelpers[2]}</span>
              <div style={{ marginTop: 12, padding: '14px 16px', borderRadius: 14, background: 'rgba(99,102,241,0.06)', border: '1px dashed rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="8" width="18" height="13" rx="2"/>
                  <path d="M12 8V4M8 4h8M3 13h18"/>
                </svg>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Te enviaremos <span className="indigo-light" style={{ fontWeight: 600 }}>+500 pts</span> el día de tu cumpleaños.</span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="input-wrap">
              <label className="input-label">Código de verificación</label>
              <p style={{ fontSize: 14, margin: 0, color: 'var(--text-muted)' }}>
                Enviamos un SMS al <span style={{ color: '#fff', fontWeight: 600 }}>+56 9 {phone || '8765 4321'}</span>
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                {[0,1,2,3].map(i => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    className={`otp-input ${otp[i] ? 'filled' : ''}`}
                    value={otp[i]}
                    onChange={(e) => handleOtp(i, e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i-1]?.focus(); }}
                    maxLength={1}
                    inputMode="numeric"
                  />
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                <span className="input-help">¿No llegó?</span>
                <button style={{ background: 'transparent', border: 'none', color: 'var(--indigo-light)', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  Reenviar
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M3 12a9 9 0 0 1 15-6.7M21 4v5h-5M21 12a9 9 0 0 1-15 6.7M3 20v-5h5"/></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 24px 36px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button className="btn-primary" disabled={!canContinue} onClick={next}>
          {step === 3 ? 'Confirmar código' : 'Continuar'}
          {canContinue && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>}
        </button>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-dim)' }}>
          Al continuar aceptas los <span className="indigo-light" style={{ fontWeight: 600 }}>Términos de uso</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SCREEN 4 — BIENVENIDA
// ============================================================

const ConfettiPiece = ({ x, delay, color, shape, dx, rot, size }) => {
  const styles = {
    position: 'absolute',
    left: x + '%',
    top: -20,
    width: size,
    height: shape === 'bar' ? size * 0.35 : size,
    background: color,
    borderRadius: shape === 'circle' ? '50%' : shape === 'bar' ? 2 : 2,
    transform: shape === 'diamond' ? 'rotate(45deg)' : 'none',
    animation: `fall ${4 + Math.random()*3}s linear ${delay}s infinite`,
    '--dx': dx + 'px',
    '--rot': rot + 'deg',
    opacity: 0.85,
  };
  return <div style={styles}/>;
};

const Confetti = () => {
  const pieces = useMemo(() => {
    const colors = ['#6366F1', '#818CF8', '#A5B4FC', '#ffffff', '#4F46E5'];
    const shapes = ['rect','circle','diamond','bar'];
    return Array.from({ length: 36 }, (_, i) => ({
      key: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random()*colors.length)],
      shape: shapes[Math.floor(Math.random()*shapes.length)],
      dx: (Math.random() - 0.5) * 240,
      rot: (Math.random() - 0.5) * 1440,
      size: 5 + Math.random() * 9,
    }));
  }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {pieces.map(p => <ConfettiPiece {...p}/>)}
    </div>
  );
};

const BienvenidaScreen = ({ userName = 'CARLOS' }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const achievements = [
    {
      title: 'Bono de bienvenida',
      sub: 'Puntos para empezar ya',
      value: '+200',
      unit: 'pts',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
        </svg>
      ),
    },
    {
      title: 'Racha activada',
      sub: 'Abre la app cada día',
      value: 'DÍA',
      unit: '1',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4-.5 2 .5 3 1 3-.5-3 0-7 2-10z"/>
        </svg>
      ),
    },
    {
      title: 'Misión de inicio',
      sub: 'Haz tu primera compra',
      value: '+300',
      unit: 'pts',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1.5"/>
          <circle cx="19" cy="21" r="1.5"/>
          <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="cfiel-screen">
      <StatusBar/>
      <Confetti/>

      {/* Background halo */}
      <div style={{
        position: 'absolute', left: '50%', top: 220,
        transform: 'translate(-50%, -50%)',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 60%)',
        filter: 'blur(20px)',
        pointerEvents: 'none',
      }}/>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 24px', position: 'relative', zIndex: 2 }}>

        {/* tiny eyebrow */}
        <div className="bebas" style={{
          fontSize: 12, letterSpacing: '0.4em', color: 'var(--text-muted)', textAlign: 'center',
          marginTop: 24,
          opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 0.15s',
        }}>CUENTA CREADA · BIENVENIDO</div>

        {/* name as the protagonist — big bebas with indigo glow halo behind */}
        <div style={{
          position: 'relative',
          display: 'flex', justifyContent: 'center',
          marginTop: 16, marginBottom: 8,
        }}>
          {/* glow halo */}
          <div style={{
            position: 'absolute', inset: '-40px -20px',
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.45) 0%, rgba(99,102,241,0.12) 35%, transparent 65%)',
            filter: 'blur(8px)',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 1s ease 0.2s',
            pointerEvents: 'none',
          }}/>
          {/* secondary smaller halo for punch */}
          <div style={{
            position: 'absolute', inset: '-10px 30px',
            background: 'radial-gradient(ellipse at center, rgba(129,140,248,0.4) 0%, transparent 70%)',
            filter: 'blur(4px)',
            opacity: mounted ? 0.7 : 0,
            animation: mounted ? 'glowPulse 3.5s ease-in-out infinite' : 'none',
            pointerEvents: 'none',
          }}/>
          <h1 className="bebas" style={{
            fontSize: 88, lineHeight: 0.9, margin: 0, position: 'relative',
            background: 'linear-gradient(180deg, #C7D2FE 0%, #818CF8 50%, #6366F1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 60px rgba(99,102,241,0.6)',
            letterSpacing: '0.02em',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.94)',
            transition: 'all 0.9s cubic-bezier(.2,.9,.3,1) 0.3s',
            filter: 'drop-shadow(0 0 24px rgba(99,102,241,0.4))',
          }}>{userName}</h1>
        </div>

        <p className="muted" style={{
          fontSize: 14, lineHeight: 1.55, margin: '8px auto 0', maxWidth: 320, textAlign: 'center',
          opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 0.6s',
        }}>
          Tu cuenta está lista. Estos tres regalos te están esperando.
        </p>

        {/* achievements — indigo-edge cards, big indigo number on right, opening-a-chest stagger */}
        <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {achievements.map((a, i) => (
            <div key={i} style={{
              position: 'relative',
              background: 'linear-gradient(180deg, rgba(99,102,241,0.14) 0%, rgba(99,102,241,0.04) 100%)',
              border: '1.5px solid rgba(129,140,248,0.55)',
              borderRadius: 18,
              padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 12px 32px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.95)',
              transition: `all 0.7s cubic-bezier(.2,1.2,.3,1) ${0.9 + i * 0.22}s`,
            }}>
              {/* inner top-edge highlight */}
              <div style={{
                position: 'absolute', top: 0, left: 16, right: 16, height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(165,180,252,0.6), transparent)',
              }}/>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(99,102,241,0.15))',
                border: '1px solid rgba(129,140,248,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#C7D2FE',
                flexShrink: 0,
                boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
              }}>{a.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{a.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{a.sub}</div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="bebas" style={{
                  fontSize: 36, lineHeight: 1, color: '#818CF8',
                  letterSpacing: '0.02em',
                  textShadow: '0 0 16px rgba(99,102,241,0.6)',
                }}>{a.value}</span>
                <span className="bebas" style={{ fontSize: 13, color: 'var(--indigo-light)', opacity: 0.7 }}>{a.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }}/>

        {/* CTA */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 10,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(.2,.8,.2,1) 1.7s',
        }}>
          <button className="btn-indigo">
            Ir a mi cuenta
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </button>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-dim)' }}>
            Tu primer punto está esperando.
          </div>
        </div>
      </div>
    </div>
  );
};

// Expose globally
Object.assign(window, {
  SplashScreen, SlidesScreen, RegistroScreen, BienvenidaScreen,
});
