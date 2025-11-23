"use client"

import { createContext, useContext, useState, useCallback } from "react"

import { useStep } from "@/features/shadcn/hooks/use-step"
import { CreateStoreFormValues, CreateStoreContextType } from "@/features/stores/types"

const CreateStoreContext = createContext<CreateStoreContextType | null>(null)

function useCreateStoreContext() {
    const ctx = useContext(CreateStoreContext)
    if (!ctx) throw new Error("CreateStoreContext not found")
    return ctx
}

function CreateStoreProvider({ children }: { children: React.ReactNode }) {
    const [values, setValuesState] = useState<Partial<CreateStoreFormValues>>({
        basic_info: {
            name: "",
            subdomain: "",
        },
        address_info: {
            is_physical_store: false,
            address: "",
            city: "",
            province: "",
            country: "",
        },
        contact_info: {
            contact_phone: "",
            contact_email: "",
            phones: [],
            emails: [],
            social_media: [],
        },
    })
    const [isStepValid, setIsStepValid] = useState<Record<number, boolean>>({})
    const [step, { setStep }] = useStep(7)
    const [isOpen, setIsOpen] = useState(false)

    const setValues = useCallback((partial: Partial<CreateStoreFormValues>) => {
        setValuesState(prev => ({ ...prev, ...partial }))
    }, [])

    const setStepValid = useCallback((step: number, valid: boolean) => {
        setIsStepValid(prev => ({ ...prev, [step]: valid }))
    }, [])

    const openDialog = useCallback(() => { setIsOpen(true) }, [])

    const closeDialog = useCallback(() => { setIsOpen(false) }, [])

    const resetForm = useCallback(() => {
        setValuesState({})
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
