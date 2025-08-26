"use client"
import { yupResolver } from "@hookform/resolvers/yup"
import { useState } from "react"
import { Resolver, FieldValues } from "react-hook-form"
import { ButtonWithPopupPropsType } from "@/features/layout/types"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form } from "@/features/layout/components"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

function ButtonWithPopup<T, P extends FieldValues>({
  text,
  children,
  title = "Popup title",
  description = "Popup description",
  action,
  messages,
  disabled = false,
  schema,
  onComplete,
  variant = "default",
  className,
  size = "default",
  formDisabled = false,
  contentButton,
  onlyIcon,
}: ButtonWithPopupPropsType<T, P>) {
  const [open, setOpen] = useState(false)
  
  const handleSuccess = async () => {
    setOpen(false)
    if (onComplete && typeof onComplete === "function") {
      onComplete()
    }
  }
  
  const resolver = schema ? yupResolver(schema) as Resolver<P> : undefined
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full">
          {onlyIcon ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  disabled={disabled}
                  type="button"
                  className={cn(disabled && "cursor-not-allowed text-muted-foreground", className)}
                  icon={() => text}
                />
              </TooltipTrigger>
              <TooltipContent>{title}</TooltipContent>
            </Tooltip>
          ) : (
            <Button disabled={disabled} variant={variant} type="button" className={cn(className)} size={size}>
              {text}
            </Button>
          )}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form<P>
          resolver={resolver}
          formAction={action}
          contentButton={contentButton || text}
          successMessage={messages.success}
          loadingMessage={messages.loading}
          onSuccess={handleSuccess}
          disabled={formDisabled}
        >
          {children}
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ButtonWithPopup