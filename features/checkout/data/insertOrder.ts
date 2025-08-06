"use server"

import { CartItemType } from "@/features/cart/types"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"
import { getStoreBySubdomain } from "@/features/subdomain/actions/getStoreBySubdomain"
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { OrderStatus, PaymentMethod } from "@prisma/client"


type insertOrderProps = {
    subdomain: string,
    branch_id: number,
    total_price: number,
    total_quantity: number,
    shipping_method: "DELIVERY" | "PICKUP",
    processed_by_user_id: number,
    payment_method: PaymentMethod,
    cart: CartItemType[],
    isWalkIn: boolean,
    isPaid: boolean,
    customer_info?: {
        name?: string,
        phone?: string,
        email?: string,
        id?: number,
        address_one?: string,
        address_two?: string,
        city?: string,
        state?: string,
        zip_code?: string,
        country?: string
    },
    status?: OrderStatus
}

export async function insertOrder({
    branch_id,
    total_price,
    total_quantity,
    shipping_method,
    processed_by_user_id,
    payment_method,
    isWalkIn,
    isPaid,
    customer_info,
    cart,
    subdomain,
    status
}: insertOrderProps) {
    return actionWrapper(async () => {

        console.log("1")
        const { payload: user, error: userError, message: userMessage } = await getUserInfo()

        console.log("2")

        if (userError || !user) throw new Error(userMessage)

        const { payload: store, error: storeError, message: storeMessage } = await getStoreBySubdomain(subdomain)

        console.log("3")

        if (storeError || !store) throw new Error(storeMessage)

        console.log("4")

        const branch = await prisma.branch.findFirst({
            where: {
                store_id: store.id,
                id: branch_id
            }
        })

        console.log("5")

        if (!branch) throw new Error("Branch not found")

        if (isWalkIn && store.user_id !== processed_by_user_id) {

            console.log("6")

            const employee = await prisma.employee.findFirst({
                where: {
                    store_id: store.id,
                    user_id: processed_by_user_id,
                }
            })

            if (!employee) throw new Error("Employee not found")

            if (!employee.can_create_orders) throw new Error("You are not authorized to create orders")

        }

        console.log("7")

        for (const item of cart) {

            const productStock = await prisma.productStock.findUnique({
                where: {
                    product_id_branch_id: {
                        branch_id: branch.id,
                        product_id: Number(item.id)
                    }
                }
            })

            const product = await prisma.product.findUnique({
                where: {
                    id: Number(item.id)
                }
            })

            if (!product) throw new Error("Product not found")

            if (product.is_active === false) throw new Error("Product is not active")

            if (!product.is_published) throw new Error(`Product ${product.name} is not published`)

            if (product.stock <= 0) throw new Error(`Product ${product.name} is out of stock`)

            if (product.stock < item.quantity) throw new Error(`Product ${product.name} is out of stock`)

            if (!productStock) throw new Error("Product not found")

            if (productStock.quantity < item.quantity) throw new Error("Product is out of stock")

        }

        const order = await prisma.$transaction(async (tx) => {

            const order = await tx.order.create({
                data: {
                    total_price: total_price,
                    total_quantity: total_quantity,
                    branch_id: branch.id,
                    store_id: store.id,
                    customer_id: !isWalkIn ? user?.id : null,
                    customer_name: customer_info?.name || user.first_name || null,
                    customer_phone: customer_info?.phone || null,
                    customer_email: customer_info?.email || user.email,
                    shipping_method: shipping_method,
                    is_paid: isPaid,
                    payment_date: isPaid ? new Date() : null,
                    payment_method: payment_method,
                    processed_by_user_id: isWalkIn ? processed_by_user_id : null,
                    payment: {
                        create: {
                            amount: total_price,
                            status: isPaid ? "PAID" : "PENDING",
                        }
                    },
                    items: {
                        createMany: {
                            data: [
                                ...cart.map((item) => ({
                                    product_id: Number(item.id),
                                    quantity: item.quantity,
                                    price: item.price
                                }))
                            ]
                        }
                    },
                    address_one: customer_info?.address_one || null,
                    address_two: customer_info?.address_two,
                    city: customer_info?.city,
                    state: customer_info?.state,
                    zip_code: customer_info?.zip_code,
                    country: customer_info?.country,
                    status: status || "PROCESSING",
                    order_type: isWalkIn ? "CASH_REGISTER" : "PUBLIC_STORE"
                }
            })

            if (!order) throw new Error("Order not created")

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
                            branch_id: branch.id
                        }
                    },
                    data: {
                        quantity: {
                            decrement: item.quantity
                        }
                    }
                })
            }

            const updatedStore = await tx.store.update({
                where: {
                    id: Number(store.id)
                },
                data: {
                    balance: {
                        update: {
                            current_balance: {
                                increment: total_price
                            },
                        }
                    },
                },
                include: {
                    balance: true
                }
            })

            if (!updatedStore) throw new Error("Store not updated")

            const transaction = await tx.transaction.create({
                data: {
                    amount: total_price,
                    type: "SALE",
                    balance_before: store.balance?.current_balance || 0,
                    balance_after: updatedStore.balance?.current_balance || 0,
                    description: `Order ${order.id} created`,
                    store_id: Number(store.id),
                    created_by: user.id,
                    notes: `Order ${order.id} created`,
                    reference_id: order.id,
                    reference_type: "order",
                    branch_id: branch.id
                }
            })

            if (!transaction) throw new Error("Transaction not created")

            return order
        })

        insertLogEntry({
            action: "CREATE",
            entity_type: "ORDER",
            entity_id: order.id,
            user_id: user.id,
            action_initiator: isWalkIn ? "Walk-in" : "Checkout",
            details: `Order ${order.id} created`
        })

        return {
            error: false,
            message: "Order created successfully",
            payload: order
        }
    })
}

/* 

Function flow : 

1- Get user info from session, a user should be logged in to create an order
2- Get store info from subdomain. The subdomain is required to get the store id
3- Get branch info from branch id. The branch id is required to get the branch info
4- If the order is walk in, check if the user is an employee and has the permission to create orders
5- Check if the product is active, published and has stock in the branch
6- Check if the product stock is enough to fulfill the order
7- Create the order
8- Create the payment
9- Create the items
10- Update the product stock
11- Update the store balance
12- Create a transaction for the order
13- Create a log entry for the order creation

*/