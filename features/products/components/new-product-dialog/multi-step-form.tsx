import { MultiStepFormWrapper, Step } from "@/components/multi-step-form-wrapper";
import { useState } from "react";
import { toast } from "sonner";
import { attributesSchema, basicInfoSchema, formSchema, FormValues, mediaSchema, pricingAndStockSchema } from "./validation-schemas";
import BasicInfoStep from "./basic-info-step";
import PricingAndStockStep from "./pricing-and-stock-step";
import MediaStep from "./media-step";
import AttributesStep from "./attribute-step";


function MultiStepForm({ storeId }: { storeId: number }) {

    const [, setResult] = useState<FormValues | null>(null)
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
        material: [],
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
        >
            <Step
                title="Basic Info"
                schema={basicInfoSchema}
            >
                <BasicInfoStep storeId={storeId} />
            </Step>
            <Step
                title="Pricing & stock"
                schema={pricingAndStockSchema}
            >
                <PricingAndStockStep />
            </Step>
            <Step
                title="Media"
                schema={mediaSchema}
            >
                <MediaStep />
            </Step>
            <Step
                title="Attributes"
                schema={attributesSchema}
            >
                <AttributesStep storeId={storeId} />
            </Step>
        </MultiStepFormWrapper >
    );
}

export default MultiStepForm