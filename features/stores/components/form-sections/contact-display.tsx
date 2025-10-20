"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { Phone, Edit as EditIcon, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/features/shadcn/components/ui/tooltip"
import { Form, InputField } from "@/features/layout/components"
import { EditContactButton } from "@/features/stores/components/section-buttons"
import { editContactSchema } from "@/features/stores/schemas/contact-schema"
import { ContactDisplayProps, EditContactData } from "@/features/stores/types"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

function ContactDisplay({ store }: ContactDisplayProps) {
    const t = useTranslations("store.edit-store")
    const [isEditing, setIsEditing] = useState(false)
    const mainBranch = store.branches?.find((branch) => branch.is_main)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    function ToggleEditButton() {
        const { reset } = useFormContext<EditContactData>()

        const initialValues: EditContactData = {
            contact_phone: mainBranch?.phone || "",
            contact_email: mainBranch?.email || "",
        }

        const onClick = () => {
            if (isEditing) {
                reset(initialValues)
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
                        className="opacity-0 group-hover/contact-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar información de contacto
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Card className="group/contact-display">
            <Form submitButton={false} contentButton={false} resolver={yupResolver(editContactSchema as never)}>
                <CardHeader>
                    <CardTitle>
                        <span className="flex items-center gap-2 text-lg md:text-xl">
                            <Phone className="size-5" />
                            {t("contact-section")}
                        </span>
                    </CardTitle>
                    <CardAction>
                        {isEditing && (
                            <EditContactButton
                                store={store}
                                onSuccess={handleCloseEdit}
                            />
                        )}
                        <ToggleEditButton />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <InputField
                                name="contact_phone"
                                label={t("contact-phone")}
                                defaultValue={mainBranch?.phone || ""}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-1">
                            <InputField
                                name="contact_email"
                                label="Email"
                                type="email"
                                defaultValue={mainBranch?.email || ""}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export { ContactDisplay }
