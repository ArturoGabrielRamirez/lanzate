import { PartyPopper } from "lucide-react"
import Image from "next/image"

import waitlistSuccessImage from "@/features/auth/assets/Starting a business project-pana.svg"
import { BackgroundPattern } from "@/features/landing/components"
import { Link } from "@/i18n/naviation"

export default async function WaitlistSuccessPage() {
    return (
        <section className="md:min-h-dvh relative pt-17 flex">
            <div className='brightness-95 dark:brightness-60 absolute inset-0'>
                <BackgroundPattern />
            </div>
            <div className="container mx-auto px-4 flex flex-col justify-center items-center md:pb-12 lg:pb-20 z-20 relative">
                <div className="mb-10 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-primary justify-center mb-4">
                        <PartyPopper />
                        <h2 className="text-5xl font-bold font-oswald">Felicidades!</h2>
                    </div>
                    <p className="text-muted-foreground font-quattrocento text-center font-medium text-lg max-w-md text-balance">
                        Te notificaremos cuando el producto esté disponible. Podes cerrar esta ventana y continuar con tu día.
                    </p>
                    <Link href="/" className="text-sm text-blue-500 hover:underline mx-auto">
                        Volver al inicio
                    </Link>
                </div>
                <div className="relative w-full hidden md:flex items-end max-w-md justify-self-start">
                    <Image
                        src={waitlistSuccessImage}
                        alt="Hero Image"
                        className="w-full antialiased object-bottom drop-shadow-xl drop-shadow/20 size-96"
                    />
                </div>
            </div>

        </section>
    )
}
