import { CogIcon, HelpCircleIcon, HomeIcon, InfoIcon, KeyRoundIcon, LayoutDashboard, LogInIcon, PhoneIcon, PlayCircleIcon, PlusCircle, Store, UserIcon, UserPlusIcon, CircleQuestionMarkIcon, DollarSignIcon } from 'lucide-react';

import { NavMenuItem, NavSubItem } from '@/features/header/types';

const HOME_ITEM = {
    label: 'layout.header.navigation.home',
    href: '/',
    description: 'layout.header.navigation.sections.heroDesc',
    icon: <HomeIcon className='size-6 lg:size-4 group-hover:text-inherit' />
}

const HOW_IT_WORKS_ITEM = {
    label: 'layout.header.navigation.sections.howItWorks',
    description: 'layout.header.navigation.sections.howItWorksDesc',
    href: '/#how-it-works',
    icon: <PlayCircleIcon className='size-6 lg:size-4 group-hover:text-inherit' />
}

const INTEGRATIONS_ITEM = {
    label: 'layout.header.navigation.sections.integrations',
    description: 'layout.header.navigation.sections.integrationsDesc',
    href: '/#integrations',
    icon: <CogIcon className='size-6 lg:size-4 group-hover:text-inherit' />
}

const FAQ_ITEM = {
    label: 'layout.header.navigation.sections.faq',
    description: 'layout.header.navigation.sections.faqDesc',
    href: '/#faq',
    icon: <HelpCircleIcon className='size-6 lg:size-4 group-hover:text-inherit' />
}

const LOGIN_ITEM = {
    label: 'layout.header.navigation.auth.login',
    href: '/login',
    description: 'layout.header.navigation.sections.loginDesc',
    icon: <LogInIcon className='size-6 lg:size-4 group-hover:text-inherit' />
}

const SIGNUP_ITEM = {
    label: 'layout.header.navigation.auth.signup',
    href: '/signup',
    description: 'layout.header.navigation.sections.signupDesc',
    icon: <UserPlusIcon className='size-6 lg:size-4 group-hover:text-inherit' />
}

const FORGOT_PASSWORD_ITEM = {
    label: 'layout.header.navigation.auth.forgotPassword',
    href: '/forgot-password',
    description: 'layout.header.navigation.sections.forgotPasswordDesc',
    icon: <KeyRoundIcon className='size-6 lg:size-4 group-hover:text-inherit' />
}

const DASHBOARD_ITEM = {
    label: 'layout.header.navigation.sections.dashboard',
    href: '/dashboard',
    description: 'layout.header.navigation.sections.dashboardDesc',
    icon: <LayoutDashboard className='size-6 lg:size-4 group-hover:text-inherit' />
}

const NEW_SALE_ITEM = {
    label: 'layout.header.navigation.sections.newSale',
    href: '/sale',
    description: 'layout.header.navigation.sections.newSaleDesc',
    icon: <PlusCircle className='size-6 lg:size-4 group-hover:text-inherit' />
}


const STORES_ITEM = {
    label: 'layout.header.navigation.sections.stores',
    href: '/stores',
    description: 'layout.header.navigation.sections.storesDesc',
    icon: <Store className='size-6 lg:size-4 group-hover:text-inherit' />
}

const ACCOUNT_ITEM = {
    label: 'layout.header.navigation.sections.account',
    href: '/account',
    description: 'layout.header.navigation.sections.accountDesc',
    icon: <UserIcon className='size-6 lg:size-4 group-hover:text-inherit' />
}

const GOOGLE_AUTH_ITEM = {
    label: 'layout.header.navigation.auth.googleAuth',
    href: '/auth/google',
    description: 'layout.header.navigation.sections.googleAuthDesc',
    icon: <KeyRoundIcon className='size-6 lg:size-4 group-hover:text-inherit' />,
    isGoogleAuth: true,
}

const ABOUT_ITEM = {
    label: 'layout.header.navigation.about',
    href: '/about',
    description: 'layout.header.navigation.sections.aboutDesc',
    icon: <InfoIcon className='size-6 lg:size-4 group-hover:text-inherit' />
}

const CONTACT_ITEM = {
    label: 'layout.header.navigation.contact',
    href: '/#contact',
    description: 'layout.header.navigation.sections.contactDesc',
    icon: <PhoneIcon className='size-6 lg:size-4 group-hover:text-inherit' />
}

const HELP_ITEM = {
    label: 'layout.header.navigation.help',
    href: '/#help',
    description: 'layout.header.navigation.sections.helpDesc',
    icon: <CircleQuestionMarkIcon className='size-6 lg:size-4 group-hover:text-inherit' />
}


const PRICING_ITEM = {
    label: 'layout.header.navigation.pricing', 
    href: '/#pricing',
    description: 'layout.header.navigation.sections.pricingDesc',
    icon: <DollarSignIcon className='size-6 lg:size-4 group-hover:text-inherit' />
}

export const NAV_MENU_ITEMS_GUEST: NavMenuItem[] = [
    {
        label: 'layout.header.navigation.home',
        items: [
            {
                label: 'layout.header.navigation.sections.hero',
                href: `/`,
                description: 'layout.header.navigation.sections.heroDesc',
                icon: <HomeIcon className='size-4 text-inherit' />
            },
            HOW_IT_WORKS_ITEM,
            INTEGRATIONS_ITEM,
            FAQ_ITEM,
            CONTACT_ITEM,
            PRICING_ITEM,
        ],
    },
    {
        label: 'layout.header.navigation.access',
        items: [
            LOGIN_ITEM,
            SIGNUP_ITEM,
            FORGOT_PASSWORD_ITEM,
            GOOGLE_AUTH_ITEM,
        ],
    },
    {
        label: 'layout.header.navigation.moreInfo',
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
    HELP_ITEM
]

export const DRAWER_MENU_ITEMS_GUEST: NavSubItem[] = [
    HOME_ITEM,
    ABOUT_ITEM,
    CONTACT_ITEM,
    LOGIN_ITEM,
    SIGNUP_ITEM,
]