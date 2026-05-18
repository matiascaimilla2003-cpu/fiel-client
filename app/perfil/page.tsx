'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { getTheme, setTheme as applyTheme } from '@/lib/theme';

const BEBAS = 'var(--font-bebas), "Bebas Neue", sans-serif';

interface UsuarioAPI {
  id: string;
  nombre: string;
  telefono?: string;
  puntos_total: number;
  nivel: string;
  racha_dias: number;
  created_at: string;
}

const TIERS = [
  { id: 'BRONCE',  color: '#B07A4A', pts: 0    },
  { id: 'PLATA',   color: '#B0B5C5', pts: 500  },
  { id: 'ORO',     color: '#F5C16C', pts: 1000 },
  { id: 'PLATINO', color: '#C7D2FE', pts: 2000 },
];

function tierFor(nivel: string) {
  const n = nivel.toLowerCase();
  if (n === 'platino') return TIERS[3];
  if (n === 'oro')     return TIERS[2];
  if (n === 'plata')   return TIERS[1];
  return TIERS[0];
}
function tierIdx(nivel: string): number {
  const n = nivel.toLowerCase();
  if (n === 'platino') return 3;
  if (n === 'oro')     return 2;
  if (n === 'plata')   return 1;
  return 0;
}
function desdeLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
}

function Sk({ w, h, r = 8 }: { w: number | string; h: number; r?: number }) {
  return <div style={{ width: w, height: h, background: 'var(--cfiel-card)', borderRadius: r, flexShrink: 0 }} />;
}

