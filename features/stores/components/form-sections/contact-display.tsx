"use client"

import { Phone, Mail } from "lucide-react"
import { useTranslations } from "next-intl"
import { AccordionContent, AccordionItem } from "@/components/ui/accordion"
import AccordionTriggerWithValidation from "@/features/branches/components/accordion-trigger-with-validation"
import { Store, Branch } from "@prisma/client"

interface ContactDisplayProps {
    store: Store & { branches: Branch[] }
    userId: number
}

const ContactDisplay = ({ store, userId }: ContactDisplayProps) => {
    const t = useTranslations("store.edit-store")
    const mainBranch = store.branches?.[0]

    return (
        <AccordionItem value="item-2">
            <AccordionTriggerWithValidation keys={["contact_phone", "contact_email"]}>
                <span className="flex items-center gap-2">
                    <Phone className="size-4" />
                    {t("contact-section")}
                </span>
            </AccordionTriggerWithValidation>
            <AccordionContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="size-4" />
                            {t("contact-phone")}
                        </p>
                        <p className="text-base">{mainBranch?.phone || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="size-4" />
                            Email
                        </p>
                        <p className="text-base">{mainBranch?.email || "Not provided"}</p>
                    </div>
                </div>
                
            </AccordionContent>
        </AccordionItem>
    )
}

export default ContactDisplay
