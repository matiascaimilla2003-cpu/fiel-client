'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import QRScanner from '@/components/QRScanner';

// ─── Types ────────────────────────────────────────────────────────────────────

type AppMode = 'select' | 'venta' | 'canje';

type VentaPhase =
  | 'scanning'
  | 'client-loading'
  | 'ready'
  | 'submitting'
  | 'success'
  | 'error';

type CanjePhase =
  | 'scanning'
  | 'client-loading'
  | 'benefits-loading'
  | 'select-benefit'
  | 'confirm'
  | 'submitting'
  | 'success'
  | 'error';

interface ClientInfo {
  id: string;
  nombre: string;
  puntos_total: number;
  nivel: string;
}

interface Beneficio {
  id: string;
  nombre: string;
  descripcion: string | null;
  puntos_costo: number;
  icono: string | null;
}

interface AcreditarResult {
  puntos_ganados: number;
  puntos_total: number;
  nivel_nuevo: string;
  subio_nivel: boolean;
  nombre: string;
}

interface CanjeResult {
  codigo_canje: string;
  puntos_usados: number;
  puntos_restantes: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NIVEL_EMOJI: Record<string, string> = {
  bronce: '🥉', plata: '🥈', oro: '⭐', platino: '👑',
};

const TENANT_SLUG = 'tio-polo';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ─── Shared styles ────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 600,
  color: 'rgba(255,255,255,0.28)',
  letterSpacing: '1.2px', textTransform: 'uppercase',
  marginBottom: 10,
};

const spinnerPath =
  'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83';

function Spinner({ color = '#D4A847', size = 28 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2.5}
      style={{ animation: 'spin 0.8s linear infinite' }}>
      <path d={spinnerPath} />
    </svg>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: '0.5px solid rgba(255,255,255,0.13)',
        borderRadius: 20, padding: '8px 14px',
        fontSize: 12, fontWeight: 500,
        color: 'rgba(255,255,255,0.45)',
        cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', gap: 6,
        marginBottom: 24,
      }}
    >
      <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={2.5}>
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Volver
    </button>
  );
}

