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

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

export default function ReferidosPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [data, setData] = useState<ReferidosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('cfiel_user_id');
    if (!id) { router.replace('/'); return; }

    setCodigo(`CFIEL-${id.substring(0, 6).toUpperCase()}`);

    fetch(`/api/referidos?usuario_id=${id}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() =>
        setData({ referidos: [], total_invitados: 0, total_registrados: 0, total_puntos: 0 }),
      )
      .finally(() => setLoading(false));
  }, [router]);

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Únete a CFIEL con mi código ${codigo} y gana 200 pts extra al registrarte. Descarga la app en: fiel-client.vercel.app`,
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const copyCodigo = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
    } catch {
      /* fallback: do nothing */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const STATS = [
    { label: 'Invitados', value: loading ? '…' : String(data?.total_invitados ?? 0) },
    { label: 'Registrados', value: loading ? '…' : String(data?.total_registrados ?? 0) },
    { label: 'Pts ganados', value: loading ? '…' : String(data?.total_puntos ?? 0) },
  ];

  return (
    <div style={{
      background: '#0a0a0a',
      minHeight: '100dvh',
      maxWidth: 430,
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 24px 14px',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}>
        <div
          onClick={() => router.back()}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            cursor: 'pointer', marginBottom: 12, width: 'fit-content',
          }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.55)" strokeWidth={2.5}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>Volver</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
          fontSize: 32, color: '#fff', letterSpacing: 2, lineHeight: 1,
        }}>
          REFERIDOS
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
          Invita amigos y gana puntos
        </div>
      </div>

      <div style={{ padding: '20px 16px 100px', overflowY: 'auto' }}>

        {/* Code card */}
        <motion.div
          {...fadeUp(0.05)}
          style={{
            background: 'linear-gradient(135deg, #1a1508 0%, #141414 100%)',
            border: '0.5px solid rgba(212,168,71,0.4)',
            borderRadius: 24,
            padding: '24px 20px',
            marginBottom: 16,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 140, height: 140,
            background: 'radial-gradient(circle, rgba(212,168,71,0.18), transparent)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          <div style={{
            fontSize: 10, fontWeight: 600,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '1.5px', textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            Tu código de invitación
          </div>

          <div style={{
            fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
            fontSize: 44, letterSpacing: 4,
            color: '#6366F1',
            lineHeight: 1,
            marginBottom: 6,
          }}>
            {loading ? '———————' : codigo}
          </div>

          <div style={{
            fontSize: 11, color: 'rgba(255,255,255,0.4)',
            marginBottom: 20,
          }}>
            Tu amigo recibe +200 pts · Tú ganas +250 pts
          </div>

          {/* WhatsApp button */}
          <button
            onClick={shareWhatsApp}
            style={{
              width: '100%',
              background: '#25D366',
              border: 'none',
              borderRadius: 14,
              padding: '13px 16px',
              marginBottom: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'pointer',
              color: '#fff', fontSize: 14, fontWeight: 700,
              fontFamily: 'inherit',
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Compartir por WhatsApp
          </button>

          {/* Copy button */}
          <button
            onClick={copyCodigo}
            style={{
              width: '100%',
              background: copied ? 'rgba(212,168,71,0.15)' : 'rgba(255,255,255,0.07)',
              border: `0.5px solid ${copied ? 'rgba(212,168,71,0.5)' : 'rgba(255,255,255,0.13)'}`,
              borderRadius: 14,
              padding: '12px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'pointer',
              color: copied ? '#6366F1' : 'rgba(255,255,255,0.7)',
              fontSize: 13, fontWeight: 600,
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ ¡Código copiado!' : 'Copiar código'}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          {...fadeUp(0.12)}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}
        >
          {STATS.map(({ label, value }) => (
            <div
              key={label}
              style={{
                background: '#141414',
                border: '0.5px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '14px 10px',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                fontSize: 30, letterSpacing: 1,
                color: '#818CF8',
                lineHeight: 1,
                marginBottom: 4,
              }}>
                {value}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>
                {label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* List */}
        <motion.div {...fadeUp(0.2)}>
          <div style={{
            fontSize: 10, fontWeight: 600,
            color: 'rgba(255,255,255,0.28)',
            letterSpacing: '1.2px', textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            Amigos invitados
          </div>

          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} style={{
                background: '#141414',
                borderRadius: 14, padding: '14px 16px', marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ width: 36, height: 36, background: '#1e1e1e', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ width: 100, height: 12, background: '#1e1e1e', borderRadius: 4, marginBottom: 6 }} />
                  <div style={{ width: 70, height: 10, background: '#1a1a1a', borderRadius: 4 }} />
                </div>
              </div>
            ))
          ) : (data?.referidos ?? []).length === 0 ? (
            <div style={{
              background: '#141414',
              border: '0.5px solid rgba(255,255,255,0.07)',
              borderRadius: 18,
              padding: '40px 20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.35 }}>🤝</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                Aún no has invitado amigos
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', lineHeight: 1.55 }}>
                Comparte tu código y gana{' '}
                <span style={{ color: '#818CF8' }}>250 pts</span>{' '}
                por cada amigo que se registre
              </div>
            </div>
          ) : (
            (data?.referidos ?? []).map((r) => {
              const words = r.nombre.trim().split(' ');
              const initials = words.slice(0, 2).map((w) => w[0] ?? '').join('').toUpperCase();
              const shortName = `${words[0]} ${words[1] ? words[1][0] + '.' : ''}`.trim();
              const isRegistered = r.estado === 'registrado';
              return (
                <div
                  key={r.id}
                  style={{
                    background: '#141414',
                    border: '0.5px solid rgba(255,255,255,0.07)',
                    borderRadius: 14,
                    padding: '12px 16px',
                    marginBottom: 8,
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <div style={{
                    width: 38, height: 38, flexShrink: 0,
                    background: isRegistered ? 'rgba(212,168,71,0.15)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${isRegistered ? 'rgba(212,168,71,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700,
                    color: isRegistered ? '#6366F1' : 'rgba(255,255,255,0.4)',
                  }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
                      {shortName}
                    </div>
                    <div style={{ fontSize: 11, color: isRegistered ? '#4CAF50' : 'rgba(255,255,255,0.35)' }}>
                      {isRegistered ? 'Registrado ✓' : 'Pendiente…'}
                    </div>
                  </div>
                  {isRegistered && (
                    <div style={{
                      fontFamily: 'var(--font-bebas), "Bebas Neue", sans-serif',
                      fontSize: 20, letterSpacing: 1,
                      color: '#6366F1', flexShrink: 0,
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

      <BottomNav />
    </div>
  );
}
