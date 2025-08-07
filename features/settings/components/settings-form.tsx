import { getStoreSettingsAction } from "@/features/settings/actions/getStoreSettingsAction"
import SettingsFormClient from "./settings-form-client"
import { SettingsFormProvider } from "./settings-form-provider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Settings } from "lucide-react"
import ColorSelector from "./color-selector"
import StorePreview from "./store-preview"
import { Header } from "@/features/store-landing/components"
import MainContainer from "@/features/store-landing/components/main-container"
import { Title } from "@/features/layout/components"
import SectionContainer from "@/features/store-landing/components/section-container"
import SaveSettingsButton from "./save-settings-button"

type SettingsFormProps = {
    slug: string
}

async function SettingsForm({ slug }: SettingsFormProps) {
    const { payload: storeData, error } = await getStoreSettingsAction(slug)
    console.log("🚀 ~ SettingsForm ~ storeData:", storeData)

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
                    </Accordion>
                    <SaveSettingsButton slug={slug} />
                </div>
                <StorePreview>
                    <Header title="Store Name" />
                    <MainContainer>
                        <SectionContainer>
                            <Title title="Products" />
                        </SectionContainer>
                    </MainContainer>
                </StorePreview>
            </SettingsFormClient>
        </SettingsFormProvider>
    )
}

export default SettingsForm 