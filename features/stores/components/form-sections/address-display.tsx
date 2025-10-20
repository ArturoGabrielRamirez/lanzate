"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { MapPin, Edit as EditIcon, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { Form, InputField, CheckboxField } from "@/features/layout/components"
import { EditAddressButton } from "@/features/stores/components/section-buttons"
import { editAddressSchema } from "@/features/stores/schemas/address-schema"
import { AddressDisplayProps, AddressFormValues } from "@/features/stores/types"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

function AddressDisplay({ store, userId }: AddressDisplayProps) {
    
    const t = useTranslations("store.edit-store")
    const mainBranch = store.branches?.find((branch) => branch.is_main)
    const [isEditing, setIsEditing] = useState(false)
    const [isPhysicalStore, setIsPhysicalStore] = useState(store.is_physical_store || false)

    useEffect(() => {
        setIsPhysicalStore(store.is_physical_store || false)
    }, [store.is_physical_store])

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    function ToggleEditButton() {
        const { reset } = useFormContext<AddressFormValues>()

        const initialValues = {
            /* is_physical_store: store.is_physical_store, */
            address: mainBranch?.address || "",
            city: mainBranch?.city || "",
            province: mainBranch?.province || "",
            country: mainBranch?.country || "",
        }

        const onClick = () => {
            if (isEditing) {
                reset(initialValues)
                /* setIsPhysicalStore(initialValues.is_physical_store) */
                handleCloseEdit()
                return
            }
            handleOpenEdit()
        }

        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <IconButton
                        icon={isEditing ? X : EditIcon}
                        onClick={onClick}
                        className="opacity-0 group-hover/address-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar información de dirección
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Card className="group/address-display">
            <Form submitButton={false} contentButton={false} resolver={yupResolver(editAddressSchema as never)}>
                <CardHeader>
                    <CardTitle>
                        <span className="flex items-center gap-2 text-lg md:text-xl">
                            <MapPin className="size-5" />
                            {t("address-section")}
                        </span>
                    </CardTitle>
                    <CardAction>
                        {isEditing && (
                            <EditAddressButton
                                store={store}
                                userId={userId}
                                onSuccess={handleCloseEdit}
                            />
                        )}
                        <ToggleEditButton />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="space-y-1 md:col-span-2">
                            <CheckboxField
                                name="is_physical_store"
                                label={t("is-physical-store")}
                                defaultValue={isPhysicalStore}
                                onChange={(checked) => setIsPhysicalStore(checked)}
                                disabled={!isEditing}
                            />
                        </div>
                        {isPhysicalStore && (
                            <>
                                <div className="space-y-1">
                                    <InputField
                                        name="address"
                                        label={t("address")}
                                        defaultValue={mainBranch?.address || ""}
                                        disabled={!isEditing || !isPhysicalStore}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <InputField
                                        name="city"
                                        label={t("city")}
                                        defaultValue={mainBranch?.city || ""}
                                        disabled={!isEditing || !isPhysicalStore}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <InputField
                                        name="province"
                                        label={t("province")}
                                        defaultValue={mainBranch?.province || ""}
                                        disabled={!isEditing || !isPhysicalStore}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <InputField
                                        name="country"
                                        label={t("country")}
                                        defaultValue={mainBranch?.country || ""}
                                        disabled={!isEditing || !isPhysicalStore}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export { AddressDisplay }
