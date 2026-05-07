'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import QRScanner from '@/components/QRScanner';

type Phase =
  | 'idle'
  | 'scanning'
  | 'client-loading'
  | 'ready'
  | 'submitting'
  | 'success'
  | 'error';

interface ClientInfo {
  id: string;
  nombre: string;
  puntos_total: number;
  nivel: string;
}

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

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function CajeroPage() {
  const router = useRouter();
  const [phase,    setPhase]   = useState<Phase>('idle');
  const [client,   setClient]  = useState<ClientInfo | null>(null);
  const [monto,    setMonto]   = useState('');
  const [result,   setResult]  = useState<AcreditarResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (localStorage.getItem('cfiel_cajero') !== 'true') {
      router.replace('/cajero/login');
    }
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/cajero/auth', { method: 'DELETE' }).catch(() => {});
    localStorage.removeItem('cfiel_cajero');
    router.replace('/cajero/login');
  };

  const montoNum  = parseInt(monto.replace(/\D/g, '')) || 0;
  const canSubmit = phase === 'ready' && client !== null && montoNum >= 100;

  const handleMontoChange = (v: string) => {
    const digits = v.replace(/\D/g, '');
    setMonto(digits ? parseInt(digits).toLocaleString('es-CL') : '');
  };

  const handleQrScan = async (scannedId: string) => {
    try {
      console.log('[Cajero] QR leído:', scannedId);

      const trimmedId = scannedId.trim();

      if (!UUID_REGEX.test(trimmedId)) {
        console.warn('[Cajero] QR inválido (no es UUID):', trimmedId);
        setErrorMsg('El QR escaneado no es válido. Pide al cliente que muestre su código CFIEL.');
        setPhase('error');
        return;
      }

      setPhase('client-loading');
      setErrorMsg('');

      console.log('[Cajero] Consultando usuario:', trimmedId);
      const res = await fetch(`/api/usuarios/${trimmedId}`);

      let data: Record<string, unknown> = {};
      try {
        data = (await res.json()) as Record<string, unknown>;
      } catch {
        // Respuesta sin cuerpo JSON válido
      }
      console.log('[Cajero] Respuesta API:', data);

      if (!res.ok) {
        const apiMsg = typeof data.error === 'string' ? data.error : null;
        setErrorMsg(
          res.status === 404
            ? 'Cliente no encontrado. Verifica que el QR sea válido.'
            : (apiMsg ?? 'Error al consultar el cliente.'),
        );
        setPhase('error');
        return;
      }

      const u = data.usuario as
        | { nombre?: string; puntos_total?: number; nivel?: string }
        | undefined;

      if (!u || typeof u.nombre !== 'string') {
        console.error('[Cajero] Estructura inesperada en respuesta API:', data);
        setErrorMsg('Respuesta inesperada del servidor. Intenta de nuevo.');
        setPhase('error');
        return;
      }

      setClient({
        id: trimmedId,
        nombre: u.nombre,
        puntos_total: u.puntos_total ?? 0,
        nivel: u.nivel ?? 'bronce',
      });
      setPhase('ready');
    } catch (err) {
      console.error('[Cajero] Error en handleQrScan:', err);
      setErrorMsg('Error de conexión. Verifica la red e intenta de nuevo.');
      setPhase('error');
    }
  };

  const handleConfirm = async () => {
    if (!canSubmit || !client) return;
    setPhase('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/puntos/acreditar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id:  client.id,
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
    setPhase('idle');
    setClient(null);
    setMonto('');
    setResult(null);
    setErrorMsg('');
  };

  const isFormPhase = ['idle', 'client-loading', 'ready', 'submitting', 'error'].includes(phase);

  return (
    <>
      {/* ── QR Scanner fullscreen overlay ── */}
      <AnimatePresence>
        {phase === 'scanning' && (
          <QRScanner
            onScan={handleQrScan}
            onCancel={() => setPhase('idle')}
          />
        )}
      </AnimatePresence>

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
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
              fontSize: 28, letterSpacing: 1, lineHeight: 1,
            }}>
              <span style={{ color: '#D4A847' }}>C</span>
              <span style={{ color: '#fff' }}>FIEL</span>
              <span style={{
                fontSize: 13, fontWeight: 500, letterSpacing: '2px',
                color: 'rgba(255,255,255,0.35)', marginLeft: 10,
                fontFamily: 'inherit', textTransform: 'uppercase',
              }}>
                · Cajero
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 4 }}>
              Tío Polo — Panel de acreditación
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '0.5px solid rgba(255,255,255,0.13)',
              borderRadius: 20, padding: '7px 13px',
              fontSize: 11, fontWeight: 500,
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2.5}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Salir
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, padding: '24px 24px 0', position: 'relative' }}>
          <AnimatePresence mode="wait">

            {/* ── FORMULARIO ── */}
            {isFormPhase && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >

                {/* ─ IDLE: solo botón de escanear ─ */}
                {phase === 'idle' && (
                  <div style={{ textAlign: 'center', paddingTop: 32 }}>
                    <div style={{
                      fontSize: 10, fontWeight: 600,
                      color: 'rgba(255,255,255,0.28)',
                      letterSpacing: '1.2px', textTransform: 'uppercase',
                      marginBottom: 24,
                    }}>
                      Nueva venta
                    </div>

                    <button
                      onClick={() => setPhase('scanning')}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #1a1400, #141414)',
                        border: '1px solid rgba(212,168,71,0.4)',
                        borderRadius: 24,
                        padding: '28px 24px',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 14,
                        cursor: 'pointer',
                        color: '#D4A847',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{
                        width: 72, height: 72,
                        background: 'rgba(212,168,71,0.12)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width={34} height={34} viewBox="0 0 24 24" fill="none"
                          stroke="#D4A847" strokeWidth={1.75} strokeLinecap="round">
                          <path d="M23 7V1h-6M1 7V1h6M23 17v6h-6M1 17v6h6"/>
                          <rect x="7" y="7" width="10" height="10" rx="1"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
                          📷 Escanear QR del cliente
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>
                          Apunta la cámara al código QR del cliente
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* ─ CLIENT LOADING ─ */}
                {phase === 'client-loading' && (
                  <div style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    paddingTop: 64, gap: 16,
                  }}>
                    <svg width={28} height={28} viewBox="0 0 24 24" fill="none"
                      stroke="#D4A847" strokeWidth={2.5}
                      style={{ animation: 'spin 0.8s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>
                      Verificando cliente...
                    </div>
                  </div>
                )}

                {/* ─ ERROR ─ */}
                {phase === 'error' && (
                  <div style={{ paddingTop: 24 }}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        background: 'rgba(231,76,60,0.1)',
                        border: '0.5px solid rgba(231,76,60,0.4)',
                        borderRadius: 20,
                        padding: '20px',
                        marginBottom: 24,
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#E74C3C', marginBottom: 6 }}>
                        {errorMsg.includes('no encontrado') ? 'Cliente no encontrado' : 'Error'}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                        {errorMsg}
                      </div>
                    </motion.div>

                    <button
                      onClick={handleReset}
                      style={{
                        width: '100%',
                        background: '#141414',
                        border: '0.5px solid rgba(212,168,71,0.35)',
                        borderRadius: 24,
                        padding: '16px',
                        fontSize: 15, fontWeight: 600,
                        color: '#D4A847',
                        cursor: 'pointer', fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={2.5}>
                        <polyline points="1 4 1 10 7 10"/>
                        <path d="M3.51 15a9 9 0 1 0 .49-3.45"/>
                      </svg>
                      Intentar de nuevo
                    </button>
                  </div>
                )}

                {/* ─ READY / SUBMITTING: cliente encontrado ─ */}
                {(phase === 'ready' || phase === 'submitting') && client && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Client card */}
                    <div style={{
                      background: '#141414',
                      border: '0.5px solid rgba(212,168,71,0.3)',
                      borderRadius: 20,
                      padding: '16px 18px',
                      marginBottom: 24,
                      display: 'flex', alignItems: 'center', gap: 14,
                    }}>
                      <div style={{
                        width: 48, height: 48,
                        background: 'rgba(212,168,71,0.12)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, fontWeight: 700, color: '#D4A847', flexShrink: 0,
                      }}>
                        {client.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 16, fontWeight: 700, color: '#fff',
                          marginBottom: 3,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          Hola, {client.nombre.split(' ')[0]}
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                          {NIVEL_EMOJI[client.nivel] ?? ''}{' '}
                          {client.nivel.charAt(0).toUpperCase() + client.nivel.slice(1)}
                          {' · '}
                          <span style={{ color: '#D4A847', fontWeight: 600 }}>
                            {client.puntos_total.toLocaleString('es-CL')} pts
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleReset}
                        style={{
                          background: 'transparent', border: 'none',
                          color: 'rgba(255,255,255,0.25)', cursor: 'pointer',
                          padding: 4, flexShrink: 0,
                        }}
                        title="Escanear otro cliente"
                      >
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth={2.5}>
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>

                    {/* Monto */}
                    <div style={{ marginBottom: 28 }}>
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
                          disabled={phase === 'submitting'}
                          style={{
                            width: '100%',
                            background: '#141414',
                            border: '0.5px solid rgba(255,255,255,0.13)',
                            borderRadius: 16,
                            padding: '18px 16px 18px 40px',
                            fontSize: 28, fontWeight: 700,
                            color: '#fff', fontFamily: 'inherit',
                            outline: 'none',
                            WebkitAppearance: 'none',
                            opacity: phase === 'submitting' ? 0.5 : 1,
                          }}
                          onFocus={(e) => (e.target.style.borderColor = '#D4A847')}
                          onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.13)')}
                        />
                      </div>
                      {montoNum >= 100 && (
                        <div style={{ fontSize: 12, color: '#2ECC71', marginTop: 8 }}>
                          = {Math.floor(montoNum / 100)} puntos a acreditar a {client.nombre.split(' ')[0]}
                        </div>
                      )}
                    </div>

                    {/* Confirm */}
                    <button
                      onClick={handleConfirm}
                      disabled={!canSubmit}
                      style={{
                        width: '100%',
                        background: canSubmit ? '#D4A847' : 'rgba(255,255,255,0.08)',
                        color: canSubmit ? '#0a0a0a' : 'rgba(255,255,255,0.28)',
                        border: 'none',
                        borderRadius: 28,
                        padding: 16,
                        fontSize: 16, fontWeight: 700,
                        cursor: canSubmit ? 'pointer' : 'not-allowed',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      {phase === 'submitting' ? (
                        <>
                          <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth={2.5}
                            style={{ animation: 'spin 0.8s linear infinite' }}>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                          </svg>
                          Acreditando...
                        </>
                      ) : (
                        `Confirmar venta${montoNum > 0 ? ` $${monto}` : ''}`
                      )}
                    </button>
                  </motion.div>
                )}

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
                    color: '#2ECC71', letterSpacing: 1, marginBottom: 4,
                  }}>
                    +{result.puntos_ganados}
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>
                    pts acreditados a {result.nombre.split(' ')[0]}
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
                    borderRadius: 20, padding: '16px 20px',
                    marginBottom: 16, textAlign: 'left',
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
                      background: '#222', borderRadius: 10,
                      padding: '4px 10px',
                      fontSize: 12, fontWeight: 600, color: '#F0C96A',
                    }}>
                      {NIVEL_EMOJI[result.nivel_nuevo]}{' '}
                      {result.nivel_nuevo.charAt(0).toUpperCase() + result.nivel_nuevo.slice(1)}
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
                      borderRadius: 14, padding: '12px 16px',
                      marginBottom: 16,
                      fontSize: 13, fontWeight: 600, color: '#D4A847',
                      textAlign: 'center',
                    }}
                  >
                    🎉 ¡{result.nombre.split(' ')[0]} subió a nivel {result.nivel_nuevo.charAt(0).toUpperCase() + result.nivel_nuevo.slice(1)}!
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
                    background: '#fff', color: '#0a0a0a',
                    border: 'none', borderRadius: 28,
                    padding: 15, fontSize: 15, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Nueva venta →
                </motion.button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </>
  );
}
