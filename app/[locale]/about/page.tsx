import { Info } from "lucide-react";
import Image from "next/image";

import aboutImage from '@/features/auth/assets/Good team-pana.svg'
import { LandingSectionIconTitle, LandingText } from "@/features/global/components";
import { BackgroundPattern, SectionSubtitle } from "@/features/landing/components";


export default function AboutPage() {
    return (
        <section className="md:min-h-dvh relative pt-17 flex flex-col gap-10">
            <div className='brightness-95 dark:brightness-60 absolute inset-0'>
                <BackgroundPattern />
            </div>
            <div className="container mx-auto px-4 flex flex-col md:grid md:grid-cols-2 md:gap-0 xl:gap-20 2xl:gap-22 xl:[row-gap:0] justify-center items-center md:pb-12 lg:pb-20 z-20 relative grow text-center md:text-left">
                <div>
                    <LandingSectionIconTitle icon={<Info />}>
                        About Us
                    </LandingSectionIconTitle>
                    <SectionSubtitle className="mb-8">
                        Get to know more about us.
                    </SectionSubtitle>
                    <div className="space-y-4">

                        <LandingText>
                            Lanzate nació de una necesidad muy real que vivimos en carne propia. Somos Horacio Gutiérrez y Gabriel Ramírez, dos programadores que, junto con Felipe (nuestro gato y supervisor de calidad), nos dimos cuenta de que empezar un negocio informal no es fácil. A través de experiencias cercanas con familiares y amigos que querían arrancar su propio emprendimiento, vimos cómo se complicaban con herramientas dispersas, planillas de Excel que se perdían, y la falta de una solución simple que les permitiera gestionar todo desde un solo lugar.
                        </LandingText>
                        <LandingText>
                            La idea de crear una plataforma all-in-one para la gestión de tiendas informales surgió después de ver a nuestros seres queridos luchando con múltiples apps, cuadernos y métodos caseros para llevar el control de sus ventas, inventario y clientes. Nos dimos cuenta de que había una brecha enorme entre las soluciones empresariales complejas y caras, y las necesidades reales de alguien que recién está arrancando. Entonces pensamos: ¿por qué no hacer algo que realmente funcione para ellos, que sea intuitivo, accesible y que los ayude a crecer sin complicarse la vida?
                        </LandingText>
                        <LandingText>
                            Así que nos pusimos manos a la obra. Con Horacio y Gabriel codeando día y noche (y Felipe supervisando desde el teclado), desarrollamos Lanzate pensando en todas esas personas que tienen un sueño y necesitan las herramientas adecuadas para hacerlo realidad. Nuestra plataforma integra todo lo que necesitás para gestionar tu negocio: desde el control de stock hasta el seguimiento de clientes, pasando por las ventas y los reportes. Porque creemos que empezar un negocio no debería ser complicado, y que con las herramientas correctas, cualquiera puede lanzarse.
                        </LandingText>
                    </div>
                </div>
                <div className="relative aspect-square w-full hidden md:flex items-end max-w-xl justify-self-center">
                    <Image
                        src={aboutImage}
                        alt="About Us"
                        className="w-full antialiased object-bottom drop-shadow-xl drop-shadow/20"
                    />

                </div>
            </div>
        </section>
    )
}