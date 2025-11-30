"use client"

import { XIcon } from "lucide-react"
import * as React from "react"

import { Badge } from "@/features/shadcn/components/ui/badge"
import { Button } from "@/features/shadcn/components/ui/button"
import { cn } from "@/lib/utils"

type InputTagsProps = Omit<
    React.ComponentProps<"input">,
    "value" | "onChange"
> & {
    value: string[]
    onChange: React.Dispatch<React.SetStateAction<string[]>>
    badgeVariant?: React.ComponentProps<typeof Badge>["variant"]
}

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
    ({ className, value, onChange, badgeVariant = 'secondary', ...props }, ref) => {
        const [pendingDataPoint, setPendingDataPoint] = React.useState("")

        React.useEffect(() => {
            if (/[;,]/.test(pendingDataPoint)) {
                const newDataPoints = new Set([
                    ...value,
                    ...pendingDataPoint.split(/[;,]/).map((chunk) => chunk.trim()),
                ])
                onChange(Array.from(newDataPoints))
                setPendingDataPoint("")
            }
        }, [pendingDataPoint, onChange, value])

        const addPendingDataPoint = () => {
            if (pendingDataPoint) {
                const newDataPoints = new Set([...value, pendingDataPoint])
                onChange(Array.from(newDataPoints))
                setPendingDataPoint("")
            }
        }

        return (
            <div
                className={cn(
                    "border-input dark:bg-input/30 flex min-h-10 w-full truncate gap-2 rounded-md border bg-transparent px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 overflow-x-auto",
                    className
                )}
            >
                {value.map((item) => (
                    <Badge key={item} variant={badgeVariant}>
                        <span className="block max-w-xs truncate break-words">{item}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 size-4 p-0"
                            onClick={() => {
                                onChange(value.filter((i) => i !== item))
                            }}
                        >
                            <XIcon />
                        </Button>
                    </Badge>
                ))}
                <input
                    className="placeholder:text-muted-foreground flex-1 outline-none"
                    value={pendingDataPoint}
                    onChange={(e) => setPendingDataPoint(e.target.value)}
                    onKeyDown={(e) => {
                        if (["Enter", ",", ";"].includes(e.key) || (e.key === "Tab" && pendingDataPoint)) {
                            e.preventDefault()
                            addPendingDataPoint()
                        } else if (
                            e.key === "Backspace" &&
                            pendingDataPoint.length === 0 &&
                            value.length > 0
                        ) {
                            e.preventDefault()
                            onChange(value.slice(0, -1))
                        }
                    }}
                    {...props}
                    ref={ref}
                />
            </div>
        )
    }
)

InputTags.displayName = "InputTags"

export { InputTags }