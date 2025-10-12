import { CogIcon, HelpCircleIcon, HomeIcon, InfoIcon, KeyRoundIcon, LayoutDashboard, LogInIcon, PhoneIcon, PlayCircleIcon, PlusCircle, Store, UserIcon, UserPlusIcon } from 'lucide-react';

import { NavMenuItem, NavSubItem } from '@/features/header/types';

const HOME_ITEM = {
    label: 'header.nav.home',
    href: '/',
    description: 'header.nav.sections.heroDesc',
    icon: <HomeIcon className='size-6 group-hover:text-inherit' />
}

const HOW_IT_WORKS_ITEM = {
    label: 'header.nav.howItWorks',
    description: 'header.nav.sections.howItWorksDesc',
    href: '/#how-it-works',
    icon: <PlayCircleIcon className='size-6 group-hover:text-inherit' />
}

const INTEGRATIONS_ITEM = {
    label: 'header.nav.integrations',
    description: 'header.nav.sections.integrationsDesc',
    href: '/#integrations',
    icon: <CogIcon className='size-6 group-hover:text-inherit' />
}

const FAQ_ITEM = {
    label: 'header.nav.sections.faq',
    description: 'header.nav.sections.faqDesc',
    href: '/#pricing',
    icon: <HelpCircleIcon className='size-6 group-hover:text-inherit' />
}

const LOGIN_ITEM = {
    label: 'header.nav.auth.login',
    href: '/login',
    description: 'header.nav.auth.loginDesc',
    icon: <LogInIcon className='size-6 group-hover:text-inherit' />
}

const SIGNUP_ITEM = {
    label: 'header.nav.auth.signup',
    href: '/signup',
    description: 'header.nav.auth.signupDesc',
    icon: <UserPlusIcon className='size-6 group-hover:text-inherit' />
}

const FORGOT_PASSWORD_ITEM = {
    label: 'header.nav.auth.forgotPassword',
    href: '/forgot-password',
    description: 'header.nav.auth.forgotPasswordDesc',
    icon: <KeyRoundIcon className='size-6 group-hover:text-inherit' />
}

const DASHBOARD_ITEM = {
    label: 'header.nav.user.dashboard',
    href: '/dashboard',
    description: 'header.nav.user.dashboardDesc',
    icon: <LayoutDashboard className='size-6 group-hover:text-inherit' />
}

const NEW_SALE_ITEM = {
    label: 'header.nav.user.newSale',
    href: '/new-sale',
    description: 'header.nav.user.newSaleDesc',
    icon: <PlusCircle className='size-6 group-hover:text-inherit' />
}


const STORES_ITEM = {
    label: 'header.nav.user.stores',
    href: '/stores',
    description: 'header.nav.user.storesDesc',
    icon: <Store className='size-6 group-hover:text-inherit' />
}

const ACCOUNT_ITEM = {
    label: 'header.nav.user.account',
    href: '/account',
    description: 'header.nav.user.accountDesc',
    icon: <UserIcon className='size-6 group-hover:text-inherit' />
}

const GOOGLE_AUTH_ITEM = {
    label: 'header.nav.auth.googleAuth',
    href: '/auth/google',
    description: 'header.nav.auth.googleAuthDesc',
    icon: <KeyRoundIcon className='size-6 group-hover:text-inherit' />
}

const ABOUT_ITEM = {
    label: 'header.nav.info.about',
    href: '/about',
    description: 'header.nav.info.aboutDesc',
    icon: <InfoIcon className='size-6 group-hover:text-inherit' />
}

const CONTACT_ITEM = {
    label: 'header.nav.info.contact',
    href: '/contact',
    description: 'header.nav.info.contactDesc',
    icon: <PhoneIcon className='size-6 group-hover:text-inherit' />
}


export const NAV_MENU_ITEMS_GUEST: NavMenuItem[] = [
    {
        label: 'header.nav.home',
        items: [
            {
                label: 'header.nav.sections.hero',
                href: `/`,
                description: 'header.nav.sections.heroDesc',
                icon: <HomeIcon className='size-6 text-inherit' />
            },
            HOW_IT_WORKS_ITEM,
            INTEGRATIONS_ITEM,
            FAQ_ITEM,
        ],
    },
    {
        label: 'header.nav.access',
        items: [
            LOGIN_ITEM,
            SIGNUP_ITEM,
            FORGOT_PASSWORD_ITEM,
            GOOGLE_AUTH_ITEM,
        ],
    },
    {
        label: 'header.nav.moreInfo',
        items: [
            ABOUT_ITEM,
            CONTACT_ITEM,
        ],
    },
];

export const NAV_MENU_ITEMS_AUTH: NavSubItem[] = [
    DASHBOARD_ITEM,
    NEW_SALE_ITEM,
    STORES_ITEM,
    ACCOUNT_ITEM,
]

export const DRAWER_MENU_ITEMS_GUEST: NavSubItem[] = [
    HOME_ITEM,
    ABOUT_ITEM,
    CONTACT_ITEM,
    LOGIN_ITEM,
    SIGNUP_ITEM,
]