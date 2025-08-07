import SettingsFormClient from "./settings-form-client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Settings } from "lucide-react"
import ColorSelector from "./color-selector"
import StorePreview from "./store-preview"

type SettingsFormProps = {
    slug: string
}

async function SettingsForm({ slug }: SettingsFormProps) {
    return (
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
                            label="Color principal"
                            defaultColor="#ef4444"
                        /* onChange={handleColorChange} */
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <StorePreview slug={slug} />
        </SettingsFormClient>
    )
}

export default SettingsForm 