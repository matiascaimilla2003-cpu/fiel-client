'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Phase = 'form' | 'loading' | 'success' | 'error';

interface AcreditarResult {
  puntos_ganados: number;
  puntos_total: number;
  nivel_nuevo: string;
  subio_nivel: boolean;
  nombre: string;
}

const NIVEL_EMOJI: Record<string, string> = {
  bronce: '🥉', plata: '🥈', oro: '⭐', platino: '👑',
};

const TENANT_SLUG = 'tio-polo';

export default function CajeroPage() {
  const [monto,       setMonto]       = useState('');
  const [userId,      setUserId]      = useState('');
  const [showQrInput, setShowQrInput] = useState(false);
  const [phase,       setPhase]       = useState<Phase>('form');
  const [result,      setResult]      = useState<AcreditarResult | null>(null);
  const [errorMsg,    setErrorMsg]    = useState('');
  const userInputRef = useRef<HTMLInputElement>(null);

  const montoNum   = parseInt(monto.replace(/\D/g, '')) || 0;
  const canSubmit  = montoNum >= 100 && userId.trim().length > 10;

  const handleMontoChange = (v: string) => {
    const digits = v.replace(/\D/g, '');
    setMonto(digits ? parseInt(digits).toLocaleString('es-CL') : '');
  };

  const handleScanQR = () => {
    setShowQrInput(true);
    setTimeout(() => userInputRef.current?.focus(), 80);
  };

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setPhase('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/puntos/acreditar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id:  userId.trim(),
          tenant_slug: TENANT_SLUG,
          monto:       montoNum,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Error al acreditar puntos');
        setPhase('error');
        return;
      }

      setResult(data);
      setPhase('success');
    } catch {
      setErrorMsg('Error de conexión. Verifica la red.');
      setPhase('error');
    }
  };

  const handleReset = () => {
    setMonto('');
    setUserId('');
    setShowQrInput(false);
    setResult(null);
    setErrorMsg('');
    setPhase('form');
  };

  return (
    <div style={{
      background: '#0a0a0a',
      minHeight: '100dvh',
      maxWidth: 430,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 0 40px',
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: '22px 24px 16px',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 28, letterSpacing: 1, lineHeight: 1,
        }}>
          <span style={{ color: '#D4A847' }}>C</span>
          <span style={{ color: '#fff' }}>FIEL</span>
          <span style={{
            fontSize: 13, fontWeight: 500, letterSpacing: '2px',
            color: 'rgba(255,255,255,0.35)', marginLeft: 10,
            fontFamily: 'inherit',
            textTransform: 'uppercase',
          }}>
            · Cajero
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 4 }}>
          Tío Polo — Panel de acreditación
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, padding: '24px 24px 0', position: 'relative' }}>

        <AnimatePresence mode="wait">

          {/* ── FORMULARIO ── */}
          {(phase === 'form' || phase === 'loading' || phase === 'error') && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >

              {/* Monto */}
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  fontSize: 10, fontWeight: 600,
                  color: 'rgba(255,255,255,0.28)',
                  letterSpacing: '1.2px', textTransform: 'uppercase',
                  marginBottom: 10,
                }}>
                  Monto de la venta
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 16, top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 22, fontWeight: 700,
                    color: montoNum > 0 ? '#fff' : 'rgba(255,255,255,0.2)',
                    pointerEvents: 'none',
                  }}>
                    $
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={monto}
                    onChange={(e) => handleMontoChange(e.target.value)}
                    placeholder="0"
                    style={{
                      width: '100%',
                      background: '#141414',
                      border: '0.5px solid rgba(255,255,255,0.13)',
                      borderRadius: 16,
                      padding: '18px 16px 18px 40px',
                      fontSize: 28,
                      fontWeight: 700,
                      color: '#fff',
                      fontFamily: 'inherit',
                      outline: 'none',
                      WebkitAppearance: 'none',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#D4A847')}
                    onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.13)')}
                  />
                </div>
                {montoNum >= 100 && (
                  <div style={{ fontSize: 12, color: '#2ECC71', marginTop: 8 }}>
                    = {Math.floor(montoNum / 100)} puntos a acreditar
                  </div>
                )}
              </div>

              {/* Cliente / QR */}
              <div style={{ marginBottom: 28 }}>
                <div style={{
                  fontSize: 10, fontWeight: 600,
                  color: 'rgba(255,255,255,0.28)',
                  letterSpacing: '1.2px', textTransform: 'uppercase',
                  marginBottom: 10,
                }}>
                  Cliente
                </div>

                <AnimatePresence>
                  {!showQrInput ? (
                    <motion.button
                      key="qr-btn"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={handleScanQR}
                      style={{
                        width: '100%',
                        background: '#141414',
                        border: '0.5px solid rgba(212,168,71,0.35)',
                        borderRadius: 16,
                        padding: '18px 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        cursor: 'pointer',
                        color: '#D4A847',
                        fontSize: 15, fontWeight: 600,
                        fontFamily: 'inherit',
                      }}
                    >
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
                        stroke="#D4A847" strokeWidth={2}>
                        <rect x="3" y="3" width="7" height="7" rx="1"/>
                        <rect x="14" y="3" width="7" height="7" rx="1"/>
                        <rect x="3" y="14" width="7" height="7" rx="1"/>
                        <rect x="14" y="17" width="3" height="3"/>
                        <rect x="19" y="14" width="2" height="2"/>
                        <rect x="14" y="14" width="3" height="2"/>
                        <rect x="19" y="17" width="2" height="4"/>
                      </svg>
                      Escanear QR del cliente
                    </motion.button>
                  ) : (
                    <motion.div
                      key="qr-input"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <input
                        ref={userInputRef}
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="ID del usuario (UUID)"
                        style={{
                          width: '100%',
                          background: '#141414',
                          border: '0.5px solid rgba(255,255,255,0.13)',
                          borderRadius: 16,
                          padding: '16px',
                          fontSize: 13,
                          color: '#fff',
                          fontFamily: 'inherit',
                          outline: 'none',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#D4A847')}
                        onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.13)')}
                      />
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 6 }}>
                        Pega el ID del usuario obtenido del QR
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Error */}
              {phase === 'error' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: 'rgba(231,76,60,0.12)',
                    border: '0.5px solid rgba(231,76,60,0.4)',
                    borderRadius: 12,
                    padding: '12px 14px',
                    fontSize: 13,
                    color: '#E74C3C',
                    marginBottom: 20,
                  }}
                >
                  {errorMsg}
                </motion.div>
              )}

              {/* Confirm button */}
              <button
                onClick={handleConfirm}
                disabled={!canSubmit || phase === 'loading'}
                style={{
                  width: '100%',
                  background: canSubmit && phase !== 'loading' ? '#D4A847' : 'rgba(255,255,255,0.08)',
                  color: canSubmit && phase !== 'loading' ? '#0a0a0a' : 'rgba(255,255,255,0.28)',
                  border: 'none',
                  borderRadius: 28,
                  padding: 16,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: canSubmit && phase !== 'loading' ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {phase === 'loading' ? (
                  <>
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth={2.5}
                      style={{ animation: 'spin 0.8s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Acreditando...
                  </>
                ) : (
                  `Confirmar venta ${montoNum > 0 ? `$${monto}` : ''}`
                )}
              </button>

            </motion.div>
          )}

          {/* ── ÉXITO ── */}
          {phase === 'success' && result && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              style={{ textAlign: 'center' }}
            >
              {/* Checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  width: 72, height: 72,
                  background: 'rgba(46,204,113,0.15)',
                  border: '1.5px solid rgba(46,204,113,0.5)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <svg width={32} height={32} viewBox="0 0 24 24" fill="none"
                  stroke="#2ECC71" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </motion.div>

              {/* Puntos */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div style={{
                  fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                  fontSize: 56, lineHeight: 1,
                  color: '#2ECC71',
                  letterSpacing: 1,
                  marginBottom: 4,
                }}>
                  +{result.puntos_ganados}
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>
                  puntos acreditados
                </div>
              </motion.div>

              {/* Info card */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  background: '#141414',
                  border: '0.5px solid rgba(255,255,255,0.07)',
                  borderRadius: 20,
                  padding: '16px 20px',
                  marginBottom: 16,
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>
                      {result.nombre}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                      Cliente
                    </div>
                  </div>
                  <div style={{
                    background: '#222',
                    borderRadius: 10,
                    padding: '4px 10px',
                    fontSize: 12, fontWeight: 600,
                    color: '#F0C96A',
                  }}>
                    {NIVEL_EMOJI[result.nivel_nuevo]} {result.nivel_nuevo.charAt(0).toUpperCase() + result.nivel_nuevo.slice(1)}
                  </div>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: 12,
                  borderTop: '0.5px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Total acumulado</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#D4A847' }}>
                    {result.puntos_total.toLocaleString('es-CL')} pts
                  </div>
                </div>
              </motion.div>

              {/* Subió de nivel */}
              {result.subio_nivel && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45, type: 'spring' }}
                  style={{
                    background: 'rgba(212,168,71,0.12)',
                    border: '0.5px solid rgba(212,168,71,0.4)',
                    borderRadius: 14,
                    padding: '12px 16px',
                    marginBottom: 16,
                    fontSize: 13, fontWeight: 600,
                    color: '#D4A847',
                    textAlign: 'center',
                  }}
                >
                  🎉 ¡{result.nombre} subió a nivel {result.nivel_nuevo.charAt(0).toUpperCase() + result.nivel_nuevo.slice(1)}!
                </motion.div>
              )}

              {/* Nueva venta */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={handleReset}
                style={{
                  width: '100%',
                  background: '#fff',
                  color: '#0a0a0a',
                  border: 'none',
                  borderRadius: 28,
                  padding: 15,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Nueva venta →
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
