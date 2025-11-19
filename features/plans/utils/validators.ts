import { AccountType } from "@prisma/client";

import { PLAN_CONFIG } from "@/features/plans/utils/constants";

interface CheckLimitParams {
    plan: AccountType;
    resource: "stores" | "products" | "teamMembers";
    currentCount: number;
}

export const hasReachedLimit = ({ plan, resource, currentCount }: CheckLimitParams): boolean => {
    const config = PLAN_CONFIG[plan];

    let limit: number;

    switch (resource) {
        case "stores": limit = config.maxStores; break;
        case "products": limit = config.maxProductsPerStore; break;
        case "teamMembers": limit = config.maxTeamMembers; break;
        default: return false;
    }

    if (limit === Infinity) return false;
    return currentCount >= limit;
};

export const hasFeatureAccess = (plan: AccountType, feature: "canRemoveBranding" | "canUseCustomDomain"): boolean => {
    return PLAN_CONFIG[plan][feature];
};

