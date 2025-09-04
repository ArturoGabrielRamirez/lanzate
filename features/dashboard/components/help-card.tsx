import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import HelpDialogButton from "./help-dialog-button"
import { Headset, MessageCircle } from "lucide-react"
import { useTranslations } from "next-intl"

const HelpCard = () => {
    const t = useTranslations("dashboard.help")
    
    return (
        <div className="area-[help] hidden lg:block group/help">
            <div className="flex items-center justify-between mb-2 md:mb-4">
                <h2 className="text-lg lg:text-2xl font-bold leading-6 flex items-center gap-2 text-primary/50 group-hover/help:text-primary transition-all">
                    <Headset className="size-4 xl:size-5" />
                    {t("title")}
                </h2>
            </div>
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
        </div>
    )
}
export default HelpCard