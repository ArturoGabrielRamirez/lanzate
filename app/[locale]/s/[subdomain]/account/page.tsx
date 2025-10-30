import { PageHeader } from "@/features/dashboard/components"
/* import { Title } from "@/features/layout/components" */
import { PageContainer } from "@/features/layout/components/page-container"

async function AccountPage() {
    return (
        <PageContainer>
            <PageHeader
                title={`Cuenta`}
            />
            {/*  <Title
                title="Account"
                breadcrumbs={[
                    { label: "Account", href: "/account" },
                ]}
                homePath={`/`}
            /> */}
        </PageContainer>
    )
}
export default AccountPage