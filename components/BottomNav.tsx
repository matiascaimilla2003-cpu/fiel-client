'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type Tab = 'inicio' | 'beneficios' | 'historial' | 'perfil';

const ROUTE_MAP: Record<Tab, string> = {
  inicio:     '/home',
  beneficios: '/beneficios',
  historial:  '/historial',
  perfil:     '/perfil',
};

const PATH_TAB: Record<string, Tab> = {
  '/home':        'inicio',
  '/beneficios':  'beneficios',
  '/historial':   'historial',
  '/perfil':      'perfil',
};

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={24} height={24}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const GiftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={24} height={24}>
    <polyline points="20 12 20 22 4 22 4 12"/>
    <rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={24} height={24}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={24} height={24}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const TABS: { id: Tab; label: string; Icon: () => React.ReactElement }[] = [
  { id: 'inicio',     label: 'Inicio',     Icon: HomeIcon  },
  { id: 'beneficios', label: 'Beneficios', Icon: GiftIcon  },
  { id: 'historial',  label: 'Historial',  Icon: ClockIcon },
  { id: 'perfil',     label: 'Perfil',     Icon: UserIcon  },
];

export default function BottomNav() {
  const router   = useRouter();
  const pathname = usePathname();
  const activeTab = PATH_TAB[pathname] ?? 'inicio';

  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      height: 80,
      background: '#141414',
      borderTop: '0.5px solid rgba(255,255,255,0.07)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 8px 12px',
      zIndex: 20,
    }}>
      {TABS.map(({ id, label, Icon }) => {
        const active = id === activeTab;
        return (
          <button
            key={id}
            onClick={() => router.push(ROUTE_MAP[id])}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '8px 18px',
              borderRadius: 14,
              background: active ? '#6366F1' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: active ? '#fff' : 'rgba(255,255,255,0.28)',
              transition: 'background 0.2s, color 0.2s',
              fontFamily: 'inherit',
            }}
          >
            <Icon />
            <span style={{ fontSize: 10, letterSpacing: '0.3px' }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