// ── ToggleSwitch ──
function ToggleSwitch({ on, onToggle, colorOn = '#6366F1' }: {
  on: boolean; onToggle: () => void; colorOn?: string;
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 46, height: 26, borderRadius: 100, cursor: 'pointer',
        position: 'relative', flexShrink: 0,
        background: on ? colorOn : 'rgba(255,255,255,0.10)',
        border: on ? `1px solid ${colorOn}88` : '1px solid rgba(255,255,255,0.12)',
        transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      <motion.div
        animate={{ x: on ? 22 : 2 }}
        transition={{ type: 'spring', damping: 22, stiffness: 320 }}
        style={{
          position: 'absolute', top: 3, width: 18, height: 18,
          borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}
      />
    </div>
  );
}

// ── MembershipCard ── (keeps dark-theme colors — it's a premium dark card always)
function MembershipCard({ userName, memberSince, tier, tierColor, code }: {
  userName: string; memberSince: string; tier: string; tierColor: string; code: string;
}) {
  return (
    <div style={{
      position: 'relative', borderRadius: 26, padding: 22,
      background: `
        radial-gradient(circle at 100% 0%, rgba(245,193,108,0.20) 0%, transparent 45%),
        radial-gradient(circle at 0% 100%, rgba(99,102,241,0.25) 0%, transparent 55%),
        linear-gradient(135deg, #1a1530 0%, #100f1f 50%, #0e0e1a 100%)
      `,
      border: `1.5px solid ${tierColor}66`,
      boxShadow: `0 16px 48px ${tierColor}30, inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(99,102,241,0.10)`,
      overflow: 'hidden',
      animation: 'fadeUp 0.5s cubic-bezier(.2,.8,.2,1)',
    }}>
      <svg style={{ position: 'absolute', top: -24, right: -24, opacity: 0.5, pointerEvents: 'none' }}
        width="180" height="180" viewBox="0 0 180 180" fill="none">
        <defs>
          <radialGradient id="memHalo" cx="0.7" cy="0.3" r="0.7">
            <stop offset="0" stopColor={`${tierColor}77`}/>
            <stop offset="1" stopColor={`${tierColor}00`}/>
          </radialGradient>
        </defs>
        <circle cx="130" cy="50" r="80" fill="url(#memHalo)"/>
        {[0,1,2,3,4,5].map(i => (
          <circle key={i} cx="130" cy="50" r={20 + i * 14}
            stroke={`${tierColor}33`} strokeWidth="0.7"
            strokeDasharray={i % 2 ? '2 6' : '0'}/>
        ))}
      </svg>

      <div style={{ position: 'absolute', top: 18, right: 22, display: 'flex', alignItems: 'baseline', opacity: 0.7 }}>
        <span style={{ fontFamily: BEBAS, fontSize: 14, color: '#6366F1' }}>C</span>
        <span style={{ fontFamily: BEBAS, fontSize: 14, color: '#fff', letterSpacing: '0.06em' }}>FIEL</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6, position: 'relative' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            position: 'absolute', inset: -3, borderRadius: '50%',
            background: `conic-gradient(${tierColor} 0deg, ${tierColor}aa 180deg, ${tierColor} 360deg)`,
            filter: `drop-shadow(0 0 10px ${tierColor}99)`,
          }}/>
          <div style={{
            position: 'relative', width: 68, height: 68, borderRadius: '50%',
            background: 'linear-gradient(135deg, #2a2540, #14121f)',
            border: '2px solid #0e0e1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: BEBAS, fontSize: 32, color: '#fff', letterSpacing: '0.04em',
          }}>{(userName[0] ?? '?').toUpperCase()}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 28, lineHeight: 1, letterSpacing: '0.02em', color: '#fff' }}>
            {userName}
          </div>
          <div style={{ fontSize: 12, color: '#8a8aa3', marginTop: 4 }}>Miembro desde {memberSince}</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6,
            padding: '4px 10px 4px 8px', borderRadius: 100,
            background: `${tierColor}1f`, border: `1px solid ${tierColor}80`,
            fontFamily: BEBAS, fontSize: 11, letterSpacing: '0.16em', color: tierColor,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zM5 18h14v2H5z"/>
            </svg>
            NIVEL {tier}
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 18, paddingTop: 14,
        borderTop: '1px dashed rgba(99,102,241,0.20)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: BEBAS, fontSize: 10, letterSpacing: '0.22em', color: '#5b5b75' }}>ID DE SOCIO</div>
          <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#fff', marginTop: 2 }}>{code}</div>
        </div>
        <div style={{
          width: 40, height: 28, borderRadius: 5, position: 'relative',
          background: `linear-gradient(135deg, ${tierColor}, ${tierColor}88)`,
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
        }}>
          <div style={{ position: 'absolute', inset: 6, borderRadius: 2, border: '1px solid rgba(255,255,255,0.25)' }}/>
          <div style={{ position: 'absolute', top: 13, left: 6, right: 6, height: 1, background: 'rgba(0,0,0,0.25)' }}/>
          <div style={{ position: 'absolute', left: 19, top: 6, bottom: 6, width: 1, background: 'rgba(0,0,0,0.25)' }}/>
        </div>
      </div>
    </div>
  );
}

