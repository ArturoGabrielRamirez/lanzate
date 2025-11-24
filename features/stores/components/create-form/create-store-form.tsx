import { yupResolver } from "@hookform/resolvers/yup"
import { Check, Loader } from "lucide-react"
import { useTranslations } from "next-intl"

import { Form } from "@/features/global/components/form/form"
import Stepper, { Step } from "@/features/shadcn/components/Stepper"
import { AddressFormPanel } from "@/features/stores/components/create-form/address-form-panel"
import { BasicInfoFormPanel } from "@/features/stores/components/create-form/basic-info-form-panel"
import { ContactFormPanel } from "@/features/stores/components/create-form/contact-form-panel"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { PaymentMethodsFormPanel } from "@/features/stores/components/create-form/payment-methods-form-panel"
import { SettingsFormPanel } from "@/features/stores/components/create-form/settings-form-panel"
import { ShippingFormPanel } from "@/features/stores/components/create-form/shipping-form-panel"
import { StepIndicator } from "@/features/stores/components/create-form/step-indicator"
import {
    addressInfoSchema,
    AddressInfoFormType,
    BasicInfoFormType,
    basicInfoSchemaNew,
    ContactInfoFormType,
    contactInfoSchema,
    SettingsFormType,
    settingsSchema,
    ShippingFormType,
    shippingSchema,
    PaymentFormType,
    paymentSchema
} from "@/features/stores/schemas"
import { CreateStoreFormProps, CreateStoreFormValues } from "@/features/stores/types"

export function CreateStoreForm({ onSubmitAll }: CreateStoreFormProps) {

    const { isStepValid, values, step, setStep } = useCreateStoreContext()
    const t = useTranslations("store.create-form")
    const isValid = !!isStepValid[step]

    const allowedMaxStep = (() => {
        let max = 1
        for (let s = 1; s <= 6; s++) {
            if (isStepValid[s]) max = s + 1; else break
        }
        return Math.min(max, 6)
    })()

    const handleFinalStepCompleted = async () => {
        await onSubmitAll(values as CreateStoreFormValues)
    }

    return (
        <Stepper
            initialStep={1}
            contentClassName="!p-0"
            stepContainerClassName="!p-0"
            stepCircleContainerClassName="!rounded-lg !max-w-full !w-full !border-none"
            footerClassName="!p-0"
            onStepChange={setStep}
            onFinalStepCompleted={handleFinalStepCompleted}
            nextButtonProps={{ disabled: !isValid }}
            renderStepIndicator={(props: { step: number; currentStep: number; onStepClick: (step: number) => void }) => {
                return (
                    <StepIndicator
                        step={props.step}
                        currentStep={props.currentStep}
                        onStepClick={props.onStepClick}
                        disabled={props.step > allowedMaxStep}
                    />
                )
            }}
        >
            <Step>
                <Form<BasicInfoFormType> contentButton="" submitButton={false} resolver={yupResolver(basicInfoSchemaNew as never)}>
                    <BasicInfoFormPanel />
                </Form>
            </Step>
            <Step>
                <Form<ContactInfoFormType> contentButton="" submitButton={false} resolver={yupResolver(contactInfoSchema as never)}>
                    <ContactFormPanel />
                </Form>
            </Step>
            <Step>
                <Form<PaymentFormType> contentButton="" submitButton={false} resolver={yupResolver(paymentSchema as never)}>
                    <PaymentMethodsFormPanel />
                </Form>
            </Step>
            
            <Step>
                <Form<AddressInfoFormType> contentButton="" submitButton={false} resolver={yupResolver(addressInfoSchema as never)}>
                    <AddressFormPanel />
                </Form>
            </Step>
            <Step>
                <Form<SettingsFormType> contentButton="" submitButton={false} resolver={yupResolver(settingsSchema as never)}>
                    <SettingsFormPanel />
                </Form>
            </Step>
            <Step>
                <Form<ShippingFormType> contentButton="" submitButton={false} resolver={yupResolver(shippingSchema as never)}>
                    <ShippingFormPanel />
                </Form>
            </Step>
            
            
            {step === 7 && (
                <Step className="!p-0 !pt-10 !pb-2">
                    <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                        <Loader className="size-12 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">{t("titles.creating")}</p>
                    </div>
                </Step>
            )}
            {step === 8 && (
                <Step className="!p-0 !pt-10 !pb-2">
                    <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                        <Check className="size-12 text-green-600" />
                        <p className="text-sm text-muted-foreground">{t("titles.created")}</p>
                    </div>
                </Step>
            )}
        </Stepper>
    )
}
