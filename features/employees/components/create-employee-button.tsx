"use client"

import { Button } from "@/components/ui/button"
import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { Plus, Search, Check } from "lucide-react"
import { useState } from "react"
import { getEmployeesByFilter } from "../actions/getEmployeesByFilter"
import { createEmployee } from "../actions/createEmployee"
import { ResponseType } from "@/features/layout/types"
import { CreateEmployeeButtonProps } from "../types"

type User = {
    id: number
    email: string
    first_name: string | null
    last_name: string | null
    avatar: string | null
    created_at: Date
}

export default function CreateEmployeeButton({ storeId, userId }: CreateEmployeeButtonProps) {

    const [search, setSearch] = useState('')
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const handleAddEmployee = async (value: string): Promise<ResponseType<any>> => {
        if (!selectedUser) {
            return {
                error: true,
                message: "Debes seleccionar un usuario primero",
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
            const { payload: users, error, message } = await getEmployeesByFilter(search)
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

    const handleSelectUser = (user: User) => {
        setSelectedUser(user)
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
        >
            <div className="flex gap-2 items-end">
                <InputField name="user_search" label="Buscar usuario" type="text" containerClassName="w-full" onChange={handleChange} value={search}/>
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
            {users.length > 0 && !selectedUser && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Usuarios encontrados:</h4>
                    <div className="space-y-2">
                        {users.map((user) => (
                            <div 
                                key={user.id} 
                                className="p-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors" 
                                onClick={() => handleSelectUser(user)}
                            >
                                <div className="font-medium">{user.first_name} {user.last_name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
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