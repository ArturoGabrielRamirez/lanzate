import { CogIcon, HelpCircleIcon, HomeIcon, InfoIcon, KeyRoundIcon, LogInIcon, PhoneIcon, PlayCircleIcon, UserPlusIcon } from 'lucide-react';

import { NavLink, NavMenuItem } from '@/features/header/types';

export const getNavLinks = (t: (key: string) => string): NavLink[] => [
  { label: t('header.nav.howItWorks'), href: '/#how-it-works' },
  { label: t('header.nav.integrations'), href: '/#integrations' },
  { label: t('header.nav.pricing'), href: '/#pricing' },
  { label: t('header.nav.contact'), href: '/#contact' },
];

export const getNavMenuItemsGuest = (t: (key: string) => string): NavMenuItem[] => [
  {
    label: t('header.nav.home'),
    items: [
      {
        label: t('header.nav.sections.hero'),
        href: `/`,
        description: t('header.nav.sections.heroDesc'),
        icon: <HomeIcon className='size-6 text-inherit'/>
      },
      {
        label: t('header.nav.sections.howItWorks'),
        href: `/#how-it-works`,
        description: t('header.nav.sections.howItWorksDesc'),
        icon: <PlayCircleIcon className='size-6 group-hover:text-inherit'/>
      },
      {
        label: t('header.nav.sections.integrations'),
        href: `/#integrations`,
        description: t('header.nav.sections.integrationsDesc'),
        icon: <CogIcon className='size-6 group-hover:text-inherit'/>
      },
      {
        label: t('header.nav.sections.faq'),
        href: `/#pricing`,
        description: t('header.nav.sections.faqDesc'),
        icon: <HelpCircleIcon className='size-6 group-hover:text-inherit'/>
      },
    ],
  },
  {
    label: t('header.nav.access'),
    items: [
      {
        label: t('header.nav.auth.login'),
        href: `/login`,
        description: t('header.nav.auth.loginDesc'),
        icon: <LogInIcon className='size-6 group-hover:text-inherit'/>
      },
      {
        label: t('header.nav.auth.signup'),
        href: `/signup`,
        description: t('header.nav.auth.signupDesc'),
        icon: <UserPlusIcon className='size-6 group-hover:text-inherit'/>
      },
      {
        label: t('header.nav.auth.forgotPassword'),
        href: `/forgot-password`,
        description: t('header.nav.auth.forgotPasswordDesc'),
        icon: <KeyRoundIcon className='size-6 group-hover:text-inherit'/>
      },
      {
        label: t('header.nav.auth.googleAuth'),
        isGoogleAuth: true,
        description: t('header.nav.auth.googleAuthDesc'),
        icon: <KeyRoundIcon className='size-6 group-hover:text-inherit'/>
      },
    ],
  },
  {
    label: t('header.nav.moreInfo'),
    items: [
      {
        label: t('header.nav.info.about'),
        href: `/about`,
        description: t('header.nav.info.aboutDesc'),
        icon: <InfoIcon className='size-6 group-hover:text-inherit'/>
      },
      {
        label: t('header.nav.info.contact'),
        href: `/contact`,
        description: t('header.nav.info.contactDesc'),
        icon: <PhoneIcon className='size-6 group-hover:text-inherit'/>
      },
    ],
  },
];
