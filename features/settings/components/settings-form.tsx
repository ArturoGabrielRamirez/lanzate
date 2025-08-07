import { getStoreSettingsAction } from "@/features/settings/actions/getStoreSettingsAction"
import SettingsFormClient from "./settings-form-client"
import { SettingsFormProvider } from "./settings-form-provider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Settings } from "lucide-react"
import ColorSelector from "./color-selector"
import StorePreview from "./store-preview"

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
        <SettingsFormProvider initialBackgroundColor={storeData.background_color}>
            <SettingsFormClient>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <span className="flex items-center gap-2">
                                <Settings />
                                Configuración general
                            </span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ColorSelector
                                label="Color de fondo"
                                defaultColor={storeData.background_color}
                                targetField="background_color"
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <StorePreview />
            </SettingsFormClient>
        </SettingsFormProvider>
    )
}

export default SettingsForm 