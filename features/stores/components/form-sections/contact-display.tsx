"use client"

import { Phone, Mail } from "lucide-react"
import { useTranslations } from "next-intl"
import { Store, Branch } from "@prisma/client"
import { EditContactButton } from "../section-buttons"
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ContactDisplayProps {
    store: Store & { branches: Branch[] }
}

const ContactDisplay = ({ store }: ContactDisplayProps) => {
    const t = useTranslations("store.edit-store")

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <span className="flex items-center gap-2">
                        <Phone className="size-4" />
                        {t("contact-section")}
                    </span>
                </CardTitle>
                <CardAction>
                    <EditContactButton
                        store={store}
                    />
                </CardAction>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    )
}

export default ContactDisplay
