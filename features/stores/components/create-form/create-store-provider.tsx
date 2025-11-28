"use client"

import { createContext, useContext, useState, useCallback } from "react"

import { useStep } from "@/features/shadcn/hooks/use-step"
import { CreateStoreFormType } from "@/features/stores/schemas"
import { CreateStoreContextType } from "@/features/stores/types"

const CreateStoreContext = createContext<CreateStoreContextType | null>(null)

function useCreateStoreContext() {
    const ctx = useContext(CreateStoreContext)
    if (!ctx) throw new Error("CreateStoreContext not found")
    return ctx
}

const initialValues: CreateStoreFormType = {
    basic_info: {
        name: "",
        subdomain: "",
        description: "",
        logo: null,
    },
    address_info: {
        is_physical_store: false,
        address: "",
        city: "",
        province: "",
        country: "",
    },
    contact_info: {
        phones: [],
        emails: [],
        social_media: [],
    },
    settings: {
        is_open_24_hours: true,
        attention_dates: [],
    },
    shipping_info: {
        offers_delivery: false,
        methods: [],
    },
    payment_info: {
        payment_methods: [],
    },
}

function CreateStoreProvider({ children }: { children: React.ReactNode }) {
    const [values, setValuesState] = useState<CreateStoreFormType>(initialValues)
    
    const [isStepValid, setIsStepValid] = useState<Record<number, boolean>>({})
    const [step, { setStep }] = useStep(8)
    const [isOpen, setIsOpen] = useState(false)

    const setValues = useCallback((partial: CreateStoreFormType) => {
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
    }, [])

    const contextValue: CreateStoreContextType = {
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
        <CreateStoreContext.Provider value={contextValue}>
            {children}
        </CreateStoreContext.Provider>
    )
}

export { CreateStoreProvider, useCreateStoreContext }
