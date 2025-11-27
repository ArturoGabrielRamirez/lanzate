"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { Store } from "@prisma/client"
import { CheckIcon, Loader2 } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

import { Form } from "@/features/global/components/form/form"
import { Button } from "@/features/shadcn/components/button"
import { updateStoreBasicInfoAction } from "@/features/stores/actions/update-store-basics.action"
import { BasicInfoFormPanel } from "@/features/stores/components/create-form/basic-info-form-panel"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { basicInfoSchemaNew, BasicInfoFormType } from "@/features/stores/schemas"

type BasicInfoClientWrapperProps = {
    data: Pick<Store, "logo" | "slug" | "subdomain" | "name" | "description"> & { _count: { products: number } } | null
    slug?: string | null
}

export function BasicInfoFormWrapper({ data, slug }: BasicInfoClientWrapperProps) {

    const [isEditing, setIsEditing] = useState(false)
    const [transition, startTransition] = useTransition()
    const { values } = useCreateStoreContext()

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = () => {

        if (!slug) {
            toast.error("No se puede guardar la información básica sin un slug")
            return
        }

        toast.loading("Guardando información básica...")

        startTransition(async () => {

            const { hasError, message } = await updateStoreBasicInfoAction(slug, values)

            toast.dismiss()

            if (hasError) {
                toast.error(message)
            } else {
                toast.success(message)
                setIsEditing(false)
            }

        })
    }

    const handleCancel = () => {
        setIsEditing(false)
    }

    return (
        <Form<BasicInfoFormType>
            contentButton="Guardar"
            resolver={yupResolver(basicInfoSchemaNew as never)}
            submitButtonClassName="self-end w-fit"
            submitButton={false}
            disabled={!isEditing}
            formAction={async () => {
                return {
                    hasError: false,
                    message: "Información básica actualizada con éxito!",
                    payload: null
                }
            }}
        >
            <BasicInfoClientWrapper data={data} />
            <div className="flex justify-end gap-2">
                {!isEditing && (
                    <Button variant={"outline"} onClick={handleEdit} type="button">Editar</Button>
                )}
                {isEditing && (
                    <Button onClick={handleCancel} variant="destructive" type="button">Cancelar</Button>
                )}
                {isEditing && (
                    <Button onClick={handleSave} type="button" disabled={transition}>
                        {transition ? <Loader2 className="size-4 animate-spin" /> : <CheckIcon className="size-4" />}
                        {transition ? "Guardando..." : "Guardar"}
                    </Button>
                )}
            </div>
        </Form>
    )
}

export function BasicInfoClientWrapper({ data }: BasicInfoClientWrapperProps) {

    const { setValues, values } = useCreateStoreContext()
    const { setValue } = useFormContext()

    useEffect(() => {
        if (data) {
            setValues({
                ...values,
                basic_info: {
                    name: data.name,
                    subdomain: data.subdomain,
                    description: data.description || "",
                    logo: data.logo || null
                }
            })

            setValue("basic_info.name", data.name)
            setValue("basic_info.subdomain", data.subdomain)
            setValue("basic_info.description", data.description || "")
            setValue("basic_info.logo", data.logo || null)
        }
    }, [])

    return (
        <BasicInfoFormPanel />
    )
}

