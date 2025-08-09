import { AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { useFormContext } from "react-hook-form"

type Props = {
    keys: string[]
    children: React.ReactNode
}

const AccordionTriggerWithValidation = ({ keys = [], children }: Props) => {

    const { formState: { errors } } = useFormContext()

    const hasErrors = keys.some(key => errors[key])

    return (
        <AccordionTrigger className={cn(hasErrors && "text-red-500")}>
            <span className="flex items-center gap-2">
                {children}
            </span>
        </AccordionTrigger>
    )
}
export default AccordionTriggerWithValidation