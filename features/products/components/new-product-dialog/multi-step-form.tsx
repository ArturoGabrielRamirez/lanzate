import { MultiStepFormWrapper, Step } from "@/components/multi-step-form-wrapper";
import { useState } from "react";
import { toast } from "sonner";
import { attributesSchema, basicInfoSchema, formSchema, FormValues, mediaSchema, pricingAndStockSchema } from "./validation-schemas";
import BasicInfoStep from "./basic-info-step";
import PricingAndStockStep from "./pricing-and-stock-step";
import MediaStep from "./media-step";
import AttributesStep from "./attribute-step";
import { Check } from "lucide-react";


function MultiStepForm({ storeId }: { storeId: number }) {

    const [data, setResult] = useState<FormValues | null>(null)
    console.log("🚀 ~ MultiStepForm ~ data:", data)

    const initialValues: Partial<FormValues> = {
        name: '',
        url: '',
        price: '',
        stock: '',
        sku: '',
        barcode: '',
        description: '',
        is_published: true,
        is_active: true,
        is_featured: false,
        categories: [],
        images: [],
        primary_image: null,
        selected_attributes: [],
        weight: '0',
        weight_unit: 'kg',
        expiration_date: new Date().toISOString().split('T')[0],
        height: '',
        height_unit: 'cm',
        width: '',
        width_unit: 'cm',
        depth: '',
        depth_unit: 'cm',
        circumference: '',
        circumference_unit: 'cm',
        sizes: [],
        dimensions: [],
        flavors: [],
        fragrances: [],
        colors: [],
        materials: [],
    };

    const handleComplete = (data: FormValues) => {
        setResult(data)
        toast.success("Form submitted!")
    }

    return (
        <MultiStepFormWrapper
            onComplete={handleComplete}
            completeButtonText="Submit"
            className="w-full"
            schema={formSchema}
            initialData={initialValues}
            allowStepReset
            allowSkipSteps
            autoSave
            persistKey="create-product-new"
            showNavigation={data ? false : true}
        >
            {!data && (
                <Step
                    title="Basic Info"
                    schema={basicInfoSchema}
                >
                    <BasicInfoStep storeId={storeId} />
                </Step>
            )}
            {!data && (
                <Step
                    title="Pricing & stock"
                    schema={pricingAndStockSchema}
                >
                    <PricingAndStockStep />
                </Step>
            )}
            {!data && (
                <Step
                    title="Media"
                    schema={mediaSchema}
                >
                    <MediaStep />
                </Step>
            )}
            {!data && (
                <Step
                    title="Attributes"
                    schema={attributesSchema}
                >
                    <AttributesStep storeId={storeId} />
                </Step>
            )}
            {data && (
                <Step title="Success">
                    <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                        <Check className="size-12 text-green-600" />
                        <p className="text-sm text-muted-foreground">Producto creado con éxito</p>
                    </div>
                </Step>
            )}
        </MultiStepFormWrapper >
    );
}

export default MultiStepForm