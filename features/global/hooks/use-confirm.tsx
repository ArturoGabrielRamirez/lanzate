'use client'

import { useState, useCallback } from 'react'

export function useConfirm() {
    const [isOpen, setIsOpen] = useState(false)
    const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null)

    const confirm = useCallback(() => {
        return new Promise<boolean>((resolve) => {
            setIsOpen(true)
            setResolver(() => resolve)
        })
    }, [])

    const handleConfirm = useCallback(() => {
        resolver?.(true)
        setIsOpen(false)
        setResolver(null)
    }, [resolver])

    const handleCancel = useCallback(() => {
        resolver?.(false)
        setIsOpen(false)
        setResolver(null)
    }, [resolver])

    return {
        isOpen,
        confirm,
        handleConfirm,
        handleCancel
    }
}