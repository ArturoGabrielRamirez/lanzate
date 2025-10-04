"use server"

/* 

### 3.2 Actualizar Producto
**Pasos:**
1. Check user owns product
2. Check SKU uniqueness if changed
3. Update product fields
4. Update image/video if provided
5. Crear registro en action_logs ("update_product")

**Tablas involucradas:**
- `products` (READ, UPDATE)
- `users` (READ)
- `action_logs` (CREATE)

**Manejo de errores:**
- Usuario no es owner → Error 403
- SKU duplicado → Error 409

---

*/

import { actionWrapper } from "@/utils/lib"
import { updateProduct as updateProductInDb } from "../data/updateProduct"
import { revalidatePath } from "next/cache"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"

export async function editProduct(productId: number, data: any, slug: string, userId: number) {
    return actionWrapper(async () => {

        //Check user owns product

        //Check SKU uniqueness if changed
        //Update product fields
        //Update image/video if provided
        const { error, payload, message } = await updateProductInDb(productId, data)

        if (error) throw new Error(message)

        revalidatePath(`/stores/${slug}`)

        //Create action log
        const { error: logError } = await insertLogEntry({
            action: "UPDATE",
            entity_type: "PRODUCT",
            entity_id: productId,
            user_id: userId,
            action_initiator: "Edit product form",
            details: "Product updated using edit product form"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")

        return {
            message: "Product updated successfully",
            payload: payload,
            error: false
        }

    })
} 