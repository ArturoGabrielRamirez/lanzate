"use server"

import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getProductDetails } from "@/features/stores/actions/getProductDetails"
import { getStoreBySubdomain } from "@/features/subdomain/actions/getStoreBySubdomain"
import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"
import { createServerSideClient } from "@/utils/supabase/server"

/* 
### 5.1 Nueva Orden de Compra
**Pasos:**
1. Check user is authenticated - done
2. Check store exists and is active - done
3. Check branch exists - pending
4. Validate each product exists and is active - done
5. Check product stock availability in branch - done but only check in entire store
6. Calculate total price and quantity - done
7. Create order record - done
8. Create order items - done
9. Reduce stock for each product in branch - done
10. Create payment record (PENDING) - pending
11. Send order confirmation notification - pending

**Tablas involucradas:**
- `orders` (CREATE)
- `order_items` (CREATE)
- `product_stocks` (READ, UPDATE)
- `order_payments` (CREATE)
- `products` (READ)
- `stores` (READ)
- `branches` (READ)
- `notifications` (CREATE)

**Manejo de errores:**
- Stock insuficiente → Error 409, rollback completo
- Producto inactivo → Error 400
- Error en payment → Rollback order y stock
- Error en items → Rollback order

*/
export async function insertNewOrder(formData: any, cart: any[], shippingMethod: "delivery" | "pickup", subdomain: string, userId: string) {
    try {

        const client = new PrismaClient()

        await client.$transaction(async (tx) => {

            const { payload: user, error: userError, message: userMessage } = await getUserInfo()

            if (userError || !user) throw new Error(userMessage)

            const { payload: store, error: storeError, message: storeMessage } = await getStoreBySubdomain(subdomain)

            if (storeError || !store) throw new Error(storeMessage)

            //get main branch
            const mainBranch = await client.branch.findFirst({
                where: {
                    store_id: Number(store.id),
                }
            })

            if (!mainBranch) throw new Error("Main branch not found")

            for (const item of cart) {

                const product = await client.product.findUnique({
                    where: {
                        id: Number(item.id)
                    }
                })

                if (!product) throw new Error("Product not found")

                if (!product.is_published) throw new Error(`Product ${product.name} is not published`)

                if (!product.is_active) throw new Error(`Product ${product.name} is not active`)

                if (product.stock <= 0) throw new Error(`Product ${product.name} is out of stock`)

                if (product.stock < item.quantity) throw new Error(`Product ${product.name} is out of stock`)

            }

            const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

            const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0)

            const order = await tx.order.create({
                data: {
                    total_price: totalPrice,
                    total_quantity: totalQuantity,
                    user_id: user.id,
                    store_id: Number(store.id),
                    branch_id: Number(mainBranch.id),
                    status: "PENDING",
                    items: {
                        create: [
                            ...cart.map((item) => ({
                                product_id: Number(item.id),
                                quantity: item.quantity,
                                price: item.price
                            }))
                        ]
                    },
                    shipping_method: shippingMethod,
                    payment: {
                        create: {
                            amount: totalPrice,
                            status: "PENDING"
                        }
                    }
                }
            })

            if (!order) throw new Error("Order not created")

            //reduce stock for each product in branch
            for (const item of cart) {

                await tx.product.update({
                    where: {
                        id: Number(item.id)
                    },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                })

                await tx.productStock.update({
                    where: {
                        product_id_branch_id: {
                            product_id: Number(item.id),
                            branch_id: Number(mainBranch.id)
                        }
                    },
                    data: {
                        quantity: {
                            decrement: item.quantity
                        }
                    }
                })
            }
            //update store balance
            const updatedStore = await client.store.update({
                where: {
                    id: Number(store.id)
                },
                data: {
                    balance: {
                        update: {
                            current_balance: {
                                increment: totalPrice
                            }
                        }
                    }
                },
                include: {
                    balance: true
                }
            })


            //create transaction
            await client.transaction.create({
                data: {
                    amount: totalPrice,
                    type: "SALE",
                    balance_before: store.balance?.current_balance || 0,
                    balance_after: updatedStore.balance?.current_balance || 0,
                    description: `Order ${order.id} created`,
                    store_id: Number(store.id),
                    created_by: user.id,
                    notes: `Order ${order.id} created`,
                    reference_id: order.id,
                    reference_type: "order",
                    //branch_id : ??
                }
            })
        })



        return {
            error: false,
            message: "Order created successfully",
            payload: null
        }

    } catch (error) {
        return formatErrorResponse("Error inserting new order", error)
    }
}
