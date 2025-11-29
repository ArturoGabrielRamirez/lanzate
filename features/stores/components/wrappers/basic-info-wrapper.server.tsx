import { getStoreBasicsBySlugAction } from "@/features/stores/actions/get-store-basics-by-slug.action"
import { BasicInfoFormWrapper } from "@/features/stores/components/wrappers/basic-info-wrapper.client"

export async function BasicInfoServerWrapper({ slug }: { slug: string }) {
    const { payload: store } = await getStoreBasicsBySlugAction(slug)
    
    return <BasicInfoFormWrapper data={store} slug={slug} />
}

