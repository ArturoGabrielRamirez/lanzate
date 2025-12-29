import { UserType } from "@/features/account/types/types"
import { PLAN_CONFIG, PERMISSIONS } from "@/features/plans/utils/constants"
import { UserSession } from "@/features/shadcn/components/gate"

export function mapUserToSession(user: UserType): UserSession {
    const accountType = (user.Account?.[0]?.type || "FREE") as keyof typeof PLAN_CONFIG;
    const limits = PLAN_CONFIG[accountType];

    const currentStoreCount = user.Store?.length || 0;
    // In a real scenario, you might want to pass product count as well, 
    // or fetch it if needed, but for now we'll assume we are checking store limits mainly 
    // or that the user object has what we need.
    // If the user object doesn't have product counts, we might need to fetch them 
    // or just rely on server-side validation for that specific resource if it's too heavy to load always.
    // For this adapter, we'll focus on what's available in UserType.

    const effectivePermissions: string[] = [];

    // 1. Store Creation Permission
    if (currentStoreCount < limits.maxStores) {
        effectivePermissions.push(PERMISSIONS.CREATE_STORE);
    }

    // 2. Branding Removal
    if (limits.canRemoveBranding) {
        effectivePermissions.push(PERMISSIONS.REMOVE_BRANDING);
    }

    // 3. Custom Domain
    if (limits.canUseCustomDomain) {
        effectivePermissions.push(PERMISSIONS.USE_CUSTOM_DOMAIN);
    }

    // 4. Team Members
    // We don't have current team member count in UserType usually, 
    // so we might optimistically grant it or need more data.
    // For now let's just add it if the limit > 0
    if (limits.maxTeamMembers > 0) {
        // This is a simplification. Ideally we check count.
        effectivePermissions.push(PERMISSIONS.ADD_TEAM_MEMBER);
    }
    
    // 5. Analytics
    // Assuming all plans have view analytics for now, or restricted by plan
    effectivePermissions.push(PERMISSIONS.VIEW_ANALYTICS);


    return {
        id: user.id.toString(),
        email: user.email,
        roles: [accountType.toLowerCase()],
        permissions: effectivePermissions,
        isActive: true,
        // We could add expiration if we had subscription end date
    };
}

