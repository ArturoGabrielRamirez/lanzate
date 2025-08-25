"use client"

import { ButtonWithPopup, InputField, CheckboxField } from "@/features/layout/components"
import { MapPin } from "lucide-react"
import { useTranslations } from "next-intl"
import { Store, Branch } from "@prisma/client"
import { editAddressSchema } from "@/features/stores/schemas/address-schema"
import { updateStoreAddress } from "@/features/stores/actions/updateStoreAddress"
import { useState, useEffect } from "react"

interface EditAddressButtonProps {
    store: Store & { branches: Branch[] }
    userId: number
    className?: string
}

const EditAddressButton = ({ store, userId, className }: EditAddressButtonProps) => {
    const t = useTranslations("store.edit-store")

    const [isPhysicalStore, setIsPhysicalStore] = useState(store.is_physical_store || false)

    const handleSubmit = async (payload: { 
        is_physical_store: boolean; 
        address?: string; 
        city?: string; 
        province?: string; 
        country?: string 
    }) => {
        return updateStoreAddress(store.slug, payload, userId)
    }

    useEffect(() => {
        setIsPhysicalStore(store.is_physical_store || false)
    }, [store.is_physical_store])

    const mainBranch = store.branches?.find((branch) => branch.is_main)

    return (
        <ButtonWithPopup
            text={
                <>
                    <MapPin className="size-4" />
                    Edit Address
                </>
            }
            title="Edit Store Address"
            schema={editAddressSchema}
            description="Update your store's address information"
            action={handleSubmit}
            messages={{
                success: "Address information updated successfully!",
                error: "Failed to update address information",
                loading: "Updating address information..."
            }}
            className={className}
        >
            <div className="space-y-4">
                <CheckboxField
                    name="is_physical_store"
                    label={t("is-physical-store")}
                    defaultValue={isPhysicalStore}
                    onChange={(checked) => {
                        setIsPhysicalStore(checked)
                    }}
                />
                <InputField
                    name="address"
                    label={t("address")}
                    type="text"
                    defaultValue={isPhysicalStore ? mainBranch?.address || "" : ""}
                    disabled={!isPhysicalStore}
                />
                <InputField
                    name="city"
                    label={t("city")}
                    type="text"
                    defaultValue={isPhysicalStore ? mainBranch?.city || "" : ""}
                    disabled={!isPhysicalStore}
                />
                <InputField
                    name="province"
                    label={t("province")}
                    type="text"
                    defaultValue={isPhysicalStore ? mainBranch?.province || "" : ""}
                    disabled={!isPhysicalStore}
                />
                <InputField
                    name="country"
                    label={t("country")}
                    type="text"
                    defaultValue={isPhysicalStore ? mainBranch?.country || "" : ""}
                    disabled={!isPhysicalStore}
                />
            </div>
        </ButtonWithPopup>
    )
}

export default EditAddressButton
