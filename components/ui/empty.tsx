import * as React from "react"
import { cn } from "@/lib/utils"

const Empty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-center text-center p-8",
      className
    )}
    {...props}
  />
))
Empty.displayName = "Empty"

const EmptyIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
EmptyIcon.displayName = "EmptyIcon"

const EmptyTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold tracking-tight",
      className
    )}
    {...props}
  />
))
EmptyTitle.displayName = "EmptyTitle"

const EmptyDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "mt-3 text-sm text-muted-foreground max-w-md",
      className
    )}
    {...props}
  />
))
EmptyDescription.displayName = "EmptyDescription"

const EmptyActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-6 flex flex-col gap-2 sm:flex-row",
      className
    )}
    {...props}
  />
))
EmptyActions.displayName = "EmptyActions"

export { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions }

