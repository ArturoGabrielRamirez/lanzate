import { Suspense } from "react"

import { Tabs, TabsList, TabsPanel, TabsTab } from "@/features/shadcn/components/ui/tabs"
import { CreateStoreProvider } from "@/features/stores/components/create-form/create-store-provider"
import { BasicInfoSkeleton } from "@/features/stores/components/skeletons/basic-info-skeleton"
import { BasicInfoServerWrapper } from "@/features/stores/components/wrappers/basic-info-wrapper.server"
import { StoreInformationFormProps } from "@/features/stores/types"

function StoreInformationForm({ slug }: StoreInformationFormProps) {

    return (
        <CreateStoreProvider>
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
                    <Suspense fallback={<BasicInfoSkeleton />}>
                        <BasicInfoServerWrapper slug={slug} />
                    </Suspense>
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
