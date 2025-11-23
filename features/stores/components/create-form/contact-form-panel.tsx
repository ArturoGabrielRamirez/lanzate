import { useEffect } from "react";
import { useFormContext } from "react-hook-form"

import { ContactEmailsPanel } from "@/features/stores/components/create-form/contact-emails-panel"
import { ContactPhonesPanel } from "@/features/stores/components/create-form/contact-phones-panel"
import { ContactUrlsPanel } from "@/features/stores/components/create-form/contact-urls-panel"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"

export function ContactFormPanel() {
    const { formState: { isValid } } = useFormContext()
    const { setStepValid } = useCreateStoreContext()

    useEffect(() => {
        setStepValid(2, isValid)
    }, [isValid, setStepValid])

    return (
        <div className="flex flex-col gap-4">
            <ContactPhonesPanel />
            <ContactEmailsPanel />
            <ContactUrlsPanel />
        </div>
    )
}
