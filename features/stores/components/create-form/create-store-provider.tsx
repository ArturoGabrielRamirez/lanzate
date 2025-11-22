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
    const [values, setValuesState] = useState<Partial<CreateStoreFormValues>>({})
    const [isStepValid, setIsStepValid] = useState<Record<number, boolean>>({})
    const [step, { setStep }] = useStep(7)
    const [isOpen, setIsOpen] = useState(false)

    const setValues = useCallback((partial: Partial<CreateStoreFormValues>) => {
        setValuesState(prev => ({ ...prev, ...partial }))
    }, [])

    const setStepValid = useCallback((step: number, valid: boolean) => {
        setIsStepValid(prev => ({ ...prev, [step]: valid }))
    }, [])

    const openDialog = useCallback(() => {
        setIsOpen(true)
    }, [])

    const closeDialog = useCallback(() => {
        setIsOpen(false)
        // Reset to step 1 when closing
        setStep(1)
        // Reset form values
        setValuesState({})
        setIsStepValid({})
    }, [setStep])

    return (
        <CreateStoreContext.Provider value={{ values, setValues, isStepValid, setStepValid, step, setStep, isOpen, openDialog, closeDialog }}>
            {children}
        </CreateStoreContext.Provider>
    )
}

export { CreateStoreProvider, useCreateStoreContext }
