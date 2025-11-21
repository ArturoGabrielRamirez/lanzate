import { Facebook, Instagram, Mail, Phone, Twitter } from "lucide-react"
import { useEffect, useRef } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslations } from "next-intl"

import { InputField } from "@/features/global/components/form/input-field"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { CreateStoreFormValues } from "@/features/stores/types"

export function ContactFormPanel() {
    const t = useTranslations("store.create-form.contact")

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
                        label={t("phone")}
                        placeholder={t("phone-placeholder")}
                        startIcon={<Phone />}
                        isRequired
                        tooltip={t("phone-tooltip")}
                    />
                    <InputField
                        name="contact_info.contact_email"
                        label={t("email")}
                        placeholder={t("email-placeholder")}
                        startIcon={<Mail />}
                        type="email"
                        isRequired
                        tooltip={t("email-tooltip")}
                    />
                </div>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="social-media" className="border-none">
                        <AccordionTrigger className="text-muted-foreground text-base font-medium hover:no-underline py-2">{t("social-media")}</AccordionTrigger>
                        <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                name="contact_info.facebook_url"
                                label={t("facebook")}
                                placeholder={t("facebook-placeholder")}
                                startIcon={<Facebook />}
                                tooltip={t("facebook-tooltip")}
                            />
                            <InputField
                                name="contact_info.instagram_url"
                                label={t("instagram")}
                                placeholder={t("instagram-placeholder")}
                                startIcon={<Instagram />}
                                type="email"
                                tooltip={t("instagram-tooltip")}
                            />
                            <InputField
                                name="contact_info.x_url"
                                label={t("x-twitter")}
                                placeholder={t("x-twitter-placeholder")}
                                startIcon={<Twitter />}
                                type="url"
                                tooltip={t("x-twitter-tooltip")}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </>
    )
}
