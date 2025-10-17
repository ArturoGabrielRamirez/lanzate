"use client"

import { Check, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ContractResponseButtonsProps } from "@/features/dashboard/types"
import { respondToContract } from "@/features/employees/data"

function ContractResponseButtons({ assignmentId, onResponse }: ContractResponseButtonsProps) {
    const [isResponding, setIsResponding] = useState(false)

    const handleResponse = async (status: 'APPROVED' | 'REJECTED') => {
        setIsResponding(true)

        try {
            const result = await respondToContract(assignmentId, status)

            if (result.error) {
                toast.error(result.message || "Error al responder al contrato")
            } else {
                toast.success(result.message)
                onResponse?.()
            }
        } catch (error) {
            console.error("Error responding to contract:", error)
            toast.error("Error al responder al contrato")
        } finally {
            setIsResponding(false)
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <Button
                size="sm"
                onClick={() => handleResponse('APPROVED')}
                disabled={isResponding}
            >
                <Check className="w-3 h-3 mr-1" />
                Aceptar
            </Button>
            <Button
                variant="destructive"
                size="sm"
                onClick={() => handleResponse('REJECTED')}
                disabled={isResponding}
            >
                <X className="w-3 h-3 mr-1" />
                Rechazar
            </Button>
        </div>
    )
}

export { ContractResponseButtons }