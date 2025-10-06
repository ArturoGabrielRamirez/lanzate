import { NavLink } from '../types';

export const isActiveRoute = (pathname: string, href: string): boolean => {
  if (href === '/') return pathname === '/';
  // Ensure exact segment match to avoid '/account' matching '/account-settings'
  const normalize = (s: string) => s.replace(/\/+$/, '');
  const path = normalize(pathname);
  const target = normalize(href);
  return path === target || path.startsWith(`${target}/`);
};

export const getAuthNavLinks = (t: (key: string) => string): NavLink[] => [
  { label: t('header.nav.user.dashboard'), href: '/dashboard' },
  { label: t('header.nav.user.newSale'), href: '/new-sale' },
  { label: t('header.nav.user.stores'), href: '/stores' },
  { label: t('header.nav.user.account'), href: '/account' },
];


