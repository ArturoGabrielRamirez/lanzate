import { CogIcon, HelpCircleIcon, HomeIcon, InfoIcon, KeyRoundIcon, LayoutDashboard, LogInIcon, PhoneIcon, PlayCircleIcon, PlusCircle, Store, UserIcon, UserPlusIcon } from 'lucide-react';

import { NavMenuItem, NavSubItem } from '@/features/header/types';

const HOME_ITEM = {
    label: 'feature/header.navigation.home',
    href: '/',
    description: 'feature/header.navigation.sections.heroDesc',
    icon: <HomeIcon className='size-6 group-hover:text-inherit' />
}

const HOW_IT_WORKS_ITEM = {
    label: 'feature/header.navigation.sections.howItWorks',
    description: 'feature/header.navigation.sections.howItWorksDesc',
    href: '/#how-it-works',
    icon: <PlayCircleIcon className='size-6 group-hover:text-inherit' />
}

const INTEGRATIONS_ITEM = {
    label: 'feature/header.navigation.sections.integrations',
    description: 'feature/header.navigation.sections.integrationsDesc',
    href: '/#integrations',
    icon: <CogIcon className='size-6 group-hover:text-inherit' />
}

const FAQ_ITEM = {
    label: 'feature/header.navigation.sections.faq',
    description: 'feature/header.navigation.sections.faqDesc',
    href: '/#pricing',
    icon: <HelpCircleIcon className='size-6 group-hover:text-inherit' />
}

const LOGIN_ITEM = {
    label: 'feature/header.navigation.login',
    href: '/login',
    description: 'feature/header.navigation.sections.loginDesc',
    icon: <LogInIcon className='size-6 group-hover:text-inherit' />
}

const SIGNUP_ITEM = {
    label: 'feature/header.navigation.signup',
    href: '/signup',
    description: 'feature/header.navigation.sections.signupDesc',
    icon: <UserPlusIcon className='size-6 group-hover:text-inherit' />
}

const FORGOT_PASSWORD_ITEM = {
    label: 'feature/header.navigation.sections.forgotPassword',
    href: '/forgot-password',
    description: 'feature/header.navigation.sections.forgotPasswordDesc',
    icon: <KeyRoundIcon className='size-6 group-hover:text-inherit' />
}

const DASHBOARD_ITEM = {
    label: 'feature/header.navigation.sections.dashboard',
    href: '/dashboard',
    description: 'feature/header.navigation.sections.dashboardDesc',
    icon: <LayoutDashboard className='size-6 group-hover:text-inherit' />
}

const NEW_SALE_ITEM = {
    label: 'feature/header.navigation.sections.newSale',
    href: '/sale',
    description: 'feature/header.navigation.sections.newSaleDesc',
    icon: <PlusCircle className='size-6 group-hover:text-inherit' />
}


const STORES_ITEM = {
    label: 'feature/header.navigation.sections.stores',
    href: '/stores',
    description: 'feature/header.navigation.sections.storesDesc',
    icon: <Store className='size-6 group-hover:text-inherit' />
}

const ACCOUNT_ITEM = {
    label: 'feature/header.navigation.sections.account',
    href: '/account',
    description: 'feature/header.navigation.sections.accountDesc',
    icon: <UserIcon className='size-6 group-hover:text-inherit' />
}

const GOOGLE_AUTH_ITEM = {
    label: 'feature/header.navigation.sections.googleAuth',
    href: '/auth/google',
    description: 'feature/header.navigation.sections.googleAuthDesc',
    icon: <KeyRoundIcon className='size-6 group-hover:text-inherit' />
}

const ABOUT_ITEM = {
    label: 'feature/header.navigation.about',
    href: '/about',
    description: 'feature/header.navigation.sections.aboutDesc',
    icon: <InfoIcon className='size-6 group-hover:text-inherit' />
}

const CONTACT_ITEM = {
    label: 'feature/header.navigation.contact',
    href: '/contact',
    description: 'feature/header.navigation.sections.contactDesc',
    icon: <PhoneIcon className='size-6 group-hover:text-inherit' />
}


export const NAV_MENU_ITEMS_GUEST: NavMenuItem[] = [
    {
        label: 'feature/header.navigation.home',
        items: [
            {
                label: 'feature/header.navigation.sections.hero',
                href: `/`,
                description: 'feature/header.navigation.sections.heroDesc',
                icon: <HomeIcon className='size-6 text-inherit' />
            },
            HOW_IT_WORKS_ITEM,
            INTEGRATIONS_ITEM,
            FAQ_ITEM,
        ],
    },
    {
        label: 'feature/header.navigation.access',
        items: [
            LOGIN_ITEM,
            SIGNUP_ITEM,
            FORGOT_PASSWORD_ITEM,
            GOOGLE_AUTH_ITEM,
        ],
    },
    {
        label: 'feature/header.navigation.moreInfo',
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