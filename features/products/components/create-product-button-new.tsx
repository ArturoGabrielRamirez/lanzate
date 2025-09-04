"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Stepper, { Step } from "@/components/Stepper"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useCallback, useContext, useEffect, useMemo, useState, createContext } from "react"
import { Form } from "@/features/layout/components"
import { Check, Loader, Box, Image as ImageIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

type CreateProductFormValues = {
    basic_info?: Record<string, unknown>
    media?: Record<string, unknown>
}

type CreateProductContextType = {
    values: Partial<CreateProductFormValues>
    setValues: (partial: Partial<CreateProductFormValues>) => void
    isStepValid: Record<number, boolean>
    setStepValid: (step: number, valid: boolean) => void
}

const CreateProductContext = createContext<CreateProductContextType | null>(null)

function useCreateProductContext() {
    const ctx = useContext(CreateProductContext)
    if (!ctx) throw new Error("CreateProductContext not found")
    return ctx
}

function CreateProductProvider({ children }: { children: React.ReactNode }) {
    const [values, setValuesState] = useState<Partial<CreateProductFormValues>>({})
    const [isStepValid, setIsStepValid] = useState<Record<number, boolean>>({})

    const setValues = useCallback((partial: Partial<CreateProductFormValues>) => {
        setValuesState(prev => ({ ...prev, ...partial }))
    }, [])

    const setStepValid = useCallback((step: number, valid: boolean) => {
        setIsStepValid(prev => ({ ...prev, [step]: valid }))
    }, [])

    return (
        <CreateProductContext.Provider value={{ values, setValues, isStepValid, setStepValid }}>
            {children}
        </CreateProductContext.Provider>
    )
}

// Empty per-step schemas (steps vacíos, siempre válidos)
const emptySchema = yup.object({})
type EmptyFormType = yup.InferType<typeof emptySchema>

function BasicInfoFormPanel() {
    const { setStepValid } = useCreateProductContext()
    // react-hook-form validity is managed by <Form> via resolver; we mark step as valid from inside the form content
    useEffect(() => { setStepValid(1, true) }, [setStepValid])
    return (
        <div className="min-h-40 flex items-center justify-center text-muted-foreground border rounded-md p-8 border-dashed">
            <p>Step 1 vacío (Información básica)</p>
        </div>
    )
}

function MediaFormPanel() {
    const { setStepValid } = useCreateProductContext()
    useEffect(() => { setStepValid(2, true) }, [setStepValid])
    return (
        <div className="min-h-40 flex items-center justify-center text-muted-foreground border rounded-md p-8 border-dashed">
            <p>Step 2 vacío (Medios/Imágenes)</p>
        </div>
    )
}

type CreateProductFormProps = {
    step: number
    setStep: (s: number) => void
    onSubmitAll: (data: CreateProductFormValues) => Promise<{ error: boolean; message: string; payload?: unknown } | undefined>
}

function CreateProductForm({ step, setStep, onSubmitAll }: CreateProductFormProps) {
    const { isStepValid, values } = useCreateProductContext()

    const isValid = !!isStepValid[step]

    const allowedMaxStep = useMemo(() => {
        let max = 1
        for (let s = 1; s <= 2; s++) {
            if (isStepValid[s]) max = s + 1; else break
        }
        return Math.min(max, 2)
    }, [isStepValid])

    return (
        <Stepper
            initialStep={1}
            className="p-0"
            contentClassName="!p-0"
            stepContainerClassName="!p-0"
            stepCircleContainerClassName="!rounded-lg !max-w-full !w-full !border-none"
            footerClassName="!p-0"
            onStepChange={setStep}
            onFinalStepCompleted={async () => {
                await onSubmitAll(values as CreateProductFormValues)
            }}
            renderStepIndicator={(props) => (
                <StepIndicator
                    step={props.step}
                    currentStep={props.currentStep}
                    onStepClick={props.onStepClick}
                    disabled={props.step > allowedMaxStep}
                />
            )}
            nextButtonProps={{ disabled: !isValid }}
        >
            <Step className="!p-0 !pt-10 !pb-2">
                <Form<EmptyFormType> contentButton="" submitButton={false} resolver={yupResolver(emptySchema as never)}>
                    <BasicInfoFormPanel />
                </Form>
            </Step>
            <Step className="!p-0 !pt-10 !pb-2">
                <Form<EmptyFormType> contentButton="" submitButton={false} resolver={yupResolver(emptySchema as never)}>
                    <MediaFormPanel />
                </Form>
            </Step>
            {step === 3 && (
                <Step className="!p-0 !pt-10 !pb-2">
                    <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                        <Loader className="size-12 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Creando tu producto...</p>
                    </div>
                </Step>
            )}
            {step === 4 && (
                <Step className="!p-0 !pt-10 !pb-2">
                    <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                        <Check className="size-12 text-green-600" />
                        <p className="text-sm text-muted-foreground">Producto creado con éxito</p>
                    </div>
                </Step>
            )}
        </Stepper>
    )
}

type StepIndicatorProps = {
    step: number
    currentStep: number
    onStepClick: (s: number) => void
    disabled: boolean
}

function StepIndicator({ step, currentStep, onStepClick, disabled }: StepIndicatorProps) {
    const { isStepValid } = useCreateProductContext()

    const icons = {
        1: Box,
        2: ImageIcon,
        3: Check,
    } as const

    const isComplete = !!isStepValid[step]
    const isInvalid = step <= 2 && !isComplete

    if (step === currentStep) {
        const Icon = icons[step as keyof typeof icons]
        return (
            <div
                className={cn(
                    "aspect-square rounded-full size-8 lg:size-10 flex items-center justify-center cursor-pointer",
                    isInvalid ? "bg-destructive/20" : "bg-muted"
                )}
                onClick={() => !disabled && onStepClick(step)}
            >
                <Icon className={cn("size-4", disabled ? "opacity-50" : "")} />
            </div>
        )
    }

    return (
        <div
            className={cn(
                "aspect-square rounded-full size-8 lg:size-10 flex items-center justify-center text-xs lg:text-base cursor-pointer text-muted-foreground hover:text-primary",
                isInvalid ? "bg-destructive/20" : "bg-muted",
                disabled ? "opacity-50 pointer-events-none" : ""
            )}
            onClick={() => { if (!disabled) onStepClick(step) }}
        >
            {isComplete ? (
                <Check className="size-4" />
            ) : (
                step
            )}
        </div>
    )
}

function CreateProductButtonNew() {
    const [step, { setStep }] = useStepShim(4)
    const [open, setOpen] = useState(false)

    const descriptions = {
        1: "Agrega datos básicos; podrás editarlos luego.",
        2: "Sube imágenes o medios del producto.",
        3: "Creando tu producto…",
        4: "Listo!",
    } as const

    const titleSlugs = {
        1: "Basic",
        2: "Media",
        3: "Success",
    } as const

    const handleCreateProduct = useCallback(async () => {
        setStep(3)
        // Esqueleto: no llamamos al backend aún; mantenemos el flujo y éxito
        await new Promise((r) => setTimeout(r, 800))
        setStep(4)
        return { error: false, message: "ok" }
    }, [setStep])

    useEffect(() => {
        if (step === 4) {
            const t = setTimeout(() => {
                setOpen(false)
                setStep(1)
            }, 1200)
            return () => clearTimeout(t)
        }
    }, [step, setStep])

    return (
        <CreateProductProvider>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus />
                        <span>Create Product</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Product - {titleSlugs[step as keyof typeof titleSlugs]}</DialogTitle>
                    </DialogHeader>
                    <DialogDescription asChild>
                        <p>{descriptions[step as keyof typeof descriptions]}</p>
                    </DialogDescription>
                    <CreateProductForm step={step} setStep={setStep} onSubmitAll={handleCreateProduct} />
                </DialogContent>
            </Dialog>
        </CreateProductProvider>
    )
}

// Small shim to reuse the same signature as useStep from hooks, without importing if not needed here
function useStepShim(max: number): [number, { setStep: (s: number) => void }] {
    const [current, setCurrent] = useState(1)
    const setStep = useCallback((s: number) => {
        const next = Math.min(Math.max(1, s), max)
        setCurrent(next)
    }, [max])
    return [current, { setStep }]
}

export default CreateProductButtonNew