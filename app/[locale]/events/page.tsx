import { Calendar } from "lucide-react"

/* import { Title } from "@/features/layout/components" */
import { PageHeader } from "@/features/dashboard/components"
import { PageContainer } from "@/features/layout/components/page-container"

function EventsPage() {
    return (
        <PageContainer>
            <PageHeader
                title={
                    <Calendar /> + "Eventos"
                } />
            {/* <Title title={<div className="flex items-center gap-2">
                <Calendar />
                Events
            </div>} breadcrumbs={[
                {
                    label: "Events",
                    href: "/events"
                }
            ]} showDate /> */}
        </PageContainer>
    )
}

export { EventsPage }