// ── TierProgress ──
function TierProgress({ points, nivelIdx }: { points: number; nivelIdx: number }) {
  const current = TIERS[nivelIdx];
  const next    = TIERS[nivelIdx + 1];
  const needed  = next ? next.pts - points : 0;

  return (
    <div style={{
      position: 'relative', borderRadius: 22, padding: 18, overflow: 'hidden',
      background: `
        radial-gradient(circle at 100% 0%, ${current.color}22 0%, transparent 50%),
        linear-gradient(180deg, var(--cfiel-card), var(--cfiel-card2))
      `,
      border: '1px solid var(--cfiel-border)',
      animation: 'fadeUp 0.5s cubic-bezier(.2,.8,.2,1) 0.1s both',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: BEBAS, fontSize: 11, letterSpacing: '0.28em', color: '#8a8aa3' }}>NIVEL ACTUAL</div>
          <div style={{
            fontFamily: BEBAS, fontSize: 32, lineHeight: 1, marginTop: 2,
            color: current.color, textShadow: `0 0 18px ${current.color}66`, letterSpacing: '0.04em',
          }}>{current.id}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--cfiel-text)', lineHeight: 1 }}>
            {points.toLocaleString('es-CL')}{' '}
            <span style={{ fontSize: 12, color: '#8a8aa3', fontWeight: 500 }}>pts</span>
          </div>
          <div style={{ fontSize: 11, color: '#8a8aa3', marginTop: 2 }}>acumulados</div>
          {next && (
            <div style={{ fontSize: 11, color: '#818CF8', marginTop: 4, fontWeight: 600 }}>
              {needed.toLocaleString('es-CL')} pts para {next.id} →
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {TIERS.map((t, i) => {
          const reached   = i <= nivelIdx;
          const isCurrent = i === nivelIdx;
          const prevColor = TIERS[Math.max(0, i - 1)].color;
          return (
            <div key={t.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%', height: 5, borderRadius: 100, position: 'relative',
                background: reached
                  ? `linear-gradient(90deg, ${prevColor}, ${t.color})`
                  : 'rgba(255,255,255,0.06)',
                boxShadow: reached ? `0 0 8px ${t.color}66` : 'none',
              }}>
                {isCurrent && (
                  <div style={{
                    position: 'absolute', right: -3, top: -3,
                    width: 10, height: 10, borderRadius: '50%',
                    background: t.color,
                    boxShadow: `0 0 10px ${t.color}, 0 0 4px #0e0e1a inset`,
                    animation: 'glowPulse 2s ease-in-out infinite',
                  }}/>
                )}
              </div>
              <div style={{
                fontFamily: BEBAS, fontSize: 10, letterSpacing: '0.14em', marginTop: 8,
                color: isCurrent ? t.color : reached ? '#8a8aa3' : '#5b5b75',
              }}>{t.id}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── StatsGrid ──
interface StatItem { label: string; value: string; color: string; sub?: string; icon: React.ReactNode }
function StatsGrid({ items }: { items: StatItem[] }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
      animation: 'fadeUp 0.5s cubic-bezier(.2,.8,.2,1) 0.15s both',
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          position: 'relative', padding: '14px 14px', borderRadius: 16, overflow: 'hidden',
          background: 'linear-gradient(180deg, var(--cfiel-card), var(--cfiel-card2))',
          border: '1px solid var(--cfiel-border)',
        }}>
          <div style={{
            position: 'absolute', top: -16, right: -16, width: 60, height: 60,
            background: `radial-gradient(circle, ${it.color}33 0%, transparent 65%)`,
            pointerEvents: 'none',
          }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, position: 'relative' }}>
            <div style={{
              width: 22, height: 22, borderRadius: 7, flexShrink: 0,
              background: `${it.color}22`, color: it.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{it.icon}</div>
            <div style={{ fontFamily: BEBAS, fontSize: 10, letterSpacing: '0.20em', color: '#8a8aa3' }}>{it.label}</div>
          </div>
          <div style={{
            fontFamily: BEBAS, fontSize: 24, lineHeight: 1,
            color: it.color, textShadow: `0 0 14px ${it.color}55`, letterSpacing: '0.02em',
          }}>{it.value}</div>
          {it.sub && <div style={{ fontSize: 11, color: '#5b5b75', marginTop: 2 }}>{it.sub}</div>}
        </div>
      ))}
    </div>
  );
}

// ── MenuRow ──
function MenuRow({ icon, title, sub, badge, badgeColor, onClick }: {
  icon: React.ReactNode; title: string; sub?: string;
  badge?: string; badgeColor?: string; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 16, cursor: onClick ? 'pointer' : 'default',
        background: 'linear-gradient(180deg, var(--cfiel-card), var(--cfiel-card2))',
        border: '1px solid var(--cfiel-border)',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.15)',
        color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cfiel-text)' }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: '#8a8aa3', marginTop: 2 }}>{sub}</div>}
      </div>
      {badge && (
        <span style={{
          padding: '3px 10px', borderRadius: 100, flexShrink: 0,
          background: 'rgba(99,102,241,0.10)',
          border: `1px solid ${badgeColor ?? '#818CF8'}55`,
          color: badgeColor ?? '#818CF8',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
        }}>{badge}</span>
      )}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5b5b75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  );
}

