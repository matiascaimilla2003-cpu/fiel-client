'use client';

const BEBAS = 'var(--font-bebas), "Bebas Neue", sans-serif';

interface Mision {
  id: string;
  titulo: string;
  descripcion: string | null;
  puntos_premio: number;
  meta_tipo: string;
  meta_valor: number;
  fecha_fin: string | null;
}

interface Props {
  onOpen: () => void;
  mision: Mision | null;
}

function MisionIcon({ tipo }: { tipo: string }) {
  if (tipo === 'compras' || tipo === 'visitas') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1.5"/>
        <circle cx="19" cy="21" r="1.5"/>
        <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>
      </svg>
    );
  }
  if (tipo === 'monto') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    );
  }
  if (tipo === 'dias') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4-.5 2 .5 3 1 3-.5-3 0-7 2-10z"/>
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function daysLeft(fechaFin: string | null): string {
  if (!fechaFin) return '';
  const days = Math.ceil((new Date(fechaFin).getTime() - Date.now()) / 86400000);
  if (days <= 0) return 'Vence hoy';
  return `${days} día${days === 1 ? '' : 's'} restante${days === 1 ? '' : 's'}`;
}

export default function MisionCard({ onOpen, mision }: Props) {
  if (!mision) return null;

  const dias = daysLeft(mision.fecha_fin);

  return (
    <div
      onClick={onOpen}
      style={{
        background: 'linear-gradient(180deg, rgba(99,102,241,0.10), rgba(99,102,241,0.04))',
        border: '1px solid rgba(99,102,241,0.20)',
        borderRadius: 22,
        padding: 18,
        cursor: 'pointer',
        marginBottom: 12,
        animation: 'fadeUp 0.6s cubic-bezier(.2,.8,.2,1) 0.2s both',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.05))',
          border: '1px solid rgba(99,102,241,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#818CF8', flexShrink: 0,
        }}>
          <MisionIcon tipo={mision.meta_tipo}/>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontFamily: BEBAS, fontSize: 20, margin: 0, lineHeight: 1.05, letterSpacing: '0.04em' }}>
            {mision.titulo}
          </h3>
          <div style={{ fontSize: 12, color: '#8a8aa3', marginTop: 4 }}>
            <span style={{ color: '#fff', fontWeight: 600 }}>0 de {mision.meta_valor}</span>
            {dias ? ` · ${dias}` : ''}
          </div>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '7px 11px',
          borderRadius: 100,
          background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
          color: '#fff',
          fontFamily: BEBAS, fontSize: 14, letterSpacing: '0.04em',
          boxShadow: '0 4px 14px rgba(99,102,241,0.45)',
          flexShrink: 0,
        }}>
          +{mision.puntos_premio} PTS
        </div>
      </div>

      <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: '0%',
          background: 'linear-gradient(90deg, #4F46E5, #818CF8)',
          borderRadius: 100,
          boxShadow: '0 0 12px rgba(99,102,241,0.5)',
        }}/>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 11, color: '#5b5b75' }}>0% completada</span>
        <span style={{ fontSize: 11, color: '#818CF8', fontWeight: 600 }}>Ver detalle →</span>
      </div>
    </div>
  );
}
