'use client'

import { Headset, MessageCircle } from "lucide-react"
import { useTranslations } from "next-intl"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { HelpDialogButton } from "@/features/dashboard/components"
import { SectionContainer } from "@/features/stores/components"

function HelpCard() {
    const t = useTranslations("dashboard.help")

    return (
        <SectionContainer title={t("title")}>
            <Card className="group/help !gap-2 opacity-50 hover:opacity-100 transition-all">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="size-4 text-muted-foreground" />
                        {t("contact-us")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        {t("description")}
                    </p>
                </CardContent>
                <CardFooter>
                    <HelpDialogButton />
                </CardFooter>
            </Card>
        </SectionContainer>
    )
}

export { HelpCard }