// ── LogoutModal ──
function LogoutModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(5,5,12,0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 340 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #15151f, #0e0e18)',
          border: '1px solid rgba(99,102,241,0.22)',
          borderRadius: 28, padding: '32px 22px',
          width: '100%', maxWidth: 320, textAlign: 'center',
        }}
      >
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{
            position: 'absolute', inset: -16,
            background: 'radial-gradient(circle, rgba(248,113,113,0.30), transparent 65%)',
            pointerEvents: 'none',
          }}/>
          <div style={{
            width: 60, height: 60, borderRadius: 18, position: 'relative',
            background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F87171',
            boxShadow: 'inset 0 0 18px rgba(248,113,113,0.15)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </div>
        </div>
        <div style={{ fontFamily: BEBAS, fontSize: 26, color: '#fff', letterSpacing: '0.04em', marginBottom: 6 }}>
          ¿CERRAR SESIÓN?
        </div>
        <div style={{ fontSize: 13, color: '#8a8aa3', lineHeight: 1.55, marginBottom: 18 }}>
          Tu progreso, puntos y misiones se guardan.<br/>Puedes volver cuando quieras.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, background: 'transparent', color: '#8a8aa3',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100,
              padding: '13px 0', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >Cancelar</button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1.4, padding: '13px 0', borderRadius: 100,
              background: 'linear-gradient(135deg, #F87171, #DC2626)',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 15, fontWeight: 600,
              boxShadow: '0 8px 24px rgba(248,113,113,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >Cerrar sesión</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── EditProfileModal ──
function EditProfileModal({ onClose, initialName, telefono, userId, onSave }: {
  onClose: () => void; initialName: string; telefono?: string;
  userId: string; onSave: (nombre: string) => void;
}) {
  const [name, setSaveName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/usuarios/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: name.trim() }),
      });
      if (res.ok) {
        onSave(name.trim());
        onClose();
        return;
      }
    } catch {}
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(5,5,12,0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 340 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #15151f, #0e0e18)',
          border: '1px solid rgba(99,102,241,0.22)',
          borderRadius: 28, padding: '28px 22px',
          width: '100%', maxWidth: 380,
        }}
      >
        <div style={{ fontFamily: BEBAS, fontSize: 28, color: '#fff', letterSpacing: '0.04em', marginBottom: 4 }}>
          EDITAR PERFIL
        </div>
        <div style={{ fontSize: 13, color: '#8a8aa3', marginBottom: 18 }}>Actualiza tus datos de contacto</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', color: '#8a8aa3', fontWeight: 600, marginBottom: 6 }}>NOMBRE COMPLETO</div>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: '0 14px', height: 50,
            }}>
              <input
                value={name}
                onChange={e => setSaveName(e.target.value)}
                placeholder="Tu nombre"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 500,
                }}
              />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', color: '#8a8aa3', fontWeight: 600, marginBottom: 6 }}>TELÉFONO</div>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: 12, padding: '0 14px', height: 50, opacity: 0.6,
            }}>
              <span style={{ color: '#8a8aa3', fontSize: 15, fontWeight: 500 }}>
                {telefono ?? 'No registrado'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, background: 'transparent', color: '#8a8aa3',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100,
              padding: '13px 0', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >Cancelar</button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            style={{
              flex: 1.4, background: saving ? 'rgba(255,255,255,0.5)' : '#fff',
              color: '#0a0a0a', border: 'none',
              borderRadius: 100, padding: '13px 0', fontSize: 14, fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              transition: 'background 0.2s',
            }}
          >{saving ? 'Guardando...' : 'Guardar cambios'}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── NotificacionesModal ──
interface NotifPrefs { promos: boolean; puntos: boolean; racha: boolean }
const DEFAULT_NOTIF: NotifPrefs = { promos: true, puntos: true, racha: true };

function NotificacionesModal({ onClose }: { onClose: () => void }) {
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT_NOTIF);

  useEffect(() => {
    const saved = localStorage.getItem('cfiel_notif_prefs');
    if (saved) {
      try { setPrefs(JSON.parse(saved)); } catch {}
    }
  }, []);

  const toggle = (key: keyof NotifPrefs) => {
    setPrefs(p => {
      const next = { ...p, [key]: !p[key] };
      localStorage.setItem('cfiel_notif_prefs', JSON.stringify(next));
      return next;
    });
  };

  const rows: { key: keyof NotifPrefs; label: string; sub: string }[] = [
    { key: 'promos', label: 'Nuevas promociones', sub: 'Ofertas y beneficios exclusivos' },
    { key: 'puntos', label: 'Puntos acreditados', sub: 'Confirmación de cada compra' },
    { key: 'racha',  label: 'Recordatorio de racha', sub: 'Para que no pierdas tu racha' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(5,5,12,0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 340 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #15151f, #0e0e18)',
          border: '1px solid rgba(99,102,241,0.22)',
          borderRadius: 28, padding: '28px 22px',
          width: '100%', maxWidth: 380,
        }}
      >
        <div style={{ fontFamily: BEBAS, fontSize: 28, color: '#fff', letterSpacing: '0.04em', marginBottom: 4 }}>
          NOTIFICACIONES
        </div>
        <div style={{ fontSize: 13, color: '#8a8aa3', marginBottom: 20 }}>
          Elige qué avisos quieres recibir
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {rows.map(({ key, label, sub }, i) => (
            <div
              key={key}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 0',
                borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{label}</div>
                <div style={{ fontSize: 11, color: '#8a8aa3', marginTop: 2 }}>{sub}</div>
              </div>
              <ToggleSwitch on={prefs[key]} onToggle={() => toggle(key)} colorOn="#4ADE80" />
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', marginTop: 20, padding: '13px 0', borderRadius: 100,
            background: '#fff', color: '#0a0a0a', border: 'none',
            fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >Listo</button>
      </motion.div>
    </motion.div>
  );
}

// ── PrivacidadModal ──
function PrivacidadModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(5,5,12,0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 340 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #15151f, #0e0e18)',
          border: '1px solid rgba(99,102,241,0.22)',
          borderRadius: 28, padding: '28px 22px',
          width: '100%', maxWidth: 380,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818CF8',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        </div>
        <div style={{ fontFamily: BEBAS, fontSize: 26, color: '#fff', letterSpacing: '0.04em', marginBottom: 4, textAlign: 'center' }}>
          PRIVACIDAD Y DATOS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
          {[
            { title: 'Tus datos son tuyos', text: 'CFIEL no comparte tu información personal con terceros bajo ninguna circunstancia.' },
            { title: 'Datos que guardamos', text: 'Solo almacenamos tu nombre, teléfono y el historial de puntos necesario para el programa.' },
            { title: '¿Quieres eliminar tu cuenta?', text: 'Escríbenos a privacidad@cfiel.cl y procesaremos tu solicitud en 72 horas.' },
          ].map(({ title, text }) => (
            <div key={title} style={{
              padding: '12px 14px', borderRadius: 14,
              background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.14)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: '#8a8aa3', lineHeight: 1.55 }}>{text}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', marginTop: 20, padding: '13px 0', borderRadius: 100,
            background: '#fff', color: '#0a0a0a', border: 'none',
            fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >Entendido</button>
      </motion.div>
    </motion.div>
  );
}

// ── AyudaModal ──
function AyudaModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(5,5,12,0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 340 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #15151f, #0e0e18)',
          border: '1px solid rgba(99,102,241,0.22)',
          borderRadius: 28, padding: '28px 22px',
          width: '100%', maxWidth: 380, textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ADE80',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
        </div>
        <div style={{ fontFamily: BEBAS, fontSize: 26, color: '#fff', letterSpacing: '0.04em', marginBottom: 6 }}>
          AYUDA Y CONTACTO
        </div>
        <div style={{ fontSize: 13, color: '#8a8aa3', lineHeight: 1.55, marginBottom: 20 }}>
          ¿Necesitas ayuda? Estamos disponibles<br/>de lunes a viernes de 9:00 a 18:00.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => window.open('https://wa.me/56912345678', '_blank')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px 0', borderRadius: 100,
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 15, fontWeight: 600,
              boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            Escribir por WhatsApp
          </button>
          <button
            onClick={() => { window.location.href = 'mailto:hola@cfiel.cl'; }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px 0', borderRadius: 100,
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.30)',
              color: '#818CF8', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 15, fontWeight: 600,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Enviar email
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '12px 0', borderRadius: 100, background: 'transparent',
              color: '#8a8aa3', border: '1px solid rgba(255,255,255,0.08)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >Cerrar</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── TerminosModal ──
function TerminosModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(5,5,12,0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 340 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #15151f, #0e0e18)',
          border: '1px solid rgba(99,102,241,0.22)',
          borderRadius: 28, padding: '28px 22px',
          width: '100%', maxWidth: 380,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818CF8',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="8" y1="13" x2="16" y2="13"/>
              <line x1="8" y1="17" x2="14" y2="17"/>
            </svg>
          </div>
        </div>
        <div style={{ fontFamily: BEBAS, fontSize: 26, color: '#fff', letterSpacing: '0.04em', marginBottom: 16, textAlign: 'center' }}>
          TÉRMINOS Y CONDICIONES
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { title: 'Qué es CFIEL', text: 'CFIEL es un servicio de fidelización de clientes para botillerías y comercios en Chile.' },
            { title: 'Uso del programa', text: 'Al usar la app aceptas nuestros términos de servicio. Los puntos son intransferibles y no tienen valor monetario.' },
            { title: 'Vigencia de puntos', text: 'Los puntos acumulados tienen una vigencia de 12 meses desde la última transacción.' },
            { title: 'Más información', text: 'Para consultar los términos completos visita cfiel.cl/terminos o escríbenos a contacto@cfiel.cl' },
          ].map(({ title, text }) => (
            <div key={title} style={{
              padding: '12px 14px', borderRadius: 14,
              background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.14)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: '#8a8aa3', lineHeight: 1.55 }}>{text}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', marginTop: 20, padding: '13px 0', borderRadius: 100,
            background: '#fff', color: '#0a0a0a', border: 'none',
            fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >Entendido</button>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════
type ModalType = 'logout' | 'edit' | 'notif' | 'privacidad' | 'ayuda' | 'terminos' | null;

export default function PerfilPage() {
  const router = useRouter();
  const [usuario, setUsuario]     = useState<UsuarioAPI | null>(null);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState<ModalType>(null);
  const [codigoRef, setCodigoRef] = useState('');
  const [isDark, setIsDark]       = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem('cfiel_user_id');
    if (!uid) { router.replace('/'); return; }
    setCodigoRef(localStorage.getItem('cfiel_codigo_referido') ?? '');
    setIsDark(getTheme() === 'dark');

    fetch(`/api/usuarios/${uid}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.usuario) setUsuario(data.usuario); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cfiel_user_id');
    localStorage.removeItem('cfiel_nombre');
    localStorage.removeItem('cfiel_codigo_referido');
    router.replace('/');
  };

  const toggleTheme = () => {
    const next = !isDark;
    applyTheme(next ? 'dark' : 'light');
    setIsDark(next);
  };

  if (loading) {
    return (
      <div style={{ background: 'var(--cfiel-bg)', minHeight: '100dvh', maxWidth: 430, margin: '0 auto' }}>
        <div style={{ padding: '20px 20px 90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Sk w={100} h={32} r={6} />
            <Sk w={36} h={36} r={10} />
          </div>
          <Sk w="100%" h={180} r={26} />
          <div style={{ height: 12 }} />
          <Sk w="100%" h={140} r={22} />
          <div style={{ height: 12 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            {[0,1,2,3].map(i => <Sk key={i} w="100%" h={80} r={16} />)}
          </div>
          {[0,1,2,3].map(i => <div key={i} style={{ marginBottom: 8 }}><Sk w="100%" h={60} r={16} /></div>)}
        </div>
        <BottomNav />
      </div>
    );
  }

  const u = usuario ?? {
    nombre: '—', puntos_total: 0, nivel: 'bronce',
    racha_dias: 0, created_at: new Date().toISOString(), id: '',
  };
  const nivelKey  = u.nivel.toLowerCase();
  const tier      = tierFor(nivelKey);
  const idx       = tierIdx(nivelKey);
  const firstName = u.nombre.split(' ')[0] ?? '—';

  const STATS: StatItem[] = [
    {
      label: 'PUNTOS LIFETIME', value: u.puntos_total.toLocaleString('es-CL'), color: '#818CF8',
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M8 12h8"/></svg>,
    },
    {
      label: 'CANJES REALIZADOS', value: '—', color: '#C4B5FD', sub: 'Próximamente',
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7"/></svg>,
    },
    {
      label: 'RACHA ACTUAL', value: `${u.racha_dias}d`, color: '#4ADE80', sub: 'Sigue así',
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4-.5 2 .5 3 1 3-.5-3 0-7 2-10z"/></svg>,
    },
    {
      label: 'MIEMBRO DESDE', value: desdeLabel(u.created_at), color: '#F5C16C',
      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    },
  ];

  return (
    <div style={{
      background: 'var(--cfiel-bg)', minHeight: '100dvh', maxWidth: 430,
      margin: '0 auto', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 500,
        background: `radial-gradient(circle, ${tier.color}0A 0%, transparent 60%)`,
        pointerEvents: 'none',
      }}/>

      {/* Header */}
      <div style={{
        padding: '20px 20px 0', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', position: 'relative',
      }}>
        <h1 style={{ fontFamily: BEBAS, fontSize: 32, margin: 0, letterSpacing: '0.04em', color: 'var(--cfiel-text)' }}>PERFIL</h1>
        <button
          onClick={() => setModal('edit')}
          aria-label="Editar perfil"
          style={{
            width: 40, height: 40, borderRadius: 12, border: '1px solid rgba(99,102,241,0.18)',
            background: 'rgba(99,102,241,0.10)',
            color: '#818CF8', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ padding: '12px 20px 100px', position: 'relative' }}>
        <MembershipCard
          userName={firstName.toUpperCase()}
          memberSince={desdeLabel(u.created_at)}
          tier={tier.id}
          tierColor={tier.color}
          code={codigoRef || u.id || 'CFIEL-000000'}
        />

        <div style={{ height: 12 }} />
        <TierProgress points={u.puntos_total} nivelIdx={idx}/>

        <div style={{ height: 12 }} />
        <StatsGrid items={STATS}/>

        {/* ── CUENTA ── */}
        <div style={{
          fontFamily: BEBAS, fontSize: 11, letterSpacing: '0.22em',
          color: '#8a8aa3', margin: '24px 4px 8px',
        }}>CUENTA</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <MenuRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>}
            title="Editar perfil" sub="Nombre, teléfono"
            onClick={() => setModal('edit')}
          />
          <MenuRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
            title="Referidos" badge="3 amigos" badgeColor="#C4B5FD"
            onClick={() => router.push('/referidos')}
          />
          <MenuRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>}
            title="Mis canjes activos" badge="2" badgeColor="#818CF8"
            onClick={() => router.push('/beneficios')}
          />
          <MenuRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>}
            title="Mi historial"
            onClick={() => router.push('/historial')}
          />
        </div>

        {/* ── PREFERENCIAS ── */}
        <div style={{
          fontFamily: BEBAS, fontSize: 11, letterSpacing: '0.22em',
          color: '#8a8aa3', margin: '20px 4px 8px',
        }}>PREFERENCIAS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Theme toggle row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', borderRadius: 16,
            background: 'linear-gradient(180deg, var(--cfiel-card), var(--cfiel-card2))',
            border: '1px solid var(--cfiel-border)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: isDark ? 'rgba(99,102,241,0.10)' : 'rgba(245,193,108,0.12)',
              border: isDark ? '1px solid rgba(99,102,241,0.15)' : '1px solid rgba(245,193,108,0.25)',
              color: isDark ? '#818CF8' : '#F5C16C',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.25s, border-color 0.25s, color 0.25s',
            }}>
              {isDark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cfiel-text)' }}>Apariencia</div>
              <div style={{ fontSize: 11, color: '#8a8aa3', marginTop: 2 }}>
                {isDark ? 'Modo oscuro' : 'Modo claro'}
              </div>
            </div>
            <ToggleSwitch on={!isDark} onToggle={toggleTheme} colorOn="#F5C16C" />
          </div>

          <MenuRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/></svg>}
            title="Notificaciones" badge="ON" badgeColor="#4ADE80"
            onClick={() => setModal('notif')}
          />
          <MenuRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
            title="Privacidad y datos"
            onClick={() => setModal('privacidad')}
          />
          <MenuRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
            title="Ayuda y contacto"
            onClick={() => setModal('ayuda')}
          />
          <MenuRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/></svg>}
            title="Términos y condiciones"
            onClick={() => setModal('terminos')}
          />
        </div>

        {/* ── Logout ── */}
        <div style={{ marginTop: 20 }}>
          <div
            onClick={() => setModal('logout')}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 16, cursor: 'pointer',
              background: 'rgba(248,113,113,0.06)',
              border: '1px solid rgba(248,113,113,0.20)',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)',
              color: '#F87171', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#F87171' }}>Cerrar sesión</div>
              <div style={{ fontSize: 11, color: '#8a8aa3', marginTop: 2 }}>Tu progreso queda guardado</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5b5b75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '24px 0 4px', fontSize: 11, color: '#5b5b75', letterSpacing: '0.04em' }}>
          CFIEL v1.0.4 ·{' '}
          <span style={{ color: '#818CF8' }}>Hecho en Chile</span>
        </div>
      </div>

      <BottomNav/>

      <AnimatePresence>
        {modal === 'logout' && (
          <LogoutModal key="logout" onClose={() => setModal(null)} onConfirm={handleLogout}/>
        )}
        {modal === 'edit' && (
          <EditProfileModal
            key="edit"
            onClose={() => setModal(null)}
            initialName={u.nombre}
            telefono={u.telefono}
            userId={u.id}
            onSave={nombre => setUsuario(prev => prev ? { ...prev, nombre } : prev)}
          />
        )}
        {modal === 'notif' && (
          <NotificacionesModal key="notif" onClose={() => setModal(null)}/>
        )}
        {modal === 'privacidad' && (
          <PrivacidadModal key="privacidad" onClose={() => setModal(null)}/>
        )}
        {modal === 'ayuda' && (
          <AyudaModal key="ayuda" onClose={() => setModal(null)}/>
        )}
        {modal === 'terminos' && (
          <TerminosModal key="terminos" onClose={() => setModal(null)}/>
        )}
      </AnimatePresence>
    </div>
  );
}
