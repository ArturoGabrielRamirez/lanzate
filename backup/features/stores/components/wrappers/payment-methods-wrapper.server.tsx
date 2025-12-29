import { getStorePaymentMethodsBySlugAction } from "@/features/stores/actions/get-store-payment-methods-by-slug.action"
import { PaymentMethodsFormWrapper } from "@/features/stores/components/wrappers/payment-methods-wrapper.client"

export async function PaymentMethodsServerWrapper({ slug }: { slug: string }) {

    const { payload: store } = await getStorePaymentMethodsBySlugAction(slug)

    const mainBranch = store?.branches?.[0]
    const paymentMethods = mainBranch?.payment_configs || []

    return <PaymentMethodsFormWrapper data={paymentMethods} slug={slug} />
}

