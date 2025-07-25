"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

type StepStatus = 'disabled' | 'active' | 'complete'

type DashboardStepCardProps = {
    stepNumber: number
    title: string
    description: string
    icon: LucideIcon
    status: StepStatus
    children?: ReactNode
    footer?: ReactNode
}

function DashboardStepCard({
    stepNumber,
    title,
    description,
    icon: Icon,
    status,
    children,
    footer
}: DashboardStepCardProps) {
    const isActive = status === 'active'
    const isComplete = status === 'complete'
    const isDisabled = status === 'disabled'

    return (
        <Card className={cn(
            "transition-all duration-200",
            isActive && "border-primary/20 shadow-md",
            (isComplete || isDisabled) && "opacity-60 border-muted",
            isDisabled && "cursor-not-allowed"
        )}>
            <CardHeader>
                <div className="grid grid-cols-[100px_1fr] gap-4">
                    <div className={cn(
                        "rounded-md flex items-center justify-center aspect-square",
                        isActive && "bg-primary/10",
                        (isComplete || isDisabled) && "bg-muted"
                    )}>
                        <Icon className={cn(
                            "size-8",
                            isActive && "text-primary",
                            (isComplete || isDisabled) && "text-muted-foreground"
                        )} />
                    </div>
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <ArrowRight className="size-4" />
                            <h2 className="font-normal text-sm">Step {stepNumber}</h2>
                            {isComplete && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    ✓ Complete
                                </span>
                            )}
                            {isActive && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    Available
                                </span>
                            )}
                        </CardTitle>
                        <CardDescription className="font-bold text-2xl text-accent-foreground">
                            {title}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className={cn(
                isActive && "text-muted-foreground/50",
                (isComplete || isDisabled) && "text-muted-foreground/30"
            )}>
                {description}
                {children}
            </CardContent>
            {footer && <CardFooter>{footer}</CardFooter>}
        </Card>
    )
}

export default DashboardStepCard 