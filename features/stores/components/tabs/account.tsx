import { getStoresFromSlug } from "../../actions/getStoresFromSlug"
import { getEmployeePermissions } from "../../actions/getEmployeePermissions"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { DeleteStoreButton, EditStoreButton } from "@/features/stores/components"
import { AccountTabProps } from "@/features/stores/types"
import { getTranslations } from "next-intl/server"
import { Phone, MessageCircle, Facebook, Instagram, Twitter } from "lucide-react"

async function AccountTab({ slug, userId }: AccountTabProps) {

    const t = await getTranslations("store.account-tab")
    
    // Get user info and employee permissions
    const [
        { payload: user, error: userError, message: userMessage },
        { payload: store, error: storeError },
        { payload: employeePermissions, error: permissionsError }
    ] = await Promise.all([
        getUserInfo(),
        getStoresFromSlug(slug),
        getEmployeePermissions(userId, slug)
    ])

    if (userError || !user) {
        return console.log(userMessage)
    }

    if (storeError || !store) {
        return console.log(storeError)
    }

    if (permissionsError || !employeePermissions) {
        return console.log("Error loading employee permissions")
    }

    // Check if user can manage store
    const canManageStore = employeePermissions.isAdmin || employeePermissions.permissions?.can_manage_store

    return (
        <>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-12 w-fit">
                <div className="flex flex-col">
                    <p className="font-light text-xs md:text-sm">{t("name")}</p>
                    <p className="font-medium text-sm md:text-base">{store.name}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-light text-xs md:text-sm">{t("description")}</p>
                    <p className="font-medium text-sm md:text-base">{store.description || t("no-description")}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-light text-xs md:text-sm">{t("website")}</p>
                    <a href={`http://${store.subdomain}.lanzate.app`} className="font-medium text-blue-500 hover:underline text-sm md:text-base" target="_blank" rel="noopener noreferrer">
                        {`https://${store.subdomain}.lanzate.app`}
                    </a>
                </div>
                <div className="flex flex-col">
                </div>

                {/* Sección de Contacto - Siempre visible */}
                <div className="flex flex-col">
                    <p className="font-light text-xs md:text-sm flex items-center gap-2">
                        <Phone className="size-4" />
                        {t("contact-phone")}
                    </p>
                    <p className="font-medium text-sm md:text-base">{store.operational_settings?.contact_phone || t("not-provided")}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-light text-xs md:text-sm flex items-center gap-2">
                        <MessageCircle className="size-4" />
                        {t("contact-whatsapp")}
                    </p>
                    <p className="font-medium text-sm md:text-base">{store.operational_settings?.contact_whatsapp || t("not-provided")}</p>
                </div>

                {/* Sección de Redes Sociales - Siempre visible */}
                <div className="flex flex-col">
                    <p className="font-light text-xs md:text-sm flex items-center gap-2">
                        <Facebook className="size-4" />
                        {t("facebook")}
                    </p>
                    {store.operational_settings?.facebook_url ? (
                        <a href={store.operational_settings.facebook_url} className="font-medium text-blue-500 hover:underline text-sm md:text-base" target="_blank" rel="noopener noreferrer">
                            {store.operational_settings.facebook_url}
                        </a>
                    ) : (
                        <p className="font-medium text-sm md:text-base">{t("not-provided")}</p>
                    )}
                </div>
                <div className="flex flex-col">
                    <p className="font-light text-xs md:text-sm flex items-center gap-2">
                        <Instagram className="size-4" />
                        {t("instagram")}
                    </p>
                    {store.operational_settings?.instagram_url ? (
                        <a href={store.operational_settings.instagram_url} className="font-medium text-blue-500 hover:underline text-sm md:text-base" target="_blank" rel="noopener noreferrer">
                            {store.operational_settings.instagram_url}
                        </a>
                    ) : (
                        <p className="font-medium text-sm md:text-base">{t("not-provided")}</p>
                    )}
                </div>
                <div className="flex flex-col">
                    <p className="font-light text-xs md:text-sm flex items-center gap-2">
                        <Twitter className="size-4" />
                        {t("x-twitter")}
                    </p>
                    {store.operational_settings?.x_url ? (
                        <a href={store.operational_settings.x_url} className="font-medium text-blue-500 hover:underline text-sm md:text-base" target="_blank" rel="noopener noreferrer">
                            {store.operational_settings.x_url}
                        </a>
                    ) : (
                        <p className="font-medium text-sm md:text-base">{t("not-provided")}</p>
                    )}
                </div>

                {canManageStore && (
                    <div>
                        <EditStoreButton
                            userId={userId}
                            slug={store.slug}
                            store={store}
                        />
                    </div>
                )}
            </section>
            {canManageStore && (
                <section className="p-4 bg-destructive/10 border-destructive border rounded-md">
                    <h2 className="text-base md:text-lg font-medium mb-4">{t("danger-zone")}</h2>
                    <DeleteStoreButton storeId={store.id} userId={userId} />
                </section>
            )}
        </>
    )
}

export default AccountTab