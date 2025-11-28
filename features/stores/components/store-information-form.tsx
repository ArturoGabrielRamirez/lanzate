import { Suspense } from "react"

import { Tabs, TabsList, TabsPanel, TabsTab } from "@/features/shadcn/components/ui/tabs"
import { CreateStoreProvider } from "@/features/stores/components/create-form/create-store-provider"
import { BasicInfoSkeleton } from "@/features/stores/components/skeletons/basic-info-skeleton"
import { ContactSkeleton } from "@/features/stores/components/skeletons/contact-skeleton"
import { AddressServerWrapper } from "@/features/stores/components/wrappers/address-wrapper.server"
import { BasicInfoServerWrapper } from "@/features/stores/components/wrappers/basic-info-wrapper.server"
import { ContactServerWrapper } from "@/features/stores/components/wrappers/contact-wrapper.server"
import { PaymentMethodsServerWrapper } from "@/features/stores/components/wrappers/payment-methods-wrapper.server"
import { StoreInformationFormProps } from "@/features/stores/types"

function StoreInformationForm({ slug }: StoreInformationFormProps) {

    return (
        <CreateStoreProvider>
            <Tabs defaultValue="basic-info">
                <TabsList variant="underline" className="overflow-x-auto max-w-full overflow-y-hidden justify-start">
                    <TabsTab value="basic-info">Información Básica</TabsTab>
                    <TabsTab value="contact">Contacto</TabsTab>
                    <TabsTab value="payment" className="flex-1 shrink-0">Métodos de Pago</TabsTab>
                    <TabsTab value="address" className="flex-1 shrink-0">Dirección</TabsTab>
                    <TabsTab value="settings" className="flex-1 shrink-0">Configuración</TabsTab>
                    <TabsTab value="shipping" className="flex-1 shrink-0">Envíos</TabsTab>
                    <TabsTab value="danger-zone" className="flex-1 shrink-0">Zona de Peligro</TabsTab>
                </TabsList>

                <TabsPanel value="basic-info">
                    <Suspense fallback={<BasicInfoSkeleton />}>
                        <BasicInfoServerWrapper slug={slug} />
                    </Suspense>
                </TabsPanel>

                <TabsPanel value="contact">
                    <Suspense fallback={<ContactSkeleton />}>
                        <ContactServerWrapper slug={slug} />
                    </Suspense>
                </TabsPanel>

                <TabsPanel value="payment">
                    <Suspense fallback={<ContactSkeleton />}>
                        <PaymentMethodsServerWrapper slug={slug} />
                    </Suspense>
                </TabsPanel>

                <TabsPanel value="address">
                    <Suspense fallback={<ContactSkeleton />}>
                        <AddressServerWrapper slug={slug} />
                    </Suspense>
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
