import { getStoreBasicsBySlugAction } from "@/features/stores/actions/get-store-basics-by-slug.action"
import { BasicInfoFormWrapper } from "@/features/stores/components/wrappers/basic-info-wrapper.client"

type BasicInfoServerWrapperProps = {
    slug: string
}

export async function BasicInfoServerWrapper({ slug }: BasicInfoServerWrapperProps) {
    const { payload: store } = await getStoreBasicsBySlugAction(slug)

    return <BasicInfoFormWrapper data={store} />
}

