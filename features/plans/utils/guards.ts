import { AccountType } from "@prisma/client";

import { UserType } from "@/features/account/types/types";
import { hasReachedLimit } from "@/features/plans/utils/validators";

export function validateCreateStore(user: UserType) {
    const accountType = (user.Account?.[0]?.type || "FREE") as AccountType;
    const currentStoreCount = user.Store?.length || 0;

    if (hasReachedLimit({ plan: accountType, resource: "stores", currentCount: currentStoreCount })) {
        throw new Error(`Ya ulizaste el límite de tiendas para tu plan ${accountType}`);
    }
}

// You can add more guards here
// export function validateCreateProduct(...) { ... }

