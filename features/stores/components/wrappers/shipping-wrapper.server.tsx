import { getStoreShippingBySlugAction } from "@/features/stores/actions/get-store-shipping-by-slug.action"
import { ShippingFormWrapper } from "@/features/stores/components/wrappers/shipping-wrapper.client"

export async function ShippingServerWrapper({ slug }: { slug: string }) {

    const { payload: store } = await getStoreShippingBySlugAction(slug)

    const mainBranch = store?.branches?.[0]
    const shippingMethods = mainBranch?.shipping_methods || []

    return <ShippingFormWrapper data={shippingMethods} slug={slug} />
}

