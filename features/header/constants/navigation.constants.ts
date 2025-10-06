import { NavLink, NavMenuItem } from '../types';

export const getNavLinks = (t: (key: string) => string): NavLink[] => [
  { label: t('header.nav.howItWorks'), href: '/#how-it-works' },
  { label: t('header.nav.integrations'), href: '/#integrations' },
  { label: t('header.nav.pricing'), href: '/#pricing' },
  { label: t('header.nav.contact'), href: '/#contact' },
];

export const getNavMenuItems = (t: (key: string) => string, locale: string): NavMenuItem[] => [
  {
    label: t('header.nav.home'),
    items: [
      { 
        label: t('header.nav.sections.hero'), 
        href: `/${locale}#inicio`
      },
      { 
        label: t('header.nav.sections.howItWorks'), 
        href: `/${locale}#how-it-works`
      },
      { 
        label: t('header.nav.sections.faq'), 
        href: `/${locale}#pricing`
      },
    ],
  },
  {
    label: t('header.nav.access'),
    items: [
      { 
        label: t('header.nav.auth.login'), 
        href: `/${locale}/login`
      },
      { 
        label: t('header.nav.auth.signup'), 
        href: `/${locale}/signup`
      },
      { 
        label: t('header.nav.auth.forgotPassword'), 
        href: `/${locale}/forgot-password`
      },
      { 
        label: t('header.nav.auth.googleAuth'), 
        isGoogleAuth: true
      },
    ],
  },
  {
    label: t('header.nav.moreInfo'),
    items: [
      { 
        label: t('header.nav.info.about'), 
        href: `/${locale}/about`
      },
      { 
        label: t('header.nav.info.contact'), 
        href: `/${locale}/contact`
      },
    ],
  },
];
