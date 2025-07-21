"use server"

/* 

### 2.1 Crear Nueva Tienda
**Pasos:**
1. Check user is authenticated
2. Check user account type allows store creation
3. Verify slug and subdomain availability
4. Create store record
5. Create default branch
6. Create success notification
7. Crear registro en action_logs ("create_store")

**Tablas involucradas:**
- `stores` (CREATE)
- `branches` (CREATE)
- `accounts` (READ)
- `notifications` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Slug/subdomain duplicado → Error 409
- Límite de tiendas alcanzado → Error 403
- Error en branch creation → Rollback store

---

*/

import { revalidatePath } from "next/cache"
import { insertStore } from "../data/insertStore"
import { actionWrapper } from "@/utils/lib"
import { canCreateStore } from "../access/canCreateStore"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"


export async function createStore(payload: any, userId: number) {
    return actionWrapper(async () => {

        //Check user is authenticated

        //Check user account type allows store creation
        const canCreate = await canCreateStore(userId)

        //Throw error if user's account is not allowed
        if (!canCreate) throw new Error("Free plan limit reached")

        //Verify slug and subdomain availability
        //Create store record
        //Create default branch
        //Create store's initial balance
        const { payload: newStore, error, message } = await insertStore(payload, userId)

        //Throw error if store was not able to be created
        if (error) throw new Error(message)

        revalidatePath("/stores")

        // Create action log
        const { error: logError } = await insertLogEntry({
            action: "CREATE",
            entity_type: "STORE",
            entity_id: newStore.id,
            user_id: userId,
            action_initiator: "Create store button",
            details: "User created a new store using the button"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")

        return {
            message: "Store created successfully",
            payload: newStore,
            error: false
        }

    })
}
