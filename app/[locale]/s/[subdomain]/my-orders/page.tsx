import { Title } from "@/features/layout/components"

async function MyOrdersPage() {
    return (
        <section className="p-4 grow flex flex-col pb-8">
            <Title
                title="My orders"
                breadcrumbs={[
                    { label: "Account", href: "/account" },
                    { label: "My orders", href: `/my-orders` }
                ]}
                homePath={`/`}
            />
        </section>
    )
}
export default MyOrdersPage