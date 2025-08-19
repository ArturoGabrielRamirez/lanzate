'use client'
import { ButtonWithPopup } from "@/features/layout/components"

const HelpDialogButton = () => {

    const handleContactUs = async () => {
        console.log("Contact us")
        return {
            error: true,
            message: "Contact us",
            payload: null
        }
    }

    return (
        <ButtonWithPopup
            title="Contact us"
            action={handleContactUs}
            description="Send us a message and we will get back to you as soon as possible."
            text="Send message"
            messages={{
                success: "Message sent",
                error: "Error sending message",
                loading: "Sending message..."
            }}
            className="w-full"
        />
    )
}
export default HelpDialogButton