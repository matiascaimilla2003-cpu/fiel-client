'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
}

const MISSIONS = [
  {
    icon: '🛒',
    title: 'Compra 2 veces',
    desc: '1 de 2 compras',
    pts: '+200 pts',
    progress: 50,
    done: false,
  },
  {
    icon: '📅',
    title: 'Visita jue o vie',
    desc: '✓ ¡Completada!',
    pts: '✓ +150 pts',
    progress: 100,
    done: true,
  },
  {
    icon: '💰',
    title: 'Compra $15.000+',
    desc: '$8.400 / $15.000',
    pts: '+300 pts',
    progress: 56,
    done: false,
  },
];

export default function MisionesModal({ open, onClose }: Props) {
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
              textAlign: 'left',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
              fontSize: 24, color: '#fff', letterSpacing: 1, marginBottom: 4,
            }}>
              Misiones
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 16 }}>
              ⏱ 4 días restantes esta semana
            </div>

            {MISSIONS.map((m, i) => (
              <div
                key={i}
                style={{
                  background: '#1a1a1a',
                  borderRadius: 20,
                  border: `0.5px solid ${m.done ? 'rgba(46,204,113,0.28)' : 'rgba(255,255,255,0.07)'}`,
                  padding: 13,
                  marginBottom: 9,
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', marginBottom: 9,
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
                      {m.icon} {m.title}
                    </div>
                    <div style={{ fontSize: 11, color: m.done ? '#2ECC71' : 'rgba(255,255,255,0.55)' }}>
                      {m.desc}
                    </div>
                  </div>
                  <div style={{
                    background: m.done ? 'rgba(46,204,113,0.1)' : 'rgba(212,168,71,0.12)',
                    border: `0.5px solid ${m.done ? 'rgba(46,204,113,0.28)' : 'rgba(212,168,71,0.28)'}`,
                    borderRadius: 20, padding: '3px 9px',
                    fontSize: 11, fontWeight: 700,
                    color: m.done ? '#2ECC71' : '#F0C96A',
                    whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    {m.pts}
                  </div>
                </div>

                <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: m.done
                      ? '#2ECC71'
                      : 'linear-gradient(90deg, #D4A847, #F0C96A)',
                    borderRadius: 5,
                    width: `${m.progress}%`,
                  }} />
                </div>
              </div>
            ))}

            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <button
                onClick={onClose}
                style={{
                  background: '#fff', color: '#0a0a0a', border: 'none',
                  borderRadius: 20, padding: '11px 32px',
                  fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
