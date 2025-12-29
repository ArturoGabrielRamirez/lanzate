import { getStoreAddressBySlugAction } from "@/features/stores/actions/get-store-address-by-slug.action"
import { AddressFormWrapper } from "@/features/stores/components/wrappers/address-wrapper.client"

export async function AddressServerWrapper({ slug }: { slug: string }) {

    const { payload: addressData } = await getStoreAddressBySlugAction(slug)

    const isPhysicalStore = (
        addressData?.address && addressData?.city && addressData?.province && addressData?.country
    ) ? true : false

    const data = {
        ...addressData,
        is_physical_store: isPhysicalStore
    }

    return <AddressFormWrapper data={data} slug={slug} />
}

