// CFIEL · Historial screen
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

// ───── bottom nav ─────
const BottomNav = ({ active = 'historial', onChange }) => {
  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></svg>
    )},
    { id: 'beneficios', label: 'Beneficios', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
    )},
    { id: 'historial', label: 'Historial', icon: active === 'historial'
        ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 11h-2V6h2v5h4v2h-4z"/></svg>
        : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    },
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

// ───── type icons ─────
const TxIcon = ({ type, size = 18 }) => {
  const color = {
    compra: '#4ADE80',
    canje: '#F87171',
    bono: '#F5C16C',
    racha: '#818CF8',
    referido: '#C4B5FD',
    nivel: '#F5C16C',
  }[type] || '#818CF8';
  const paths = {
    compra: <><circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></>,
    canje: <><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></>,
    bono: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    racha: <><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4-.5 2 .5 3 1 3-.5-3 0-7 2-10z"/></>,
    referido: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    nivel: <><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zM5 18h14v2H5z"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={type === 'bono' || type === 'nivel' ? color : 'none'} stroke={type === 'bono' || type === 'nivel' ? 'none' : color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[type]}
    </svg>
  );
};

// ───── transaction data ─────
const ALL_TXS = [
  { id: 't9', type: 'racha',    title: 'Racha 5 días',          local: 'Bonus diario', amount: '',          pts: +50,  date: '12 may 2026', time: '09:14' },
  { id: 't8', type: 'compra',   title: 'Compra $50.000',        local: 'Tío Polo · Recoleta', amount: '$50.000',  pts: +500, date: '8 may 2026',  time: '20:22' },
  { id: 't7', type: 'compra',   title: 'Compra $30.000',        local: 'Tío Polo · Recoleta', amount: '$30.000',  pts: +300, date: '8 may 2026',  time: '14:48' },
  { id: 't6', type: 'canje',    title: 'Canje Mojito 200cc',    local: 'Tío Polo · Recoleta', amount: '',         pts: -50,  date: '7 may 2026',  time: '21:03' },
  { id: 't5', type: 'bono',     title: 'Bono de bienvenida',    local: 'Regalo CFIEL',         amount: '',         pts: +200, date: '7 may 2026',  time: '18:30' },
  { id: 't4', type: 'compra',   title: 'Compra $12.000',        local: 'El Cervecero · Ñuñoa', amount: '$12.000',  pts: +120, date: '28 abr 2026', time: '23:12' },
  { id: 't3', type: 'canje',    title: 'Canje Heineken x2',     local: 'El Cervecero · Ñuñoa', amount: '',         pts: -120, date: '25 abr 2026', time: '22:55' },
  { id: 't2', type: 'referido', title: 'Referido Marco G.',     local: 'Programa amigos',      amount: '',         pts: +250, date: '20 abr 2026', time: '15:10' },
  { id: 't1', type: 'nivel',    title: 'Subiste a Nivel ORO',   local: 'Logro de nivel',       amount: '',         pts: +100, date: '15 abr 2026', time: '10:00' },
];

const MONTH_ES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
const MONTH_FULL = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

const parseMonthKey = (s) => {
  // "28 abr 2026" -> "abr 2026"
  const parts = s.split(' ');
  return `${parts[1]} ${parts[2]}`;
};

const monthLabel = (key) => {
  // "abr 2026" -> "ABRIL DE 2026"
  const [m, y] = key.split(' ');
  const idx = MONTH_ES.findIndex(x => x.toLowerCase().startsWith(m));
  return `${(MONTH_FULL[idx] || m).toUpperCase()} DE ${y}`;
};

// ───── transaction row ─────
const TxRow = ({ tx, onTap }) => {
  const positive = tx.pts > 0;
  return (
    <div className="tx-row" onClick={() => onTap?.(tx)}>
      <div style={{
        width: 38, height: 38, borderRadius: 11,
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <TxIcon type={tx.type} size={18}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{tx.local} · {tx.date.split(' ').slice(0,2).join(' ')}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="bebas" style={{
          fontSize: 18, lineHeight: 1,
          color: positive ? '#4ADE80' : '#F87171',
          letterSpacing: '0.02em',
        }}>{positive ? '+' : ''}{tx.pts}</div>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2, letterSpacing: '0.08em' }}>pts</div>
      </div>
    </div>
  );
};

