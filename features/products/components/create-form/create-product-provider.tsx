"use client"

import { createContext, useContext, useState, useCallback } from "react"

import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"
import { useStep } from "@/features/shadcn/hooks/use-step"

interface CreateProductContextType {
    values: CreateProductFormType
    setValues: (partial: Partial<CreateProductFormType>) => void
    isStepValid: Record<number, boolean>
    setStepValid: (step: number, valid: boolean) => void
    step: number
    setStep: (step: number) => void
    isOpen: boolean
    openDialog: () => void
    closeDialog: () => void
    resetForm: () => void
}

const CreateProductContext = createContext<CreateProductContextType | null>(null)

function useCreateProductContext() {
    const ctx = useContext(CreateProductContext)
    if (!ctx) throw new Error("CreateProductContext not found")
    return ctx
}

const initialValues: CreateProductFormType = {
    basic_info: {
        name: "",
        description: "",
        slug: "",
        sku: "",
        barcode: "",
    },
    media_info: {
        images: [],
        video_url: null,
    },
    price_stock_info: {
        price: 0,
        stock: 0,
        cost: 0,
    },
    settings_info: {
        is_active: true,
        is_featured: false,
        is_published: true,
    }
}

function CreateProductProvider({ children, initialValues: propInitialValues }: { children: React.ReactNode; initialValues?: Partial<CreateProductFormType> }) {
    const [values, setValuesState] = useState<CreateProductFormType>(() => ({
        ...initialValues,
        ...propInitialValues,
        basic_info: { ...initialValues.basic_info, ...propInitialValues?.basic_info },
        media_info: { ...initialValues.media_info, ...propInitialValues?.media_info },
        price_stock_info: { ...initialValues.price_stock_info, ...propInitialValues?.price_stock_info },
        settings_info: { ...initialValues.settings_info, ...propInitialValues?.settings_info },
    }))
    
    const [isStepValid, setIsStepValid] = useState<Record<number, boolean>>({})
    const [step, { setStep }] = useStep(6) // Steps: Basic, Media, Price/Stock, Settings, Creating, Created
    const [isOpen, setIsOpen] = useState(false)

    const setValues = useCallback((partial: Partial<CreateProductFormType>) => {
        setValuesState(prev => ({ ...prev, ...partial }))
    }, [])

    const setStepValid = useCallback((step: number, valid: boolean) => {
        setIsStepValid(prev => ({ ...prev, [step]: valid }))
    }, [])

    const openDialog = useCallback(() => { setIsOpen(true) }, [])

    const closeDialog = useCallback(() => { setIsOpen(false) }, [])

    const resetForm = useCallback(() => {
        setValuesState(initialValues)
        setIsStepValid({})
        setStep(1)
    }, [setStep])

    const contextValue: CreateProductContextType = {
        values,
        setValues,
        isStepValid,
        setStepValid,
        step,
        setStep,
        isOpen,
        openDialog,
        closeDialog,
        resetForm,
    }

    return (
        <CreateProductContext.Provider value={contextValue}>
            {children}
        </CreateProductContext.Provider>
    )
}

export { CreateProductProvider, useCreateProductContext }

