'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'confirm' | 'loading' | 'success' | 'error';

interface Props {
  open: boolean;
  onClose: () => void;
  nombre: string;
  puntos: number;
  usuarioId: string;
  tenantId: string;
  beneficioId: string;
  onSuccess: (puntosRestantes: number) => void;
}

export default function CanjeModal({
  open, onClose, nombre, puntos,
  usuarioId, tenantId, beneficioId, onSuccess,
}: Props) {
  const [step, setStep]       = useState<Step>('confirm');
  const [codigo, setCodigo]   = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (open) {
      setStep('confirm');
      setCodigo('');
      setErrorMsg('');
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = async () => {
    setStep('loading');
    try {
      const res = await fetch('/api/puntos/canjear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioId,
          tenant_id: tenantId,
          beneficio_id: beneficioId,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Error al canjear. Intenta nuevamente.');
        setStep('error');
        return;
      }

      setCodigo(data.codigo_canje);
      onSuccess(data.puntos_restantes);
      setStep('success');
    } catch {
      setErrorMsg('Sin conexión. Intenta nuevamente.');
      setStep('error');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={step !== 'loading' ? handleClose : undefined}
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
            {/* ── Confirm ── */}
            {step === 'confirm' && (
              <>
                <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🎁</span>
                <div style={{
                  fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                  fontSize: 24, color: '#fff', letterSpacing: 1, marginBottom: 6,
                }}>
                  Confirmar canje
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 18 }}>
                  {nombre}
                </div>
                <div style={{
                  background: '#1a1a1a',
                  borderRadius: 20, padding: '12px 16px', marginBottom: 20,
                  border: '0.5px solid rgba(99,102,241,0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1' }} />
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#818CF8' }}>
                    {puntos.toLocaleString('es-CL')}
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>pts</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleClose}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      color: 'rgba(255,255,255,0.4)',
                      border: '0.5px solid rgba(255,255,255,0.13)',
                      borderRadius: 20, padding: '11px 0',
                      fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirm}
                    style={{
                      flex: 2,
                      background: '#fff', color: '#0a0a0a', border: 'none',
                      borderRadius: 20, padding: '11px 0',
                      fontSize: 13, fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    Confirmar →
                  </button>
                </div>
              </>
            )}

            {/* ── Loading ── */}
            {step === 'loading' && (
              <div style={{ padding: '20px 0' }}>
                <div style={{
                  width: 40, height: 40, margin: '0 auto 16px',
                  border: '3px solid rgba(255,255,255,0.1)',
                  borderTop: '3px solid #6366F1',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                  Procesando canje…
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* ── Success ── */}
            {step === 'success' && (
              <>
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
                <div style={{
                  background: '#1a1a1a',
                  borderRadius: 20, padding: 15, marginBottom: 16,
                  border: '0.5px solid rgba(46,204,113,0.28)',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                    fontSize: 26, color: '#2ECC71', letterSpacing: 5,
                  }}>
                    {codigo}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
                    Muéstrale este código al cajero
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  style={{
                    background: '#fff', color: '#0a0a0a', border: 'none',
                    borderRadius: 20, padding: '12px 36px',
                    fontSize: 14, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Listo ✓
                </button>
              </>
            )}

            {/* ── Error ── */}
            {step === 'error' && (
              <>
                <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>😕</span>
                <div style={{
                  fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                  fontSize: 22, color: '#E74C3C', letterSpacing: 1, marginBottom: 8,
                }}>
                  No se pudo canjear
                </div>
                <div style={{
                  fontSize: 13, color: 'rgba(255,255,255,0.55)',
                  marginBottom: 20, lineHeight: 1.5,
                }}>
                  {errorMsg}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleClose}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      color: 'rgba(255,255,255,0.4)',
                      border: '0.5px solid rgba(255,255,255,0.13)',
                      borderRadius: 20, padding: '11px 0',
                      fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={handleConfirm}
                    style={{
                      flex: 2,
                      background: '#fff', color: '#0a0a0a', border: 'none',
                      borderRadius: 20, padding: '11px 0',
                      fontSize: 13, fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    Reintentar
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