// ───── stat card ─────
const StatCard = ({ label, value, type = 'pos', icon }) => (
  <div className={`stat-card ${type === 'neg' ? 'neg' : ''}`}>
    {/* deco glow */}
    <div style={{
      position: 'absolute', top: -20, right: -20,
      width: 90, height: 90,
      background: `radial-gradient(circle, ${type === 'neg' ? 'rgba(248,113,113,0.25)' : 'rgba(99,102,241,0.30)'} 0%, transparent 65%)`,
      pointerEvents: 'none',
    }}/>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
      <div className="bebas" style={{ fontSize: 11, letterSpacing: '0.24em', color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div style={{
        width: 24, height: 24, borderRadius: 8,
        background: type === 'neg' ? 'rgba(248,113,113,0.12)' : 'rgba(99,102,241,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: type === 'neg' ? '#F87171' : 'var(--indigo-light)',
      }}>
        {icon}
      </div>
    </div>
    <div className="bebas" style={{
      fontSize: 34, lineHeight: 1.1, marginTop: 6,
      color: type === 'neg' ? '#F87171' : '#4ADE80',
      textShadow: type === 'neg' ? '0 0 16px rgba(248,113,113,0.3)' : '0 0 16px rgba(74,222,128,0.3)',
      letterSpacing: '0.02em',
    }}>
      {value > 0 && type !== 'neg' ? '+' : type === 'neg' ? '−' : ''}{Math.abs(value).toLocaleString('es-CL')}
    </div>
    <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 1, letterSpacing: '0.08em' }}>PTS</div>
  </div>
);

// ───── modal: detalle ─────
const Modal = ({ children, onClose, narrow }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-sheet" style={narrow ? { maxWidth: 320 } : undefined} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const TxDetailModal = ({ tx, onClose, balanceAfter }) => {
  if (!tx) return null;
  const positive = tx.pts > 0;
  const color = positive ? '#4ADE80' : '#F87171';
  return (
    <Modal onClose={onClose} narrow>
      {/* icon */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <div style={{
          position: 'absolute', inset: '-16px',
          background: `radial-gradient(circle, ${positive ? 'rgba(74,222,128,0.28)' : 'rgba(248,113,113,0.28)'}, transparent 65%)`,
          pointerEvents: 'none',
        }}/>
        <div style={{
          width: 60, height: 60, borderRadius: 16,
          background: 'rgba(99,102,241,0.12)',
          border: `1px solid ${positive ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          boxShadow: `inset 0 0 18px ${positive ? 'rgba(74,222,128,0.10)' : 'rgba(248,113,113,0.10)'}`,
        }}>
          <TxIcon type={tx.type} size={26}/>
        </div>
      </div>

      <h2 className="bebas" style={{ fontSize: 22, textAlign: 'center', margin: '0 0 4px', letterSpacing: '0.04em' }}>
        {tx.title}
      </h2>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
        {tx.local}
      </p>

      {/* points */}
      <div style={{
        marginTop: 16, padding: '14px 18px', borderRadius: 14,
        background: positive ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
        border: `1.5px solid ${positive ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)'}`,
        textAlign: 'center',
      }}>
        <div className="bebas" style={{
          fontSize: 42, lineHeight: 1, color,
          textShadow: `0 0 18px ${color}55`,
          letterSpacing: '0.04em',
        }}>{positive ? '+' : ''}{tx.pts}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, letterSpacing: '0.08em' }}>
          PUNTOS {positive ? 'GANADOS' : 'USADOS'}
        </div>
      </div>

      {/* meta rows */}
      <div style={{ marginTop: 12, padding: '4px 4px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {[
          ['Fecha', `${tx.date} · ${tx.time}`],
          tx.amount && ['Monto compra', tx.amount],
          ['Saldo final', `${balanceAfter.toLocaleString('es-CL')} pts`],
          ['ID', tx.id.toUpperCase() + '-' + tx.date.replace(/\s/g,'')],
        ].filter(Boolean).map(([k, v], i, arr) => (
          <div key={k} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '10px 4px',
            borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            fontSize: 13,
          }}>
            <span style={{ color: 'var(--text-muted)' }}>{k}</span>
            <span style={{ color: k === 'ID' ? 'var(--text-dim)' : '#fff', fontFamily: k === 'ID' ? 'monospace' : 'inherit', fontWeight: k === 'ID' ? 400 : 500 }}>{v}</span>
          </div>
        ))}
      </div>

      <button className="modal-close-pill" onClick={onClose}>Cerrar</button>
    </Modal>
  );
};

