"use client"

import { Button } from "@/components/ui/button"
import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { Plus, Search, Check, UserCheck } from "lucide-react"
import { useState } from "react"
import { getEmployeesByFilter } from "../actions/getEmployeesByFilter"
import { createEmployee } from "../actions/createEmployee"
import { ResponseType } from "@/features/layout/types"
import { CreateEmployeeButtonProps, UserWithEmployeeStatus } from "../types"

export default function CreateEmployeeButton({ storeId, userId }: CreateEmployeeButtonProps) {

    const [search, setSearch] = useState('')
    const [users, setUsers] = useState<UserWithEmployeeStatus[]>([])
    const [selectedUser, setSelectedUser] = useState<UserWithEmployeeStatus | null>(null)

    const handleAddEmployee = async (): Promise<ResponseType<any>> => {
        if (!selectedUser) {
            return {
                error: true,
                message: "Debes seleccionar un usuario primero",
                payload: null
            }
        }

        // Check if user is already an employee
        if (selectedUser.isEmployee) {
            return {
                error: true,
                message: "Este usuario ya es empleado de esta tienda",
                payload: null
            }
        }

        try {
            const { payload: employee, error, message } = await createEmployee(selectedUser.id, storeId)
            if (error) {
                return {
                    error: true,
                    message: message,
                    payload: null
                }
            }

            // Reset form
            setSelectedUser(null)
            setUsers([])
            setSearch('')

            return {
                error: false,
                message: "Empleado agregado correctamente",
                payload: employee
            }
        } catch (error) {
            return {
                error: true,
                message: "Error al agregar empleado",
                payload: null
            }
        }
    }

    const handleSearch = async () => {
        if (!search.trim()) return

        try {
            const { payload: users, error, message } = await getEmployeesByFilter(search, storeId, userId)
            if (error) {
                console.error("Error searching users:", message)
                return
            }
            setUsers(users || [])
        } catch (error) {
            console.error("Error searching users:", error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const handleSelectUser = (user: UserWithEmployeeStatus) => {
        // Only allow selection if user is not already an employee
        if (!user.isEmployee) {
            setSelectedUser(user)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Plus />
                    Agregar empleado
                </>
            )}
            title="Agregar empleado"
            description="Busca un usuario registrado para agregarlo como empleado de esta tienda."
            action={handleAddEmployee}
            messages={{
                success: "Empleado agregado correctamente!",
                error: "Error al agregar empleado",
                loading: "Agregando empleado..."
            }}
            formDisabled={!selectedUser}
        >
            <div className="flex gap-2 items-end">
                <InputField name="user_search" label="Buscar usuario" type="text" containerClassName="w-full" onChange={handleChange} value={search} onKeyDown={handleKeyDown} />
                <Button onClick={handleSearch} type="button">
                    <Search />
                    Buscar
                </Button>
            </div>
            {selectedUser && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2">
                        <Check className="text-green-600 size-4" />
                        <span className="text-sm font-medium text-green-800">Usuario seleccionado:</span>
                    </div>
                    <div className="mt-1 text-sm text-green-700">
                        {selectedUser.first_name} {selectedUser.last_name} ({selectedUser.email})
                    </div>
                </div>
            )}

            {users.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Usuarios encontrados:</h4>
                    <div className="space-y-2">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className={`p-2 border rounded-md transition-colors ${user.isEmployee
                                        ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                                        : 'cursor-pointer hover:bg-gray-50'
                                    }`}
                                onClick={() => handleSelectUser(user)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">{user.first_name} {user.last_name}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </div>
                                    {user.isEmployee && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <UserCheck className="size-3" />
                                            <span>Ya es empleado</span>
                                        </div>
                                    )}
                                </div>
                                {user.isEmployee && user.employeeData && (
                                    <div className="mt-1 text-xs text-gray-500">
                                        Rol: {user.employeeData.role} • Contratado: {new Date(user.employeeData.hired_at).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {users.length === 0 && search.trim() && !selectedUser && (
                <div className="mt-4">
                    <p className="text-sm text-muted-foreground">No se encontraron usuarios</p>
                </div>
            )}
        </ButtonWithPopup>
    )
} 