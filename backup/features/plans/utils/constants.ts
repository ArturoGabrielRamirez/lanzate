import { AccountType } from "@prisma/client";

import { PlanLimits } from "@/features/plans/types";

export const PERMISSIONS = {
    CREATE_STORE: "store:create",
    CREATE_PRODUCT: "product:create",
    REMOVE_BRANDING: "branding:remove",
    USE_CUSTOM_DOMAIN: "domain:custom",
    ADD_TEAM_MEMBER: "team:add",
    VIEW_ANALYTICS: "analytics:view",
} as const;

export const PLAN_CONFIG: Record<AccountType, PlanLimits> = {
    FREE: {
        maxStores: 2,
        maxProductsPerStore: 100,
        maxTeamMembers: 1,
        canRemoveBranding: false,
        canUseCustomDomain: false,
    },
    PRO: {
        maxStores: 5,
        maxProductsPerStore: 5000,
        maxTeamMembers: 5,
        canRemoveBranding: true,
        canUseCustomDomain: true,
    },
    ENTERPRISE: {
        maxStores: Infinity,
        maxProductsPerStore: Infinity,
        maxTeamMembers: Infinity,
        canRemoveBranding: true,
        canUseCustomDomain: true,
    },
};

