import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import HelpDialogButton from "./help-dialog-button"
import { Headset } from "lucide-react"

const HelpCard = () => {
    return (
        <Card className="area-[help] group/help !gap-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Headset className="size-4 text-muted-foreground/50 group-hover/help:text-primary transition-all" />
                    Need help?
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground/50 group-hover/help:text-muted-foreground transition-all">
                    Our experts are here to help you.
                </p>
            </CardContent>
            <CardFooter className="opacity-50 group-hover/help:opacity-100 transition-all">
                <HelpDialogButton />
            </CardFooter>
        </Card>
    )
}
export default HelpCard