// ───── empty state ─────
const EmptyState = () => (
  <div style={{ padding: '60px 24px', textAlign: 'center', animation: 'fadeUp 0.5s ease' }}>
    <div style={{
      width: 72, height: 72, borderRadius: 20,
      background: 'rgba(99,102,241,0.08)',
      border: '1px solid rgba(99,102,241,0.22)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--indigo-light)',
      marginBottom: 16,
    }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    </div>
    <h3 className="bebas" style={{ fontSize: 22, margin: '0 0 6px', letterSpacing: '0.04em' }}>SIN MOVIMIENTOS AÚN</h3>
    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6, maxWidth: 280, marginInline: 'auto' }}>
      Cuando hagas tu primera compra o canjees un premio, aparecerá aquí
    </p>
  </div>
);

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════

const FILTERS = [
  { id: 'todos',  label: 'Todos' },
  { id: 'pos',    label: 'Ganados' },
  { id: 'neg',    label: 'Usados' },
  { id: 'bono',   label: 'Bonus' },
];

const HistorialScreen = ({ initialFilter = 'todos', initialModal = null, empty = false }) => {
  const [filter, setFilter] = useState(initialFilter);
  const [selected, setSelected] = useState(initialModal === 'detail' ? ALL_TXS[1] : null);
  const [navTab, setNavTab] = useState('historial');

  const txs = useMemo(() => empty ? [] : ALL_TXS.filter(t => {
    if (filter === 'todos') return true;
    if (filter === 'pos') return t.pts > 0;
    if (filter === 'neg') return t.pts < 0;
    if (filter === 'bono') return ['bono','racha','referido','nivel'].includes(t.type);
    return true;
  }), [filter, empty]);

  const totals = useMemo(() => {
    const ganados = (empty ? [] : ALL_TXS).filter(t => t.pts > 0).reduce((s, t) => s + t.pts, 0);
    const usados  = (empty ? [] : ALL_TXS).filter(t => t.pts < 0).reduce((s, t) => s + Math.abs(t.pts), 0);
    return { ganados, usados };
  }, [empty]);

  const counts = useMemo(() => ({
    todos: ALL_TXS.length,
    pos:   ALL_TXS.filter(t => t.pts > 0).length,
    neg:   ALL_TXS.filter(t => t.pts < 0).length,
    bono:  ALL_TXS.filter(t => ['bono','racha','referido','nivel'].includes(t.type)).length,
  }), []);

  // group by month
  const grouped = useMemo(() => {
    const map = new Map();
    for (const t of txs) {
      const key = parseMonthKey(t.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    }
    return Array.from(map.entries());
  }, [txs]);

  return (
    <div className="home-screen" data-screen-label="Historial">
      <div style={{
        position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 500,
        background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 60%)',
        pointerEvents: 'none',
      }}/>
      <StatusBar/>

      {/* Header */}
      <div style={{ padding: '8px 20px 12px', flexShrink: 0 }}>
        <h1 className="bebas" style={{ fontSize: 38, margin: 0, lineHeight: 1, letterSpacing: '0.03em' }}>HISTORIAL</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 16px' }}>
          Tus movimientos de puntos
        </p>

        {/* stats row */}
        <div style={{ display: 'flex', gap: 10 }}>
          <StatCard
            label="GANADOS"
            value={totals.ganados}
            type="pos"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 14l5-5 5 5"/></svg>}
          />
          <StatCard
            label="USADOS"
            value={totals.usados}
            type="neg"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10l5 5 5-5"/></svg>}
          />
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: '0 0 6px', flexShrink: 0 }}>
        <div className="chip-row">
          {FILTERS.map(c => (
            <button key={c.id} className={`chip ${filter === c.id ? 'active' : ''}`} onClick={() => setFilter(c.id)}>
              {c.label}
              <span className="chip-count">{counts[c.id]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="home-scroll" style={{ paddingTop: 0 }}>
        {empty || grouped.length === 0 ? (
          <EmptyState/>
        ) : (
          grouped.map(([key, list]) => (
            <div key={key} style={{ animation: 'fadeUp 0.5s cubic-bezier(.2,.8,.2,1)' }}>
              <div className="month-label">{monthLabel(key)}</div>
              <div className="card" style={{ padding: '4px 14px', marginTop: 6 }}>
                {list.map(tx => (
                  <TxRow key={tx.id} tx={tx} onTap={setSelected}/>
                ))}
              </div>
            </div>
          ))
        )}
        <div style={{ height: 12 }}/>
      </div>

      <BottomNav active={navTab} onChange={setNavTab}/>

      {selected && (
        <TxDetailModal
          tx={selected}
          balanceAfter={1000}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

Object.assign(window, { HistorialScreen });
