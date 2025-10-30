import { MessageCircle } from "lucide-react";

import { BackgroundPattern } from "@/features/landing/components";
import { AnimatedShinyButton } from "@/features/shadcn/components/animated-shiny-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card";

function ContactSection() {
    return (
        <section className="relative py-17 flex snap-start flex-col items-center">
            <div className="container mx-auto px-4 relative h-full grow w-full">
                <div className='brightness-90 dark:brightness-100 absolute inset-0'>
                    <BackgroundPattern />
                </div>
                <div className="mb-10 flex items-center gap-2 text-primary">
                    <MessageCircle />
                    <h2 className="text-2xl font-bold font-oswald">Contact</h2>
                </div>
                <Card className="relative z-20">
                    <CardHeader>
                        <CardTitle>
                            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl font-oswald text-center">
                                Contact Us
                            </h2>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <p className="text-muted-foreground font-quattrocento text-center text-balance">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, vero eius, in quasi hic nemo magnam assumenda accusamus dolorem fugiat quia provident inventore enim vitae nobis? Cupiditate quibusdam saepe temporibus?
                        </p>
                        <AnimatedShinyButton>
                            Contact Us
                        </AnimatedShinyButton>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

export { ContactSection }