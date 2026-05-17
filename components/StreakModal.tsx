'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
  streak: number;
}

export default function StreakModal({ open, onClose, streak }: Props) {
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
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, zIndex: 50,
          }}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#141414',
              border: '0.5px solid rgba(255,255,255,0.13)',
              borderRadius: 32,
              padding: '28px 22px',
              width: '100%',
              maxWidth: 310,
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2c0 4-4 7-4 11a4 4 0 0 0 8 0c0-4-4-7-4-11z"/>
                <path d="M12 13c0-2 1.5-3 1.5-5"/>
              </svg>
            </div>

            <div style={{
              fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
              fontSize: 26, color: '#fff', letterSpacing: 1, marginBottom: 7,
            }}>
              ¡{streak} DÍAS SEGUIDOS!
            </div>

            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 18, lineHeight: 1.55 }}>
              Cada día que abres la app sumas puntos bonus automáticamente. ¡Sigue así!
            </div>

            <div style={{
              background: '#1a1a1a',
              borderRadius: 20, padding: 15, marginBottom: 16,
              border: '0.5px solid rgba(99,102,241,0.28)',
            }}>
              <div style={{
                fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                fontSize: 34, color: '#818CF8', letterSpacing: 1,
              }}>
                +50 PTS
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
                bonus de hoy ya acreditados
              </div>
            </div>

            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginBottom: 16 }}>
              14 días seguidos → bonus doble
            </div>

            <button
              onClick={onClose}
              style={{
                background: '#fff', color: '#0a0a0a', border: 'none',
                borderRadius: 20, padding: '12px 36px',
                fontSize: 14, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
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
