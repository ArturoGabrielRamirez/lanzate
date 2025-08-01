import { getStoresFromSlug } from "../../actions/getStoresFromSlug"
import { DeleteStoreButton, EditStoreButton } from "@/features/stores/components"
import { AccountTabProps } from "@/features/stores/types"
import { getTranslations } from "next-intl/server"

async function AccountTab({ slug, userId }: AccountTabProps) {

    const { payload: store, error } = await getStoresFromSlug(slug)
    const t = await getTranslations("store.account-tab")

    if (error || !store) {
        return console.log(error)
    }

    return (
        <>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 w-fit">
                <div className="flex flex-col">
                    <p className="font-light text-sm">{t("name")}</p>
                    <p className="font-medium">{store.name}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-light text-sm">{t("description")}</p>
                    <p className="font-medium">{store.description || t("no-description")}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-light text-sm">{t("website")}</p>
                    <a href={`http://${store.subdomain}.lanzate.app`} className="font-medium text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                        {`https://${store.subdomain}.lanzate.app`}
                    </a>
                </div>
                <div className="flex flex-col">
                </div>
                <div>
                    <EditStoreButton
                        userId={userId}
                        slug={store.slug}
                        store={store}
                    />
                </div>
            </section>
            <section className="p-4 bg-destructive/10 border-destructive border rounded-md">
                <h2 className="text-lg font-medium mb-4">{t("danger-zone")}</h2>
                <p className="text-sm text-destructive-foreground">{t("delete-warning")}</p>
                <p className="text-sm text-destructive-foreground mb-4">{t("delete-irreversible")}</p>
                <DeleteStoreButton storeId={store.id} userId={userId}/>
            </section>
        </>
    )
}
export default AccountTab