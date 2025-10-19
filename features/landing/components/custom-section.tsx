import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { EyeCatchingButton } from "@/features/landing/components"

async function CustomSection() {

    const t = await getTranslations('home')

    return (
        <div className="text-center bg-background dark:bg-black/95 rounded-3xl py-10 container mx-auto z-10">
            <h2 className="text-balance text-4xl font-semibold lg:text-6xl mb-4"><span className="text-primary">Customize</span> your store</h2>
            <p className="text-balance text-lg lg:text-xl mb-8">{t('customization.description')}</p>
            <EyeCatchingButton asChild className="text-xl font-bold">
                <Link href="/signup">{t('buttons.get-started')}</Link>
            </EyeCatchingButton>
        </div>
    )
}
export default CustomSection