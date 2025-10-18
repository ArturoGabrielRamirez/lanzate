'use client'

import { Headset, MessageCircle } from "lucide-react"
import { useTranslations } from "next-intl"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpDialogButton } from "@/features/dashboard/components"
import { SectionContainer } from "@/features/stores/components"

function HelpCard() {
    const t = useTranslations("dashboard.help")

    return (
        <SectionContainer title={t("title")}>
            <Card className="group/help !gap-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="size-4 text-muted-foreground/50 group-hover/help:text-primary transition-all" />
                        {t("contact-us")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground/50 group-hover/help:text-muted-foreground transition-all">
                        {t("description")}
                    </p>
                </CardContent>
                <CardFooter className="opacity-50 group-hover/help:opacity-100 transition-all">
                    <HelpDialogButton />
                </CardFooter>
            </Card>
        </SectionContainer>
    )
}

export { HelpCard }