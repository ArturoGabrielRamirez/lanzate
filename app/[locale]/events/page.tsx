import { Title } from "@/features/layout/components"
import { Calendar } from "lucide-react"

const EventsPage = () => {
    return (
        <div className="p-2 md:p-4 pt-13 md:pt-24 max-md:pb-12 container mx-auto z-10">
            <Title title={<div className="flex items-center gap-2">
                <Calendar />
                Events
            </div>} breadcrumbs={[
                {
                    label: "Events",
                    href: "/events"
                }
            ]} showDate />
        </div>
    )
}

export default EventsPage