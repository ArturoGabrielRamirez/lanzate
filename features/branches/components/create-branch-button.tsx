"use client"

import { CreateBranchButtonProps } from "../types"
import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { Plus } from "lucide-react"
import { branchCreateSchema } from "../schemas/branch-schema"
import { formatErrorResponse } from "@/utils/lib"
import { createBranch } from "../actions/createBranch"
import { useTranslations } from "next-intl"

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
                    {t("button")}
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
            <InputField name="name" label={t("name")} type="text" />
            <InputField name="address" label={t("address")} type="text" />
            <InputField name="phone" label={t("phone")} type="text" />
            <InputField name="email" label={t("email")} type="text" />
        </ButtonWithPopup>
    )
}
export default CreateBranchButton