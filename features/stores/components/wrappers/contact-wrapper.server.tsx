import { getStoreContactsBySlugAction } from "@/features/stores/actions"
import { ContactFormWrapper } from "@/features/stores/components/wrappers/contact-wrapper.client"

export async function ContactServerWrapper({ slug }: { slug: string }) {

    const { payload: store } = await getStoreContactsBySlugAction(slug)

    const mainBranch = store?.branches?.[0]

    const contactData = {
        phones: mainBranch?.phones || [],
        emails: mainBranch?.emails || [],
        social_media: mainBranch?.social_media || []
    }

    return <ContactFormWrapper data={contactData} slug={slug} />
}
