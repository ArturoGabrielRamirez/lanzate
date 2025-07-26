import { getTranslations } from "next-intl/server"

async function StoreDetailsPage() {

    const t = await getTranslations("store")

    return (
        <div className="p-4 grow flex flex-col">
            {t("store-details-page")}
        </div>
    )
}
export default StoreDetailsPage