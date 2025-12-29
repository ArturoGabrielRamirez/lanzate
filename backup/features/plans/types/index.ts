export type PermissionType = 
    | "store:create"
    | "product:create"
    | "branding:remove"
    | "domain:custom"
    | "team:add"
    | "analytics:view";

export interface PlanLimits {
    maxStores: number;
    maxProductsPerStore: number;
    maxTeamMembers: number;
    canRemoveBranding: boolean;
    canUseCustomDomain: boolean;
}

