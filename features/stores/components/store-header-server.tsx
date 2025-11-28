import { getStoreBasicsBySlugAction } from "@/features/stores/actions"
import { StoreHeaderClient } from "@/features/stores/components"
import { StoreHeaderProps } from "@/features/stores/types"


async function StoreHeaderServer({ slug }: StoreHeaderProps) {

    const { payload: store, hasError, message } = await getStoreBasicsBySlugAction(slug)

    if (hasError || !store) {
        return <div>Error al cargar el encabezado de la tienda: {message || "Error desconocido"}</div>
    }

    return (
        <StoreHeaderClient store={store} />
    )
}

export { StoreHeaderServer }
