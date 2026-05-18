'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

interface Referido {
  id: string;
  nombre: string;
  estado: string;
  puntos_acreditados: number;
  created_at: string;
}

interface ReferidosData {
  referidos: Referido[];
  total_invitados: number;
  total_registrados: number;
  total_puntos: number;
}

function Sk({ w, h, r = 8 }: { w: number | string; h: number; r?: number }) {
  return <div style={{ width: w, height: h, background: '#1a1a1a', borderRadius: r, flexShrink: 0 }} />;
}

export default function ReferidosPage() {
  const router = useRouter();
  const [codigo, setCodigo]   = useState('');
  const [data, setData]       = useState<ReferidosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('cfiel_user_id');
    if (!id) { router.replace('/'); return; }
    setCodigo(`CFIEL-${id.substring(0, 6).toUpperCase()}`);
    fetch(`/api/referidos?usuario_id=${id}`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => setData({ referidos: [], total_invitados: 0, total_registrados: 0, total_puntos: 0 }))
      .finally(() => setLoading(false));
  }, [router]);

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Únete a CFIEL con mi código ${codigo} y gana 200 pts extra al registrarte. Descarga la app en: fiel-client.vercel.app`,
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const copyCodigo = async () => {
    try { await navigator.clipboard.writeText(codigo); } catch { /* fallback */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { label: 'INVITADOS',   value: loading ? '—' : String(data?.total_invitados ?? 0) },
    { label: 'REGISTRADOS', value: loading ? '—' : String(data?.total_registrados ?? 0) },
    { label: 'PTS GANADOS', value: loading ? '—' : String(data?.total_puntos ?? 0) },
  ];

  const referidos = data?.referidos ?? [];

  return (
    <div style={{
      background: '#0a0a14', minHeight: '100dvh', maxWidth: 430,
      margin: '0 auto', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-dm-sans), "DM Sans", system-ui, sans-serif',
      color: '#fff', WebkitFontSmoothing: 'antialiased',
    }}>
      {/* ambient glow */}
      <div style={{
        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 500,
        background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0,
      }}/>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0, position: 'relative', zIndex: 1,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: 'transparent', border: 'none', color: '#fff',
            display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
            padding: '4px 0', marginBottom: 10, fontSize: 14, fontWeight: 500,
            fontFamily: 'inherit',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>
        <h1 style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 36, margin: 0, lineHeight: 1,
          letterSpacing: '0.04em', color: '#fff',
        }}>
          REFERIDOS
        </h1>
        <p style={{ fontSize: 13, color: '#8a8aa3', margin: '4px 0 0' }}>
          Invita amigos · Ganan ustedes dos
        </p>
      </motion.div>

      {/* ── Scroll area ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 100px', position: 'relative', zIndex: 1 }}>

        {/* Code hero card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            position: 'relative', overflow: 'hidden',
            borderRadius: 22, padding: 20, marginBottom: 14,
            background: `
              radial-gradient(circle at 100% 0%, rgba(139,92,246,0.30) 0%, transparent 50%),
              radial-gradient(circle at 0% 100%, rgba(99,102,241,0.25) 0%, transparent 55%),
              linear-gradient(135deg, #1a1530 0%, #100f1f 100%)
            `,
            border: '1.5px solid rgba(129,140,248,0.35)',
            boxShadow: '0 16px 48px rgba(99,102,241,0.2)',
          }}
        >
          {/* decorative circles */}
          <svg style={{ position: 'absolute', top: -10, right: -20, opacity: 0.45, pointerEvents: 'none' }} width="140" height="140" viewBox="0 0 140 140" fill="none">
            {[0, 1, 2, 3].map(i => (
              <circle key={i} cx="100" cy="40" r={20 + i * 14}
                stroke="rgba(165,180,252,0.25)" strokeWidth="0.8"
                strokeDasharray={i % 2 ? '2 6' : '0'}
              />
            ))}
          </svg>

          <div style={{
            fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
            fontSize: 11, letterSpacing: '0.32em', color: '#8a8aa3',
            marginBottom: 6,
          }}>
            TU CÓDIGO DE INVITACIÓN
          </div>

          <div style={{
            fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
            fontSize: 38, margin: '0 0 4px',
            background: 'linear-gradient(90deg, #fff 0%, #818CF8 70%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '0.06em',
            filter: 'drop-shadow(0 0 18px rgba(99,102,241,0.4))',
          }}>
            {loading ? '————————' : codigo}
          </div>

          <p style={{ fontSize: 12, color: '#8a8aa3', margin: '0 0 14px' }}>
            Tu amigo recibe{' '}
            <span style={{ color: '#818CF8', fontWeight: 600 }}>+200 pts</span>
            {' · '}Tú ganas{' '}
            <span style={{ color: '#818CF8', fontWeight: 600 }}>+250 pts</span>
          </p>

          {/* WhatsApp */}
          <button
            onClick={shareWhatsApp}
            style={{
              width: '100%', height: 50, borderRadius: 14, marginBottom: 8,
              background: 'linear-gradient(180deg, #25D366 0%, #1DA851 100%)',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 8px 24px rgba(37,211,102,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            Compartir por WhatsApp
          </button>

          {/* Copy */}
          <button
            onClick={copyCodigo}
            style={{
              width: '100%', height: 46, borderRadius: 14,
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${copied ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.10)'}`,
              color: copied ? '#4ADE80' : '#fff',
              cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 14, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s ease',
            }}
          >
            {copied ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Copiado al portapapeles
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copiar código
              </>
            )}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}
        >
          {stats.map(s => (
            <div key={s.label} style={{
              padding: '14px 10px', borderRadius: 16, textAlign: 'center',
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.18)',
            }}>
              <div style={{
                fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                fontSize: 36, lineHeight: 1, letterSpacing: '0.02em',
                color: s.value !== '0' && s.value !== '—' ? '#818CF8' : '#fff',
                textShadow: s.value !== '0' && s.value !== '—'
                  ? '0 0 14px rgba(99,102,241,0.5)' : 'none',
              }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                fontSize: 10, letterSpacing: '0.18em', color: '#8a8aa3', marginTop: 4,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Friends section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
        >
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
            color: '#8a8aa3', textTransform: 'uppercase',
            margin: '0 4px 10px',
          }}>
            Amigos invitados
          </div>

          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)',
              }}>
                <Sk w={38} h={38} r={19}/>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Sk w="60%" h={12}/>
                  <Sk w="40%" h={10}/>
                </div>
                <Sk w={50} h={20}/>
              </div>
            ))
          ) : referidos.length === 0 ? (
            <div style={{
              padding: '32px 20px', borderRadius: 18, textAlign: 'center',
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(99,102,241,0.18)',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'rgba(99,102,241,0.10)',
                border: '1px solid rgba(99,102,241,0.25)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: '#8a8aa3', marginBottom: 12,
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                Aún no has invitado amigos
              </div>
              <p style={{ fontSize: 12, color: '#8a8aa3', margin: 0, lineHeight: 1.55 }}>
                Comparte tu código y gana{' '}
                <span style={{ color: '#818CF8', fontWeight: 600 }}>250 pts</span>{' '}
                por cada amigo que se registre
              </p>
            </div>
          ) : (
            referidos.map(r => {
              const words = r.nombre.trim().split(' ');
              const initials = words.slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase();
              const shortName = `${words[0]} ${words[1] ? words[1][0] + '.' : ''}`.trim();
              const registered = r.estado === 'registrado';
              return (
                <div key={r.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 0',
                  borderBottom: '0.5px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                    background: registered ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${registered ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.10)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700,
                    color: registered ? '#818CF8' : '#8a8aa3',
                  }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
                      {shortName}
                    </div>
                    <div style={{ fontSize: 11, color: registered ? '#4ADE80' : '#8a8aa3' }}>
                      {registered ? 'Registrado' : 'Pendiente'}
                    </div>
                  </div>
                  {registered && (
                    <div style={{
                      fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                      fontSize: 18, letterSpacing: '0.02em',
                      color: '#4ADE80', flexShrink: 0,
                    }}>
                      +{r.puntos_acreditados}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </motion.div>
      </div>

      <BottomNav/>
    </div>
  );
}
