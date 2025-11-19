"use client";

import { UserType } from "@/features/account/types/types";
import { mapUserToSession } from "@/features/plans/utils/adapter";
import { AccessManagerProvider } from "@/features/shadcn/components/access-manager";

interface PlanProviderProps {
    user: UserType | null;
    children: React.ReactNode;
}

export function PlanProvider({ user, children }: PlanProviderProps) {
    const userSession = user ? mapUserToSession(user) : null;

    return (
        <AccessManagerProvider
            user={userSession}
            // Optional: Map base roles if you want additional static rules
            rolePermissionMap={{
                admin: ["manage_users", "view_all"],
                // These map to the 'roles' we set in adapter (lowercase plan names)
                free: ["basic_access"],
                pro: ["premium_access"],
                enterprise: ["all_access"]
            }}
        >
            {children}
        </AccessManagerProvider>
    );
}
