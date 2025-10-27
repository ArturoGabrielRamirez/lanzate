"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { MessageCircle, Edit as EditIcon, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { EditSocialMediaButton } from "@/features/stores/components/section-buttons"
import { editSocialMediaSchema } from "@/features/stores/schemas/social-media-schema"
import { EditSocialMediaData, SocialMediaDisplayProps } from "@/features/stores/types"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Form } from "@/features/global/components/form/form"
import { InputField } from "@/features/global/components/form/input-field"

function SocialMediaDisplay({ store }: SocialMediaDisplayProps) {
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
        const { reset } = useFormContext<EditSocialMediaData>()

        const initialValues: EditSocialMediaData = {
            facebook_url: mainBranch?.facebook_url || "",
            instagram_url: mainBranch?.instagram_url || "",
            x_url: mainBranch?.x_url || "",
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
                        className="opacity-0 group-hover/social-media-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar información de redes sociales
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Card className="group/social-media-display">
            <Form submitButton={false} contentButton={false} resolver={yupResolver(editSocialMediaSchema as never)}>
                <CardHeader>
                    <CardTitle>
                        <span className="flex items-center gap-2 text-lg md:text-xl">
                            <MessageCircle className="size-5" />
                            {t("social-media-section")}
                        </span>
                    </CardTitle>
                    <CardAction>
                        {isEditing && (
                            <EditSocialMediaButton
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
                                name="facebook_url"
                                label={t("facebook-url")}
                                defaultValue={mainBranch?.facebook_url || ""}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-1">
                            <InputField
                                name="instagram_url"
                                label={t("instagram-url")}
                                defaultValue={mainBranch?.instagram_url || ""}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-1">
                            <InputField
                                name="x_url"
                                label={t("x-url")}
                                defaultValue={mainBranch?.x_url || ""}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export { SocialMediaDisplay }
