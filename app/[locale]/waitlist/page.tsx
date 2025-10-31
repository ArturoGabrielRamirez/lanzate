import { ListChecks } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import waitlistImage from "@/features/auth/assets/Waiting-pana.svg";
import { JoinWaitlist } from "@/features/auth/components";
import { BackgroundPattern } from "@/features/landing/components";
import { Link } from "@/i18n/naviation";

export default async function WaitlistPage() {

    const t = await getTranslations("auth")

    return (
        <section className="md:min-h-dvh relative pt-17 flex">
            <div className='brightness-95 dark:brightness-60 absolute inset-0'>
                <BackgroundPattern />
            </div>
            <div className="container mx-auto px-4 flex flex-col md:grid md:grid-cols-2 md:gap-0 xl:gap-20 2xl:gap-22 xl:[row-gap:0] justify-center items-center md:pb-12 lg:pb-20 z-20 relative">
                <div className='w-full flex flex-col gap-8 lg:max-w-md md:justify-self-end'>
                    <div>
                        <div className="flex items-center gap-2 text-primary">
                            <ListChecks />
                            <h2 className="text-2xl font-bold font-oswald">Lista de espera</h2>
                        </div>
                        <p className="text-muted-foreground font-quattrocento">
                            Únete a la lista de espera para recibir notificaciones cuando el producto esté disponible
                        </p>
                    </div>
                    <JoinWaitlist />
                    <div className='w-full'>
                        <div className="flex gap-2 items-center justify-center w-full">
                            <h3 className="text-sm text-gray-600 dark:text-gray-400">
                                Necesitas ayuda?{" "}
                            </h3>
                            <Link href="/help" className="text-sm text-blue-500 hover:underline">
                                {t("help")}
                            </Link>
                        </div>
                        <div className="flex gap-2 items-center justify-center w-full">
                            <h3 className="text-sm text-gray-600 dark:text-gray-400">
                                Ya tienes una cuenta?{" "}
                            </h3>
                            <Link href="/login" className="text-sm text-blue-500 hover:underline">
                                {t("login")}
                            </Link>
                        </div>
                        <div className="flex gap-2 items-center justify-center w-full">
                            <h3 className="text-sm text-gray-600 dark:text-gray-400">
                                Volver a la página de inicio{" "}
                            </h3>
                            <Link href="/" className="text-sm text-blue-500 hover:underline">
                                {t("back-to-home")}
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="relative aspect-square w-full hidden md:flex items-end max-w-md justify-self-start">
                    <Image
                        src={waitlistImage}
                        alt="Hero Image"
                        width={5}
                        className="w-full antialiased object-bottom drop-shadow-xl drop-shadow-primary/30"
                    />

                </div>
            </div>
        </section>
    )
}