"use client"

import { VariantsTable } from "@/features/products/components/create-form/variants-table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion"

interface VariantsAccordionProps {
    variantsCount: number
}

export function VariantsAccordion({ variantsCount }: VariantsAccordionProps) {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 delay-150">
            <Accordion type="single" collapsible className="w-full" defaultValue="variants">
                <AccordionItem value="variants" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-0">
                        <p className="text-sm font-medium">Variantes Generadas ({variantsCount})</p>
                    </AccordionTrigger>
                    <AccordionContent className="pb-1">
                        <VariantsTable />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

