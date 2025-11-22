"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import shareStoreImage from "@/features/dashboard/assets/Ecommerce web page-pana.svg"
import createStoreImage from "@/features/dashboard/assets/fashion shop-pana.svg"
import createProductImage from "@/features/dashboard/assets/Niche service marketplace-pana.svg"
import welcomeImage from "@/features/dashboard/assets/we are open-pana.svg"
import { WelcomeTutorialWidget } from "@/features/dashboard/components/welcome-tutorial"
import { Button } from "@/features/shadcn/components/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/features/shadcn/components/ui/dialog"
import { useStep } from "@/features/shadcn/hooks/use-step"
import { SectionContainer } from "@/features/stores/components"

function WelcomeTutorial() {

    const [open, setOpen] = useState(false)
    const [currentStep, { goToNextStep, goToPrevStep, setStep }] = useStep(4)

    const images = [welcomeImage, createStoreImage, createProductImage, shareStoreImage]
    const texts = [
        {
            title: "Bienvenido!",
            descriptions: [
                "Este es un breve tutorial para ayudarte a comenzar con tu negocio.",
                "Una vez que hayas completado el tutorial, podrás comenzar a usar Lanzate.",

            ]
        },
        {
            title: "Creá una tienda",
            descriptions: [
                "Creá una tienda para comenzar a vender tus productos.",
                "Elegí un nombre, logo y métodos de envío para comenzar; podés editar los detalles de tu tienda más tarde.",
            ]
        },
        {
            title: "Crear un producto",
            descriptions: [
                "Agregá productos a tu tienda para comenzar a vender.",
                "Agregá tantos detalles como desees, como imágenes, descripciones, precios y más.",
            ]
        },
        {
            title: "Compartí tu tienda",
            descriptions: [
                "Compartí el enlace personalizado de tu tienda con tus clientes.",
                "Ellos podrán ver tus productos, agregarlos a su carrito y finalizar la compra fácilmente.",
                "También podés compartir tu tienda en redes sociales, enviarla a clientes o agregarla a tus tarjetas de presentación.",
            ]
        }
    ]

    useEffect(() => {
        const tutorialFinished = localStorage.getItem("tutorial-finished")
        if (tutorialFinished) {
            setOpen(false)
        } else {
            setOpen(true)
        }
    }, [])

    const handleFinishTutorial = () => {
        setOpen(false)
        localStorage.setItem("tutorial-finished", "true")
    }

    const handleRetakeTutorial = () => {
        localStorage.removeItem("tutorial-finished")
        setOpen(true)
        setStep(1)
    }

    return (
        <SectionContainer title="Feeling lost?">
            <WelcomeTutorialWidget onRetakeTutorial={handleRetakeTutorial} />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-full !max-w-full h-full md:!max-w-lg md:h-auto rounded-none md:rounded-lg">
                    <DialogHeader>
                        <DialogTitle>Bienvenido a Lanzate!</DialogTitle>
                    </DialogHeader>

                    <div className="text-center md:text-left">
                        <div className="relative w-full aspect-video my-8">
                            <Image src={images[currentStep - 1]} alt="Welcome Image" fill objectFit="cover" />
                        </div>
                        <p className="text-3xl font-bold mb-6">
                            {texts[currentStep - 1].title}
                        </p>
                        <p className="text-lg mb-2 text-balance text-muted-foreground">
                            {texts[currentStep - 1].descriptions[0]}
                        </p>
                        <p className="text-lg text-balance text-muted-foreground">
                            {texts[currentStep - 1].descriptions[1]}
                        </p>
                    </div>

                    <DialogFooter className="!flex-col justify-end md:!flex-row">
                        {currentStep > 1 && (
                            <Button onClick={goToPrevStep} variant="secondary">
                                Anterior
                            </Button>
                        )}
                        {currentStep < 4 && (
                            <Button onClick={goToNextStep}>
                                Siguiente
                            </Button>
                        )}
                        {currentStep === 4 && (
                            <Button onClick={handleFinishTutorial}>
                                Finalizar Tutorial
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SectionContainer>
    )

}

export { WelcomeTutorial }