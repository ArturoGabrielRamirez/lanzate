"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { Globe, Plus, Store } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

import { Form } from "@/features/global/components/form/form"
import { InputField } from "@/features/global/components/form/input-field"
import { TextareaField } from "@/features/global/components/form/textarea-field"
import { ScrollArea } from "@/features/shadcn/components/scroll-area"
import { Button } from "@/features/shadcn/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shadcn/components/ui/dialog"
import { useStep } from "@/features/shadcn/hooks/use-step"
import { basicInfoSchema } from "@/features/stores/schemas"
import { cn } from "@/lib/utils"

function StepIndicator({ step, isCurrent }: { step: number, isCurrent: boolean }) {

    const { formState: { isValid } } = useFormContext()

    return (
        <div className={cn(
            "aspect-square rounded-full size-3 lg:size-6 flex items-center justify-center cursor-pointer",
            isCurrent && !isValid ? "bg-destructive" : "bg-muted",
            isCurrent && isValid ? "bg-primary" : ""
        )}>
            <span className="hidden lg:block text-xs">
                {step}
            </span>
        </div>
    )
}

function NextStepButton({ goToNextStep, className }: { goToNextStep: () => void, className?: string }) {

    const { formState: { isValid } } = useFormContext()

    const handleNext = () => {
        goToNextStep()
    }

    return (
        <Button onClick={handleNext} disabled={!isValid} className={className}>
            Siguiente
        </Button>
    )
}


function CreateStoreButton({ }: { userId: number }) {

    const steps = 4
    const [open, setOpen] = useState(false)
    const [currentStep, { goToNextStep, goToPrevStep }] = useStep(steps)

    return (
        <>
            <Form contentButton="" submitButton={false} resolver={yupResolver(basicInfoSchema as never)}>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="size-4" />
                            <span>Crear Tienda</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full !max-w-full md:!max-w-2xl h-full rounded-none md:h-auto md:rounded-lg max-h-dvh !grid-rows-[auto_1fr_auto]">
                        <DialogHeader>
                            <DialogTitle>Nueva Tienda</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[calc(100dvh_-_12rem)] md:max-h-96 !overflow-x-visible">
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <InputField name="name" label="Nombre de la tienda" placeholder="Ej: Mi Tienda" startIcon={<Store />} tooltip="El nombre de tu tienda" isRequired />
                                    <InputField name="subdomain" label="Subdominio" placeholder="Ej: mi-tienda" startIcon={<Globe />} tooltip="El subdominio de tu tienda" isRequired />
                                    <TextareaField name="description" label="Descripción de la tienda" placeholder="Ej: Describí tu tienda..." tooltip="La descripción de tu tienda" />
                                </div>
                            )}
                            {currentStep === 2 && (
                                <div className="space-y-4">

                                </div>
                            )}

                        </ScrollArea>
                        <DialogFooter className="!flex-col justify-end">
                            <div className="flex items-center gap-2 justify-center">
                                <StepIndicator step={1} isCurrent={currentStep === 1} />
                                <StepIndicator step={2} isCurrent={currentStep === 2} />
                                <StepIndicator step={3} isCurrent={currentStep === 3} />
                                <StepIndicator step={4} isCurrent={currentStep === 4} />
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-2 justify-end w-full md:w-auto">
                                {currentStep > 1 && (
                                    <Button onClick={goToPrevStep} variant="secondary" className="w-full md:w-auto">
                                        Anterior
                                    </Button>
                                )}
                                {currentStep < 4 && (
                                    <NextStepButton goToNextStep={goToNextStep} className="w-full md:w-auto" />
                                )}
                                {currentStep === 4 && (
                                    <Button onClick={() => setOpen(false)} className="w-full md:w-auto">
                                        Guardar Tienda
                                    </Button>
                                )}
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Form>
        </>
    )
}

export { CreateStoreButton }