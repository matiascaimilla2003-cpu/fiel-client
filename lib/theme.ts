export type Theme = 'dark' | 'light';

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem('cfiel_theme') as Theme) ?? 'dark';
}

export function setTheme(theme: Theme): void {
  localStorage.setItem('cfiel_theme', theme);
  document.documentElement.classList.remove('dark', 'light');
  document.documentElement.classList.add(theme);
}
