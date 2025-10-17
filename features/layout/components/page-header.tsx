"use client"

import { ArrowLeft } from "lucide-react"

import { useRouter } from "@/i18n/naviation"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

interface PageHeaderProps {
    title: string | React.ReactNode
}

function PageHeader({ title }: PageHeaderProps) {

    const router = useRouter()

    const handleGoBack = () => {
        router.back()
    }

    return (
        <header className="flex items-center gap-2 justify-center relative">
            <IconButton
                    icon={ArrowLeft}
                    className="absolute left-0"
                    onClick={handleGoBack}
                />
            <h2 className="flex items-center gap-2 font-bold text-xl"> {title} </h2>
        </header>
    )
}

export { PageHeader }