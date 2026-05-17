// CFIEL · Beneficios screen
const { useState, useMemo } = React;

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

// ───── bottom nav (shared) ─────
const BottomNav = ({ active = 'beneficios', onChange }) => {
  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></svg>
    )},
    { id: 'beneficios', label: 'Beneficios', icon: active === 'beneficios'
        ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
        : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
    },
    { id: 'historial', label: 'Historial', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    )},
    { id: 'perfil', label: 'Perfil', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
    )},
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

// ───── category icons ─────
const CategoryIcon = ({ category, locked }) => {
  const c = locked ? 'rgba(255,255,255,0.35)' : 'var(--indigo-light)';
  const map = {
    bebidas: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2h8l-1 8a4 4 0 0 1-3 4 4 4 0 0 1-3-4L8 2zM12 14v8M9 22h6"/>
      </svg>
    ),
    descuento: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
    pack: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    regalo: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
  };
  return map[category] || map.regalo;
};

// ───── benefit card ─────
const BenefitCard = ({ item, balance, onCanjear, index = 0 }) => {
  const affordable = balance >= item.pts;
  const missing = item.pts - balance;
  const pct = Math.min(1, balance / item.pts);

  return (
    <div className={`benefit-card ${!affordable ? 'locked' : ''}`} style={{
      animation: `fadeUp 0.5s cubic-bezier(.2,.8,.2,1) ${0.05 * index}s both`,
    }}>
      {/* decorative dot pattern in top-right */}
      {affordable && (
        <svg style={{ position: 'absolute', top: -8, right: -8, opacity: 0.4, pointerEvents: 'none' }} width="80" height="80" viewBox="0 0 80 80" fill="none">
          <radialGradient id={`bg${index}`} cx="0.6" cy="0.3" r="0.6">
            <stop offset="0" stopColor="rgba(99,102,241,0.4)"/>
            <stop offset="1" stopColor="rgba(99,102,241,0)"/>
          </radialGradient>
          <circle cx="55" cy="20" r="40" fill={`url(#bg${index})`}/>
        </svg>
      )}

      {/* header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, position: 'relative' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: affordable ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${affordable ? 'rgba(99,102,241,0.30)' : 'rgba(255,255,255,0.06)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <CategoryIcon category={item.category} locked={!affordable}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 style={{
              fontSize: 16, fontWeight: 600, margin: 0,
              color: affordable ? '#fff' : 'var(--text-muted)',
              lineHeight: 1.2,
            }}>{item.name}</h3>
            {item.featured && affordable && (
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                padding: '2px 7px',
                borderRadius: 100,
                background: 'rgba(245,193,108,0.15)',
                border: '1px solid rgba(245,193,108,0.4)',
                color: 'var(--gold)',
                textTransform: 'uppercase',
              }}>HOT</span>
            )}
          </div>
          {item.sub && (
            <div style={{
              fontSize: 12, color: 'var(--text-muted)', marginTop: 2,
            }}>{item.sub}</div>
          )}
          {item.saving && affordable && (
            <div style={{
              fontSize: 11, color: '#4ADE80', marginTop: 4, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
              Ahorras {item.saving}
            </div>
          )}
        </div>
      </div>

      {/* divider */}
      <div style={{
        margin: '14px 0 12px',
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.18), transparent)',
      }}/>

      {/* footer: pts + action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span className="bebas" style={{
            fontSize: 26, lineHeight: 1,
            color: affordable ? 'var(--indigo-light)' : 'var(--text-muted)',
            textShadow: affordable ? '0 0 14px rgba(99,102,241,0.4)' : 'none',
            letterSpacing: '0.02em',
          }}>{item.pts.toLocaleString('es-CL')}</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>pts</span>
        </div>
        {affordable ? (
          <button className="btn-canjear" onClick={() => onCanjear?.(item)}>
            Canjear
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </button>
        ) : (
          <div style={{ flex: 1, marginLeft: 8 }}>
            <div style={{
              height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden', marginBottom: 4,
            }}>
              <div style={{
                height: '100%', width: `${pct * 100}%`,
                background: 'linear-gradient(90deg, #4F46E5, #818CF8)',
                borderRadius: 100,
              }}/>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>
              Te faltan <span style={{ color: 'var(--indigo-light)', fontWeight: 600 }}>{missing.toLocaleString('es-CL')} pts</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ───── data ─────
const ALL_BENEFITS = [
  { id: 1, name: 'Mojito 200cc', sub: 'En cualquier local', pts: 50, category: 'bebidas', featured: true, saving: '$2.500' },
  { id: 2, name: 'Pisco Mistral 3R', sub: 'Botella 750ml', pts: 200, category: 'bebidas', saving: '$8.900' },
  { id: 3, name: 'Cerveza Heineken x2', sub: 'Botellín 330ml', pts: 120, category: 'bebidas' },
  { id: 4, name: 'Descuento $3.000', sub: 'Sobre la próxima compra', pts: 300, category: 'descuento' },
  { id: 5, name: 'Descuento $5.000', sub: 'En compras sobre $20.000', pts: 500, category: 'descuento' },
  { id: 6, name: 'Pack Futbolero', sub: '6 cervezas + maní + papas', pts: 400, category: 'pack', saving: '$6.500' },
  { id: 7, name: 'Pack Asado', sub: 'Carne + carbón + bebidas', pts: 1200, category: 'pack' },
  { id: 8, name: 'Pack Fin de Semana', sub: 'Premium para 4 personas', pts: 1500, category: 'pack' },
];

const CATEGORIES = [
  { id: 'todos',     label: 'Todos' },
  { id: 'bebidas',   label: 'Bebidas' },
  { id: 'descuento', label: 'Descuentos' },
  { id: 'pack',      label: 'Packs' },
];

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

// ───── Confirmar canje ─────
const ConfirmCanjeModal = ({ item, balance, onCancel, onConfirm }) => {
  const after = balance - item.pts;
  return (
    <Modal onClose={onCancel} narrow>
      {/* gift icon glow */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <div style={{
          position: 'absolute', inset: '-16px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.35), transparent 65%)',
          pointerEvents: 'none',
        }}/>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(99,102,241,0.10))',
          border: '1px solid rgba(99,102,241,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--indigo-light)',
          boxShadow: 'inset 0 0 20px rgba(99,102,241,0.25), 0 8px 28px rgba(99,102,241,0.35)',
          position: 'relative',
          animation: 'float 3s ease-in-out infinite',
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
          </svg>
        </div>
      </div>

      <h2 className="bebas" style={{ fontSize: 28, textAlign: 'center', margin: '0 0 4px', letterSpacing: '0.04em' }}>
        CONFIRMAR CANJE
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
        {item.name}
      </p>

      {/* price card */}
      <div style={{
        marginTop: 18, padding: '14px 18px', borderRadius: 14,
        background: 'rgba(99,102,241,0.08)',
        border: '1.5px solid rgba(99,102,241,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: 'inset 0 0 18px rgba(99,102,241,0.10)',
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--indigo)',
          boxShadow: '0 0 10px var(--indigo)',
        }}/>
        <span className="bebas" style={{
          fontSize: 28, lineHeight: 1,
          color: 'var(--indigo-light)',
          textShadow: '0 0 14px rgba(99,102,241,0.5)',
          letterSpacing: '0.04em',
        }}>{item.pts.toLocaleString('es-CL')}</span>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>pts</span>
      </div>

      {/* balance math */}
      <div style={{
        marginTop: 10, padding: '10px 14px',
        background: 'rgba(255,255,255,0.02)', borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 12, color: 'var(--text-muted)',
      }}>
        <span>Saldo actual</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#fff', fontWeight: 600 }}>{balance.toLocaleString('es-CL')}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          <span className="bebas" style={{ fontSize: 16, color: 'var(--indigo-light)' }}>{after.toLocaleString('es-CL')} pts</span>
        </span>
      </div>

      {/* buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        <button className="btn-cancel" style={{ flex: 1 }} onClick={onCancel}>Cancelar</button>
        <button className="modal-close-pill" style={{ flex: 1.4, margin: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={onConfirm}>
          Confirmar
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </button>
      </div>
    </Modal>
  );
};

// ───── Éxito canje ─────
const SuccessCanjeModal = ({ item, code = 'CFIEL-PR-A29X', onClose }) => (
  <Modal onClose={onClose} narrow>
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
      {/* expanding rings */}
      {[0, 0.5, 1.0].map((d, i) => (
        <div key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 96, height: 96,
          border: '1.5px solid var(--indigo)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: `ringExpand 2.2s ease-out ${d}s infinite`,
          pointerEvents: 'none',
        }}/>
      ))}
      <div style={{
        width: 76, height: 76, borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 16px 48px rgba(99,102,241,0.5), inset 0 0 0 1px rgba(255,255,255,0.15)',
        position: 'relative', zIndex: 1,
        animation: 'scaleIn 0.5s cubic-bezier(.2,1.4,.4,1)',
      }}>
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
    </div>

    <h2 className="bebas" style={{ fontSize: 26, textAlign: 'center', margin: '0 0 4px', letterSpacing: '0.04em' }}>
      ¡CANJE EXITOSO!
    </h2>
    <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', margin: 0, lineHeight: 1.55 }}>
      Muestra este código en caja para reclamar tu <span style={{ color: '#fff', fontWeight: 600 }}>{item?.name || 'premio'}</span>
    </p>

    <div style={{
      marginTop: 18, padding: '14px 18px', borderRadius: 14,
      background: 'rgba(99,102,241,0.10)',
      border: '1.5px dashed rgba(99,102,241,0.45)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-dim)', fontWeight: 600 }}>TU CÓDIGO</div>
      <div className="bebas" style={{
        fontSize: 28, marginTop: 4,
        color: 'var(--indigo-light)',
        letterSpacing: '0.06em',
        textShadow: '0 0 16px rgba(99,102,241,0.5)',
      }}>{code}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Vence en 7 días</div>
    </div>

    <button className="modal-close-pill" onClick={onClose}>Listo</button>
  </Modal>
);

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════

