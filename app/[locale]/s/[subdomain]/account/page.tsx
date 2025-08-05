import { Title } from "@/features/layout/components"

async function AccountPage() {
    return (
        <section className="p-4 grow flex flex-col pb-8">
            <Title
                title="Account"
                breadcrumbs={[
                    { label: "Account", href: "/account" },
                ]}
                homePath={`/`}
            />
        </section>
    )
}
export default AccountPage