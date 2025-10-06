import { NavLink, NavMenuItem } from '../types';

export const getNavLinks = (t: (key: string) => string): NavLink[] => [
  { label: t('header.nav.howItWorks'), href: '/#how-it-works' },
  { label: t('header.nav.integrations'), href: '/#integrations' },
  { label: t('header.nav.pricing'), href: '/#pricing' },
  { label: t('header.nav.contact'), href: '/#contact' },
];

// Menu items for guest users (not authenticated)
export const getNavMenuItemsGuest = (t: (key: string) => string, locale: string): NavMenuItem[] => [
  {
    label: t('header.nav.home'),
    items: [
      { 
        label: t('header.nav.sections.hero'), 
        href: `/`,
        description: t('header.nav.sections.heroDesc')
      },
      { 
        label: t('header.nav.sections.howItWorks'), 
        href: `/#how-it-works`,
        description: t('header.nav.sections.howItWorksDesc')
      },
      { 
        label: t('header.nav.sections.faq'), 
        href: `/#pricing`,
        description: t('header.nav.sections.faqDesc')
      },
    ],
  },
  {
    label: t('header.nav.access'),
    items: [
      { 
        label: t('header.nav.auth.login'), 
        href: `/login`,
        description: t('header.nav.auth.loginDesc')
      },
      { 
        label: t('header.nav.auth.signup'), 
        href: `/signup`,
        description: t('header.nav.auth.signupDesc')
      },
      { 
        label: t('header.nav.auth.forgotPassword'), 
        href: `/forgot-password`,
        description: t('header.nav.auth.forgotPasswordDesc')
      },
      { 
        label: t('header.nav.auth.googleAuth'), 
        isGoogleAuth: true,
        description: t('header.nav.auth.googleAuthDesc')
      },
    ],
  },
  {
    label: t('header.nav.moreInfo'),
    items: [
      { 
        label: t('header.nav.info.about'), 
        href: `/about`,
        description: t('header.nav.info.aboutDesc')
      },
      { 
        label: t('header.nav.info.contact'), 
        href: `/contact`,
        description: t('header.nav.info.contactDesc')
      },
    ],
  },
];
