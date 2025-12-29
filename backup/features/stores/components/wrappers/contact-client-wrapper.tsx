"use client"

import { BranchEmail, BranchPhone, BranchSocialMedia } from "@prisma/client"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { ContactFormPanel } from "@/features/stores/components/create-form/contact-form-panel"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"

type ContactClientWrapperProps = {
    data: {
        phones: BranchPhone[]
        emails: BranchEmail[]
        social_media: BranchSocialMedia[]
    }
}

export function ContactClientWrapper({ data }: ContactClientWrapperProps) {

    const { setValues, values } = useCreateStoreContext()
    const { setValue } = useFormContext()

    useEffect(() => {
        if (data) {
            const mappedPhones = data.phones.map(p => ({
                phone: p.number,
                is_primary: p.is_primary
            }))
            const mappedEmails = data.emails.map(e => ({
                email: e.email,
                is_primary: e.is_primary
            }))
            const mappedSocial = data.social_media.map(s => ({
                url: s.url,
                is_primary: s.is_primary
            }))

            setValues({
                ...values,
                contact_info: {
                    phones: mappedPhones,
                    emails: mappedEmails,
                    social_media: mappedSocial
                }
            })

            setValue("contact_info.phones", mappedPhones)
            setValue("contact_info.emails", mappedEmails)
            setValue("contact_info.social_media", mappedSocial)
        }
    }, [])

    return (
        <ContactFormPanel />
    )
}
