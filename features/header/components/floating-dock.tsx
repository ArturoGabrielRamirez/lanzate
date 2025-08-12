"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

type Props = {
    children: React.ReactNode
    showBackButton?: boolean
}

const FloatingDock = ({ children, showBackButton = false }: Props) => {

    const router = useRouter()

    const handleBack = () => {
        router.back()
    }

    return (
        <div className="fixed bottom-2 w-fit px-8 left-1/2 -translate-x-1/2 z-50 flex justify-center items-center bg-white/25 backdrop-blur-[5px] rounded-lg py-4 shadow-2xl md:hidden">
            <div className="absolute top-0 left-0 right-0 h-12 bg-background/95 blur-xl shadow-2xl rounded-t-lg -z-10"></div>
            {showBackButton && (
                <Button variant="outline" size="icon" className="" onClick={handleBack}>
                    <ArrowLeft className="size-5" />
                </Button>
            )}
            {showBackButton && <div className="grow w-px h-10 bg-primary mx-4" />}
            <div className="flex items-center gap-2">
                {children}
            </div>
        </div>
    )
}
export default FloatingDock