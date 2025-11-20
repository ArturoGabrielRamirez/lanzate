"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { Globe, Plus, Store, StoreIcon, Truck } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

import { Form } from "@/features/global/components/form/form"
import { InputField } from "@/features/global/components/form/input-field"
import { TextareaField } from "@/features/global/components/form/textarea-field"
import { ScrollArea } from "@/features/shadcn/components/scroll-area"
import { Button } from "@/features/shadcn/components/ui/button"
import { ChoiceBox, ChoiceBoxItem, ChoiceBoxLabel, ChoiceBoxDescription } from "@/features/shadcn/components/ui/choice-box"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shadcn/components/ui/dialog"
import { useStep } from "@/features/shadcn/hooks/use-step"
import { basicInfoSchema } from "@/features/stores/schemas"
import { cn } from "@/lib/utils"

function BasicInfoStep() {
    return (
        <div className="space-y-4">
            <InputField name="name" label="Name" placeholder="Ej: My Store" startIcon={<Store />} tooltip="The name of your store" isRequired />
            <InputField name="subdomain" label="Subdomain" placeholder="Ej: my-store" startIcon={<Globe />} tooltip="The subdomain of your store" isRequired />
            <TextareaField name="description" label="Description" placeholder="Ej: My Store Description" tooltip="The description of your store" />
        </div>
    )
}

function AddressStep() {
    return (
        <div className="space-y-4">
            <ChoiceBox aria-label="Select items" gap={2} columns={2}>
                <ChoiceBoxItem textValue="premium">
                    <Truck className="place-self-center"/>
                    <div className="flex flex-col gap-1">
                        <ChoiceBoxLabel>Delivery</ChoiceBoxLabel>
                        <ChoiceBoxDescription>
                            Enable delivery for your store.
                        </ChoiceBoxDescription>
                    </div>
                </ChoiceBoxItem>
                <ChoiceBoxItem textValue="deluxe">
                    <StoreIcon className="place-self-center"/>
                    <div className="flex flex-col gap-1">
                        <ChoiceBoxLabel>Pickup</ChoiceBoxLabel>
                        <ChoiceBoxDescription>
                            Enable pickup for your store.
                        </ChoiceBoxDescription>
                    </div>
                </ChoiceBoxItem>
            </ChoiceBox>
        </div>
    )
}

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
            Next
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
                            <span>Create Store</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full !max-w-full md:!max-w-2xl h-full rounded-none md:h-auto md:rounded-lg max-h-dvh !grid-rows-[auto_1fr_auto]">
                        <DialogHeader>
                            <DialogTitle>New Store</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[calc(100dvh_-_12rem)] md:max-h-96 !overflow-x-visible">
                            {currentStep === 1 && (
                                <BasicInfoStep />
                            )}
                            {currentStep === 2 && (
                                <AddressStep />
                            )}

                        </ScrollArea>
                        <DialogFooter className="!flex-col justify-end">
                            <div className="flex items-center gap-2 justify-center md:hidden">
                                <StepIndicator step={1} isCurrent={currentStep === 1} />
                                <StepIndicator step={2} isCurrent={currentStep === 2} />
                                <StepIndicator step={3} isCurrent={currentStep === 3} />
                                <StepIndicator step={4} isCurrent={currentStep === 4} />
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-2 justify-between w-full md:w-auto">
                                <Button onClick={goToPrevStep} variant="secondary" className="w-full md:w-auto" disabled={currentStep === 1}>
                                    Previous
                                </Button>
                                <div className="hidden md:flex items-center gap-2 justify-center">
                                    <StepIndicator step={1} isCurrent={currentStep === 1} />
                                    <StepIndicator step={2} isCurrent={currentStep === 2} />
                                    <StepIndicator step={3} isCurrent={currentStep === 3} />
                                    <StepIndicator step={4} isCurrent={currentStep === 4} />
                                </div>
                                {currentStep < 4 && (
                                    <NextStepButton goToNextStep={goToNextStep} className="w-full md:w-auto" />
                                )}
                                {currentStep === 4 && (
                                    <Button onClick={() => setOpen(false)} className="w-full md:w-auto">
                                        Save Store
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