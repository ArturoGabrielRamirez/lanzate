"use client"

import Image from "next/image"
import { useState } from "react"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import shareStoreImage from "@/features/dashboard/assets/Ecommerce web page-pana.svg"
import createStoreImage from "@/features/dashboard/assets/fashion shop-pana.svg"
import createProductImage from "@/features/dashboard/assets/Niche service marketplace-pana.svg"
import welcomeImage from "@/features/dashboard/assets/we are open-pana.svg"
import { Button } from "@/features/shadcn/components/button"
import { useStep } from "@/hooks/use-step"

function WelcomeTutorial() {

    const [open, setOpen] = useState(true)
    const [currentStep, { goToNextStep, goToPrevStep }] = useStep(4)

    const images = [welcomeImage, createStoreImage, createProductImage, shareStoreImage]
    const texts = [
        {
            title: "Welcome!",
            descriptions: [
                "This is a brief tutorial to help you get started with your business.",
                "Once you have completed the tutorial, you will be able to start using Lanzate.",
            ]
        },
        {
            title: "Create a store",
            descriptions: [
                "Create a store to start selling your products.",
                "Choose a name, logo and shipping methods to get started; you can edit your store details later.",
            ]
        },
        {
            title: "Create a product",
            descriptions: [
                "Add products to your store to start selling.",
                "Add as many details as you want such as images, descriptions, prices, and more.",
            ]
        },
        {
            title: "Share your store",
            descriptions: [
                "Share your store's custom link with your customers!",
                "They'll be able to see your products, add them to their cart, and checkout with ease.",
                "You can also share your store on social media, send it to customers, or add it to your business cards.",
            ]
        }
    ]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full !max-w-full h-full md:!max-w-lg md:h-auto rounded-none md:rounded-lg">
                <DialogHeader>
                    <DialogTitle>Welcome to Lanzate!</DialogTitle>
                </DialogHeader>

                <div className="text-center md:text-left">
                    <Image src={images[currentStep - 1]} alt="Welcome Image" width={500} height={500} className="mb-8" />
                    <p className="text-3xl font-bold mb-4">
                        {texts[currentStep - 1].title}
                    </p>
                    <p className="text-lg mb-2">
                        {texts[currentStep - 1].descriptions[0]}
                    </p>
                    <p className="text-lg">
                        {texts[currentStep - 1].descriptions[1]}
                    </p>
                </div>

                <DialogFooter>
                    {currentStep > 1 && (
                        <Button onClick={goToPrevStep} variant="secondary">
                            Previous
                        </Button>
                    )}
                    {currentStep < 4 && (
                        <Button onClick={goToNextStep}>
                            Next
                        </Button>
                    )}
                    {currentStep === 4 && (
                        <Button onClick={() => setOpen(false)}>
                            Finish Tutorial
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}

export { WelcomeTutorial }