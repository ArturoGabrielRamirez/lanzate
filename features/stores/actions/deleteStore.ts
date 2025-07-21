"use server"

/* 

### 2.3 Eliminar Tienda
**Pasos:**
1. Check user owns store
2. Check for pending orders
3. Archive all products
4. Cancel pending orders
5. Delete store cascade
6. Create deletion notification
7. Crear registro en action_logs ("delete_store")

**Tablas involucradas:**
- `stores` (DELETE)
- `products` (UPDATE - archive)
- `orders` (READ, UPDATE)
- `branches` (DELETE - cascade)
- `notifications` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Órdenes pendientes → Error 409
- Error en cascade → Rollback completo

---

*/

import { actionWrapper } from "@/utils/lib"
import { deleteStore as deleteStoreFromDb } from "../data/deleteStore"
import { revalidatePath } from "next/cache"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"

export async function deleteStore(storeId: number, userId: number) {
    return actionWrapper(async () => {

        //Check user owns store
        //Check for pending orders
        //Archive all products
        //Cancel pending orders
        //Send user from orders an email

        //Delete store cascade
        const { error, message, payload } = await deleteStoreFromDb(storeId)

        if (error) throw new Error(message)

        revalidatePath("/stores")

        // Create action log
        const { error: logError } = await insertLogEntry({
            action: "DELETE",
            entity_type: "STORE",
            entity_id: storeId,
            user_id: userId,
            action_initiator: "Delete store button",
            details: "User deleted store using the delete store button in danger zone"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")


        return {
            error: false,
            message: "Store deleted successfully",
            payload: payload
        }

    })
}
