"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { settingsSchema } from "@/features/settings/schemas/settings-schema"
import { StoreCustomizationForm } from "@/features/settings/types"
import { updateStoreSettingsAction } from "@/features/settings/actions/updateStoreSettingsAction"
import { InputField } from "@/features/layout/components"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CheckboxField from "./checkbox-field"
import SelectField from "./select-field"
import { FormProvider, useForm, FieldValues } from "react-hook-form"
import { toast } from "sonner"

type SettingsFormProps = {
    slug: string
    initialData: StoreCustomizationForm
}

function SettingsForm({ slug, initialData }: SettingsFormProps) {
    
    // Proporcionar valores por defecto para evitar errores
    const defaultValues: StoreCustomizationForm = {
        primary_color: initialData.primary_color || '#000000',
        secondary_color: initialData.secondary_color || '#ffffff',
        accent_color: initialData.accent_color || '#6366f1',
        background_color: initialData.background_color || '#ffffff',
        text_color: initialData.text_color || '#000000',
        secondary_text_color: initialData.secondary_text_color || '#6b7280',
        border_color: initialData.border_color || '#e5e7eb',
        success_color: initialData.success_color || '#10b981',
        warning_color: initialData.warning_color || '#f59e0b',
        error_color: initialData.error_color || '#ef4444',
        primary_font: initialData.primary_font || 'Inter',
        secondary_font: initialData.secondary_font || 'Inter',
        font_size_base: initialData.font_size_base || '16px',
        show_header: initialData.show_header ?? true,
        show_logo: initialData.show_logo ?? true,
        show_search_bar: initialData.show_search_bar ?? true,
        show_navigation_menu: initialData.show_navigation_menu ?? true,
        show_cart_icon: initialData.show_cart_icon ?? true,
        show_user_account: initialData.show_user_account ?? true,
        header_position: initialData.header_position || 'TOP',
        header_style: initialData.header_style || 'MODERN',
        show_footer: initialData.show_footer ?? true,
        footer_text: initialData.footer_text || '',
        show_social_links: initialData.show_social_links ?? true,
        show_contact_info: initialData.show_contact_info ?? true,
        show_store_info: initialData.show_store_info ?? true,
        layout_style: initialData.layout_style || 'MODERN',
        container_max_width: initialData.container_max_width || '1200px',
        border_radius: initialData.border_radius || '8px',
        spacing_unit: initialData.spacing_unit || '1rem',
        show_hero_section: initialData.show_hero_section ?? true,
        show_featured_products: initialData.show_featured_products ?? true,
        show_categories: initialData.show_categories ?? true,
        show_testimonials: initialData.show_testimonials ?? false,
        show_about_section: initialData.show_about_section ?? false,
        products_per_page: initialData.products_per_page || 12,
        product_card_style: initialData.product_card_style || 'MODERN',
        show_product_rating: initialData.show_product_rating ?? true,
        show_product_stock: initialData.show_product_stock ?? true,
        show_add_to_cart_btn: initialData.show_add_to_cart_btn ?? true,
        meta_title: initialData.meta_title || '',
        meta_description: initialData.meta_description || '',
        google_analytics_id: initialData.google_analytics_id || '',
        facebook_pixel_id: initialData.facebook_pixel_id || '',
        google_tag_manager_id: initialData.google_tag_manager_id || '',
    }

    const methods = useForm<any>({
        resolver: yupResolver(settingsSchema) as any,
        defaultValues: defaultValues,
        mode: 'onChange'
    })

    const onSubmit = async (data: FieldValues) => {
        try {
            const result = await updateStoreSettingsAction(slug, data as StoreCustomizationForm)
            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success(result.message)
            }
        } catch (error) {
            toast.error("An error occurred while saving settings")
        }
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Colores */}
                <Card>
                    <CardHeader>
                        <CardTitle>Colors & Theme</CardTitle>
                        <CardDescription>Configure the color scheme for your store</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <InputField name="primary_color" label="Primary Color" type="color" defaultValue={defaultValues.primary_color} />
                        <InputField name="secondary_color" label="Secondary Color" type="color" defaultValue={defaultValues.secondary_color} />
                        <InputField name="accent_color" label="Accent Color" type="color" defaultValue={defaultValues.accent_color} />
                        <InputField name="background_color" label="Background Color" type="color" defaultValue={defaultValues.background_color} />
                        <InputField name="text_color" label="Text Color" type="color" defaultValue={defaultValues.text_color} />
                        <InputField name="secondary_text_color" label="Secondary Text Color" type="color" defaultValue={defaultValues.secondary_text_color} />
                        <InputField name="border_color" label="Border Color" type="color" defaultValue={defaultValues.border_color} />
                        <InputField name="success_color" label="Success Color" type="color" defaultValue={defaultValues.success_color} />
                        <InputField name="warning_color" label="Warning Color" type="color" defaultValue={defaultValues.warning_color} />
                        <InputField name="error_color" label="Error Color" type="color" defaultValue={defaultValues.error_color} />
                    </CardContent>
                </Card>

                {/* Fuentes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Typography</CardTitle>
                        <CardDescription>Configure fonts and text sizes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InputField name="primary_font" label="Primary Font" defaultValue={defaultValues.primary_font} />
                        <InputField name="secondary_font" label="Secondary Font" defaultValue={defaultValues.secondary_font} />
                        <InputField name="font_size_base" label="Base Font Size" defaultValue={defaultValues.font_size_base} />
                    </CardContent>
                </Card>

                {/* Header */}
                <Card>
                    <CardHeader>
                        <CardTitle>Header Configuration</CardTitle>
                        <CardDescription>Configure what elements appear in your store header</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <CheckboxField name="show_header" label="Show Header" />
                            <CheckboxField name="show_logo" label="Show Logo" />
                            <CheckboxField name="show_search_bar" label="Show Search Bar" />
                            <CheckboxField name="show_navigation_menu" label="Show Navigation Menu" />
                            <CheckboxField name="show_cart_icon" label="Show Cart Icon" />
                            <CheckboxField name="show_user_account" label="Show User Account" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <SelectField 
                                name="header_position" 
                                label="Header Position"
                                options={[
                                    { value: 'TOP', label: 'Top' },
                                    { value: 'FIXED_TOP', label: 'Fixed Top' },
                                    { value: 'STICKY', label: 'Sticky' }
                                ]}
                            />
                            <SelectField 
                                name="header_style" 
                                label="Header Style"
                                options={[
                                    { value: 'MODERN', label: 'Modern' },
                                    { value: 'CLASSIC', label: 'Classic' },
                                    { value: 'MINIMAL', label: 'Minimal' },
                                    { value: 'BOLD', label: 'Bold' }
                                ]}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <Card>
                    <CardHeader>
                        <CardTitle>Footer Configuration</CardTitle>
                        <CardDescription>Configure footer elements</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <CheckboxField name="show_footer" label="Show Footer" />
                            <CheckboxField name="show_social_links" label="Show Social Links" />
                            <CheckboxField name="show_contact_info" label="Show Contact Info" />
                            <CheckboxField name="show_store_info" label="Show Store Info" />
                        </div>
                        <InputField name="footer_text" label="Footer Text" defaultValue={defaultValues.footer_text} />
                    </CardContent>
                </Card>

                {/* Layout */}
                <Card>
                    <CardHeader>
                        <CardTitle>Layout Configuration</CardTitle>
                        <CardDescription>Configure general layout settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <SelectField 
                            name="layout_style" 
                            label="Layout Style"
                            options={[
                                { value: 'MODERN', label: 'Modern' },
                                { value: 'CLASSIC', label: 'Classic' },
                                { value: 'MINIMAL', label: 'Minimal' },
                                { value: 'GRID', label: 'Grid' },
                                { value: 'MAGAZINE', label: 'Magazine' }
                            ]}
                        />
                        <InputField name="container_max_width" label="Container Max Width" defaultValue={defaultValues.container_max_width} />
                        <InputField name="border_radius" label="Border Radius" defaultValue={defaultValues.border_radius} />
                        <InputField name="spacing_unit" label="Spacing Unit" defaultValue={defaultValues.spacing_unit} />
                    </CardContent>
                </Card>

                {/* Home Page */}
                <Card>
                    <CardHeader>
                        <CardTitle>Home Page Sections</CardTitle>
                        <CardDescription>Configure which sections appear on your home page</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <CheckboxField name="show_hero_section" label="Show Hero Section" />
                            <CheckboxField name="show_featured_products" label="Show Featured Products" />
                            <CheckboxField name="show_categories" label="Show Categories" />
                            <CheckboxField name="show_testimonials" label="Show Testimonials" />
                            <CheckboxField name="show_about_section" label="Show About Section" />
                        </div>
                    </CardContent>
                </Card>

                {/* Products */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Configuration</CardTitle>
                        <CardDescription>Configure product display settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <CheckboxField name="show_product_rating" label="Show Product Rating" />
                            <CheckboxField name="show_product_stock" label="Show Product Stock" />
                            <CheckboxField name="show_add_to_cart_btn" label="Show Add to Cart Button" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField name="products_per_page" label="Products per Page" type="number" defaultValue={defaultValues.products_per_page.toString()} />
                            <SelectField 
                                name="product_card_style" 
                                label="Product Card Style"
                                options={[
                                    { value: 'MODERN', label: 'Modern' },
                                    { value: 'CLASSIC', label: 'Classic' },
                                    { value: 'MINIMAL', label: 'Minimal' },
                                    { value: 'DETAILED', label: 'Detailed' },
                                    { value: 'COMPACT', label: 'Compact' }
                                ]}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* SEO */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>SEO & Analytics</CardTitle>
                        <CardDescription>Configure SEO and analytics settings</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <InputField name="meta_title" label="Meta Title" defaultValue={defaultValues.meta_title} />
                        <InputField name="meta_description" label="Meta Description" defaultValue={defaultValues.meta_description} />
                        <InputField name="google_analytics_id" label="Google Analytics ID" defaultValue={defaultValues.google_analytics_id} />
                        <InputField name="facebook_pixel_id" label="Facebook Pixel ID" defaultValue={defaultValues.facebook_pixel_id} />
                        <InputField name="google_tag_manager_id" label="Google Tag Manager ID" defaultValue={defaultValues.google_tag_manager_id} />
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="md:col-span-2 flex justify-end pt-6 border-t">
                    <button 
                        type="submit" 
                        disabled={methods.formState.isSubmitting}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md font-medium disabled:opacity-50"
                    >
                        {methods.formState.isSubmitting ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </form>
        </FormProvider>
    )
}

export default SettingsForm 