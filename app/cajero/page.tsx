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

const BEBAS = 'var(--font-bebas), "Bebas Neue", sans-serif';

const NIVEL_LABEL: Record<string, string> = {
  bronce: 'Bronce', plata: 'Plata', oro: 'Oro', platino: 'Platino',
};

const TIER_COLOR: Record<string, string> = {
  bronce: '#CD7F32', plata: '#C0C0C0', oro: '#D4A847', platino: '#E5E4E2',
};

const TENANT_SLUG = 'tio-polo';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ─── Spinner ──────────────────────────────────────────────────────────────────

const spinnerPath =
  'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83';

function Spinner({ color = '#818CF8', size = 28 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2}
      style={{ animation: 'spin 0.8s linear infinite' }}>
      <path d={spinnerPath} />
    </svg>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.20)',
        borderRadius: 12, padding: '9px 16px',
        fontSize: 13, fontWeight: 600,
        color: '#818CF8',
        cursor: 'pointer', fontFamily: 'inherit',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        marginBottom: 24,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M5 12l7 7M5 12l7-7"/>
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
  const tierColor = TIER_COLOR[client.nivel] ?? '#818CF8';
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))',
      border: '1px solid rgba(99,102,241,0.22)',
      borderRadius: 20,
      padding: '16px 18px',
      marginBottom: 24,
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 52, height: 52,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.08))',
        border: '1px solid rgba(99,102,241,0.35)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: BEBAS, fontSize: 24, color: '#818CF8', flexShrink: 0,
      }}>
        {client.nombre.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: BEBAS,
          fontSize: 22, letterSpacing: '0.02em', lineHeight: 1.1,
          color: '#fff',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {client.nombre}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 3 }}>
          <span style={{ fontSize: 12, color: tierColor, fontWeight: 600 }}>
            {NIVEL_LABEL[client.nivel] ?? client.nivel.charAt(0).toUpperCase() + client.nivel.slice(1)}
          </span>
          <span style={{
            width: 3, height: 3, borderRadius: '50%',
            background: 'rgba(255,255,255,0.22)', flexShrink: 0,
            display: 'inline-block',
          }}/>
          <span style={{ fontSize: 13, color: '#818CF8', fontWeight: 600 }}>
            {client.puntos_total.toLocaleString('es-CL')} pts
          </span>
        </div>
      </div>
      {onClear && (
        <button
          onClick={onClear}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 10,
            color: 'rgba(255,255,255,0.35)', cursor: 'pointer',
            padding: 8, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          title="Escanear otro cliente"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5">
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
        background: '#0a0a14',
        minHeight: '100dvh',
        maxWidth: 430,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 520, height: 420,
          background: 'radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }}/>

        {/* ── Header ── */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid rgba(99,102,241,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', zIndex: 2, flexShrink: 0,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                fontFamily: BEBAS,
                fontSize: 30, letterSpacing: '0.02em', lineHeight: 1,
              }}>
                <span style={{ color: '#6366F1' }}>C</span>
                <span style={{ color: '#fff' }}>FIEL</span>
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'rgba(74,222,128,0.10)',
                border: '1px solid rgba(74,222,128,0.22)',
                borderRadius: 100,
                padding: '4px 10px',
                fontSize: 11, fontWeight: 600, color: '#4ade80',
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#4ade80',
                  animation: 'pulseDot 2s ease-in-out infinite',
                }}/>
                En línea
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: 3 }}>
              Panel de operaciones
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.18)',
              borderRadius: 12, padding: '8px 14px',
              fontSize: 12, fontWeight: 600,
              color: '#818CF8',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Salir
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{
          flex: 1, padding: '24px 24px 48px',
          overflowY: 'auto', scrollbarWidth: 'none',
          position: 'relative', zIndex: 1,
        }}>
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
                <div style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.18em',
                  color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
                  marginBottom: 20,
                }}>
                  Nueva operación
                </div>

                {/* REGISTRAR VENTA */}
                <button
                  onClick={() => { resetVenta(); setMode('venta'); }}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #6366F1 0%, #4f46e5 100%)',
                    border: 'none',
                    borderRadius: 24,
                    padding: '22px 22px',
                    display: 'flex', alignItems: 'center', gap: 18,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    marginBottom: 14,
                    textAlign: 'left',
                    boxShadow: '0 8px 30px rgba(99,102,241,0.38)',
                    transition: 'opacity 0.15s',
                  }}
                >
                  <div style={{
                    width: 58, height: 58, flexShrink: 0,
                    background: 'rgba(255,255,255,0.14)',
                    borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff',
                  }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{
                      fontFamily: BEBAS,
                      fontSize: 26, letterSpacing: '0.04em',
                      color: '#fff', lineHeight: 1.1, marginBottom: 4,
                    }}>
                      REGISTRAR VENTA
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)', fontWeight: 400, lineHeight: 1.4 }}>
                      Escanea QR y acredita puntos
                    </div>
                  </div>
                </button>

                {/* CANJEAR BENEFICIO */}
                <button
                  onClick={() => { resetCanje(); setMode('canje'); }}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))',
                    border: '1px solid rgba(99,102,241,0.25)',
                    borderRadius: 24,
                    padding: '22px 22px',
                    display: 'flex', alignItems: 'center', gap: 18,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    marginBottom: 36,
                    textAlign: 'left',
                    transition: 'opacity 0.15s',
                  }}
                >
                  <div style={{
                    width: 58, height: 58, flexShrink: 0,
                    background: 'rgba(99,102,241,0.14)',
                    border: '1px solid rgba(99,102,241,0.28)',
                    borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#818CF8',
                  }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 12 20 22 4 22 4 12"/>
                      <rect x="2" y="7" width="20" height="5"/>
                      <line x1="12" y1="22" x2="12" y2="7"/>
                      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{
                      fontFamily: BEBAS,
                      fontSize: 26, letterSpacing: '0.04em',
                      color: '#fff', lineHeight: 1.1, marginBottom: 4,
                    }}>
                      CANJEAR BENEFICIO
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', fontWeight: 400, lineHeight: 1.4 }}>
                      Escanea QR y canjea premios
                    </div>
                  </div>
                </button>

                {/* Cerrar sesión sutil */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'transparent', border: 'none',
                      fontSize: 12, color: 'rgba(255,255,255,0.20)',
                      cursor: 'pointer', fontFamily: 'inherit',
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
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
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 88, gap: 16 }}>
                    <Spinner />
                    <div style={{ color: 'rgba(255,255,255,0.42)', fontSize: 14 }}>Verificando cliente...</div>
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
                        background: 'rgba(248,113,113,0.08)',
                        border: '1px solid rgba(248,113,113,0.22)',
                        borderRadius: 20, padding: '24px 20px',
                        marginBottom: 20, textAlign: 'center',
                      }}
                    >
                      <div style={{ marginBottom: 12, color: '#F87171', display: 'flex', justifyContent: 'center' }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      </div>
                      <div style={{
                        fontFamily: BEBAS, fontSize: 20, letterSpacing: '0.04em',
                        color: '#F87171', marginBottom: 8,
                      }}>
                        {ventaError.includes('no encontrado') ? 'CLIENTE NO ENCONTRADO' : 'ERROR'}
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.5 }}>
                        {ventaError}
                      </div>
                    </motion.div>
                    <button
                      onClick={resetVenta}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(99,102,241,0.05))',
                        border: '1px solid rgba(99,102,241,0.28)',
                        borderRadius: 16,
                        padding: 16, fontSize: 14, fontWeight: 700,
                        color: '#818CF8', cursor: 'pointer', fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      <svg width={15} height={15} viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
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
                      <div style={{
                        fontSize: 10, fontWeight: 600, letterSpacing: '0.18em',
                        color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
                        marginBottom: 10,
                      }}>
                        Monto de la venta
                      </div>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(99,102,241,0.02))',
                        border: '1px solid rgba(99,102,241,0.20)',
                        borderRadius: 16,
                        padding: '4px 4px 4px 18px',
                        display: 'flex', alignItems: 'center',
                      }}>
                        <span style={{
                          fontSize: 28, fontWeight: 700,
                          color: montoNum > 0 ? '#fff' : 'rgba(255,255,255,0.18)',
                          flexShrink: 0, userSelect: 'none',
                        }}>$</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={monto}
                          onChange={(e) => handleMontoChange(e.target.value)}
                          placeholder="0"
                          disabled={ventaPhase === 'submitting'}
                          style={{
                            flex: 1, background: 'transparent',
                            border: 'none',
                            padding: '14px 14px 14px 6px',
                            fontSize: 28, fontWeight: 700,
                            color: '#fff', fontFamily: 'inherit',
                            outline: 'none',
                            opacity: ventaPhase === 'submitting' ? 0.5 : 1,
                          }}
                        />
                      </div>
                      {montoNum >= 100 && (
                        <div style={{
                          fontSize: 12, color: '#4ade80', marginTop: 8,
                          display: 'flex', alignItems: 'center', gap: 5,
                        }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {Math.floor(montoNum / 100)} pts a acreditar a {ventaClient.nombre.split(' ')[0]}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleVentaConfirm}
                      disabled={!canSubmitVenta}
                      style={{
                        width: '100%',
                        background: canSubmitVenta
                          ? 'linear-gradient(135deg, #6366F1, #4f46e5)'
                          : 'rgba(255,255,255,0.06)',
                        color: canSubmitVenta ? '#fff' : 'rgba(255,255,255,0.18)',
                        border: 'none', borderRadius: 16, padding: 18,
                        fontFamily: BEBAS,
                        fontSize: 20, letterSpacing: '0.06em',
                        cursor: canSubmitVenta ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        boxShadow: canSubmitVenta ? '0 6px 22px rgba(99,102,241,0.38)' : 'none',
                      }}
                    >
                      {ventaPhase === 'submitting' ? (
                        <><Spinner color="#818CF8" size={18} />
                          <span style={{ fontFamily: 'inherit', fontSize: 15, fontWeight: 600, letterSpacing: 0 }}>
                            Acreditando...
                          </span>
                        </>
                      ) : (
                        `CONFIRMAR VENTA${montoNum > 0 ? ` $${monto}` : ''}`
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
                    {/* Check circle */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                      style={{
                        width: 80, height: 80,
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(99,102,241,0.08))',
                        border: '1.5px solid rgba(99,102,241,0.45)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 0 40px rgba(99,102,241,0.28)',
                      }}
                    >
                      <svg width={34} height={34} viewBox="0 0 24 24" fill="none"
                        stroke="#818CF8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <div style={{
                        fontFamily: BEBAS,
                        fontSize: 76, lineHeight: 0.88,
                        color: '#6366F1',
                        letterSpacing: '-0.01em',
                        textShadow: '0 0 60px rgba(99,102,241,0.55)',
                        marginBottom: 8,
                      }}>
                        +{ventaResult.puntos_ganados}
                      </div>
                      <div style={{
                        fontFamily: BEBAS,
                        fontSize: 16, letterSpacing: '0.22em', color: '#818CF8',
                        marginBottom: 5,
                      }}>PTS ACREDITADOS</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.40)', marginBottom: 28 }}>
                        a {ventaResult.nombre.split(' ')[0]}
                      </div>
                    </motion.div>

                    {/* Summary card */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))',
                        border: '1px solid rgba(99,102,241,0.20)',
                        borderRadius: 20, padding: '18px 20px', marginBottom: 14, textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{ventaResult.nombre}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.30)', marginTop: 2 }}>Cliente</div>
                        </div>
                        <div style={{
                          background: 'rgba(99,102,241,0.12)',
                          border: '1px solid rgba(99,102,241,0.20)',
                          borderRadius: 10, padding: '5px 12px',
                          fontFamily: BEBAS, fontSize: 14, letterSpacing: '0.04em',
                          color: TIER_COLOR[ventaResult.nivel_nuevo] ?? '#818CF8',
                        }}>
                          {NIVEL_LABEL[ventaResult.nivel_nuevo] ?? ventaResult.nivel_nuevo.charAt(0).toUpperCase() + ventaResult.nivel_nuevo.slice(1)}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        paddingTop: 12, borderTop: '1px solid rgba(99,102,241,0.10)',
                      }}>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)' }}>Total acumulado</div>
                        <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: '0.04em', color: '#818CF8' }}>
                          {ventaResult.puntos_total.toLocaleString('es-CL')} PTS
                        </div>
                      </div>
                    </motion.div>

                    {/* Level-up banner */}
                    {ventaResult.subio_nivel && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.45, type: 'spring' }}
                        style={{
                          background: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(99,102,241,0.04))',
                          border: '1px solid rgba(99,102,241,0.22)',
                          borderRadius: 14, padding: '11px 16px', marginBottom: 14,
                          fontFamily: BEBAS, fontSize: 15, letterSpacing: '0.05em',
                          color: TIER_COLOR[ventaResult.nivel_nuevo] ?? '#818CF8',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="18 15 12 9 6 15"/>
                        </svg>
                        {ventaResult.nombre.split(' ')[0]} subió a {ventaResult.nivel_nuevo.charAt(0).toUpperCase() + ventaResult.nivel_nuevo.slice(1)}
                      </motion.div>
                    )}

                    <motion.button
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                      onClick={() => { resetVenta(); setMode('select'); }}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #6366F1, #4f46e5)',
                        color: '#fff',
                        border: 'none', borderRadius: 16, padding: 18,
                        fontFamily: BEBAS,
                        fontSize: 18, letterSpacing: '0.06em',
                        cursor: 'pointer',
                        boxShadow: '0 6px 22px rgba(99,102,241,0.38)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12l7-7 7 7"/>
                      </svg>
                      NUEVA OPERACIÓN
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
                {/* ─ Loading ─ */}
                {(canjePhase === 'client-loading' || canjePhase === 'benefits-loading') && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 88, gap: 16 }}>
                    <Spinner />
                    <div style={{ color: 'rgba(255,255,255,0.42)', fontSize: 14 }}>
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
                        background: 'rgba(248,113,113,0.08)',
                        border: '1px solid rgba(248,113,113,0.22)',
                        borderRadius: 20, padding: '24px 20px',
                        marginBottom: 20, textAlign: 'center',
                      }}
                    >
                      <div style={{ marginBottom: 12, color: '#F87171', display: 'flex', justifyContent: 'center' }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      </div>
                      <div style={{
                        fontFamily: BEBAS, fontSize: 20, letterSpacing: '0.04em',
                        color: '#F87171', marginBottom: 8,
                      }}>
                        {canjeError.includes('no encontrado') ? 'CLIENTE NO ENCONTRADO' : 'ERROR'}
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.5 }}>
                        {canjeError}
                      </div>
                    </motion.div>
                    <button
                      onClick={resetCanje}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(99,102,241,0.05))',
                        border: '1px solid rgba(99,102,241,0.28)',
                        borderRadius: 16,
                        padding: 16, fontSize: 14, fontWeight: 700,
                        color: '#818CF8', cursor: 'pointer', fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      <svg width={15} height={15} viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
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

                    <div style={{
                      fontSize: 10, fontWeight: 600, letterSpacing: '0.18em',
                      color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
                      marginBottom: 16,
                    }}>
                      Beneficios disponibles
                    </div>

                    {beneficios.length === 0 ? (
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(99,102,241,0.02))',
                        border: '1px solid rgba(99,102,241,0.14)',
                        borderRadius: 20, padding: '44px 20px', textAlign: 'center',
                      }}>
                        <div style={{ marginBottom: 14, color: 'rgba(255,255,255,0.22)', display: 'flex', justifyContent: 'center' }}>
                          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 12 20 22 4 22 4 12"/>
                            <rect x="2" y="7" width="20" height="5"/>
                            <line x1="12" y1="22" x2="12" y2="7"/>
                            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                          </svg>
                        </div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.32)' }}>
                          No hay beneficios disponibles
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {beneficios.map((b, i) => {
                          const canCanje = canjeClient.puntos_total >= b.puntos_costo;
                          return (
                            <motion.button
                              key={b.id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04 }}
                              onClick={() => handleSelectBeneficio(b)}
                              disabled={!canCanje}
                              style={{
                                width: '100%',
                                background: canCanje
                                  ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))'
                                  : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${canCanje ? 'rgba(74,222,128,0.22)' : 'rgba(255,255,255,0.06)'}`,
                                borderRadius: 18,
                                padding: '14px 16px',
                                display: 'flex', alignItems: 'center', gap: 13,
                                cursor: canCanje ? 'pointer' : 'not-allowed',
                                fontFamily: 'inherit',
                                opacity: canCanje ? 1 : 0.48,
                                transition: 'all 0.2s',
                                textAlign: 'left',
                              }}
                            >
                              <div style={{
                                width: 46, height: 46, flexShrink: 0,
                                background: canCanje ? 'rgba(74,222,128,0.10)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${canCanje ? 'rgba(74,222,128,0.18)' : 'rgba(255,255,255,0.07)'}`,
                                borderRadius: 13,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: canCanje ? '#4ade80' : 'rgba(255,255,255,0.22)',
                              }}>
                                {canCanje ? (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 12 20 22 4 22 4 12"/>
                                    <rect x="2" y="7" width="20" height="5"/>
                                    <line x1="12" y1="22" x2="12" y2="7"/>
                                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                                  </svg>
                                ) : (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                  </svg>
                                )}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: 14, fontWeight: 600,
                                  color: canCanje ? '#fff' : 'rgba(255,255,255,0.38)',
                                  marginBottom: b.descripcion ? 3 : 0,
                                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                  {b.nombre}
                                </div>
                                {b.descripcion && (
                                  <div style={{
                                    fontSize: 11, color: 'rgba(255,255,255,0.28)',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                  }}>
                                    {b.descripcion}
                                  </div>
                                )}
                              </div>
                              <div style={{
                                flexShrink: 0,
                                background: canCanje ? 'rgba(99,102,241,0.14)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${canCanje ? 'rgba(99,102,241,0.22)' : 'rgba(255,255,255,0.07)'}`,
                                borderRadius: 10, padding: '6px 12px',
                                fontFamily: BEBAS, fontSize: 14, letterSpacing: '0.04em',
                                color: canCanje ? '#818CF8' : 'rgba(255,255,255,0.22)',
                              }}>
                                {b.puntos_costo.toLocaleString('es-CL')}
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
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))',
                        border: '1px solid rgba(99,102,241,0.22)',
                        borderRadius: 24, padding: '24px',
                        marginBottom: 20,
                      }}
                    >
                      {/* Gift icon */}
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
                        <div style={{
                          width: 56, height: 56,
                          background: 'rgba(99,102,241,0.14)',
                          border: '1px solid rgba(99,102,241,0.28)',
                          borderRadius: 16,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#818CF8',
                        }}>
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 12 20 22 4 22 4 12"/>
                            <rect x="2" y="7" width="20" height="5"/>
                            <line x1="12" y1="22" x2="12" y2="7"/>
                            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                          </svg>
                        </div>
                      </div>

                      <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', marginBottom: 7 }}>
                          Confirmar canje de
                        </div>
                        <div style={{
                          fontFamily: BEBAS,
                          fontSize: 24, letterSpacing: '0.03em',
                          color: '#fff', lineHeight: 1.1, marginBottom: 12,
                        }}>
                          {selectedBeneficio.nombre}
                        </div>
                        <div style={{
                          display: 'inline-flex', alignItems: 'center',
                          background: 'rgba(99,102,241,0.14)',
                          border: '1px solid rgba(99,102,241,0.24)',
                          borderRadius: 12, padding: '8px 20px',
                          fontFamily: BEBAS, fontSize: 20, letterSpacing: '0.05em',
                          color: '#818CF8',
                        }}>
                          {selectedBeneficio.puntos_costo.toLocaleString('es-CL')} PTS
                        </div>
                      </div>

                      {/* Points before → after */}
                      <div style={{ paddingTop: 16, borderTop: '1px solid rgba(99,102,241,0.12)' }}>
                        <div style={{
                          fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.25)',
                          letterSpacing: '0.16em', textAlign: 'center', marginBottom: 12,
                          textTransform: 'uppercase',
                        }}>
                          Balance de puntos
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginBottom: 5 }}>Antes</div>
                            <div style={{ fontFamily: BEBAS, fontSize: 22, color: '#818CF8', letterSpacing: '0.02em' }}>
                              {canjeClient.puntos_total.toLocaleString('es-CL')}
                            </div>
                          </div>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="rgba(255,255,255,0.18)" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M13 5l7 7-7 7"/>
                          </svg>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginBottom: 5 }}>Después</div>
                            <div style={{ fontFamily: BEBAS, fontSize: 22, color: '#4ade80', letterSpacing: '0.02em' }}>
                              {(canjeClient.puntos_total - selectedBeneficio.puntos_costo).toLocaleString('es-CL')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <button
                      onClick={handleCanjeConfirm}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #6366F1, #4f46e5)',
                        color: '#fff',
                        border: 'none', borderRadius: 16, padding: 18,
                        fontFamily: BEBAS,
                        fontSize: 18, letterSpacing: '0.06em',
                        cursor: 'pointer',
                        marginBottom: 12, transition: 'all 0.2s',
                        boxShadow: '0 6px 22px rgba(99,102,241,0.38)',
                      }}
                    >
                      CONFIRMAR CANJE
                    </button>
                    <button
                      onClick={() => setCanjePhase('select-benefit')}
                      style={{
                        width: '100%', background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: 15,
                        fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.30)',
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      Cancelar
                    </button>
                  </motion.div>
                )}

                {/* ─ Submitting ─ */}
                {canjePhase === 'submitting' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 88, gap: 16 }}>
                    <Spinner />
                    <div style={{ color: 'rgba(255,255,255,0.42)', fontSize: 14 }}>Procesando canje...</div>
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
                    {/* Check circle */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                      style={{
                        width: 80, height: 80,
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(99,102,241,0.08))',
                        border: '1.5px solid rgba(99,102,241,0.45)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 0 40px rgba(99,102,241,0.28)',
                      }}
                    >
                      <svg width={34} height={34} viewBox="0 0 24 24" fill="none"
                        stroke="#818CF8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <div style={{
                        fontFamily: BEBAS,
                        fontSize: 24, letterSpacing: '0.04em',
                        color: '#fff', marginBottom: 6,
                      }}>
                        CANJE CONFIRMADO
                      </div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', marginBottom: 28 }}>
                        Entrega el beneficio al cliente
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))',
                        border: '1px solid rgba(99,102,241,0.22)',
                        borderRadius: 20, padding: '20px',
                        marginBottom: 16, textAlign: 'left',
                      }}
                    >
                      <div style={{ marginBottom: 14 }}>
                        <div style={{
                          fontSize: 10, color: 'rgba(255,255,255,0.25)',
                          letterSpacing: '0.14em', marginBottom: 6, textTransform: 'uppercase',
                        }}>
                          Entrega
                        </div>
                        <div style={{
                          fontSize: 15, fontWeight: 600, color: '#fff',
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818CF8"
                            strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 12 20 22 4 22 4 12"/>
                            <rect x="2" y="7" width="20" height="5"/>
                            <line x1="12" y1="22" x2="12" y2="7"/>
                            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                          </svg>
                          {selectedBeneficio.nombre}
                        </div>
                      </div>

                      {/* Code — Bebas golden */}
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(212,168,71,0.12), rgba(212,168,71,0.04))',
                        border: '1px solid rgba(212,168,71,0.22)',
                        borderRadius: 12, padding: '12px 16px',
                        marginBottom: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <div style={{
                          fontSize: 10, color: 'rgba(255,255,255,0.26)',
                          letterSpacing: '0.12em', textTransform: 'uppercase',
                        }}>Código</div>
                        <div style={{
                          fontFamily: BEBAS,
                          fontSize: 22, letterSpacing: '0.05em',
                          color: '#D4A847',
                          textShadow: '0 0 24px rgba(212,168,71,0.38)',
                        }}>
                          {canjeResult.codigo_canje}
                        </div>
                      </div>

                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        paddingTop: 14, borderTop: '1px solid rgba(99,102,241,0.10)',
                      }}>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)' }}>Puntos restantes</div>
                        <div style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: '0.04em', color: '#818CF8' }}>
                          {canjeResult.puntos_restantes.toLocaleString('es-CL')} PTS
                        </div>
                      </div>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                      onClick={() => { resetCanje(); setMode('select'); }}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #6366F1, #4f46e5)',
                        color: '#fff',
                        border: 'none', borderRadius: 16, padding: 18,
                        fontFamily: BEBAS,
                        fontSize: 18, letterSpacing: '0.06em',
                        cursor: 'pointer',
                        boxShadow: '0 6px 22px rgba(99,102,241,0.38)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12l7-7 7 7"/>
                      </svg>
                      NUEVA OPERACIÓN
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
