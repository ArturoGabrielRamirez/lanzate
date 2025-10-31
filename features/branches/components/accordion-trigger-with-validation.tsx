import { useFormContext } from "react-hook-form"

import { AccordionTriggerProps } from "@/features/branches/types"
import { AccordionTrigger } from "@/features/shadcn/components/ui/accordion"
import { cn } from "@/lib/utils"

function AccordionTriggerWithValidation({ keys = [], completeKeys, children }: AccordionTriggerProps) {
    const { formState: { errors }, watch } = useFormContext()

    const hasErrors = keys.some(key => (errors)[key])

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
        <AccordionTrigger className={cn(
            hasErrors && "text-red-500",
            !hasErrors && isCompleted && "text-emerald-500"
        )}>
            <span className="flex items-center gap-2">
                {children}
            </span>
        </AccordionTrigger>
    )
}
export { AccordionTriggerWithValidation }