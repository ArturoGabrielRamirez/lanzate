"use client"

import { Store, StoreOperationalSettings, Branch } from "@prisma/client"
/* import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card" */
import { Accordion } from "@/components/ui/accordion"
import { Form } from "@/features/layout/components"
import { Button } from "@/components/ui/button"
/* import { Store as StoreIcon } from "lucide-react" */
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
            {/* <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <StoreIcon className="size-5" />
                        Información de la Tienda
                    </CardTitle>
                    <CardDescription>
                        Detalles básicos y contacto de tu tienda
                    </CardDescription>
                </CardHeader>
                <CardContent> */}
                    <Accordion type="single" collapsible defaultValue="item-1">
                        <BasicInfoDisplay
                            store={store}
                            userId={userId}
                        />
                        <AddressDisplay
                            store={store}
                            userId={userId}
                        />
                        <ContactDisplay
                            store={store}
                            userId={userId}
                        />
                        <SocialMediaDisplay
                            store={store}
                            userId={userId}
                        />
                    </Accordion>

                    {canManageStore && children}
                {/* </CardContent>
            </Card> */}
        </Form>
    )
}

export default StoreInformationForm
