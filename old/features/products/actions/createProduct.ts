"use server"

/* 

### 3.1 Crear Producto
**Pasos:**
1. Check user owns store
2. Verify SKU uniqueness
3. Generate slug from name
4. Create product record
5. Create initial stock entry for each branch
6. Create product notification
7. Crear registro en action_logs ("create_product")

**Tablas involucradas:**
- `products` (CREATE)
- `stores` (READ)
- `branches` (READ)
- `product_stocks` (CREATE)
- `notifications` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- SKU duplicado → Error 409
- Slug duplicado → Auto-generate variant
- Error en stock creation → Rollback product

---

*/


import { actionWrapper } from "@/utils/lib"
import { insertProduct } from "../data/insertProduct"
import { revalidatePath } from "next/cache"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"

export async function createProduct(payload: any, storeId: number, userId: number) {
    return actionWrapper(async () => {

        //Check user owns store

        //Verify SKU uniqueness
        //Generate slug from name
        //Create product record
        //Create initial stock entry for each branch (falta, solo esta main branch por ahora)
        const { error, message, payload: product } = await insertProduct(payload, storeId, userId)

        if (error) throw new Error(message)

        revalidatePath(`/stores/${storeId}`)
        revalidatePath(`/dashboard`)

        //Create product notification
        //Create action_log record
        // Create action log
        const { error: logError } = await insertLogEntry({
            action: "CREATE",
            entity_type: "PRODUCT",
            entity_id: product.id,
            user_id: userId,
            action_initiator: "Create product button",
            details: "Product created using the create product button"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")


        return {
            error: false,
            message: "Product created successfully",
            payload: product
        }

    })
}
