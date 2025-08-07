import { getStoreSettingsAction } from "@/features/settings/actions/getStoreSettingsAction"
import SettingsFormClient from "./settings-form-client"
import { SettingsFormProvider } from "./settings-form-provider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AppWindow, Filter, Settings } from "lucide-react"
import ColorSelector from "./color-selector"
import StorePreview from "./store-preview"
import { Header } from "@/features/store-landing/components"
import MainContainer from "@/features/store-landing/components/main-container"
import { Title } from "@/features/layout/components"
import SectionContainer from "@/features/store-landing/components/section-container"
import SaveSettingsButton from "./save-settings-button"
import SidebarFilters from "@/features/store-landing/components/sidebar-filters"

type SettingsFormProps = {
    slug: string
}

async function SettingsForm({ slug }: SettingsFormProps) {
    const { payload: storeData, error } = await getStoreSettingsAction(slug)

    if (error || !storeData) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground">Unable to load settings. Please try again.</p>
            </div>
        )
    }

    return (
        <SettingsFormProvider
            initialBackgroundColor={storeData.background_color}
            initialBackgroundForegroundColor={storeData.background_foreground_color}
            initialHeaderColor={storeData.header_color}
            initialHeaderForegroundColor={storeData.header_foreground_color}
            initialFilterBackgroundColor={storeData.filter_background_color}
            initialFilterTextColor={storeData.filter_text_color}
        >
            <SettingsFormClient>
                <div>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <span className="flex items-center gap-2">
                                    <Settings />
                                    Configuración general
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <ColorSelector
                                    label="Color de fondo"
                                    defaultColor={storeData.background_color}
                                    targetField="background_color"
                                />
                                <ColorSelector
                                    label="Color de texto sobre fondo"
                                    defaultColor={storeData.background_foreground_color}
                                    targetField="background_foreground_color"
                                />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>
                                <span className="flex items-center gap-2">
                                    <AppWindow />
                                    Configuración de cabecera
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <ColorSelector
                                    label="Color de cabecera"
                                    defaultColor={storeData.header_color}
                                    targetField="header_color"
                                />
                                <ColorSelector
                                    label="Color de texto de cabecera"
                                    defaultColor={storeData.header_foreground_color}
                                    targetField="header_foreground_color"
                                />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>
                                <span className="flex items-center gap-2">
                                    <Filter />
                                    Configuración de filtros
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <ColorSelector
                                    label="Color de fondo de filtros"
                                    defaultColor={storeData.filter_background_color}
                                    targetField="filter_background_color"
                                />
                                <ColorSelector
                                    label="Color de texto de filtros"
                                    defaultColor={storeData.filter_text_color}
                                    targetField="filter_text_color"
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <SaveSettingsButton slug={slug} />
                </div>
                <StorePreview>
                    <Header title="Store Name" />
                    <MainContainer>
                        <SectionContainer>
                            <Title title="Products" />
                            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-4 grow grid-rows-[min-content_1fr_min-content]">
                                <SidebarFilters />
                            </div>
                        </SectionContainer>
                    </MainContainer>
                </StorePreview>
            </SettingsFormClient>
        </SettingsFormProvider>
    )
}

export default SettingsForm 