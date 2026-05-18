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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1.5"/>
        <circle cx="19" cy="21" r="1.5"/>
        <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>
      </svg>
    );
  }
  if (tipo === 'monto') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    );
  }
  if (tipo === 'dias') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4-.5 2 .5 3 1 3-.5-3 0-7 2-10z"/>
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="3"/>
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
              maxHeight: '90vh',
            }}
          >
            {/* header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
              <h2 style={{
                fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                fontSize: 30, margin: 0, letterSpacing: '0.03em', color: '#fff',
              }}>
                MISIONES
              </h2>
              {misiones.length > 0 && (
                <span style={{
                  fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                  fontSize: 12, letterSpacing: '0.2em', color: '#818CF8',
                  marginTop: 8, padding: '4px 10px',
                  background: 'rgba(99,102,241,0.12)', borderRadius: 100,
                  border: '1px solid rgba(99,102,241,0.3)',
                }}>
                  {misiones.length} ACTIVAS
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: '#8a8aa3', margin: '6px 0 16px' }}>
              {misiones.length > 0
                ? 'Completa misiones y gana puntos extra'
                : 'No hay misiones activas esta semana'}
            </p>

            {misiones.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#5b5b75' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
            ) : (
              <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {misiones.map(m => {
                  const dias = daysLeft(m.fecha_fin);
                  const desc = [m.descripcion ?? `0 de ${m.meta_valor}`, dias].filter(Boolean).join(' · ');
                  return (
                    <div key={m.id} style={{
                      padding: 14, borderRadius: 16,
                      background: 'rgba(99,102,241,0.06)',
                      border: '1px solid rgba(99,102,241,0.22)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                          background: 'rgba(99,102,241,0.18)',
                          border: '1px solid rgba(99,102,241,0.35)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#818CF8',
                        }}>
                          <MisionIcon tipo={m.meta_tipo}/>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                            fontSize: 16, letterSpacing: '0.04em', color: '#fff',
                          }}>
                            {m.titulo}
                          </div>
                          <div style={{ fontSize: 11, color: '#8a8aa3', marginTop: 1 }}>
                            {desc}
                          </div>
                        </div>
                        <div style={{
                          padding: '4px 9px', borderRadius: 100, flexShrink: 0,
                          background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                          color: '#fff',
                          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                          fontSize: 13, letterSpacing: '0.04em',
                          boxShadow: '0 4px 10px rgba(99,102,241,0.3)',
                        }}>
                          +{m.puntos_premio} PTS
                        </div>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: '0%',
                          background: 'linear-gradient(90deg, #4F46E5, #818CF8)',
                          borderRadius: 100,
                        }}/>
                      </div>
                    </div>
                  );
                })}
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
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
