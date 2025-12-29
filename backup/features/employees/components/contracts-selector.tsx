"use client"

import { Eye, Download, Check, Loader } from "lucide-react"
import { useState, useEffect } from "react"

import { Contract, ContractsSelectorProps } from "@/features/employees/types/types"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Button } from "@/features/shadcn/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"

function ContractsSelector({ storeId, selectedContractId, onContractSelect, employeeId }: ContractsSelectorProps) {
    const [contracts, setContracts] = useState<Contract[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadContracts = async () => {
            setLoading(true)
            setError(null)

            try {
                const result = {
                    message: "Contratos obtenidos con éxito",
                    payload: contracts,
                    hasError: false
                }

                if (result.hasError) {
                    setError(result.message || "Error al cargar contratos")
                    return
                }

                if (result.payload) {
                    setContracts(result.payload as Contract[])
                }
            } catch (err) {
                console.error("Error loading contracts:", err)
                setError("Error al cargar contratos")
            } finally {
                setLoading(false)
            }
        }

        loadContracts()
    }, [storeId, contracts])

    if (loading) {
        return (
            <div className="text-center py-4">
                <Loader className="w-6 h-6 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Cargando contratos...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                {error}
            </div>
        )
    }

    // Filtrar contratos: solo PENDING y no asignados al empleado específico
    const availableContracts = contracts.filter(contract => {
        // Solo contratos pendientes
        if (contract.status !== 'PENDING') return false

        // Si no hay employeeId, mostrar todos los contratos pendientes
        if (!employeeId) return true

        // Filtrar contratos que ya están asignados a este empleado
        const isAlreadyAssigned = contract.assignments?.some(
            assignment => assignment.employee_id === employeeId
        )

        return !isAlreadyAssigned
    })

    if (availableContracts.length === 0) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                No hay contratos pendientes disponibles
            </div>
        )
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'secondary'
            case 'APPROVED':
                return 'default'
            case 'REJECTED':
                return 'destructive'
            case 'COMPLETED':
                return 'default'
            case 'EXPIRED':
                return 'outline'
            default:
                return 'secondary'
        }
    }

    const formatDate = (dateString: Date) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="space-y-3">
            <h4 className="text-sm font-medium">Contratos Pendientes Disponibles</h4>
            {availableContracts.map((contract) => (
                <Card
                    key={contract.id}
                    className={`p-3 cursor-pointer transition-colors ${selectedContractId === contract.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-gray-50'
                        }`}
                    onClick={() => onContractSelect(selectedContractId === contract.id ? null : contract)}
                >
                    <CardHeader className="p-0 pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2">
                                {contract.title}
                                {selectedContractId === contract.id && (
                                    <Check className="w-4 h-4 text-primary" />
                                )}
                            </CardTitle>
                            <Badge variant={getStatusBadgeVariant(contract.status)} className="text-xs">
                                {contract.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                                Creado: {formatDate(contract.created_at)}
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        window.open(contract.file_url, '_blank')
                                    }}
                                >
                                    <Eye className="w-3 h-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        const link = document.createElement('a')
                                        link.href = contract.file_url
                                        link.download = contract.title
                                        link.click()
                                    }}
                                >
                                    <Download className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                        {contract.comments && (
                            <div className="mt-2 text-xs text-muted-foreground">
                                <strong>Comentarios:</strong> {contract.comments}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export { ContractsSelector }