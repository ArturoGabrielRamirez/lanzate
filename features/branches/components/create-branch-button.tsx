"use client"

import { Phone, Plus, User } from "lucide-react"
import { useTranslations } from "next-intl"
import { formatErrorResponse } from "@/utils/lib"

import { ButtonWithPopup, InputField } from "@/features/layout/components"

import { CreateBranchButtonProps } from "@/features/branches/types"
import { branchCreateSchema } from "@/features/branches/schemas"
import { createBranch } from "@/features/branches/actions"
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import AccordionTriggerWithValidation from "./accordion-trigger-with-validation"

function CreateBranchButton({ storeId, userId }: CreateBranchButtonProps) {

    const t = useTranslations("store.create-branch")

    const handleCreateProduct = async (payload: any) => {
        try {

            const { error, message, payload: branch } = await createBranch(payload, storeId, userId)
            if (error) throw new Error(message)
            return {
                error: false,
                message: t("messages.success"),
                payload: branch
            }
        } catch (error) {
            return formatErrorResponse(t("messages.error"), error, null)
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