const BeneficiosScreen = ({ balance = 1000, initialModal = null, initialFilter = 'todos', userName = 'CARLOS' }) => {
  const [filter, setFilter] = useState(initialFilter);
  const [modal, setModal] = useState(initialModal); // null | 'confirm' | 'success'
  const [selectedItem, setSelectedItem] = useState(initialModal === 'confirm' || initialModal === 'success' ? ALL_BENEFITS[0] : null);
  const [navTab, setNavTab] = useState('beneficios');

  const visible = useMemo(() => {
    if (filter === 'todos') return ALL_BENEFITS;
    return ALL_BENEFITS.filter(b => b.category === filter);
  }, [filter]);

  const counts = useMemo(() => ({
    todos: ALL_BENEFITS.length,
    bebidas: ALL_BENEFITS.filter(b => b.category === 'bebidas').length,
    descuento: ALL_BENEFITS.filter(b => b.category === 'descuento').length,
    pack: ALL_BENEFITS.filter(b => b.category === 'pack').length,
  }), []);

  const affordableCount = useMemo(() => ALL_BENEFITS.filter(b => b.pts <= balance).length, [balance]);

  const handleCanjear = (item) => {
    setSelectedItem(item);
    setModal('confirm');
  };

  const handleConfirm = () => {
    setModal('success');
  };

  return (
    <div className="home-screen" data-screen-label="Beneficios">
      {/* ambient glow */}
      <div style={{
        position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 500,
        background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 60%)',
        pointerEvents: 'none',
      }}/>

      <StatusBar/>

      {/* Header */}
      <div style={{ padding: '8px 20px 12px', flexShrink: 0 }}>
        <h1 className="bebas" style={{ fontSize: 38, margin: 0, lineHeight: 1, letterSpacing: '0.03em' }}>BENEFICIOS</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 12px' }}>
          Canjea tus puntos por premios reales
        </p>

        {/* Available balance pill — premium */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '8px 14px 8px 10px',
          borderRadius: 100,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(99,102,241,0.06))',
          border: '1px solid rgba(99,102,241,0.40)',
          boxShadow: '0 4px 18px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: 'linear-gradient(135deg, #818CF8, #4F46E5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(99,102,241,0.6)',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 7v10M8 12h8"/>
            </svg>
          </div>
          <span className="bebas" style={{
            fontSize: 20, color: 'var(--indigo-light)',
            letterSpacing: '0.04em',
            textShadow: '0 0 12px rgba(99,102,241,0.5)',
          }}>{balance.toLocaleString('es-CL')}</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>pts disponibles</span>
          <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.10)' }}/>
          <span style={{ fontSize: 12, color: 'var(--indigo-light)', fontWeight: 600 }}>
            {affordableCount} {affordableCount === 1 ? 'premio' : 'premios'} al alcance
          </span>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ padding: '0 0 10px', flexShrink: 0 }}>
        <div className="chip-row">
          {CATEGORIES.map(c => (
            <button key={c.id} className={`chip ${filter === c.id ? 'active' : ''}`} onClick={() => setFilter(c.id)}>
              {c.label}
              <span className="chip-count">{counts[c.id]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="home-scroll" style={{ paddingTop: 4 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {visible.map((item, i) => (
            <BenefitCard key={item.id} item={item} balance={balance} index={i} onCanjear={handleCanjear}/>
          ))}
          {visible.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
              No hay premios en esta categoría
            </div>
          )}
        </div>
      </div>

      <BottomNav active={navTab} onChange={setNavTab}/>

      {modal === 'confirm' && selectedItem && (
        <ConfirmCanjeModal
          item={selectedItem}
          balance={balance}
          onCancel={() => setModal(null)}
          onConfirm={handleConfirm}
        />
      )}
      {modal === 'success' && selectedItem && (
        <SuccessCanjeModal item={selectedItem} onClose={() => setModal(null)}/>
      )}
    </div>
  );
};

Object.assign(window, { BeneficiosScreen });
