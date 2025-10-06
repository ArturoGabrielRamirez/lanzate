import { NavLink } from '../types';

export const isActiveRoute = (pathname: string, href: string): boolean => {
  // Remove locale prefix like /es or /en
  const stripLocale = (s: string) => s.replace(/^\/(es|en)(?=\/|$)/, '');
  const normalize = (s: string) => s.replace(/\/+$/, '') || '/';

  const path = normalize(stripLocale(pathname));
  const target = normalize(href);

  if (target === '/') return path === '/';

  // Ensure exact segment match to avoid '/account' matching '/account-settings'
  return path === target || path.startsWith(`${target}/`);
};

export const getAuthNavLinks = (t: (key: string) => string): NavLink[] => [
  { label: t('header.nav.user.dashboard'), href: '/dashboard' },
  { label: t('header.nav.user.newSale'), href: '/new-sale' },
  { label: t('header.nav.user.stores'), href: '/stores' },
  { label: t('header.nav.user.account'), href: '/account' },
];


