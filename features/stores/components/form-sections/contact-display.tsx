"use client"

import { Phone, Mail } from "lucide-react"
import { useTranslations } from "next-intl"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Store, Branch } from "@prisma/client"
import { EditContactButton } from "../section-buttons"

interface ContactDisplayProps {
    store: Store & { branches: Branch[] }
}

const ContactDisplay = ({ store }: ContactDisplayProps) => {
    const t = useTranslations("store.edit-store")

    return (
        <AccordionItem value="item-2">
            <AccordionTrigger>
                <span className="flex items-center gap-2">
                    <Phone className="size-4" />
                    {t("contact-section")}
                </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="size-4" />
                            {t("contact-phone")}
                        </p>
                        <p className="text-base">{store.phone || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="size-4" />
                            Email
                        </p>
                        <p className="text-base">{store.email || "Not provided"}</p>
                    </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                    <EditContactButton
                        store={store}
                    />
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}

export default ContactDisplay
