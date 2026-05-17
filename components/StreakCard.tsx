'use client';

const BEBAS = 'var(--font-bebas), "Bebas Neue", sans-serif';

interface Props {
  streak: number;
  todayPts?: number;
  onOpen: () => void;
}

export default function StreakCard({ streak, todayPts = 50, onOpen }: Props) {
  const days = streak;

  const slots = Array.from({ length: 7 }, (_, i) => {
    if (i < days) return 'done';
    if (i === days) return 'today';
    return 'future';
  });

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
        animation: 'fadeUp 0.6s cubic-bezier(.2,.8,.2,1) 0.15s both',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'radial-gradient(circle at 50% 60%, rgba(99,102,241,0.35), rgba(99,102,241,0.05))',
          border: '1px solid rgba(99,102,241,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#818CF8', flexShrink: 0,
          boxShadow: 'inset 0 0 16px rgba(99,102,241,0.2)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
            style={{ filter: 'drop-shadow(0 0 6px rgba(99,102,241,0.7))' }}>
            <path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4-.5 2 .5 3 1 3-.5-3 0-7 2-10z"/>
          </svg>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 11, letterSpacing: '0.28em', color: '#8a8aa3' }}>TU RACHA</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: BEBAS, fontSize: 32, color: '#fff', lineHeight: 1 }}>{days}</span>
            <span style={{ fontSize: 13, color: '#8a8aa3' }}>días seguidos</span>
          </div>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 10px',
          borderRadius: 100,
          background: 'rgba(34,197,94,0.12)',
          border: '1px solid rgba(34,197,94,0.35)',
          color: '#4ADE80',
          fontSize: 12, fontWeight: 600,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          +{todayPts} hoy
        </div>
      </div>

      {/* 7-slot calendar */}
      <div style={{ display: 'flex', gap: 6 }}>
        {slots.map((state, i) => {
          const label = ['L','M','M','J','V','S','D'][i];
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: '100%', height: 30, borderRadius: 8,
                background: state === 'done'
                  ? 'linear-gradient(180deg, #6366F1, #4F46E5)'
                  : state === 'today'
                    ? 'rgba(99,102,241,0.12)'
                    : 'rgba(255,255,255,0.04)',
                border: state === 'today'
                  ? '1.5px solid #6366F1'
                  : state === 'done'
                    ? '1px solid rgba(165,180,252,0.4)'
                    : '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: state === 'done'
                  ? '0 4px 12px rgba(99,102,241,0.35)'
                  : state === 'today'
                    ? '0 0 0 4px rgba(99,102,241,0.15)'
                    : 'none',
                animation: state === 'today' ? 'glowPulse 2s ease-in-out infinite' : 'none',
              }}>
                {state === 'done' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white"
                    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                )}
                {state === 'today' && (
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#6366F1', boxShadow: '0 0 8px #6366F1',
                  }}/>
                )}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
                color: state === 'done' ? '#818CF8' : state === 'today' ? '#fff' : '#5b5b75',
              }}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
