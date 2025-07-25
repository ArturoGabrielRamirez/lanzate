"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Store } from "@/prisma/generated/prisma"

type StoreSelectorProps = {
    stores: Store[]
}

function StoreSelector({ stores }: StoreSelectorProps) {
    const [selectedStore, setSelectedStore] = useState<string>("")
    const router = useRouter()

    const handleConfirm = () => {
        if (selectedStore) {
            router.push(`/sale/${selectedStore}`)
        }
    }

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Seleccionar Tienda</h3>
                <p className="text-sm text-muted-foreground">
                    Elige una tienda para crear una nueva orden
                </p>
            </div>
            
            <div className="w-full space-y-4">
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una tienda..." />
                    </SelectTrigger>
                    <SelectContent>
                        {stores.map((store) => (
                            <SelectItem key={store.id} value={store.slug}>
                                {store.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                
                <Button 
                    onClick={handleConfirm} 
                    disabled={!selectedStore}
                    className="w-full"
                >
                    Confirmar Tienda
                </Button>
            </div>
        </div>
    )
}

export default StoreSelector 