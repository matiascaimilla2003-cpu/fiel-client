'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
  streak: number;
  todayPts?: number;
}

export default function StreakModal({ open, onClose, streak, todayPts = 50 }: Props) {
  const untilDouble = Math.max(0, 14 - streak);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(5,5,12,0.7)',
            backdropFilter: 'blur(8px) saturate(140%)',
            WebkitBackdropFilter: 'blur(8px) saturate(140%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, zIndex: 100,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 360,
              background: 'linear-gradient(180deg, #15151f 0%, #0e0e18 100%)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 24, padding: 24,
              boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* flame icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: '-20px',
                background: 'radial-gradient(circle, rgba(99,102,241,0.35), transparent 60%)',
                pointerEvents: 'none',
              }}/>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                style={{
                  width: 64, height: 64, borderRadius: 18,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(99,102,241,0.08))',
                  border: '1px solid rgba(99,102,241,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#818CF8', position: 'relative',
                  boxShadow: 'inset 0 0 24px rgba(99,102,241,0.2), 0 8px 24px rgba(99,102,241,0.3)',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{ filter: 'drop-shadow(0 0 10px rgba(99,102,241,0.8))' }}>
                  <path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4-.5 2 .5 3 1 3-.5-3 0-7 2-10z"/>
                </svg>
              </motion.div>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
              fontSize: 30, textAlign: 'center', margin: '8px 0 6px',
              letterSpacing: '0.03em', color: '#fff',
            }}>
              ¡<span style={{ color: '#818CF8' }}>{streak}</span> DÍAS SEGUIDOS!
            </h2>
            <p style={{ fontSize: 13, color: '#8a8aa3', textAlign: 'center', margin: 0, lineHeight: 1.55 }}>
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
              <div style={{
                fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                fontSize: 38, lineHeight: 1, color: '#818CF8',
                textShadow: '0 0 24px rgba(99,102,241,0.6)',
                letterSpacing: '0.04em',
              }}>
                +{todayPts} PTS
              </div>
              <div style={{ fontSize: 12, color: '#8a8aa3', marginTop: 4 }}>
                Bonus de hoy ya acreditado
              </div>
            </div>

            {/* milestone */}
            {untilDouble > 0 && (
              <div style={{
                marginTop: 14, padding: '12px 14px', borderRadius: 14,
                background: 'rgba(245,193,108,0.08)',
                border: '1px dashed rgba(245,193,108,0.35)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#F5C16C">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zM5 18h14v2H5z"/>
                </svg>
                <div style={{ fontSize: 12, color: '#8a8aa3', flex: 1 }}>
                  <span style={{ color: '#F5C16C', fontWeight: 600 }}>{untilDouble} días más</span>
                  {' '}y desbloqueas{' '}
                  <span style={{ color: '#fff', fontWeight: 600 }}>bonus doble</span>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              style={{
                alignSelf: 'center', marginTop: 16,
                padding: '12px 36px', borderRadius: 100,
                background: '#fff', color: '#0a0a14',
                fontSize: 15, fontWeight: 600,
                border: 'none', cursor: 'pointer',
              }}
            >
              ¡Vamos!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
