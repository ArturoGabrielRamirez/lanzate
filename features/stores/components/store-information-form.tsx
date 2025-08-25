"use client"

import { Store, StoreOperationalSettings, Branch } from "@prisma/client"
import { Accordion } from "@/components/ui/accordion"
import { Form } from "@/features/layout/components"
import { Button } from "@/components/ui/button"
import { FieldValues } from "react-hook-form"
import {
    BasicInfoDisplay,
    AddressDisplay,
    ContactDisplay,
    SocialMediaDisplay
} from "./form-sections"

interface StoreInformationFormProps {
    store: Store & {
        operational_settings: StoreOperationalSettings | null
        branches: Branch[]
    }
    canManageStore?: boolean
    children?: React.ReactNode
    userId: number
}

const StoreInformationForm = ({
    store,
    canManageStore = false,
    children,
    userId
}: StoreInformationFormProps) => {

    const handleSubmit = async (formData: FieldValues) => {
        return { message: "Store information updated successfully", error: false, payload: formData }
    }

    return (
        <Form
            contentButton={<Button>Guardar</Button>}
            formAction={handleSubmit}
            submitButton={false}
        >
            <Accordion type="single" collapsible defaultValue="item-1">
                <BasicInfoDisplay
                    store={store}
                    userId={userId}
                />
                <AddressDisplay
                    store={store}
                    userId={userId}
                />
                <ContactDisplay store={store} />
                <SocialMediaDisplay
                    store={store}
                />
            </Accordion>

            {canManageStore && children}

        </Form>
    )
}

export default StoreInformationForm
