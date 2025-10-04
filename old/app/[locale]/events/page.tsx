import { Title } from "@/features/layout/components"
import PageContainer from "@/features/layout/components/page-container"
import { Calendar } from "lucide-react"

const EventsPage = () => {
    return (
        <PageContainer>
            <Title title={<div className="flex items-center gap-2">
                <Calendar />
                Events
            </div>} breadcrumbs={[
                {
                    label: "Events",
                    href: "/events"
                }
            ]} showDate />
        </PageContainer>
    )
}

export default EventsPage