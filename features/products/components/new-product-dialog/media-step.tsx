import { useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { FormValues } from "./validation-schemas"
import * as motion from "motion/react-client"
import { Form } from "@/components/ui/form"


function MediaStep() {
    const { form } = useMultiStepForm<FormValues>()

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
        >
            <Form {...form}>
                Media
            </Form>
        </motion.div>
    )
}

export default MediaStep