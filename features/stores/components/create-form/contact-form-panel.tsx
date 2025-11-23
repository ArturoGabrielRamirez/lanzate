import { useEffect } from "react";
import { useFormContext } from "react-hook-form"

import { ContactEmailsPanel } from "@/features/stores/components/create-form/contact-emails-panel"
import { ContactPhonesPanel } from "@/features/stores/components/create-form/contact-phones-panel"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"

export function ContactFormPanel() {
    const { formState: { isValid } } = useFormContext()
    const { setStepValid } = useCreateStoreContext()

    useEffect(() => {
        setStepValid(3, isValid)
    }, [isValid, setStepValid])

    return (
        <div className="space-y-8">
            <ContactPhonesPanel />
            <ContactEmailsPanel />
        </div>
    )
}
