"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useFormContext } from "react-hook-form"

type Props = {
    keys: string[]
    completeKeys?: string[]
    children: React.ReactNode
    className?: string
}

const ValidatedCard = ({ keys = [], completeKeys, children, className }: Props) => {
    const { formState: { errors }, watch } = useFormContext()

    const hasErrors = keys.some(key => (errors as any)[key])

    const keysToCheck = completeKeys && completeKeys.length > 0 ? completeKeys : keys
    const values = keysToCheck.map((k) => watch(k))

    function isFilled(v: unknown): boolean {
        if (v === undefined || v === null) return false
        if (typeof v === 'string') return v.trim().length > 0
        if (typeof v === 'number') return true
        if (typeof v === 'boolean') return v === true
        if (Array.isArray(v)) return v.length > 0
        if (typeof v === 'object') return Object.keys(v as Record<string, unknown>).length > 0
        return false
    }

    const isCompleted = values.some(isFilled)

    return (
        <Card className={cn(
            "transition-colors duration-200",
            hasErrors && "border-red-500",
            !hasErrors && isCompleted && "border-emerald-500",
            className
        )}>
            {children}
        </Card>
    )
}

export default ValidatedCard
