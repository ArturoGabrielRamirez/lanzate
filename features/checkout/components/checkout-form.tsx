"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, InputField } from "@/features/layout/components"
import { cn } from "@/lib/utils"
import { MapPin, Truck, CreditCard, Banknote, Smartphone, ArrowLeft, ArrowRight } from "lucide-react"
import { useState } from "react"
/* import { createNewOrder } from "../actions/createNewOrder" */
/* import { useCart } from "@/features/cart/components/cart-provider" */
import { Button } from "@/components/ui/button"
import { deliveryOrderSchema, pickupOrderSchema } from "../schemas/order-schema"
import { yupResolver } from "@hookform/resolvers/yup"
import { createNewCheckoutOrder } from "../actions/createNewCheckoutOrder"
import { Branch } from "@prisma/client"
import { InteractiveStepper, InteractiveStepperContent, InteractiveStepperDescription, InteractiveStepperIndicator, InteractiveStepperItem, InteractiveStepperSeparator, InteractiveStepperTitle, InteractiveStepperTrigger, useStepper } from "@/components/expansion/interactive-stepper"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useFormContext } from "react-hook-form"
/* import { createNewCheckoutOrder } from "../actions/createNewCheckoutOrder" */

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
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(
        branches.length === 1 ? branches[0].id : null
    )
    const [paymentMethod, setPaymentMethod] = useState<string>("")
    /* const { cart, clearCart } = useCart() */

    const handleShippingMethodChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.target as HTMLButtonElement
        const type = target.dataset.type
        if (type) {
            setShippingMethod(type as "delivery" | "pickup")
        }
    }

    const handleBranchChange = (value: string) => {
        setSelectedBranchId(Number(value))
    }

    const handlePaymentMethodChange = (value: string) => {
        setPaymentMethod(value)
    }

    const handleSubmit = async (formData: any) => {
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
                    <InteractiveStepperTrigger>
                        <InteractiveStepperIndicator />
                        <div>
                            <InteractiveStepperTitle>Personal Information</InteractiveStepperTitle>
                            <InteractiveStepperDescription>Provide your personal information</InteractiveStepperDescription>
                        </div>
                    </InteractiveStepperTrigger>
                    <InteractiveStepperSeparator />
                </InteractiveStepperItem>
                <InteractiveStepperItem>
                    <InteractiveStepperTrigger>
                        <InteractiveStepperIndicator />
                        <div>
                            <InteractiveStepperTitle>Delivery Information</InteractiveStepperTitle>
                            <InteractiveStepperDescription>Choose how your order gets to you</InteractiveStepperDescription>
                        </div>
                    </InteractiveStepperTrigger>
                    <InteractiveStepperSeparator />
                </InteractiveStepperItem>
                <InteractiveStepperItem>
                    <InteractiveStepperTrigger>
                        <InteractiveStepperIndicator />
                        <div>
                            <InteractiveStepperTitle>Payment Information</InteractiveStepperTitle>
                            <InteractiveStepperDescription>Choose how you want to pay</InteractiveStepperDescription>
                        </div>
                    </InteractiveStepperTrigger>
                    <InteractiveStepperSeparator />
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
                            <div>
                                <Label className="text-base font-medium mb-4 block">Choose your delivery method</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleShippingMethodChange}
                                        data-type="delivery"
                                        className={cn(
                                            "h-auto p-4 flex flex-col items-center gap-2 transition-all duration-300",
                                            shippingMethod === "delivery"
                                                ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                                                : "hover:bg-muted"
                                        )}
                                    >
                                        <Truck className="size-8" />
                                        <div className="text-center">
                                            <div className="font-semibold">Delivery</div>
                                            <div className="text-sm opacity-80">
                                                Orders take 30 min to 2 hours
                                            </div>
                                        </div>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleShippingMethodChange}
                                        data-type="pickup"
                                        className={cn(
                                            "h-auto p-4 flex flex-col items-center gap-2 transition-all duration-300",
                                            shippingMethod === "pickup"
                                                ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                                                : "hover:bg-muted"
                                        )}
                                    >
                                        <MapPin className="size-8" />
                                        <div className="text-center">
                                            <div className="font-semibold">Pickup</div>
                                            <div className="text-sm opacity-80">
                                                Orders take 5-10 minutes
                                            </div>
                                        </div>
                                    </Button>
                                </div>
                                <input type="hidden" name="shippingMethod" value={shippingMethod} />
                            </div>

                            {/* Branch Selection */}
                            <div>
                                <Label htmlFor="branchId" className="text-base font-medium mb-2 block">
                                    Select Branch
                                </Label>
                                <Select
                                    value={selectedBranchId?.toString() || ""}
                                    onValueChange={handleBranchChange}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches.map((branch) => (
                                            <SelectItem key={branch.id} value={branch.id.toString()}>
                                                {branch.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <input type="hidden" name="branchId" value={selectedBranchId || ""} />
                            </div>

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
                        <CardContent className="flex flex-col gap-6">
                            {/* Payment Method Selection */}
                            <div>
                                <Label htmlFor="paymentMethod" className="text-base font-medium mb-2 block">
                                    Select Payment Method
                                </Label>
                                <Select
                                    value={paymentMethod}
                                    onValueChange={handlePaymentMethodChange}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="credit-debit">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="size-4" />
                                                Credit/Debit Card
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="transfer">
                                            <div className="flex items-center gap-2">
                                                <Banknote className="size-4" />
                                                Bank Transfer
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="mercadopago">
                                            <div className="flex items-center gap-2">
                                                <Smartphone className="size-4" />
                                                Mercado Pago
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <input type="hidden" name="paymentMethod" value={paymentMethod} />
                            </div>

                            {/* Conditional Payment Fields */}
                            {paymentMethod === "credit-debit" && (
                                <div className="space-y-4">
                                    <Label className="text-base font-medium block">Card Information</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField name="cardNumber" label="Card Number" placeholder="1234 5678 9012 3456" />
                                        <InputField name="cardHolder" label="Cardholder Name" placeholder="John Doe" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField name="expiryDate" label="Expiry Date" placeholder="MM/YY" />
                                        <InputField name="cvv" label="CVV" placeholder="123" />
                                    </div>
                                </div>
                            )}

                            {paymentMethod === "transfer" && (
                                <Card className="border-blue-200 bg-blue-50">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-3">
                                            <Banknote className="h-5 w-5 text-blue-600 mt-0.5" />
                                            <div className="space-y-2">
                                                <p className="font-medium text-blue-900">Bank Transfer Details:</p>
                                                <p className="text-sm text-accent"><strong>CVU:</strong> 0000003100061234567890</p>
                                                <p className="text-sm text-accent"><strong>Alias:</strong> MI.TIENDA.ONLINE</p>
                                                <p className="text-sm text-blue-700 mt-2">
                                                    Please include your order number in the transfer description.
                                                    Your order will be confirmed once the payment is received.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {paymentMethod === "mercadopago" && (
                                <Card className="border-orange-200 bg-orange-50">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-3">
                                            <Smartphone className="h-5 w-5 text-orange-600 mt-0.5" />
                                            <div className="space-y-2">
                                                <p className="font-medium text-orange-900">Mercado Pago Payment</p>
                                                <p className="text-sm text-orange-700 max-w-xl">
                                                    When you click "Confirm Order", you will be redirected to Mercado Pago
                                                    to complete your payment securely. After payment, you will be brought
                                                    back to our site with your order confirmation.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

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