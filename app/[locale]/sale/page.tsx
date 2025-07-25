import { ShoppingBasket } from "lucide-react"
import { Title } from "@/features/layout/components"

type Props = {}

function SalePage({ }: Props) {
    return (
        <section className="p-4 flex flex-col max-md:pt-24">
            <Title title={(
                <div className="flex items-center gap-2">
                    <ShoppingBasket />
                    New order
                </div>
            )} breadcrumbs={[{
                label: "Sale",
                href: "/sale"
            }]} />
        </section>
    )
}

export default SalePage