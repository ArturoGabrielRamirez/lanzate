"use server"

export async function insertNewOrder(formData: any, cart: any[], shippingMethod: "delivery" | "pickup", subdomain: string, userId: string) {
    console.log("🚀 ~ insertNewOrder ~ formData:", formData)
    console.log("🚀 ~ insertNewOrder ~ cart:", cart)
    console.log("🚀 ~ insertNewOrder ~ shippingMethod:", shippingMethod)
    console.log("🚀 ~ insertNewOrder ~ subdomain:", subdomain)
    console.log("🚀 ~ insertNewOrder ~ userId:", userId)
}
