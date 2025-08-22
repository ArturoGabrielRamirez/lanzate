import { Title } from "@/features/layout/components"
import PageContainer from "@/features/layout/components/page-container"

async function AccountPage() {
    return (
        <PageContainer className="![padding-top:calc(var(--section-padding-top)_+_2rem)]">
            <Title
                title="Account"
                breadcrumbs={[
                    { label: "Account", href: "/account" },
                ]}
                homePath={`/`}
            />
        </PageContainer>
    )
}
export default AccountPage