// CFIEL · Perfil screen
const { useState } = React;

// ───── status bar ─────
const StatusBar = () => (
  <div className="status-bar">
    <span>9:41</span>
    <div className="icons">
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><path d="M1 8h2v3H1zM5 6h2v5H5zM9 4h2v7H9zM13 2h2v9h-2z" fill="currentColor"/></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1 4.5C3 2.5 5.5 1.5 8 1.5s5 1 7 3M3 7c1.5-1.3 3-2 5-2s3.5.7 5 2M5.5 9.5c.7-.6 1.6-1 2.5-1s1.8.4 2.5 1"/></svg>
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="1" y="1" width="21" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" opacity="0.5"/><rect x="3" y="3" width="17" height="6" rx="1.2" fill="currentColor"/><rect x="23" y="4" width="1.5" height="4" rx="0.5" fill="currentColor" opacity="0.5"/></svg>
    </div>
  </div>
);

// ───── bottom nav ─────
const BottomNav = ({ active = 'perfil', onChange }) => {
  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></svg>
    )},
    { id: 'beneficios', label: 'Beneficios', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
    )},
    { id: 'historial', label: 'Historial', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    )},
    { id: 'perfil', label: 'Perfil', icon: active === 'perfil'
        ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-8 2.5-8 6v2h16v-2c0-3.5-4-6-8-6z"/></svg>
        : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
    },
  ];
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <div key={t.id} className={`nav-item ${active === t.id ? 'active' : ''}`} onClick={() => onChange?.(t.id)}>
          <div className="nav-icon">{t.icon}</div>
          <span className="nav-label">{t.label}</span>
        </div>
      ))}
    </nav>
  );
};

