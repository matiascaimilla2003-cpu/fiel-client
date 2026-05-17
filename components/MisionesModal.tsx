'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface Mision {
  id: string;
  titulo: string;
  descripcion: string | null;
  puntos_premio: number;
  meta_tipo: string;
  meta_valor: number;
  fecha_fin: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  misiones: Mision[];
}

function MisionIcon({ tipo }: { tipo: string }) {
  if (tipo === 'compras' || tipo === 'visitas') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    );
  }
  if (tipo === 'monto') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    );
  }
  if (tipo === 'dias') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c0 4-4 7-4 11a4 4 0 0 0 8 0c0-4-4-7-4-11z"/>
        <path d="M12 13c0-2 1.5-3 1.5-5"/>
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function daysLeft(fechaFin: string | null): string {
  if (!fechaFin) return '';
  const days = Math.ceil((new Date(fechaFin).getTime() - Date.now()) / 86400000);
  if (days <= 0) return 'Vence hoy';
  return `${days} día${days === 1 ? '' : 's'} restante${days === 1 ? '' : 's'}`;
}

export default function MisionesModal({ open, onClose, misiones }: Props) {
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
              borderRadius: 32, padding: '28px 22px',
              width: '100%', maxWidth: 310,
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
              {misiones.length > 0
                ? 'Completa misiones y gana puntos'
                : 'No hay misiones activas esta semana'}
            </div>

            {misiones.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(255,255,255,0.28)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
            )}

            {misiones.map((m) => {
              const dias = daysLeft(m.fecha_fin);
              const desc = [m.descripcion ?? `0 de ${m.meta_valor}`, dias].filter(Boolean).join(' · ');

              return (
                <div
                  key={m.id}
                  style={{
                    background: '#1a1a1a', borderRadius: 20,
                    border: '0.5px solid rgba(255,255,255,0.07)',
                    padding: 13, marginBottom: 9,
                  }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', marginBottom: 9,
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#818CF8' }}><MisionIcon tipo={m.meta_tipo} /></span>
                        {m.titulo}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
                        {desc}
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(99,102,241,0.12)',
                      border: '0.5px solid rgba(99,102,241,0.28)',
                      borderRadius: 20, padding: '3px 9px',
                      fontSize: 11, fontWeight: 700, color: '#818CF8',
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                      +{m.puntos_premio} pts
                    </div>
                  </div>

                  <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #6366F1, #818CF8)',
                      borderRadius: 5, width: '0%',
                    }} />
                  </div>
                </div>
              );
            })}

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
