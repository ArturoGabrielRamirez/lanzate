/* "use client" */

import { yupResolver } from "@hookform/resolvers/yup"
/* import { Branch, BranchOperationalSettings, BranchOpeningHour, BranchEmail, BranchPhone, BranchPaymentConfig, BranchSocialMedia } from "@prisma/client" */

import { Form } from "@/features/global/components/form/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/features/shadcn/components/ui/tabs"
/* import { AddressFormPanel } from "@/features/stores/components/create-form/address-form-panel" */
import { BasicInfoFormPanel } from "@/features/stores/components/create-form/basic-info-form-panel"
/* import { ContactFormPanel } from "@/features/stores/components/create-form/contact-form-panel" */
import { CreateStoreProvider } from "@/features/stores/components/create-form/create-store-provider"
/* import { PaymentMethodsFormPanel } from "@/features/stores/components/create-form/payment-methods-form-panel"
import { SettingsFormPanel } from "@/features/stores/components/create-form/settings-form-panel"
import { ShippingFormPanel } from "@/features/stores/components/create-form/shipping-form-panel" */
import { DeleteStoreButton } from "@/features/stores/components/delete-store-button"
import { 
    BasicInfoFormType, 
    basicInfoSchemaNew, 
    /* CreateStoreFormType,
    ContactInfoFormType,
    contactInfoSchema,
    PaymentFormType,
    paymentSchema,
    AddressInfoFormType,
    addressInfoSchema,
    SettingsFormType,
    settingsSchema,
    ShippingFormType,
    shippingSchema */
} from "@/features/stores/schemas"
import { StoreInformationFormProps } from "@/features/stores/types"

/* type ExtendedBranch = Branch & {
    operational_settings: BranchOperationalSettings | null
    opening_hours: BranchOpeningHour[]
    is_physical_store?: boolean
    address?: string
    city?: string
    province?: string
    country?: string
    phone?: string
    email?: string
    facebook_url?: string
    instagram_url?: string
    x_url?: string
    phones: BranchPhone[]
    emails: BranchEmail[]
    social_media: BranchSocialMedia[]
    payment_configs: BranchPaymentConfig[]
} */

function StoreInformationForm({ /* store, */ canManageStore = false, userId }: StoreInformationFormProps) {

    //const mainBranch = (store.branches?.find((branch) => branch.is_main) || store.branches?.[0]) as ExtendedBranch | undefined;

    /* const storeFormData: Partial<CreateStoreFormType> = {
        basic_info: {
            name: store.name,
            subdomain: store.subdomain,
            description: store.description || "",
            logo: store.logo,
        },
        address_info: {
            is_physical_store: mainBranch?.is_physical_store ?? false,
            address: mainBranch?.address || "",
            city: mainBranch?.city || "",
            province: mainBranch?.province || "",
            country: mainBranch?.country || "",
        },
        contact_info: {
            phones: mainBranch?.phones ? mainBranch.phones.map((phone) => ({ phone: phone.number, is_primary: phone.is_primary })) : [],
            emails: mainBranch?.emails ? mainBranch.emails.map((email) => ({ email: email.email, is_primary: email.is_primary })) : [],
            social_media: mainBranch?.social_media ? mainBranch.social_media.map((social_media) => ({ url: social_media.url, is_primary: social_media.is_primary })) : [],
        },
        settings: {
            is_open_24_hours: mainBranch?.operational_settings?.is_open_24_hours ?? true,
            attention_dates: [],
        },
        shipping_info: {
            offers_delivery: false,
            methods: [],
        },
        payment_info: {
            payment_methods: mainBranch?.payment_configs ? mainBranch.payment_configs.map((payment_config) => ({
                name: payment_config.name,
                type: payment_config.type,
                commission_percent: payment_config.commission_percent ?? undefined,
                commission_amount: payment_config.commission_amount ?? undefined,
                cbu_cvu: payment_config.details?.cbu as string,
                alias: payment_config.details?.alias as string,
                instructions: payment_config.details?.instructions as string,
            })) : [],
        }
    } */

    return (
        <CreateStoreProvider /* initialValues={storeFormData} */>
            <Tabs defaultValue="basic-info">
                <TabsList variant="underline">
                    <TabsTab value="basic-info">Información Básica</TabsTab>
                    <TabsTab value="contact">Contacto</TabsTab>
                    <TabsTab value="payment">Métodos de Pago</TabsTab>
                    <TabsTab value="address">Dirección</TabsTab>
                    <TabsTab value="settings">Configuración</TabsTab>
                    <TabsTab value="shipping">Envíos</TabsTab>
                    <TabsTab value="danger-zone">Zona de Peligro</TabsTab>
                </TabsList>
                
                <TabsPanel value="basic-info">
                    {/* <Form<BasicInfoFormType> contentButton="Guardar" resolver={yupResolver(basicInfoSchemaNew as never)}>
                        <BasicInfoFormPanel />
                    </Form> */}
                </TabsPanel>

                <TabsPanel value="contact">
                    {/* <Form<ContactInfoFormType> contentButton="Guardar" resolver={yupResolver(contactInfoSchema as never)}>
                        <ContactFormPanel />
                    </Form> */}
                </TabsPanel>

                <TabsPanel value="payment">
                    {/* <Form<PaymentFormType> contentButton="Guardar" resolver={yupResolver(paymentSchema as never)}>
                        <PaymentMethodsFormPanel />
                    </Form> */}
                </TabsPanel>

                <TabsPanel value="address">
                    {/* <Form<AddressInfoFormType> contentButton="Guardar" resolver={yupResolver(addressInfoSchema as never)}>
                        <AddressFormPanel />
                    </Form> */}
                </TabsPanel>

                <TabsPanel value="settings">
                    {/* <Form<SettingsFormType> contentButton="Guardar" resolver={yupResolver(settingsSchema as never)}>
                        <SettingsFormPanel />
                    </Form> */}
                </TabsPanel>

                <TabsPanel value="shipping">
                    {/* <Form<ShippingFormType> contentButton="Guardar" resolver={yupResolver(shippingSchema as never)}>
                        <ShippingFormPanel />
                    </Form> */}
                </TabsPanel>

                <TabsPanel value="danger-zone">
                    {/* {canManageStore && (
                        <Card className="border-destructive">
                            <CardHeader>
                                <CardTitle className="text-destructive">Danger zone</CardTitle>
                                <CardDescription>
                                    Esta acción es irreversible.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DeleteStoreButton storeId={store.id} userId={userId} />
                            </CardContent>
                        </Card>
                    )} */}
                </TabsPanel>
            </Tabs>
        </CreateStoreProvider>
    )
}

export { StoreInformationForm }
