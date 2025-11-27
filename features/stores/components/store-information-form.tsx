"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { Branch, BranchOperationalSettings, BranchOpeningHour } from "@prisma/client"

import { Form } from "@/features/global/components/form/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/features/shadcn/components/ui/tabs"
import { BasicInfoFormPanel } from "@/features/stores/components/create-form/basic-info-form-panel"
import { CreateStoreProvider } from "@/features/stores/components/create-form/create-store-provider"
import { DeleteStoreButton } from "@/features/stores/components/delete-store-button"
import { BasicInfoFormType, basicInfoSchemaNew, CreateStoreFormType } from "@/features/stores/schemas"
import { StoreInformationFormProps } from "@/features/stores/types"

type ExtendedBranch = Branch & {
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
}

function StoreInformationForm({ store, canManageStore = false, userId }: StoreInformationFormProps) {

    const mainBranch = (store.branches?.find((branch) => branch.is_main) || store.branches?.[0]) as ExtendedBranch | undefined;

    const storeFormData: Partial<CreateStoreFormType> = {
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
            phones: mainBranch?.phone ? [{ phone: mainBranch.phone, is_primary: true }] : [],
            emails: mainBranch?.email ? [{ email: mainBranch.email, is_primary: true }] : [],
            social_media: [
                mainBranch?.facebook_url ? { url: mainBranch.facebook_url, is_primary: false } : null,
                mainBranch?.instagram_url ? { url: mainBranch.instagram_url, is_primary: false } : null,
                mainBranch?.x_url ? { url: mainBranch.x_url, is_primary: false } : null,
            ].filter((x): x is { url: string; is_primary: boolean } => x !== null)
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
            payment_methods: [],
        }
    }

    return (
        <CreateStoreProvider initialValues={storeFormData}>
            <Tabs defaultValue="tab-1">
                <TabsList variant="underline">
                    <TabsTab value="tab-1">Tab 1</TabsTab>
                    <TabsTab value="tab-2">Tab 2</TabsTab>
                    <TabsTab value="danger-zone">Danger zone</TabsTab>
                </TabsList>
                <TabsPanel value="tab-1">
                    <Form<BasicInfoFormType> contentButton="Guardar" resolver={yupResolver(basicInfoSchemaNew as never)}>
                        <BasicInfoFormPanel />
                    </Form>
                </TabsPanel>
                <TabsPanel value="tab-2">Tab 2 content</TabsPanel>
                <TabsPanel value="danger-zone">
                    {canManageStore && (
                        <Card className="border-destructive">
                            <CardHeader>
                                <CardTitle className="text-destructive">Danger zone</CardTitle>
                                <CardDescription>
                                    Delete warning irreversible
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DeleteStoreButton storeId={store.id} userId={userId} />
                            </CardContent>
                        </Card>
                    )}
                </TabsPanel>
            </Tabs>
        </CreateStoreProvider>
    )
}

export { StoreInformationForm }
