"use server"

/* 

### 2.2 Actualizar Tienda
**Pasos:**
1. Check user owns store
2. Check slug/subdomain availability if changed
3. Update store fields
4. Update logo if provided
5. Log store modification
6. Crear registro en action_logs ("update_store")

**Tablas involucradas:**
- `stores` (READ, UPDATE)
- `users` (READ)
- `action_logs` (CREATE)

**Manejo de errores:**
- Usuario no es owner → Error 403
- Slug duplicado → Error 409

---

*/

import { actionWrapper } from "@/utils/lib"
import { canUpdateStore } from "../access/canUpdateStore"
import { updateStoreBySlug } from "../data/updateStoreBySlug"
import { revalidatePath } from "next/cache"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"

export async function updateStore(slug: string, data: any, userId: number) {
    return actionWrapper(async () => {

        //Check user owns store
        const canUpdate = await canUpdateStore(slug, userId)

        if (!canUpdate) throw new Error("You are not allowed to update this store")

        //Check slug/subdomain availability if changed
        //Update store fields
        const { error, payload, message } = await updateStoreBySlug(slug, data)

        if (error) throw new Error(message)

        revalidatePath(`/stores/${slug}`)

        // Create action log
        const { error: logError } = await insertLogEntry({
            action: "UPDATE",
            entity_type: "STORE",
            entity_id: payload.id,
            user_id: userId,
            action_initiator: "Edit store button",
            details: "User updated store using the edit store button"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")


        return {
            message: "Store updated successfully",
            payload: payload,
            error: false
        }
    })
}
