"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { Check, Loader } from "lucide-react"
import { useTranslations } from "next-intl"

import { Form } from "@/features/global/components/form/form"
import { ServerResponse } from "@/features/global/types"
import { BasicInfoProductPanel } from "@/features/products/components/create-form/basic-info-product-panel"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { MediaProductPanel } from "@/features/products/components/create-form/media-product-panel"
import { OptionsVariantsProductPanel } from "@/features/products/components/create-form/options-variants-product-panel"
// import { PriceStockProductPanel } from "@/features/products/components/create-form/price-stock-product-panel"
// import { SettingsProductPanel } from "@/features/products/components/create-form/settings-product-panel"
import { StepIndicator } from "@/features/products/components/create-form/step-indicator"
import {
    CreateProductFormType,
    productBasicInfoSchema,
    ProductBasicInfoFormType,
    productMediaSchema,
    ProductMediaFormType,
    productOptionsVariantsSchema,
    ProductOptionsVariantsFormType,
    /* productPriceStockSchema,
    ProductPriceStockFormType,
    productSettingsSchema,
    ProductSettingsFormType */
} from "@/features/products/schemas/create-product-form-schema"
import Stepper, { Step } from "@/features/shadcn/components/Stepper"

interface CreateProductFormProps {
    onSubmitAll: (data: CreateProductFormType) => Promise<ServerResponse<unknown>>
    onExitFlow?: () => void
}

export function CreateProductForm({ onSubmitAll, onExitFlow }: CreateProductFormProps) {

    const { isStepValid, values, step, setStep } = useCreateProductContext()
    const t = useTranslations("store.create-product")
    const isValid = !!isStepValid[step]

    const allowedMaxStep = (() => {
        let max = 1
        for (let s = 1; s <= 2; s++) { // Check steps 1, 2 (Step 3 is final now)
            if (isStepValid[s]) max = s + 1; else break
        }
        return Math.min(max, 3)
    })()

    const handleFinalStepCompleted = async () => {
        await onSubmitAll(values)
    }

    return (
        <Stepper
            initialStep={1}
            contentClassName="!p-0"
            stepContainerClassName="!p-0"
            stepCircleContainerClassName="!rounded-lg !max-w-full !w-full !border-none"
            footerClassName="!p-0"
            disableStepConnectors={true}
            onStepChange={setStep}
            onFinalStepCompleted={handleFinalStepCompleted}
            onExitFlow={onExitFlow}
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
                <Form<ProductBasicInfoFormType> contentButton="" submitButton={false} resolver={yupResolver(productBasicInfoSchema as never)}>
                    <BasicInfoProductPanel />
                </Form>
            </Step>
            <Step>
                <Form<ProductMediaFormType> contentButton="" submitButton={false} resolver={yupResolver(productMediaSchema as never)}>
                    <MediaProductPanel />
                </Form>
            </Step>

            <Step>
                <Form<ProductOptionsVariantsFormType> contentButton="" submitButton={false} resolver={yupResolver(productOptionsVariantsSchema as never)}>
                    <OptionsVariantsProductPanel />
                </Form>
            </Step>

            {/* 
            <Step>
                <Form<ProductPriceStockFormType> contentButton="" submitButton={false} resolver={yupResolver(productPriceStockSchema as never)}>
                    <PriceStockProductPanel />
                </Form>
            </Step>
            
            <Step>
                <Form<ProductSettingsFormType> contentButton="" submitButton={false} resolver={yupResolver(productSettingsSchema as never)}>
                    <SettingsProductPanel />
                </Form>
            </Step>
            */}
            
            {step === 4 && (
                <Step className="!p-0 !pt-10 !pb-2">
                    <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                        <Loader className="size-12 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">{t("titles.creating")}</p>
                    </div>
                </Step>
            )}
            {step === 5 && ( // Assuming success is next step or handled by dialog close
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

