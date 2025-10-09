import { LayoutDashboard, PlusCircle, Store, User as UserIcon } from 'lucide-react';

import { NavLink } from '@/features/header/types';

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
  { label: t('header.nav.user.dashboard'), href: '/dashboard', icon: <LayoutDashboard className="mr-2 size-5" aria-hidden /> },
  { label: t('header.nav.user.newSale'), href: '/new-sale', icon: <PlusCircle className="mr-2 size-5" aria-hidden /> },
  { label: t('header.nav.user.stores'), href: '/stores', icon: <Store className="mr-2 size-5" aria-hidden /> },
  { label: t('header.nav.user.account'), href: '/account', icon: <UserIcon className="mr-2 size-5" aria-hidden /> },
];


