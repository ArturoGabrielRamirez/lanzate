import { getStoresFromSlug } from "../../actions/getStoresFromSlug"
import { getEmployeePermissions } from "../../actions/getEmployeePermissions"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { DeleteStoreButton, EditStoreButton, EditOperationalSettingsButton } from "@/features/stores/components"
import { AccountTabProps } from "@/features/stores/types"
import { getTranslations } from "next-intl/server"
import { Phone, MessageCircle, Facebook, Instagram, Twitter, Store, Settings, DollarSign, Truck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { PaymentMethod } from "@prisma/client"

async function AccountTab({ slug }: AccountTabProps) {

    const t = await getTranslations("store.account-tab")

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    // Get user info and employee permissions
    const [
        { payload: store, error: storeError },
        { payload: employeePermissions, error: permissionsError }
    ] = await Promise.all([
        getStoresFromSlug(slug),
        getEmployeePermissions(user.id, slug)
    ])

    if (userError || !user) {
        console.error(userMessage)
        return null
    }

    if (storeError || !store) {
        console.error(storeError)
        return null
    }

    if (permissionsError || !employeePermissions) {
        console.error("Error loading employee permissions")
        return null
    }

    // Check if user can manage store
    const canManageStore = employeePermissions.isAdmin || employeePermissions.permissions?.can_manage_store

    const operationalSettings = store.operational_settings

    return (
        <div className="space-y-6">
            {/* Store Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Store className="size-5" />
                        Información de la Tienda
                    </CardTitle>
                    <CardDescription>
                        Detalles básicos y contacto de tu tienda
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="font-medium text-sm text-muted-foreground">{t("name")}</p>
                            <p className="text-base">{store.name}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-sm text-muted-foreground">{t("description")}</p>
                            <p className="text-base">{store.description || t("no-description")}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-sm text-muted-foreground">{t("website")}</p>
                            <a
                                href={`http://${store.subdomain}.lanzate.app`}
                                className="text-blue-500 hover:underline text-base"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {`https://${store.subdomain}.lanzate.app`}
                            </a>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                <Phone className="size-4" />
                                {t("contact-phone")}
                            </p>
                            <p className="text-base">{operationalSettings?.contact_phone || t("not-provided")}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                <MessageCircle className="size-4" />
                                {t("contact-whatsapp")}
                            </p>
                            <p className="text-base">{operationalSettings?.contact_whatsapp || t("not-provided")}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                <Facebook className="size-4" />
                                {t("facebook")}
                            </p>
                            {operationalSettings?.facebook_url ? (
                                <a
                                    href={operationalSettings.facebook_url}
                                    className="text-blue-500 hover:underline text-base"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {operationalSettings.facebook_url}
                                </a>
                            ) : (
                                <p className="text-base">{t("not-provided")}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                <Instagram className="size-4" />
                                {t("instagram")}
                            </p>
                            {operationalSettings?.instagram_url ? (
                                <a
                                    href={operationalSettings.instagram_url}
                                    className="text-blue-500 hover:underline text-base"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {operationalSettings.instagram_url}
                                </a>
                            ) : (
                                <p className="text-base">{t("not-provided")}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                <Twitter className="size-4" />
                                {t("x-twitter")}
                            </p>
                            {operationalSettings?.x_url ? (
                                <a
                                    href={operationalSettings.x_url}
                                    className="text-blue-500 hover:underline text-base"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {operationalSettings.x_url}
                                </a>
                            ) : (
                                <p className="text-base">{t("not-provided")}</p>
                            )}
                        </div>
                    </div>

                    {canManageStore && (
                        <div className="mt-6 pt-6 border-t">
                            <EditStoreButton
                                userId={user.id}
                                slug={store.slug}
                                store={store}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Operational Settings Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="size-5" />
                        Configuración Operacional
                    </CardTitle>
                    <CardDescription>
                        Configuración de delivery, precios y métodos de pago
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Delivery Settings */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Truck className="size-4" />
                                <h3 className="font-medium">Delivery</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium">Ofrece delivery</p>
                                        <p className="text-xs text-muted-foreground">
                                            Permite entregas a domicilio
                                        </p>
                                    </div>
                                    <Switch
                                        checked={operationalSettings?.offers_delivery || false}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Precio de delivery</p>
                                    <p className="text-base flex items-center gap-1">
                                        <DollarSign className="size-4" />
                                        {operationalSettings?.delivery_price || "0"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Mínimo para delivery gratis</p>
                                    <p className="text-base flex items-center gap-1">
                                        <DollarSign className="size-4" />
                                        {operationalSettings?.free_delivery_minimum || "No establecido"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Radio de entrega</p>
                                    <p className="text-base">
                                        {operationalSettings?.delivery_radius_km || "5"} km
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Settings */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <DollarSign className="size-4" />
                                <h3 className="font-medium">Configuración de Pagos</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Monto mínimo de orden</p>
                                    <p className="text-base flex items-center gap-1">
                                        <DollarSign className="size-4" />
                                        {operationalSettings?.minimum_order_amount || "0"}
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-sm font-medium">Métodos de pago aceptados</p>
                                    <div className="space-y-2">
                                        {(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER', 'MERCADO_PAGO', 'PAYPAL', 'CRYPTO'] as PaymentMethod[]).map((method) => {
                                            const isAccepted = operationalSettings?.payment_methods?.includes(method) || (method === 'CASH' && !operationalSettings?.payment_methods)
                                            const methodLabels: Record<PaymentMethod, string> = {
                                                CASH: 'Efectivo',
                                                CREDIT_CARD: 'Tarjeta de Crédito',
                                                DEBIT_CARD: 'Tarjeta de Débito',
                                                TRANSFER: 'Transferencia',
                                                MERCADO_PAGO: 'Mercado Pago',
                                                PAYPAL: 'PayPal',
                                                CRYPTO: 'Criptomonedas'
                                            }

                                            return (
                                                <div key={method} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        checked={isAccepted}
                                                        disabled
                                                        id={method}
                                                    />
                                                    <label
                                                        htmlFor={method}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {methodLabels[method]}
                                                    </label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {canManageStore && (
                        <div className="mt-6 pt-6 border-t">
                            <EditOperationalSettingsButton
                                storeId={store.id}
                                store={store}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Danger Zone Card */}
            {canManageStore && (
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">{t("danger-zone")}</CardTitle>
                        <CardDescription>
                            {t("delete-warning")} {t("delete-irreversible")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DeleteStoreButton storeId={store.id} userId={user.id} />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default AccountTab