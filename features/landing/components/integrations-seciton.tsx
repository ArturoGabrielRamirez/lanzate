import { Home } from "lucide-react"

import { BackgroundPattern } from "@/features/landing/components"
import { PriceCard, OfferingWrapper, Offering, ProductName, Price, Description } from "@/features/shadcn/components/lukacho/pricing-card"

function IntegrationsSection() {
    return (
        <section className="min-h-dvh relative pt-17 flex snap-start flex-col items-center">
            <div className="container grid items-center gap-12 lg:grid-cols-[1fr_3fr] mx-auto px-4 relative h-fit">
                <div className='brightness-90 dark:brightness-100 absolute inset-0'>
                    <BackgroundPattern />
                </div>
                <div className="h-full">
                    <div className="mb-10 flex items-center gap-2 text-primary">
                        <Home />
                        <h2 className="text-2xl font-bold font-oswald">Pricing</h2>
                    </div>
                    <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl font-oswald">
                        Lorem ipsum dolor sit amet.
                    </h2>
                    <p className="text-muted-foreground font-quattrocento">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, vero eius, in quasi hic nemo magnam assumenda accusamus dolorem fugiat quia provident inventore enim vitae nobis? Cupiditate quibusdam saepe temporibus?
                    </p>
                </div>
                <div className="container grid items-center pt-10 gap-4 lg:grid-cols-3 mx-auto relative h-fit w-full">
                    <PriceCard contactPageHref="/login" className="shadow-sm hover:drop-shadow-2xl transition-all hover:-translate-y-1 scale-90">
                        <ProductName>Starter</ProductName>
                        <Price>$0 / FREE</Price>
                        <Description>
                            Perfecto para comenzar tu negocio online. Gestiona tus productos y ventas sin costo inicial.
                        </Description>
                        <OfferingWrapper>
                            <Offering>All-in-one product and inventory management</Offering>
                            <Offering>Social media integration</Offering>
                            <Offering>Up to 2 free store and branch</Offering>
                            <Offering>Up to 500 products</Offering>
                            <Offering>Basic sales analytics</Offering>
                            <Offering>Community support</Offering>
                        </OfferingWrapper>
                    </PriceCard>
                    <PriceCard contactPageHref="/contact" className="shadow-sm hover:drop-shadow-2xl transition-all hover:-translate-y-1 bg-card">
                        <ProductName>Business</ProductName>
                        <Price>$10/mo</Price>
                        <Description>
                            Ideal para negocios en crecimiento que quieren ampliar su alcance con herramientas avanzadas.
                        </Description>
                        <OfferingWrapper>
                            <Offering>Todo del plan Starter</Offering>
                            <Offering>Up to 5 stores and branches</Offering>
                            <Offering>Up to 2000 products</Offering>
                            <Offering>Custom branding options</Offering>
                            <Offering>AI features</Offering>
                        </OfferingWrapper>
                    </PriceCard>
                    <PriceCard contactPageHref="/contact" className="shadow-sm hover:drop-shadow-2xl transition-all hover:-translate-y-1 scale-90">
                        <ProductName>Enterprise</ProductName>
                        <Price>$25/mo</Price>
                        <Description>
                            Para empresas que buscan escalar. Gestión completa con herramientas premium y soporte dedicado.                    </Description>
                        <OfferingWrapper>
                            <Offering>Todo del plan Business</Offering>
                            <Offering>Unlimited stores and branches</Offering>
                            <Offering>Unlimited products</Offering>
                            <Offering>Advanced inventory management</Offering>
                            <Offering>Advanced analytics & custom reports</Offering>
                            <Offering>Dedicated support team</Offering>
                        </OfferingWrapper>
                    </PriceCard>
                </div>
            </div>
        </section>
    )
}

export { IntegrationsSection }