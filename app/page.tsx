'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const RING_SIZES = [200, 310, 440];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: 'easeOut' as const },
});

export default function SplashPage() {
  const router = useRouter();

  return (
    <div style={{
      background: '#0a0a0a',
      minHeight: '100dvh',
      maxWidth: 430,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 32px 48px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Anillos concéntricos dorados decorativos */}
      {RING_SIZES.map((size) => (
        <div
          key={size}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            border: '0.5px solid rgba(212,168,71,0.12)',
            top: '38%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Logo CFIEL — C en dorado */}
      <motion.div
        {...fadeUp(0)}
        style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 80,
          lineHeight: 1,
          letterSpacing: 6,
          marginBottom: 6,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <span style={{ color: '#6366F1' }}>C</span>
        <span style={{ color: '#fff' }}>FIEL</span>
      </motion.div>

      {/* Subtítulo espaciado */}
      <motion.div
        {...fadeUp(0.1)}
        style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.28)',
          letterSpacing: 3,
          textTransform: 'uppercase',
          marginBottom: 44,
          position: 'relative',
          zIndex: 2,
        }}
      >
        Sistema de Puntos
      </motion.div>

      {/* Headline Bebas Neue */}
      <motion.div
        {...fadeUp(0.2)}
        style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 36,
          color: '#fff',
          letterSpacing: 1,
          lineHeight: 1.0,
          marginBottom: 12,
          position: 'relative',
          zIndex: 2,
        }}
      >
        Cada compra<br />te da más
      </motion.div>

      {/* Descripción */}
      <motion.p
        {...fadeUp(0.3)}
        style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.65,
          margin: '0 0 48px',
          maxWidth: 280,
          position: 'relative',
          zIndex: 2,
        }}
      >
        Acumula puntos, sube de nivel y canjea beneficios reales. Sin app extra, sin complicaciones.
      </motion.p>

      {/* Botones */}
      <motion.div
        {...fadeUp(0.4)}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <button
          onClick={() => router.push('/onboarding/slides')}
          style={{
            background: '#fff',
            color: '#0a0a0a',
            border: 'none',
            borderRadius: 28,
            padding: 15,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            width: '100%',
            letterSpacing: '0.2px',
            fontFamily: 'inherit',
          }}
        >
          Comenzar gratis →
        </button>
        <button
          onClick={() => router.push('/onboarding/registro')}
          style={{
            background: 'transparent',
            color: 'rgba(255,255,255,0.55)',
            border: '0.5px solid rgba(255,255,255,0.13)',
            borderRadius: 28,
            padding: 14,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            width: '100%',
            fontFamily: 'inherit',
          }}
        >
          Ya tengo cuenta
        </button>
      </motion.div>
    </div>
  );
}
