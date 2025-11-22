"use client"

import { Pencil } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { editBranchAction } from "@/features/branches/actions"
import { branchUpdatePayloadSchema/* , branchUpdateSchema */ } from "@/features/branches/schemas"
import { EditBranchButtonProps } from "@/features/branches/types"
import { ButtonWithPopup } from "@/features/global/components/button-with-popup"
import InputField from "@/features/global/components/form/input"
/* import { Checkbox } from "@/features/shadcn/components/ui/checkbox" */
import { Label } from "@/features/shadcn/components/ui/label"
import { Textarea } from "@/features/shadcn/components/ui/textarea"

function EditBranchButton({ branch, slug, onComplete, userId }: EditBranchButtonProps) {

    const [isMain,/*  setIsMain */] = useState(branch.is_main)
    const t = useTranslations("store.edit-branch")

    const handleEditBranch = async (payload: {
        branchId: number
        data: {
            name: string
            description?: string,
            address: string
            email: string
            phone: string
            is_main: boolean
        }
        slug: string
        userId: number
    }) => {
        const data = {
            ...payload,
            is_main: isMain
        }

        return editBranchAction({ branchId: branch.id, data: data.data, slug, userId })
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Pencil className="text-muted-foreground size-4" />
                    {t("button")}
                </>
            )}
            title={t("title")}
            schema={branchUpdatePayloadSchema}
            description={t("description-popup")}
            action={handleEditBranch}
            onComplete={onComplete}
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
            className="bg-transparent w-full justify-start"
        >
            <InputField
                name="name"
                label={t("name")}
                type="text"
                defaultValue={branch.name || ""}
            />

            <div className="space-y-2">
                <Label htmlFor="description">{t("description")}</Label>
                <Textarea
                    name="description"
                    placeholder={t("description-placeholder")}
                    defaultValue={branch.description || ""}
                />
            </div>

            <InputField
                name="address"
                label={t("address")}
                type="text"
                defaultValue={branch.address || ""}
            />

            <InputField
                name="phone"
                label={t("phone")}
                type="text"
                defaultValue={branch.phone || ""}
            />

            <InputField
                name="email"
                label={t("email")}
                type="email"
                defaultValue={branch.email || ""}
            />

            <div className="flex items-center space-x-2">
                {/* <Checkbox
                    id="is_main"
                    checked={isMain}
                    onCheckedChange={(checked) => setIsMain(checked as boolean)}
                /> */}
                <Label htmlFor="is_main" className="text-sm">
                    {t("set-as-main")}
                </Label>
            </div>
            {isMain && (
                <p className="text-xs text-muted-foreground">
                    {t("main-branch-note")}
                </p>
            )}
        </ButtonWithPopup>
    )
}
export default EditBranchButton 