import { Facebook, Instagram, Mail, Phone, Twitter } from "lucide-react"
import { useEffect, useRef } from "react"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { CreateStoreFormValues } from "@/features/stores/types"

export function ContactFormPanel() {

    const { formState: { isValid }, watch, setValue, trigger } = useFormContext()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()

    const seededRefContact = useRef(false)

    useEffect(() => {
        if (seededRefContact.current) return
        seededRefContact.current = true
        if (values.contact_info) {
            setValue("contact_info", values.contact_info, { shouldValidate: true })
        } else {
            trigger(["contact_info.contact_phone", "contact_info.contact_email"])
        }
    }, [values.contact_info, setValue, trigger])

    useEffect(() => {
        const sub = watch((v) => setCtxValues({ contact_info: (v as CreateStoreFormValues).contact_info }))
        return () => sub.unsubscribe()
    }, [watch, setCtxValues])

    useEffect(() => { setStepValid(3, isValid) }, [isValid, setStepValid])

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        name="contact_info.contact_phone"
                        label="Phone"
                        placeholder="Ej: 1234567890"
                        startIcon={<Phone />}
                        isRequired
                        tooltip="This is the phone number of your store. It will be used to contact your store."
                    />
                    <InputField
                        name="contact_info.contact_email"
                        label="Email"
                        placeholder="Ej: test@example.com"
                        startIcon={<Mail />}
                        type="email"
                        isRequired
                        tooltip="This is the email of your store. It will be used to contact your store."
                    />
                </div>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="social-media" className="border-none">
                        <AccordionTrigger className="text-muted-foreground text-base font-medium hover:no-underline py-2">Social Media</AccordionTrigger>
                        <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                name="contact_info.facebook_url"
                                label="Facebook"
                                placeholder="Ej: https://www.facebook.com/your-page"
                                startIcon={<Facebook />}
                                tooltip="This is the Facebook URL of your store. It will be used to display your store on Facebook."
                            />
                            <InputField
                                name="contact_info.instagram_url"
                                label="Instagram"
                                placeholder="Ej: https://www.instagram.com/your-page"
                                startIcon={<Instagram />}
                                type="email"
                                tooltip="This is the Instagram URL of your store. It will be used to display your store on Instagram."
                            />
                            <InputField
                                name="contact_info.x_url"
                                label="X (Twitter)"
                                placeholder="Ej: https://x.com/your-page"
                                startIcon={<Twitter />}
                                type="url"
                                tooltip="This is the X (Twitter) URL of your store. It will be used to display your store on X (Twitter)."
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </>
    )
}
