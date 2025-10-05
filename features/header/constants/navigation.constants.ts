import { NavLink } from '../types';

export const getNavLinks = (t: (key: string) => string): NavLink[] => [
  { label: t('header.nav.howItWorks'), href: '/#how-it-works' },
  { label: t('header.nav.integrations'), href: '/#integrations' },
  { label: t('header.nav.pricing'), href: '/#pricing' },
  { label: t('header.nav.contact'), href: '/#contact' },
];
