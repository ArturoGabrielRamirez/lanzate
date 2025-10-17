import { getStoreBalanceBySlugAction } from "@/features/stores/actions"

async function StoreBalanceBig({ slug }: { slug: string }) {

    const { payload: balance, hasError, message } = await getStoreBalanceBySlugAction(slug)

    if (hasError) {
        return <div>Error loading store balance: {message || "Unknown error"}</div>
    }

    return (
        <div>
            {/* <p className="text-base text-muted-foreground/50">Tu balance</p> */}
            <p className="text-5xl lg:text-5xl font-bold">{Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(balance?.balance?.current_balance || 0)}</p>
        </div>
    )
}

export { StoreBalanceBig }