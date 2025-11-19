import { ROUTES } from "@/features/global/constants";

export const PRICING_PLANS = [
    {
        id: 'starter',
        contactPageHref: ROUTES.LOGIN,
        className: "shadow-sm hover:drop-shadow-2xl transition-all hover:-translate-y-1",
        planKey: 'starter',
        featuresCount: 6,
    },
    {
        id: 'business',
        contactPageHref: ROUTES.WAITLIST,
        className: "shadow-sm hover:drop-shadow-2xl transition-all hover:-translate-y-1 bg-card",
        planKey: 'business',
        featuresCount: 5,
    },
    {
        id: 'enterprise',
        contactPageHref: ROUTES.WAITLIST,
        className: "shadow-sm hover:drop-shadow-2xl transition-all hover:-translate-y-1",
        planKey: 'enterprise',
        featuresCount: 6,
    },
] as const;

