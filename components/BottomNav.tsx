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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
    strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
    <path d="M3 12l9-9 9 9M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/>
  </svg>
);

const GiftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
    strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
    <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
    strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
    strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 21a8 8 0 0 1 16 0"/>
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
      height: 86,
      background: 'rgba(10,10,20,0.85)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderTop: '1px solid rgba(99,102,241,0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingBottom: 20,
      zIndex: 20,
    }}>
      {TABS.map(({ id, label, Icon }) => {
        const active = id === activeTab;
        return (
          <button
            key={id}
            onClick={() => router.push(ROUTE_MAP[id])}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: '6px 0',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: active ? '#818CF8' : '#5b5b75',
              transition: 'color 0.2s ease',
              fontFamily: 'inherit',
              position: 'relative',
            }}
          >
            {active && (
              <div style={{
                position: 'absolute',
                top: 0,
                width: 32,
                height: 2,
                background: '#6366F1',
                borderRadius: 100,
                boxShadow: '0 0 12px rgba(99,102,241,0.7)',
              }}/>
            )}
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
              border: `1px solid ${active ? 'rgba(99,102,241,0.35)' : 'transparent'}`,
              transition: 'all 0.2s ease',
            }}>
              <Icon/>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
