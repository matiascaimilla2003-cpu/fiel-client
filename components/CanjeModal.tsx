'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BEBAS = 'var(--font-bebas), "Bebas Neue", sans-serif';

type Step = 'confirm' | 'loading' | 'success' | 'error';

interface Props {
  open: boolean;
  onClose: () => void;
  nombre: string;
  puntos: number;
  usuarioId: string;
  tenantId: string;
  beneficioId: string;
  userPoints?: number;
  onSuccess: (puntosRestantes: number) => void;
}

export default function CanjeModal({
  open, onClose, nombre, puntos,
  usuarioId, tenantId, beneficioId, userPoints, onSuccess,
}: Props) {
  const [step, setStep]         = useState<Step>('confirm');
  const [codigo, setCodigo]     = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (open) {
      setStep('confirm');
      setCodigo('');
      setErrorMsg('');
    }
  }, [open]);

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

  const afterPts = (userPoints ?? 0) - puntos;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={step !== 'loading' ? onClose : undefined}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(5,5,12,0.7)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, zIndex: 50,
          }}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(180deg, #15151f, #0e0e18)',
              border: '1px solid rgba(99,102,241,0.22)',
              borderRadius: 28,
              padding: '32px 22px',
              width: '100%',
              maxWidth: 320,
              textAlign: 'center',
            }}
          >

            {/* ── Confirm ── */}
            {step === 'confirm' && (
              <>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                  <div style={{
                    position: 'absolute', inset: -16,
                    background: 'radial-gradient(circle, rgba(99,102,241,0.35), transparent 65%)',
                    pointerEvents: 'none',
                  }}/>
                  <div style={{
                    width: 64, height: 64, borderRadius: 18, position: 'relative',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(99,102,241,0.10))',
                    border: '1px solid rgba(99,102,241,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#818CF8',
                    boxShadow: 'inset 0 0 20px rgba(99,102,241,0.25), 0 8px 28px rgba(99,102,241,0.35)',
                    animation: 'float 3s ease-in-out infinite',
                  }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                    </svg>
                  </div>
                </div>

                <div style={{ fontFamily: BEBAS, fontSize: 28, color: '#fff', letterSpacing: '0.04em', marginBottom: 4 }}>
                  CONFIRMAR CANJE
                </div>
                <div style={{ fontSize: 14, color: '#8a8aa3', marginBottom: 18 }}>
                  {nombre}
                </div>

                <div style={{
                  padding: '14px 18px', borderRadius: 14,
                  background: 'rgba(99,102,241,0.08)',
                  border: '1.5px solid rgba(99,102,241,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: 'inset 0 0 18px rgba(99,102,241,0.10)',
                  marginBottom: 10,
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#6366F1', boxShadow: '0 0 10px #6366F1', flexShrink: 0,
                    display: 'inline-block',
                  }}/>
                  <span style={{
                    fontFamily: BEBAS, fontSize: 28, lineHeight: 1,
                    color: '#818CF8', letterSpacing: '0.04em',
                    textShadow: '0 0 14px rgba(99,102,241,0.5)',
                  }}>{puntos.toLocaleString('es-CL')}</span>
                  <span style={{ fontSize: 13, color: '#8a8aa3', fontWeight: 500 }}>pts</span>
                </div>

                {userPoints != null && (
                  <div style={{
                    padding: '10px 14px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: 12, color: '#8a8aa3', marginBottom: 18,
                  }}>
                    <span>Saldo actual</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{userPoints.toLocaleString('es-CL')}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 5l7 7-7 7"/>
                      </svg>
                      <span style={{ fontFamily: BEBAS, fontSize: 16, color: '#818CF8' }}>{afterPts.toLocaleString('es-CL')} pts</span>
                    </span>
                  </div>
                )}

                {!userPoints && <div style={{ marginBottom: 18 }}/>}

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={onClose}
                    style={{
                      flex: 1,
                      background: 'transparent', color: '#8a8aa3',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 100, padding: '13px 0',
                      fontSize: 14, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >Cancelar</button>
                  <button
                    onClick={handleConfirm}
                    style={{
                      flex: 1.4,
                      background: '#fff', color: '#0a0a0a', border: 'none',
                      borderRadius: 100, padding: '13px 0',
                      fontSize: 14, fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'inherit',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                  >
                    Confirmar
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </>
            )}

            {/* ── Loading ── */}
            {step === 'loading' && (
              <div style={{ padding: '28px 0' }}>
                <div style={{
                  width: 44, height: 44, margin: '0 auto 16px',
                  border: '3px solid rgba(255,255,255,0.08)',
                  borderTop: '3px solid #6366F1',
                  borderRadius: '50%',
                  animation: 'spinSlow 0.8s linear infinite',
                }}/>
                <div style={{ fontSize: 13, color: '#8a8aa3' }}>Procesando canje…</div>
              </div>
            )}

            {/* ── Success ── */}
            {step === 'success' && (
              <>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 16, height: 96 }}>
                  {[0, 0.5, 1.0].map((d, i) => (
                    <div key={i} style={{
                      position: 'absolute', top: '50%', left: '50%',
                      width: 96, height: 96,
                      border: '1.5px solid #6366F1',
                      borderRadius: '50%',
                      marginLeft: -48, marginTop: -48,
                      animation: `ringExpand 2.2s ease-out ${d}s infinite`,
                      pointerEvents: 'none',
                    }}/>
                  ))}
                  <div style={{
                    width: 76, height: 76, borderRadius: '50%',
                    position: 'absolute', top: '50%', left: '50%',
                    marginLeft: -38, marginTop: -38, zIndex: 1,
                    background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 16px 48px rgba(99,102,241,0.5), inset 0 0 0 1px rgba(255,255,255,0.15)',
                    animation: 'scaleIn 0.5s cubic-bezier(.2,1.4,.4,1)',
                  }}>
                    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                </div>

                <div style={{ fontFamily: BEBAS, fontSize: 26, color: '#fff', letterSpacing: '0.04em', marginBottom: 4 }}>
                  ¡CANJE EXITOSO!
                </div>
                <div style={{ fontSize: 13, color: '#8a8aa3', marginBottom: 18, lineHeight: 1.55 }}>
                  Muestra este código en caja para reclamar tu{' '}
                  <span style={{ color: '#fff', fontWeight: 600 }}>{nombre}</span>
                </div>

                <div style={{
                  padding: '14px 18px', borderRadius: 14,
                  background: 'rgba(99,102,241,0.10)',
                  border: '1.5px dashed rgba(99,102,241,0.45)',
                  textAlign: 'center', marginBottom: 18,
                }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#5b5b75', fontWeight: 600 }}>TU CÓDIGO</div>
                  <div style={{
                    fontFamily: BEBAS, fontSize: 28, marginTop: 4,
                    color: '#818CF8', letterSpacing: '0.06em',
                    textShadow: '0 0 16px rgba(99,102,241,0.5)',
                  }}>{codigo}</div>
                  <div style={{ fontSize: 11, color: '#8a8aa3', marginTop: 4 }}>Vence en 7 días</div>
                </div>

                <button
                  onClick={onClose}
                  style={{
                    width: '100%',
                    background: '#fff', color: '#0a0a0a', border: 'none',
                    borderRadius: 100, padding: '14px 0',
                    fontSize: 15, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >Listo</button>
              </>
            )}

            {/* ── Error ── */}
            {step === 'error' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'rgba(231,76,60,0.12)',
                    border: '1px solid rgba(231,76,60,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  </div>
                </div>
                <div style={{ fontFamily: BEBAS, fontSize: 22, color: '#E74C3C', letterSpacing: '0.04em', marginBottom: 8 }}>
                  No se pudo canjear
                </div>
                <div style={{ fontSize: 13, color: '#8a8aa3', marginBottom: 22, lineHeight: 1.5 }}>
                  {errorMsg}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={onClose}
                    style={{
                      flex: 1,
                      background: 'transparent', color: '#8a8aa3',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 100, padding: '13px 0',
                      fontSize: 14, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >Cerrar</button>
                  <button
                    onClick={handleConfirm}
                    style={{
                      flex: 1.5,
                      background: '#fff', color: '#0a0a0a', border: 'none',
                      borderRadius: 100, padding: '13px 0',
                      fontSize: 14, fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >Reintentar</button>
                </div>
              </>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
