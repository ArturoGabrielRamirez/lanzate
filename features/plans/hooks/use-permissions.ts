import { PERMISSIONS } from "@/features/plans/utils/constants"
import { useAccessManager } from "@/features/shadcn/components/gate"

export function usePermissions() {
    const { hasPermission, user } = useAccessManager();

    return {
        canCreateStore: hasPermission(PERMISSIONS.CREATE_STORE),
        canCreateProduct: hasPermission(PERMISSIONS.CREATE_PRODUCT),
        canRemoveBranding: hasPermission(PERMISSIONS.REMOVE_BRANDING),
        canUseCustomDomain: hasPermission(PERMISSIONS.USE_CUSTOM_DOMAIN),
        canAddTeamMember: hasPermission(PERMISSIONS.ADD_TEAM_MEMBER),
        canViewAnalytics: hasPermission(PERMISSIONS.VIEW_ANALYTICS),
        // Expose raw user session if needed
        userSession: user
    };
}

