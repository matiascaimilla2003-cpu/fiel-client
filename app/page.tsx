'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      background: '#0a0a14',
      minHeight: '100dvh',
      maxWidth: 430,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Perspective grid + halos */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>

        {/* Stripe-style perspective grid */}
        <svg style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          width: '100%', height: '70%', opacity: 0.7,
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
            {Array.from({ length: 14 }).map((_, i) => {
              const t = Math.pow(i / 13, 1.8);
              const y = 600 - t * 600;
              return <line key={'h' + i} x1="-200" y1={y} x2="630" y2={y}/>;
            })}
            {Array.from({ length: 21 }).map((_, i) => {
              const xBottom = -200 + (830 / 20) * i;
              return <line key={'v' + i} x1="215" y1="280" x2={xBottom} y2="620"/>;
            })}
          </g>
        </svg>

        {/* Horizon glow line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 'calc(38% - 1px)',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(129,140,248,0.5), transparent)',
          boxShadow: '0 0 24px rgba(99,102,241,0.4)',
        }}/>

        {/* Indigo halo behind wordmark */}
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

      {/* Main content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '0 32px', position: 'relative', zIndex: 2,
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}>

        {/* Wordmark: C (indigo glow) + FIEL (white) */}
        <div style={{
          display: 'inline-flex', alignItems: 'baseline', lineHeight: 1,
          marginBottom: 16,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(.2,.8,.2,1) 0.1s',
        }}>
          <span style={{
            fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
            fontSize: 120, color: '#6366F1', fontWeight: 400,
            textShadow: '0 0 60px rgba(99,102,241,0.6), 0 0 24px rgba(99,102,241,0.4)',
          }}>C</span>
          <span style={{
            fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
            fontSize: 120, color: '#fff', fontWeight: 400,
          }}>FIEL</span>
        </div>

        {/* Eyebrow */}
        <div style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          letterSpacing: '0.5em', fontSize: 12,
          color: 'rgba(255,255,255,0.45)', marginBottom: 64,
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
        }}>
          SISTEMA DE PUNTOS
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 56, lineHeight: 0.95, textAlign: 'center',
          margin: '0 0 20px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.8s cubic-bezier(.2,.8,.2,1) 0.45s',
        }}>
          <span style={{ color: '#fff' }}>CADA COMPRA<br/></span>
          <span style={{
            background: 'linear-gradient(90deg, #fff 0%, #818CF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>TE DA MÁS</span>
        </h1>

        {/* Description */}
        <p style={{
          fontSize: 15, lineHeight: 1.55, textAlign: 'center',
          maxWidth: 300, margin: 0,
          color: 'rgba(255,255,255,0.55)',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.8s ease 0.6s',
        }}>
          Acumula puntos, sube de nivel y canjea<br/>
          beneficios reales en tus locales favoritos.
        </p>
      </div>

      {/* CTAs */}
      <div style={{
        padding: '0 24px 36px',
        display: 'flex', flexDirection: 'column', gap: 10,
        position: 'relative', zIndex: 2,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.8s cubic-bezier(.2,.8,.2,1) 0.75s',
      }}>
        <button
          onClick={() => router.push('/onboarding/slides')}
          style={{
            background: '#6366F1', color: '#fff', border: 'none',
            borderRadius: 100, padding: '16px 24px',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            width: '100%', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          Comenzar gratis
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </button>

        <button
          onClick={() => router.push('/onboarding/registro')}
          style={{
            background: 'transparent', color: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 100, padding: '14px 24px',
            fontSize: 15, fontWeight: 500, cursor: 'pointer',
            width: '100%', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          Ya tengo cuenta
        </button>

        <div style={{ textAlign: 'center', marginTop: 6, fontSize: 12, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.35)' }}>
          Hecho en Chile · Sin tarjetas físicas
        </div>
      </div>
    </div>
  );
}
