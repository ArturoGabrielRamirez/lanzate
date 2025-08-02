"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, InputField } from "@/features/layout/components"
import { cn } from "@/lib/utils"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useState } from "react"
/* import { createNewOrder } from "../actions/createNewOrder" */
/* import { useCart } from "@/features/cart/components/cart-provider" */
import { Button } from "@/components/ui/button"
import { deliveryOrderSchema, pickupOrderSchema } from "../schemas/order-schema"
import { yupResolver } from "@hookform/resolvers/yup"
import { createNewCheckoutOrder } from "../actions/createNewCheckoutOrder"
import { Branch } from "@prisma/client"
import { InteractiveStepper, InteractiveStepperContent, InteractiveStepperDescription, InteractiveStepperIndicator, InteractiveStepperItem, InteractiveStepperSeparator, InteractiveStepperTitle, InteractiveStepperTrigger, useStepper } from "@/components/expansion/interactive-stepper"
import { useFormContext } from "react-hook-form"
import { ShippingMethodSelector } from "./shipping-method-selector"
import { BranchSelector } from "./branch-selector"
import { PaymentInformation } from "./payment-information"
import { CheckoutStepItem } from "./checkout-step-item"
/* import { createNewCheckoutOrder } from "../actions/createNewCheckoutOrder" */
import { Label } from "@/components/ui/label"

function StepNavigation() {
    const { currentStep, nextStep, prevStep, hasNext, hasPrev } = useStepper()

    return (
        <div className="flex justify-between pt-4">
            {currentStep > 1 && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                >
                    <ArrowLeft />
                    Previous
                </Button>
            )}
            {hasNext() && (
                <Button
                    type="button"
                    onClick={nextStep}
                    className={currentStep === 1 ? "ml-auto" : ""}
                >
                    Next
                    <ArrowRight />
                </Button>
            )}
        </div>
    )
}

function CheckoutForm({ /* subdomain, userId  */ branches }: { subdomain: string, userId: string, branches: Branch[] }) {

    /* const { formState: { errors } } = useFormContext()
    console.log("🚀 ~ CheckoutForm ~ errors:", errors) */
    const [shippingMethod, setShippingMethod] = useState<"delivery" | "pickup">("delivery")
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<string>("")
    /* const { cart, clearCart } = useCart() */

    const handleSubmit = async (formData: any) => {
        console.log("🚀 ~ handleSubmit ~ formData:", formData)
        /* createNewCheckoutOrder({
            branch_id : 1,
        }) */
        //const { error, message, payload } = await createNewOrder(formData, cart, shippingMethod, subdomain, userId)
        /* const {} = createNewCheckoutOrder({

        })
        if (error) throw new Error(message)
        clearCart()
        return {
            error: false,
            message: "Order created successfully",
            payload: payload
        } */
        return {
            error: false,
            message: "Order created successfully",
            payload: null
        }
    }

    return (
        <Form
            className="grow"
            contentButton="Continue"
            formAction={handleSubmit}
            resolver={yupResolver(shippingMethod === "delivery" ? deliveryOrderSchema : pickupOrderSchema)}
        >
            <InteractiveStepper defaultValue={1} className="grow">
                <InteractiveStepperItem>
                    <CheckoutStepItem
                        step={1}
                        title="Personal Information"
                        description="Provide your personal information"
                        errorFields={["name", "email", "phone"]}
                    />
                </InteractiveStepperItem>
                <InteractiveStepperItem>
                    <CheckoutStepItem
                        step={2}
                        title="Delivery Information"
                        description="Choose how your order gets to you"
                        errorFields={["shippingMethod", "branchId", "address", "city", "state", "country"]}
                    />
                </InteractiveStepperItem>
                <InteractiveStepperItem>
                    <CheckoutStepItem
                        step={3}
                        title="Payment Information"
                        description="Choose how you want to pay"
                        errorFields={["paymentMethod", "cardNumber", "cardHolder", "expiryDate", "cvv"]}
                    />
                </InteractiveStepperItem>

                <InteractiveStepperContent step={1}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <InputField name="name" label="Name" />
                            <InputField name="email" label="Email" />
                            <InputField name="phone" label="Phone" />
                            <StepNavigation />
                        </CardContent>
                    </Card>
                </InteractiveStepperContent>
                <InteractiveStepperContent step={2}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Information</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-6">
                            {/* Shipping Method Selection */}
                            <ShippingMethodSelector
                                value={shippingMethod}
                                onChange={setShippingMethod}
                            />

                            {/* Branch Selection */}
                            <BranchSelector
                                branches={branches}
                                value={selectedBranchId}
                                onChange={setSelectedBranchId}
                            />

                            {/* Address Fields (only for delivery) */}
                            {shippingMethod === "delivery" && (
                                <div className="space-y-4">
                                    <Label className="text-base font-medium block">Delivery Address</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField name="address" label="Address" />
                                        <InputField name="city" label="City" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField name="state" label="State" />
                                        <InputField name="country" label="Country" />
                                    </div>
                                </div>
                            )}

                            <StepNavigation />
                        </CardContent>
                    </Card>
                </InteractiveStepperContent>
                <InteractiveStepperContent step={3}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PaymentInformation
                                paymentMethod={paymentMethod}
                                onChange={setPaymentMethod}
                            />
                            <div className="flex justify-between pt-4">
                                <StepNavigation />
                            </div>
                        </CardContent>
                    </Card>
                </InteractiveStepperContent>
            </InteractiveStepper>
        </Form>
    )
}

export default CheckoutForm