function ClientCard({
  client,
  onClear,
}: {
  client: ClientInfo;
  onClear?: () => void;
}) {
  return (
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
          {client.nombre.split(' ')[0]}
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
      {onClear && (
        <button
          onClick={onClear}
          style={{
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.25)', cursor: 'pointer',
            padding: 4, flexShrink: 0,
          }}
          title="Escanear otro cliente"
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2.5}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CajeroPage() {
  const router = useRouter();

  // ── Mode state ──
  const [mode, setMode] = useState<AppMode>('select');

  // ── Venta state ──
  const [ventaPhase, setVentaPhase] = useState<VentaPhase>('scanning');
  const [ventaClient, setVentaClient] = useState<ClientInfo | null>(null);
  const [monto, setMonto] = useState('');
  const [ventaResult, setVentaResult] = useState<AcreditarResult | null>(null);
  const [ventaError, setVentaError] = useState('');

  // ── Canje state ──
  const [canjePhase, setCanjePhase] = useState<CanjePhase>('scanning');
  const [canjeClient, setCanjeClient] = useState<ClientInfo | null>(null);
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [tenantId, setTenantId] = useState('');
  const [selectedBeneficio, setSelectedBeneficio] = useState<Beneficio | null>(null);
  const [canjeResult, setCanjeResult] = useState<CanjeResult | null>(null);
  const [canjeError, setCanjeError] = useState('');

  // ── Auth ──
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

  // ── Derived ──
  const montoNum = parseInt(monto.replace(/\D/g, '')) || 0;
  const canSubmitVenta = ventaPhase === 'ready' && ventaClient !== null && montoNum >= 100;

  const handleMontoChange = (v: string) => {
    const digits = v.replace(/\D/g, '');
    setMonto(digits ? parseInt(digits).toLocaleString('es-CL') : '');
  };

  // ── Venta QR scan ──
  const handleVentaQrScan = async (scannedId: string) => {
    const trimmedId = scannedId.trim();
    if (!UUID_REGEX.test(trimmedId)) {
      setVentaError('El QR escaneado no es válido. Pide al cliente que muestre su código CFIEL.');
      setVentaPhase('error');
      return;
    }
    setVentaPhase('client-loading');
    setVentaError('');
    try {
      const res = await fetch(`/api/usuarios/${trimmedId}`);
      let data: Record<string, unknown> = {};
      try { data = (await res.json()) as Record<string, unknown>; } catch { /* noop */ }
      if (!res.ok) {
        const apiMsg = typeof data.error === 'string' ? data.error : null;
        setVentaError(res.status === 404
          ? 'Cliente no encontrado. Verifica que el QR sea válido.'
          : (apiMsg ?? 'Error al consultar el cliente.'));
        setVentaPhase('error');
        return;
      }
      const u = data.usuario as { nombre?: string; puntos_total?: number; nivel?: string } | undefined;
      if (!u || typeof u.nombre !== 'string') {
        setVentaError('Respuesta inesperada del servidor. Intenta de nuevo.');
        setVentaPhase('error');
        return;
      }
      setVentaClient({ id: trimmedId, nombre: u.nombre, puntos_total: u.puntos_total ?? 0, nivel: u.nivel ?? 'bronce' });
      setVentaPhase('ready');
    } catch {
      setVentaError('Error de conexión. Verifica la red e intenta de nuevo.');
      setVentaPhase('error');
    }
  };

  const handleVentaConfirm = async () => {
    if (!canSubmitVenta || !ventaClient) return;
    setVentaPhase('submitting');
    setVentaError('');
    try {
      const res = await fetch('/api/puntos/acreditar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: ventaClient.id, tenant_slug: TENANT_SLUG, monto: montoNum }),
      });
      const data = await res.json();
      if (!res.ok) { setVentaError(data.error ?? 'Error al acreditar puntos'); setVentaPhase('error'); return; }
      setVentaResult(data);
      setVentaPhase('success');
    } catch {
      setVentaError('Error de conexión. Verifica la red.');
      setVentaPhase('error');
    }
  };

  const resetVenta = () => {
    setVentaPhase('scanning');
    setVentaClient(null);
    setMonto('');
    setVentaResult(null);
    setVentaError('');
  };

  // ── Canje QR scan ──
  const handleCanjeQrScan = async (scannedId: string) => {
    const trimmedId = scannedId.trim();
    if (!UUID_REGEX.test(trimmedId)) {
      setCanjeError('El QR escaneado no es válido. Pide al cliente que muestre su código CFIEL.');
      setCanjePhase('error');
      return;
    }
    setCanjePhase('client-loading');
    setCanjeError('');
    try {
      const [userRes, benefRes] = await Promise.all([
        fetch(`/api/usuarios/${trimmedId}`),
        fetch(`/api/beneficios/${TENANT_SLUG}`),
      ]);

      let userData: Record<string, unknown> = {};
      let benefData: Record<string, unknown> = {};
      try { userData = (await userRes.json()) as Record<string, unknown>; } catch { /* noop */ }
      try { benefData = (await benefRes.json()) as Record<string, unknown>; } catch { /* noop */ }

      if (!userRes.ok) {
        const apiMsg = typeof userData.error === 'string' ? userData.error : null;
        setCanjeError(userRes.status === 404
          ? 'Cliente no encontrado. Verifica que el QR sea válido.'
          : (apiMsg ?? 'Error al consultar el cliente.'));
        setCanjePhase('error');
        return;
      }

      const u = userData.usuario as { nombre?: string; puntos_total?: number; nivel?: string } | undefined;
      if (!u || typeof u.nombre !== 'string') {
        setCanjeError('Respuesta inesperada del servidor. Intenta de nuevo.');
        setCanjePhase('error');
        return;
      }

      setCanjeClient({ id: trimmedId, nombre: u.nombre, puntos_total: u.puntos_total ?? 0, nivel: u.nivel ?? 'bronce' });

      if (benefRes.ok && Array.isArray(benefData.beneficios)) {
        setBeneficios(benefData.beneficios as Beneficio[]);
        setTenantId(typeof benefData.tenant_id === 'string' ? benefData.tenant_id : '');
      }

      setCanjePhase('select-benefit');
    } catch {
      setCanjeError('Error de conexión. Verifica la red e intenta de nuevo.');
      setCanjePhase('error');
    }
  };

  const handleSelectBeneficio = (b: Beneficio) => {
    if (!canjeClient || canjeClient.puntos_total < b.puntos_costo) return;
    setSelectedBeneficio(b);
    setCanjePhase('confirm');
  };

  const handleCanjeConfirm = async () => {
    if (!canjeClient || !selectedBeneficio || !tenantId) return;
    setCanjePhase('submitting');
    setCanjeError('');
    try {
      const res = await fetch('/api/puntos/canjear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: canjeClient.id,
          tenant_id: tenantId,
          beneficio_id: selectedBeneficio.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setCanjeError(data.error ?? 'Error al canjear'); setCanjePhase('error'); return; }
      setCanjeResult(data);
      setCanjePhase('success');
    } catch {
      setCanjeError('Error de conexión. Verifica la red.');
      setCanjePhase('error');
    }
  };

  const resetCanje = () => {
    setCanjePhase('scanning');
    setCanjeClient(null);
    setBeneficios([]);
    setTenantId('');
    setSelectedBeneficio(null);
    setCanjeResult(null);
    setCanjeError('');
  };

  // QR scanners are fullscreen overlays — shown when mode matches and phase is 'scanning'
  const showVentaScanner = mode === 'venta' && ventaPhase === 'scanning';
  const showCanjeScanner = mode === 'canje' && canjePhase === 'scanning';

  return (
    <>
      {/* ── QR Scanner overlays ── */}
      <AnimatePresence>
        {showVentaScanner && (
          <QRScanner
            onScan={handleVentaQrScan}
            onCancel={() => setMode('select')}
          />
        )}
        {showCanjeScanner && (
          <QRScanner
            onScan={handleCanjeQrScan}
            onCancel={() => setMode('select')}
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
              Panel de operaciones CFIEL
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
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Salir
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, padding: '24px 24px 0', position: 'relative' }}>
          <AnimatePresence mode="wait">

            {/* ════════════════════════════════════════
                PANTALLA DE SELECCIÓN DE MODO
            ════════════════════════════════════════ */}
            {mode === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ ...labelStyle, marginBottom: 28 }}>Nueva operación</div>

                {/* Venta button */}
                <button
                  onClick={() => { resetVenta(); setMode('venta'); }}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #1a1400, #141414)',
                    border: '1px solid rgba(212,168,71,0.4)',
                    borderRadius: 24,
                    padding: '28px 24px',
                    display: 'flex', alignItems: 'center', gap: 20,
                    cursor: 'pointer',
                    color: '#D4A847',
                    fontFamily: 'inherit',
                    marginBottom: 16,
                    transition: 'all 0.2s',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: 64, height: 64, flexShrink: 0,
                    background: 'rgba(212,168,71,0.12)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28,
                  }}>
                    🛒
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 5 }}>
                      Registrar venta
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 400, lineHeight: 1.4 }}>
                      Escanea el QR del cliente y acredita puntos por la compra
                    </div>
                  </div>
                </button>

                {/* Canje button */}
                <button
                  onClick={() => { resetCanje(); setMode('canje'); }}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #001a0a, #141414)',
                    border: '1px solid rgba(46,204,113,0.35)',
                    borderRadius: 24,
                    padding: '28px 24px',
                    display: 'flex', alignItems: 'center', gap: 20,
                    cursor: 'pointer',
                    color: '#2ECC71',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: 64, height: 64, flexShrink: 0,
                    background: 'rgba(46,204,113,0.12)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28,
                  }}>
                    🎁
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 5 }}>
                      Canjear beneficio
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 400, lineHeight: 1.4 }}>
                      Escanea el QR del cliente y canjea sus puntos por un beneficio
                    </div>
                  </div>
                </button>
              </motion.div>
            )}

            {/* ════════════════════════════════════════
                MODO VENTA
            ════════════════════════════════════════ */}
            {mode === 'venta' && ventaPhase !== 'scanning' && (
              <motion.div
                key="venta"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {/* ─ Loading ─ */}
                {ventaPhase === 'client-loading' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 64, gap: 16 }}>
                    <Spinner />
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>Verificando cliente...</div>
                  </div>
                )}

                {/* ─ Error ─ */}
                {ventaPhase === 'error' && (
                  <div style={{ paddingTop: 8 }}>
                    <BackButton onClick={() => setMode('select')} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        background: 'rgba(231,76,60,0.1)',
                        border: '0.5px solid rgba(231,76,60,0.4)',
                        borderRadius: 20, padding: '20px',
                        marginBottom: 24, textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#E74C3C', marginBottom: 6 }}>
                        {ventaError.includes('no encontrado') ? 'Cliente no encontrado' : 'Error'}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                        {ventaError}
                      </div>
                    </motion.div>
                    <button
                      onClick={resetVenta}
                      style={{
                        width: '100%', background: '#141414',
                        border: '0.5px solid rgba(212,168,71,0.35)', borderRadius: 24,
                        padding: '16px', fontSize: 15, fontWeight: 600,
                        color: '#D4A847', cursor: 'pointer', fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={2.5}>
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 .49-3.45" />
                      </svg>
                      Intentar de nuevo
                    </button>
                  </div>
                )}

                {/* ─ Ready / Submitting ─ */}
                {(ventaPhase === 'ready' || ventaPhase === 'submitting') && ventaClient && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <BackButton onClick={() => setMode('select')} />
                    <ClientCard client={ventaClient} onClear={resetVenta} />

                    {/* Monto */}
                    <div style={{ marginBottom: 28 }}>
                      <div style={labelStyle}>Monto de la venta</div>
                      <div style={{ position: 'relative' }}>
                        <span style={{
                          position: 'absolute', left: 16, top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: 22, fontWeight: 700,
                          color: montoNum > 0 ? '#fff' : 'rgba(255,255,255,0.2)',
                          pointerEvents: 'none',
                        }}>$</span>
                        <input
                          type="text" inputMode="numeric"
                          value={monto}
                          onChange={(e) => handleMontoChange(e.target.value)}
                          placeholder="0"
                          disabled={ventaPhase === 'submitting'}
                          style={{
                            width: '100%', background: '#141414',
                            border: '0.5px solid rgba(255,255,255,0.13)',
                            borderRadius: 16, padding: '18px 16px 18px 40px',
                            fontSize: 28, fontWeight: 700,
                            color: '#fff', fontFamily: 'inherit',
                            outline: 'none', WebkitAppearance: 'none',
                            opacity: ventaPhase === 'submitting' ? 0.5 : 1,
                          }}
                          onFocus={(e) => (e.target.style.borderColor = '#D4A847')}
                          onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.13)')}
                        />
                      </div>
                      {montoNum >= 100 && (
                        <div style={{ fontSize: 12, color: '#2ECC71', marginTop: 8 }}>
                          = {Math.floor(montoNum / 100)} puntos a acreditar a {ventaClient.nombre.split(' ')[0]}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleVentaConfirm}
                      disabled={!canSubmitVenta}
                      style={{
                        width: '100%',
                        background: canSubmitVenta ? '#D4A847' : 'rgba(255,255,255,0.08)',
                        color: canSubmitVenta ? '#0a0a0a' : 'rgba(255,255,255,0.28)',
                        border: 'none', borderRadius: 28, padding: 16,
                        fontSize: 16, fontWeight: 700,
                        cursor: canSubmitVenta ? 'pointer' : 'not-allowed',
                        fontFamily: 'inherit', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      {ventaPhase === 'submitting' ? (
                        <><Spinner color="#0a0a0a" size={18} /> Acreditando...</>
                      ) : (
                        `Confirmar venta${montoNum > 0 ? ` $${monto}` : ''}`
                      )}
                    </button>
                  </motion.div>
                )}

                {/* ─ Success ─ */}
                {ventaPhase === 'success' && ventaResult && (
                  <motion.div
                    key="venta-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    style={{ textAlign: 'center' }}
                  >
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
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <div style={{
                        fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                        fontSize: 56, lineHeight: 1, color: '#2ECC71', letterSpacing: 1, marginBottom: 4,
                      }}>
                        +{ventaResult.puntos_ganados}
                      </div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>
                        pts acreditados a {ventaResult.nombre.split(' ')[0]}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      style={{
                        background: '#141414', border: '0.5px solid rgba(255,255,255,0.07)',
                        borderRadius: 20, padding: '16px 20px', marginBottom: 16, textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{ventaResult.nombre}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Cliente</div>
                        </div>
                        <div style={{ background: '#222', borderRadius: 10, padding: '4px 10px', fontSize: 12, fontWeight: 600, color: '#F0C96A' }}>
                          {NIVEL_EMOJI[ventaResult.nivel_nuevo]}{' '}
                          {ventaResult.nivel_nuevo.charAt(0).toUpperCase() + ventaResult.nivel_nuevo.slice(1)}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        paddingTop: 12, borderTop: '0.5px solid rgba(255,255,255,0.06)',
                      }}>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Total acumulado</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#D4A847' }}>
                          {ventaResult.puntos_total.toLocaleString('es-CL')} pts
                        </div>
                      </div>
                    </motion.div>

                    {ventaResult.subio_nivel && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.45, type: 'spring' }}
                        style={{
                          background: 'rgba(212,168,71,0.12)', border: '0.5px solid rgba(212,168,71,0.4)',
                          borderRadius: 14, padding: '12px 16px', marginBottom: 16,
                          fontSize: 13, fontWeight: 600, color: '#D4A847', textAlign: 'center',
                        }}
                      >
                        🎉 ¡{ventaResult.nombre.split(' ')[0]} subió a nivel{' '}
                        {ventaResult.nivel_nuevo.charAt(0).toUpperCase() + ventaResult.nivel_nuevo.slice(1)}!
                      </motion.div>
                    )}

                    <motion.button
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                      onClick={() => { resetVenta(); setMode('select'); }}
                      style={{
                        width: '100%', background: '#fff', color: '#0a0a0a',
                        border: 'none', borderRadius: 28, padding: 15,
                        fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      Nueva operación →
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ════════════════════════════════════════
                MODO CANJE
            ════════════════════════════════════════ */}
            {mode === 'canje' && canjePhase !== 'scanning' && (
              <motion.div
                key="canje"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >

                {/* ─ Loading (cliente o beneficios) ─ */}
                {(canjePhase === 'client-loading' || canjePhase === 'benefits-loading') && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 64, gap: 16 }}>
                    <Spinner color="#2ECC71" />
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>
                      {canjePhase === 'client-loading' ? 'Verificando cliente...' : 'Cargando beneficios...'}
                    </div>
                  </div>
                )}

                {/* ─ Error ─ */}
                {canjePhase === 'error' && (
                  <div style={{ paddingTop: 8 }}>
                    <BackButton onClick={() => setMode('select')} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        background: 'rgba(231,76,60,0.1)',
                        border: '0.5px solid rgba(231,76,60,0.4)',
                        borderRadius: 20, padding: '20px',
                        marginBottom: 24, textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#E74C3C', marginBottom: 6 }}>
                        {canjeError.includes('no encontrado') ? 'Cliente no encontrado' : 'Error'}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                        {canjeError}
                      </div>
                    </motion.div>
                    <button
                      onClick={resetCanje}
                      style={{
                        width: '100%', background: '#141414',
                        border: '0.5px solid rgba(46,204,113,0.35)', borderRadius: 24,
                        padding: '16px', fontSize: 15, fontWeight: 600,
                        color: '#2ECC71', cursor: 'pointer', fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={2.5}>
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 .49-3.45" />
                      </svg>
                      Intentar de nuevo
                    </button>
                  </div>
                )}

                {/* ─ Seleccionar beneficio ─ */}
                {canjePhase === 'select-benefit' && canjeClient && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <BackButton onClick={() => setMode('select')} />
                    <ClientCard client={canjeClient} />

                    <div style={{ ...labelStyle, marginBottom: 16 }}>Beneficios disponibles</div>

                    {beneficios.length === 0 ? (
                      <div style={{
                        background: '#141414', border: '0.5px solid rgba(255,255,255,0.07)',
                        borderRadius: 20, padding: '32px 20px', textAlign: 'center',
                      }}>
                        <div style={{ fontSize: 32, marginBottom: 12 }}>🎁</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
                          No hay beneficios disponibles por el momento
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {beneficios.map((b) => {
                          const canCanje = canjeClient.puntos_total >= b.puntos_costo;
                          return (
                            <motion.button
                              key={b.id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              onClick={() => handleSelectBeneficio(b)}
                              disabled={!canCanje}
                              style={{
                                width: '100%',
                                background: '#141414',
                                border: `0.5px solid ${canCanje ? 'rgba(46,204,113,0.3)' : 'rgba(255,255,255,0.07)'}`,
                                borderRadius: 20,
                                padding: '16px 18px',
                                display: 'flex', alignItems: 'center', gap: 14,
                                cursor: canCanje ? 'pointer' : 'not-allowed',
                                fontFamily: 'inherit',
                                opacity: canCanje ? 1 : 0.45,
                                transition: 'all 0.2s',
                                textAlign: 'left',
                              }}
                            >
                              <div style={{
                                width: 48, height: 48, flexShrink: 0,
                                background: canCanje ? 'rgba(46,204,113,0.12)' : 'rgba(255,255,255,0.06)',
                                borderRadius: 14,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 22,
                              }}>
                                {canCanje ? (b.icono ?? '🎁') : '🔒'}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: 14, fontWeight: 600,
                                  color: canCanje ? '#fff' : 'rgba(255,255,255,0.5)',
                                  marginBottom: 4,
                                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                  {b.nombre}
                                </div>
                                {b.descripcion && (
                                  <div style={{
                                    fontSize: 11, color: 'rgba(255,255,255,0.35)',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    marginBottom: 4,
                                  }}>
                                    {b.descripcion}
                                  </div>
                                )}
                              </div>
                              <div style={{
                                flexShrink: 0,
                                background: canCanje ? 'rgba(212,168,71,0.15)' : 'rgba(255,255,255,0.06)',
                                borderRadius: 10, padding: '5px 10px',
                                fontSize: 13, fontWeight: 700,
                                color: canCanje ? '#D4A847' : 'rgba(255,255,255,0.3)',
                              }}>
                                {b.puntos_costo.toLocaleString('es-CL')} pts
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ─ Confirmar canje ─ */}
                {canjePhase === 'confirm' && canjeClient && selectedBeneficio && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                  >
                    <BackButton onClick={() => setCanjePhase('select-benefit')} />
                    <ClientCard client={canjeClient} />

                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        background: 'linear-gradient(135deg, #001a0a, #141414)',
                        border: '1px solid rgba(46,204,113,0.3)',
                        borderRadius: 24, padding: '28px 24px',
                        textAlign: 'center', marginBottom: 24,
                      }}
                    >
                      <div style={{ fontSize: 40, marginBottom: 14 }}>
                        {selectedBeneficio.icono ?? '🎁'}
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                        Confirmar canje de
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
                        {selectedBeneficio.nombre}
                      </div>
                      <div style={{
                        display: 'inline-block',
                        background: 'rgba(212,168,71,0.15)',
                        borderRadius: 12, padding: '8px 18px',
                        fontSize: 18, fontWeight: 700, color: '#D4A847',
                      }}>
                        {selectedBeneficio.puntos_costo.toLocaleString('es-CL')} puntos
                      </div>

                      <div style={{
                        marginTop: 20, paddingTop: 16,
                        borderTop: '0.5px solid rgba(255,255,255,0.06)',
                        fontSize: 12, color: 'rgba(255,255,255,0.4)',
                      }}>
                        Quedarán{' '}
                        <span style={{ color: '#D4A847', fontWeight: 600 }}>
                          {(canjeClient.puntos_total - selectedBeneficio.puntos_costo).toLocaleString('es-CL')} pts
                        </span>
                        {' '}en la cuenta
                      </div>
                    </motion.div>

                    <button
                      onClick={handleCanjeConfirm}
                      style={{
                        width: '100%', background: '#2ECC71', color: '#0a0a0a',
                        border: 'none', borderRadius: 28, padding: 16,
                        fontSize: 16, fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'inherit', marginBottom: 12, transition: 'all 0.2s',
                      }}
                    >
                      Confirmar canje
                    </button>
                    <button
                      onClick={() => setCanjePhase('select-benefit')}
                      style={{
                        width: '100%', background: 'transparent',
                        border: '0.5px solid rgba(255,255,255,0.13)', borderRadius: 28, padding: 14,
                        fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.45)',
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      Cancelar
                    </button>
                  </motion.div>
                )}

                {/* ─ Submitting ─ */}
                {canjePhase === 'submitting' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 64, gap: 16 }}>
                    <Spinner color="#2ECC71" />
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>Procesando canje...</div>
                  </div>
                )}

                {/* ─ Success ─ */}
                {canjePhase === 'success' && canjeResult && selectedBeneficio && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    style={{ textAlign: 'center' }}
                  >
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
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: '#2ECC71', marginBottom: 4 }}>
                        ✓ Canje confirmado
                      </div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>
                        Entrega el beneficio al cliente
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      style={{
                        background: '#141414',
                        border: '0.5px solid rgba(46,204,113,0.25)',
                        borderRadius: 20, padding: '20px',
                        marginBottom: 16, textAlign: 'left',
                      }}
                    >
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>Entrega</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>{selectedBeneficio.icono ?? '🎁'}</span>
                          {selectedBeneficio.nombre}
                        </div>
                      </div>

                      <div style={{
                        background: '#0a0a0a', borderRadius: 12, padding: '10px 14px',
                        marginBottom: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Código</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#D4A847', letterSpacing: 1 }}>
                          {canjeResult.codigo_canje}
                        </div>
                      </div>

                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        paddingTop: 14, borderTop: '0.5px solid rgba(255,255,255,0.06)',
                      }}>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Puntos restantes</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#D4A847' }}>
                          {canjeResult.puntos_restantes.toLocaleString('es-CL')} pts
                        </div>
                      </div>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                      onClick={() => { resetCanje(); setMode('select'); }}
                      style={{
                        width: '100%', background: '#fff', color: '#0a0a0a',
                        border: 'none', borderRadius: 28, padding: 15,
                        fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      Nueva operación →
                    </motion.button>
                  </motion.div>
                )}
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
