import { Calendar } from "lucide-react"

import { Title } from "@/features/layout/components"
import { PageContainer } from "@/features/layout/components/page-container"

function EventsPage() {
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

export { EventsPage }