// ───── membership card (hero) ─────
const MembershipCard = ({ userName, memberSince, tier, tierColor, points, code }) => (
  <div style={{
    position: 'relative',
    borderRadius: 26,
    padding: 22,
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
    {/* decorative — concentric rings + dots */}
    <svg style={{ position: 'absolute', top: -24, right: -24, opacity: 0.5, pointerEvents: 'none' }} width="180" height="180" viewBox="0 0 180 180" fill="none">
      <defs>
        <radialGradient id="memHalo" cx="0.7" cy="0.3" r="0.7">
          <stop offset="0" stopColor={`${tierColor}77`}/>
          <stop offset="1" stopColor={`${tierColor}00`}/>
        </radialGradient>
      </defs>
      <circle cx="130" cy="50" r="80" fill="url(#memHalo)"/>
      {[0,1,2,3,4,5].map(i => (
        <circle key={i} cx="130" cy="50" r={20 + i*14} stroke={`${tierColor}33`} strokeWidth="0.7" strokeDasharray={i % 2 ? '2 6' : '0'}/>
      ))}
    </svg>

    {/* CFIEL embossed at top */}
    <div style={{ position: 'absolute', top: 18, right: 22, display: 'flex', alignItems: 'baseline', opacity: 0.7 }}>
      <span className="bebas" style={{ fontSize: 14, color: 'var(--indigo)' }}>C</span>
      <span className="bebas" style={{ fontSize: 14, color: '#fff', letterSpacing: '0.06em' }}>FIEL</span>
    </div>

    {/* Avatar + name row */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6, position: 'relative' }}>
      {/* avatar with tier ring */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          position: 'absolute', inset: -3, borderRadius: '50%',
          background: `conic-gradient(${tierColor} 0deg, ${tierColor}aa 180deg, ${tierColor} 360deg)`,
          padding: 2, filter: `drop-shadow(0 0 10px ${tierColor}99)`,
        }}/>
        <div style={{
          position: 'relative', width: 68, height: 68, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2a2540, #14121f)',
          border: '2px solid #0e0e1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Bebas Neue', fontSize: 32, color: '#fff',
          letterSpacing: '0.04em',
        }}>{userName[0]}</div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="bebas" style={{ fontSize: 28, lineHeight: 1, letterSpacing: '0.02em' }}>{userName}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Miembro desde {memberSince}</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          marginTop: 6,
          padding: '4px 10px 4px 8px',
          borderRadius: 100,
          background: `${tierColor}1f`,
          border: `1px solid ${tierColor}80`,
          fontFamily: 'Bebas Neue', fontSize: 11, letterSpacing: '0.16em',
          color: tierColor,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zM5 18h14v2H5z"/></svg>
          NIVEL {tier}
        </div>
      </div>
    </div>

    {/* bottom strip — id + chip */}
    <div style={{
      marginTop: 18, paddingTop: 14, borderTop: '1px dashed rgba(99,102,241,0.20)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <div className="bebas" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--text-dim)' }}>ID DE SOCIO</div>
        <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#fff', marginTop: 2 }}>{code}</div>
      </div>
      {/* SIM chip */}
      <div style={{
        width: 40, height: 28, borderRadius: 5,
        background: `linear-gradient(135deg, ${tierColor}, ${tierColor}88)`,
        position: 'relative',
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

// ───── tier progress ─────
const tiers = [
  { id: 'BRONCE',  color: '#B07A4A', pts: 0 },
  { id: 'PLATA',   color: '#B0B5C5', pts: 500 },
  { id: 'ORO',     color: '#F5C16C', pts: 1000 },
  { id: 'PLATINO', color: '#C7D2FE', pts: 2000 },
];

const TierProgress = ({ points = 1000 }) => {
  // find current tier (highest reached)
  let currentIdx = 0;
  for (let i = 0; i < tiers.length; i++) if (points >= tiers[i].pts) currentIdx = i;
  const next = tiers[currentIdx + 1];
  const current = tiers[currentIdx];
  const needed = next ? next.pts - points : 0;

  return (
    <div style={{
      position: 'relative',
      borderRadius: 22, padding: 18,
      background: `
        radial-gradient(circle at 100% 0%, ${current.color}22 0%, transparent 50%),
        linear-gradient(180deg, rgba(99,102,241,0.10), rgba(99,102,241,0.03))
      `,
      border: '1px solid rgba(99,102,241,0.20)',
      animation: 'fadeUp 0.5s cubic-bezier(.2,.8,.2,1) 0.1s both',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div className="bebas" style={{ fontSize: 11, letterSpacing: '0.28em', color: 'var(--text-muted)' }}>NIVEL ACTUAL</div>
          <div className="bebas" style={{
            fontSize: 32, lineHeight: 1, marginTop: 2,
            color: current.color,
            textShadow: `0 0 18px ${current.color}66`,
            letterSpacing: '0.04em',
          }}>{current.id}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
            {points.toLocaleString('es-CL')} <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>pts</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>acumulados</div>
          {next && (
            <div style={{ fontSize: 11, color: 'var(--indigo-light)', marginTop: 4, fontWeight: 600 }}>
              {needed.toLocaleString('es-CL')} pts para {next.id} →
            </div>
          )}
        </div>
      </div>

      {/* 4 segment bar */}
      <div style={{ display: 'flex', gap: 4 }}>
        {tiers.map((t, i) => {
          const reached = i <= currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <div key={t.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%', height: 5,
                borderRadius: 100,
                background: reached
                  ? `linear-gradient(90deg, ${tiers[Math.max(0, i-1)].color}, ${t.color})`
                  : 'rgba(255,255,255,0.06)',
                boxShadow: reached ? `0 0 8px ${t.color}66` : 'none',
                position: 'relative',
              }}>
                {isCurrent && (
                  <div style={{
                    position: 'absolute', right: -3, top: -3, width: 10, height: 10,
                    borderRadius: '50%', background: t.color,
                    boxShadow: `0 0 10px ${t.color}, 0 0 4px #0e0e1a inset`,
                    animation: 'glowPulse 2s ease-in-out infinite',
                  }}/>
                )}
              </div>
              <div className="bebas" style={{
                fontSize: 10, letterSpacing: '0.14em', marginTop: 8,
                color: isCurrent ? t.color : reached ? 'var(--text-muted)' : 'var(--text-dim)',
                fontWeight: isCurrent ? 700 : 400,
              }}>
                {t.id}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ───── stats grid ─────
const StatsGrid = ({ items }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
    animation: 'fadeUp 0.5s cubic-bezier(.2,.8,.2,1) 0.15s both',
  }}>
    {items.map((it, i) => (
      <div key={i} style={{
        position: 'relative',
        padding: '14px 14px',
        borderRadius: 16,
        background: 'linear-gradient(180deg, rgba(99,102,241,0.08), rgba(99,102,241,0.02))',
        border: '1px solid rgba(99,102,241,0.18)',
        overflow: 'hidden',
      }}>
        {/* deco glow */}
        <div style={{
          position: 'absolute', top: -16, right: -16,
          width: 60, height: 60,
          background: `radial-gradient(circle, ${it.color}33 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, position: 'relative' }}>
          <div style={{
            width: 22, height: 22, borderRadius: 7,
            background: `${it.color}22`,
            color: it.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{it.icon}</div>
          <div className="bebas" style={{ fontSize: 10, letterSpacing: '0.20em', color: 'var(--text-muted)' }}>{it.label}</div>
        </div>
        <div className="bebas" style={{
          fontSize: 24, lineHeight: 1, color: it.color,
          textShadow: `0 0 14px ${it.color}55`,
          letterSpacing: '0.02em',
        }}>{it.value}</div>
        {it.sub && <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{it.sub}</div>}
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════════════════
const Modal = ({ children, onClose, narrow }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-sheet" style={narrow ? { maxWidth: 320 } : undefined} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

// ───── Logout confirm ─────
const LogoutModal = ({ onClose, onConfirm }) => (
  <Modal onClose={onClose} narrow>
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
      <div style={{
        position: 'absolute', inset: '-16px',
        background: 'radial-gradient(circle, rgba(248,113,113,0.30), transparent 65%)',
        pointerEvents: 'none',
      }}/>
      <div style={{
        width: 60, height: 60, borderRadius: 18,
        background: 'rgba(248,113,113,0.15)',
        border: '1px solid rgba(248,113,113,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#F87171',
        boxShadow: 'inset 0 0 18px rgba(248,113,113,0.15)',
        position: 'relative',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
        </svg>
      </div>
    </div>
    <h2 className="bebas" style={{ fontSize: 26, textAlign: 'center', margin: '0 0 6px', letterSpacing: '0.04em' }}>
      ¿CERRAR SESIÓN?
    </h2>
    <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', margin: 0, lineHeight: 1.55 }}>
      Tu progreso, puntos y misiones se guardan.<br/>Puedes volver cuando quieras.
    </p>
    <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
      <button className="btn-cancel" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
      <button onClick={onConfirm} style={{
        flex: 1.4,
        padding: '12px 24px',
        borderRadius: 100,
        background: 'linear-gradient(135deg, #F87171, #DC2626)',
        color: '#fff', border: 'none', cursor: 'pointer',
        fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600,
        boxShadow: '0 8px 24px rgba(248,113,113,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
      }}>Cerrar sesión</button>
    </div>
  </Modal>
);

// ───── Edit profile modal ─────
const EditProfileModal = ({ onClose, initialName = 'Carlos Morales', initialPhone = '9 8765 4321', initialEmail = '' }) => {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  return (
    <Modal onClose={onClose}>
      <h2 className="bebas" style={{ fontSize: 28, margin: 0, letterSpacing: '0.04em' }}>EDITAR PERFIL</h2>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 18px' }}>Actualiza tus datos de contacto</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { label: 'NOMBRE COMPLETO', value: name, set: setName, placeholder: 'Tu nombre' },
          { label: 'TELÉFONO', value: phone, set: setPhone, placeholder: '9 0000 0000', prefix: '+56' },
          { label: 'EMAIL', value: email, set: setEmail, placeholder: 'tu@email.cl' },
        ].map(f => (
          <div key={f.label}>
            <label style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--text-muted)', fontWeight: 600 }}>{f.label}</label>
            <div style={{
              marginTop: 6, display: 'flex', alignItems: 'center',
              background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: '0 14px', height: 50,
            }}>
              {f.prefix && <span style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500, marginRight: 10 }}>{f.prefix}</span>}
              <input
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                placeholder={f.placeholder}
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 500,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button className="btn-cancel" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
        <button className="modal-close-pill" style={{ flex: 1.4, margin: 0 }} onClick={onClose}>Guardar cambios</button>
      </div>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════
const PerfilScreen = ({ userName = 'CARLOS', initialModal = null }) => {
  const [modal, setModal] = useState(initialModal);
  const [navTab, setNavTab] = useState('perfil');

  const points = 1000;
  const tier = 'ORO';
  const tierColor = '#F5C16C';

  return (
    <div className="home-screen" data-screen-label="Perfil">
      <div style={{
        position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 500,
        background: 'radial-gradient(circle, rgba(245,193,108,0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }}/>
      <StatusBar/>

      {/* Header bar */}
      <div className="topbar" style={{ paddingTop: 12 }}>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 32, margin: 0, letterSpacing: '0.04em' }}>PERFIL</h1>
        <button className="icon-btn" onClick={() => setModal('edit')} aria-label="Editar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>
          </svg>
        </button>
      </div>

      <div className="home-scroll" style={{ paddingTop: 12 }}>
        <MembershipCard
          userName={userName}
          memberSince="mayo 2026"
          tier={tier}
          tierColor={tierColor}
          points={points}
          code="CFIEL-F26E0B"
        />

        <div style={{ height: 12 }}/>
        <TierProgress points={points}/>

        <div style={{ height: 12 }}/>
        <StatsGrid items={[
          { label: 'PUNTOS GANADOS LIFETIME', value: '2.470', color: '#818CF8',
            icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M8 12h8"/></svg> },
          { label: 'CANJES REALIZADOS', value: '5', color: '#C4B5FD', sub: 'Mojito · Cerveza · etc',
            icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7"/></svg> },
          { label: 'RACHA ACTUAL', value: '5d', color: '#4ADE80', sub: 'Sigue así',
            icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4-.5 2 .5 3 1 3-.5-3 0-7 2-10z"/></svg> },
          { label: 'LOCALES VISITADOS', value: '4', color: '#F5C16C', sub: 'En 30 días',
            icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg> },
        ]}/>

        {/* Menu — group: Cuenta */}
        <div className="bebas" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--text-muted)', margin: '24px 4px 8px' }}>CUENTA</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <MenuRow icon="user" title="Editar perfil" sub="Nombre, teléfono, email" onClick={() => setModal('edit')}/>
          <MenuRow icon="people" title="Referidos" badge="3 amigos" badgeColor="#C4B5FD"/>
          <MenuRow icon="gift" title="Mis canjes activos" badge="2" badgeColor="var(--indigo-light)"/>
          <MenuRow icon="clock" title="Mi historial"/>
        </div>

        {/* Menu — group: Preferencias */}
        <div className="bebas" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--text-muted)', margin: '20px 4px 8px' }}>PREFERENCIAS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <MenuRow icon="bell" title="Notificaciones" badge="ON" badgeColor="#4ADE80"/>
          <MenuRow icon="shield" title="Privacidad y datos"/>
          <MenuRow icon="help" title="Ayuda y contacto"/>
          <MenuRow icon="doc" title="Términos y condiciones"/>
        </div>

        {/* Logout */}
        <div style={{ marginTop: 20 }}>
          <div className="menu-row danger" onClick={() => setModal('logout')}>
            <div className="menu-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Cerrar sesión</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Tu progreso queda guardado</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>

        {/* footer */}
        <div style={{ textAlign: 'center', padding: '24px 0 4px', fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
          CFIEL v1.0.4 · <span style={{ color: 'var(--indigo-light)' }}>Hecho en Chile</span>
        </div>
      </div>

      <BottomNav active={navTab} onChange={setNavTab}/>

      {modal === 'logout' && <LogoutModal onClose={() => setModal(null)} onConfirm={() => setModal(null)}/>}
      {modal === 'edit'   && <EditProfileModal onClose={() => setModal(null)}/>}
    </div>
  );
};

// ───── menu row helper ─────
const MenuRow = ({ icon, title, sub, badge, badgeColor, onClick }) => {
  const ICONS = {
    user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>,
    people: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    gift: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
    clock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/></svg>,
    shield: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    help: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    doc: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/></svg>,
  };
  return (
    <div className="menu-row" onClick={onClick}>
      <div className="menu-icon">{ICONS[icon]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
      {badge && (
        <span style={{
          padding: '3px 10px', borderRadius: 100,
          background: 'rgba(99,102,241,0.10)',
          border: `1px solid ${badgeColor}55`,
          color: badgeColor, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.04em',
        }}>{badge}</span>
      )}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </div>
  );
};

Object.assign(window, { PerfilScreen });
