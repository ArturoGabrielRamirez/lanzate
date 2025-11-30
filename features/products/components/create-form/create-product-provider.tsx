"use client"

import { createContext, useContext, useState, useCallback } from "react"

import { CreateProductFormType, ProductStatus, ProductType, WeightUnit, LengthUnit } from "@/features/products/schemas/create-product-form-schema"
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
        type: ProductType.PHYSICAL,
        slug: "",
        description: "",
        brand: "",
        tags: [],
        category_ids: [],
    },
    media_info: {
        images: [],
        video_url: null,
    },
    options_variants_info: {
        has_variants: false,
        options: [],
        variants: [],
    },
    price_stock_info: {
        sku: "",
        barcode: "",
        price: 0,
        promotional_price: null,
        cost: 0,
        stock: 0,
        stock_unlimited: false,
        track_stock: true,
    },
    shipping_info: {
        free_shipping: false,
        weight: 0,
        weight_unit: WeightUnit.KG,
        dimensions: {
            width: 0,
            height: 0,
            depth: 0,
            unit: LengthUnit.CM,
        }
    },
    settings_info: {
        status: ProductStatus.ACTIVE,
        is_featured: false,
        is_new: false,
        is_on_sale: false,
        allow_promotions: true,
        seo_title: "",
        seo_description: "",
    }
}

function CreateProductProvider({ children, initialValues: propInitialValues }: { children: React.ReactNode; initialValues?: Partial<CreateProductFormType> }) {
    const [values, setValuesState] = useState<CreateProductFormType>(() => ({
        ...initialValues,
        ...propInitialValues,
        basic_info: { ...initialValues.basic_info, ...propInitialValues?.basic_info },
        media_info: { ...initialValues.media_info, ...propInitialValues?.media_info },
        options_variants_info: { ...initialValues.options_variants_info, ...propInitialValues?.options_variants_info },
        price_stock_info: { ...initialValues.price_stock_info, ...propInitialValues?.price_stock_info },
        shipping_info: { ...initialValues.shipping_info, ...propInitialValues?.shipping_info },
        settings_info: { ...initialValues.settings_info, ...propInitialValues?.settings_info },
    }))
    
    const [isStepValid, setIsStepValid] = useState<Record<number, boolean>>({})
    // Steps: Basic, Media, Options/Variants, Price/Stock, Shipping, Settings, Review/Confirm (7 steps now?)
    // Let's assume 6 steps for now based on logical grouping in the wizard design
    // 1. Basic
    // 2. Media
    // 3. Options & Variants
    // 4. Price & Stock
    // 5. Shipping
    // 6. Settings
    const [step, { setStep }] = useStep(6) 
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
