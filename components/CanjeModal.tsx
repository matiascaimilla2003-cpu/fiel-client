'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
  nombre: string;
  puntos: number;
}

export default function CanjeModal({ open, onClose, nombre, puntos }: Props) {
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
            <span style={{ fontSize: 52, display: 'block', marginBottom: 12 }}>🎉</span>

            <div style={{
              fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
              fontSize: 26, color: '#fff', letterSpacing: 1, marginBottom: 7,
            }}>
              ¡CANJEADO!
            </div>

            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 18 }}>
              {nombre} · −{puntos.toLocaleString('es-CL')} pts
            </div>

            {/* Código en verde */}
            <div style={{
              background: '#1a1a1a',
              borderRadius: 20, padding: 15, marginBottom: 16,
              border: '0.5px solid rgba(46,204,113,0.28)',
            }}>
              <div style={{
                fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                fontSize: 26, color: '#2ECC71', letterSpacing: 5,
              }}>
                CFIEL-847
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
                Muéstrale este código al cajero
              </div>
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
              Listo ✓
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
