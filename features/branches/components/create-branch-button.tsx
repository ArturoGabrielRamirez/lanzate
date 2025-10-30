"use client"

import { Phone, Plus, User } from "lucide-react"
import { useTranslations } from "next-intl"

import { createBranchAction } from "@/features/branches/actions"
import { AccordionTriggerWithValidation } from "@/features/branches/components"
import { branchCreateSchema } from "@/features/branches/schemas"
import { CreateBranchButtonProps } from "@/features/branches/types"
import { ButtonWithPopup } from "@/features/global/components/button-with-popup"
import InputField from "@/features/global/components/form/input"
import { formatErrorResponse } from "@/features/global/utils"
import { Accordion, AccordionContent, AccordionItem } from "@/features/shadcn/components/ui/accordion"


function CreateBranchButton({ storeId, userId }: CreateBranchButtonProps) {

    const t = useTranslations("store.create-branch")

    const handleCreateProduct = async (payload: {
        name: string,
        address: string,
        email: string,
        phone: string
    }) => {
        try {

            const { hasError, message, payload: branch } = await createBranchAction({ payload, storeId, userId })
            if (hasError) throw new Error(message)
            return {
                error: false,
                message: t("messages.success"),
                payload: branch
            }
        } catch (error) {
            return formatErrorResponse(t("messages.error"))
        }
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Plus />
                    <span className="hidden md:block">{t("button")}</span>
                </>
            )}
            schema={branchCreateSchema}
            title={t("title")}
            description={t("description")}
            action={handleCreateProduct}
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
        >
            <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTriggerWithValidation keys={["name"]}>
                        <span className="flex items-center gap-2">
                            <User className="size-4" />
                            {t("basic-info")}
                        </span>
                    </AccordionTriggerWithValidation>
                    <AccordionContent className="space-y-4">
                        <InputField name="name" label={t("name")} type="text" />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTriggerWithValidation keys={["address", "phone", "email"]}>
                        <span className="flex items-center gap-2">
                            <Phone className="size-4" />
                            {t("contact-info")}
                        </span>
                    </AccordionTriggerWithValidation>
                    <AccordionContent className="space-y-4">
                        <InputField name="address" label={t("address")} type="text" />
                        <InputField name="phone" label={t("phone")} type="text" />
                        <InputField name="email" label={t("email")} type="text" />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </ButtonWithPopup>
    )
}
export default CreateBranchButton