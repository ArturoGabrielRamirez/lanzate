import { Calendar, Home, ShoppingBasket, Store, User } from "lucide-react"
import { Title } from "@/features/layout/components"
import { StoreSelectorContainer, StoreSelectorSkeleton } from "@/features/sale/components"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import FloatingDock from "@/features/header/components/floating-dock"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function SalePage() {
    const t = await getTranslations("sale")

    return (
        <section className="p-2 md:p-4 flex flex-col pt-13 md:pt-17">
            <Title title={(
                <div className="flex items-center gap-2">
                    <ShoppingBasket />
                    {t("title")}
                </div>
            )} breadcrumbs={[{
                label: t("breadcrumbs.sale"),
                href: "/sale"
            }]} />

            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full max-w-md">
                    <Suspense fallback={<StoreSelectorSkeleton />}>
                        <StoreSelectorContainer />
                    </Suspense>
                </div>
            </div>
            <FloatingDock showBackButton>
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard">
                        <Home className="size-5" />
                    </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                    <Link href="/sale">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M21 15h-2.5a1.503 1.503 0 0 0-1.5 1.5a1.503 1.503 0 0 0 1.5 1.5h1a1.503 1.503 0 0 1 1.5 1.5a1.503 1.503 0 0 1-1.5 1.5H17m2 0v1m0-8v1m-6 6H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2m12 3.12V9a2 2 0 0 0-2-2h-2"></path><path d="M16 10V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6m8 0H8m8 0h1m-9 0H7m1 4v.01M8 17v.01m4-3.02V14m0 3v.01"></path></g></svg>
                    </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                    <Link href="/stores">
                        <Store className="size-5" />
                    </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                    <Link href="/events">
                        <Calendar className="size-5" />
                    </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                    <Link href="/account">
                        <User className="size-5" />
                    </Link>
                </Button>
            </FloatingDock>
        </section>
    )
}

export default SalePage