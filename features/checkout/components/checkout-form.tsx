"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { Branch, PaymentMethod, StoreOperationalSettings } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { useCart } from "@/features/cart/components/cart-provider"
import { createNewCheckoutOrderAction } from "@/features/checkout/actions/create-new-checkout-order.action"
import { BranchSelector } from "@/features/checkout/components/branch-selector"
import { useCheckout } from "@/features/checkout/components/checkout-context"
import { CheckoutStepItem } from "@/features/checkout/components/checkout-step-item"
import { PaymentInformation } from "@/features/checkout/components/payment-information"
import { ShippingMethodSelector } from "@/features/checkout/components/shipping-method-selector"
import { StepNavigation } from "@/features/checkout/components/step-navigation"
import { deliveryOrderSchema, pickupOrderSchema } from "@/features/checkout/schemas/order-schema"
import { calculateDeliveryCost } from "@/features/checkout/utils"
import { Form } from "@/features/global/components/form/form"
import { InputField } from "@/features/global/components/form/input-field"
import { InteractiveStepper, InteractiveStepperContent, InteractiveStepperItem } from "@/features/shadcn/components/expansion/interactive-stepper"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Label } from "@/features/shadcn/components/ui/label"

function CheckoutForm({
    userId,
    branches,
    subdomain,
    operationalSettings
}: {
    subdomain: string
    userId: string
    branches: Branch[]
    operationalSettings: StoreOperationalSettings | null
}) {

    const { shippingMethod, setShippingMethod } = useCheckout()
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH")
    const { quantity, total, cart, clearCart } = useCart()
    const router = useRouter()
    const t = useTranslations("checkout")

    // Calculate delivery cost
    const deliveryCost = calculateDeliveryCost(
        operationalSettings?.offers_delivery || false,
        shippingMethod,
        operationalSettings?.delivery_price || 0
    )

    // Calculate final total including delivery
    const finalTotal = total + deliveryCost

    const handleSubmit = async (formData: any) => {

        const { hasError: error, message, payload } = await createNewCheckoutOrderAction({
            branch_id: selectedBranchId as number,
            customer_info: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address_one: formData.address,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                zip_code: formData.zip_code
            },
            payment_method: paymentMethod,
            shipping_method: shippingMethod,
            subdomain: subdomain,
            total_price: finalTotal,
            total_quantity: quantity,
            cart: cart,
            processed_by_user_id: Number(userId)
        })

        if (error) throw new Error(message)

        clearCart()

        router.push(`/my-orders/${payload.id}`)

        return {
            hasError: false,
            message: t("messages.order-created"),
            payload: payload
        }
    }

    return (
        <Form
            className="grow"
            contentButton={t("navigation.continue")}
            formAction={handleSubmit}
            resolver={yupResolver(shippingMethod === "DELIVERY" ? deliveryOrderSchema : pickupOrderSchema as never)}
        >
            <InteractiveStepper defaultValue={1} className="grow">
                <InteractiveStepperItem>
                    <CheckoutStepItem
                        step={1}
                        title={t("steps.personal-information.title")}
                        description={t("steps.personal-information.description")}
                        errorFields={["name", "email", "phone"]}
                    />
                </InteractiveStepperItem>
                <InteractiveStepperItem>
                    <CheckoutStepItem
                        step={2}
                        title={t("steps.delivery-information.title")}
                        description={t("steps.delivery-information.description")}
                        errorFields={["shippingMethod", "branchId", "address", "city", "state", "country"]}
                    />
                </InteractiveStepperItem>
                <InteractiveStepperItem>
                    <CheckoutStepItem
                        step={3}
                        title={t("steps.payment-information.title")}
                        description={t("steps.payment-information.description")}
                        errorFields={["paymentMethod", "cardNumber", "cardHolder", "expiryDate", "cvv"]}
                    />
                </InteractiveStepperItem>

                <InteractiveStepperContent step={1} className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("steps.personal-information.title")}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <InputField name="name" label={t("personal-info.name")} placeholder={t("personal-info.name")} />
                            <InputField name="email" label={t("personal-info.email")} placeholder={t("personal-info.email")} />
                            <InputField name="phone" label={t("personal-info.phone")} placeholder={t("personal-info.phone")} />
                            <StepNavigation />
                        </CardContent>
                    </Card>
                </InteractiveStepperContent>
                <InteractiveStepperContent step={2} className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("steps.delivery-information.title")}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-6">

                            <ShippingMethodSelector
                                value={shippingMethod}
                                onChange={setShippingMethod}
                                offersDelivery={operationalSettings?.offers_delivery || false}
                                deliveryPrice={operationalSettings?.delivery_price || 0}
                            />

                            <BranchSelector
                                branches={branches}
                                value={selectedBranchId}
                                onChange={setSelectedBranchId}
                            />

                            {shippingMethod === "DELIVERY" && (
                                <div className="space-y-4">
                                    <Label className="text-base font-medium block">{t("delivery.address.label")}</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField name="address" label={t("delivery.address.address")} placeholder={t("delivery.address.address")} />
                                        <InputField name="city" label={t("delivery.address.city")} placeholder={t("delivery.address.city")} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField name="state" label={t("delivery.address.state")} placeholder={t("delivery.address.state")} />
                                        <InputField name="country" label={t("delivery.address.country")} placeholder={t("delivery.address.country")} />
                                    </div>
                                </div>
                            )}

                            <StepNavigation />
                        </CardContent>
                    </Card>
                </InteractiveStepperContent>
                <InteractiveStepperContent step={3} className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("steps.payment-information.title")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PaymentInformation
                                paymentMethod={paymentMethod}
                                onChange={setPaymentMethod}
                                allowedPaymentMethods={operationalSettings?.payment_methods || ["CASH"]}
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

export { CheckoutForm }