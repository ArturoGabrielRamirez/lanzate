import { MultiStepFormWrapper, Step } from "@/components/multi-step-form-wrapper";
import { attributesSchema, basicInfoSchema, formSchema, FormValues, mediaSchema, pricingAndStockSchema } from "./validation-schemas";
import BasicInfoStep from "./basic-info-step";
import PricingAndStockStep from "./pricing-and-stock-step";
import MediaStep from "./media-step";
import AttributesStep from "./attribute-step";
import VariantsStep from "./variants-step";


function MultiStepForm({ storeId, onComplete }: { storeId: number, onComplete: (values: FormValues) => void }) {

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
        onComplete(data)
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
            <Step
                title="Variants"
            >
                <VariantsStep />
            </Step>
        </MultiStepFormWrapper >
    );
}

export default MultiStepForm