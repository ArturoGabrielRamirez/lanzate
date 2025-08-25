"use client"

import { Store, StoreOperationalSettings, Branch } from "@prisma/client"
import StoreFormButton from "../store-form-button"
import { EditBasicInfoButton, EditAddressButton } from "../section-buttons"

interface StoreFormExamplesProps {
    store: Store & { 
        operational_settings: StoreOperationalSettings | null
        branches: Branch[]
    }
    userId: number
}

const StoreFormExamples = ({ store, userId }: StoreFormExamplesProps) => {
    return (
        <div className="space-y-6">
            {/* Formulario completo para editar la tienda */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Formulario Completo para Editar Tienda</h2>
                <StoreFormButton
                    mode="edit"
                    userId={userId}
                    slug={store.slug}
                    store={store}
                    schema={/* Aquí iría el esquema completo */}
                    action={/* Aquí iría la acción completa */}
                    messages={{
                        success: "Store updated successfully!",
                        error: "Failed to update store",
                        loading: "Updating store..."
                    }}
                />
            </div>

            {/* Botones individuales para editar cada sección */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Botones Individuales por Sección</h2>
                <div className="flex flex-wrap gap-4">
                    <EditBasicInfoButton
                        store={store}
                        userId={userId}
                    />
                    <EditAddressButton
                        store={store}
                        userId={userId}
                    />
                </div>
            </div>

            {/* Formulario completo para crear una nueva tienda */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Formulario Completo para Crear Tienda</h2>
                <StoreFormButton
                    mode="create"
                    userId={userId}
                    canCreate={true}
                    schema={/* Aquí iría el esquema para crear */}
                    action={/* Aquí iría la acción para crear */}
                    messages={{
                        success: "Store created successfully!",
                        error: "Failed to create store",
                        loading: "Creating store..."
                    }}
                />
            </div>
        </div>
    )
}

export default StoreFormExamples
