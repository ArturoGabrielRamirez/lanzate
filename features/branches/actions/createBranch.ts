"use server"

/* 

### 6.1 Crear Sucursal
**Pasos:**
1. Check user owns store
2. Create branch record
3. Initialize stock for all store products
4. Create branch notification
5. Crear registro en action_logs ("create_branch")

**Tablas involucradas:**
- `branches` (CREATE)
- `stores` (READ)
- `products` (READ)
- `product_stocks` (CREATE)
- `notifications` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Error en stock init → Rollback branch
- Store no encontrado → Error 404

---

*/

import { actionWrapper } from "@/utils/lib"
import { insertBranch } from "../data/insertBranch"
import { revalidatePath } from "next/cache"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"

export async function createBranch(payload: any, storeId: number, userId: number) {

    return actionWrapper(async () => {

        const { error, message, payload: branch } = await insertBranch(payload, storeId)

        if (error) throw new Error(message)

        revalidatePath(`/stores/${storeId}`)

        // Create action log
        const { error: logError } = await insertLogEntry({
            action: "CREATE",
            entity_type: "BRANCH",
            entity_id: branch.id,
            user_id: userId,
            action_initiator: "Branch creation form",
            details: "Branch created using branch creation form"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")


        return {
            error: false,
            message: "Branch created successfully",
            payload: branch
        }

    })
}
