"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, InputField } from "@/features/layout/components"
import { cn } from "@/lib/utils"
import { MapPin, Truck } from "lucide-react"
import { useState } from "react"
import { createNewOrder } from "../actions/createNewOrder"
import { useCart } from "@/features/cart/components/cart-provider"
import { Button } from "@/components/ui/button"
type Props = {
}

function CheckoutForm({ }: Props) {

    const [shippingMethod, setShippingMethod] = useState<"delivery" | "pickup">("delivery")
    const { cart } = useCart()

    const handleShippingMethodChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.target as HTMLButtonElement
        const type = target.dataset.type
        if (type) {
            setShippingMethod(type as "delivery" | "pickup")
        }
    }

    const handleSubmit = async (formData: any) => {
        return await createNewOrder(formData, cart, shippingMethod)
    }

    return (
        <Form
            className="flex-1"
            contentButton="Continue"
            formAction={handleSubmit}
        >
            <h3 className="text-xl font-bold">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
                <InputField name="name" label="Name" />
                <InputField name="email" label="Email" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <InputField name="phone" label="Phone" />
            </div>
            <div className="w-full h-px bg-muted-foreground/20"></div>
            <h3 className="text-xl font-bold">Shipping Information</h3>
            <div className="flex gap-4">
                <Button onClick={handleShippingMethodChange} asChild data-type="delivery">
                    <Card className={cn("grow cursor-pointer py-6 bg-muted-foreground/10 transition-all duration-300 h-fit", shippingMethod === "delivery" && "bg-primary")}>
                        <CardHeader>
                            <CardTitle>Delivery</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-2 justify-between">
                            <p>Delivery to your address takes 2-3 business days</p>
                            <Truck className="w-10 h-10" />
                        </CardContent>
                    </Card>
                </Button>
                <Button onClick={handleShippingMethodChange} asChild data-type="pickup">
                    <Card  className={cn("grow cursor-pointer py-6 bg-muted-foreground/10 transition-all duration-300 h-fit", shippingMethod === "pickup" && "bg-primary")}>
                        <CardHeader>
                            <CardTitle>Pickup</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-2 justify-between">
                            <p>Pickup from our store takes 2-3 business days</p>
                            <MapPin className="w-10 h-10" />
                        </CardContent>
                    </Card>
                </Button>
            </div>
            <div className="w-full h-px bg-muted-foreground/20"></div>
            <h3 className="text-xl font-bold">Address Information</h3>
            <div className="grid grid-cols-2 gap-4">
                <InputField name="address" label="Address" />
                <InputField name="city" label="City" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <InputField name="state" label="State" />
                <InputField name="country" label="Country" />
            </div>
        </Form>
    )
}
export default CheckoutForm