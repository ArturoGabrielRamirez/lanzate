"use client"

import { useState } from "react"
import { FieldValues } from "react-hook-form"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form } from "@/features/layout/components"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { yupResolverFlexible } from "@/features/employees/types/yup-resolver-flexible"
import { ButtonWithPopupPropsType } from "@/features/layout/types"

function ButtonWithPopup<P extends FieldValues>({
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
}: ButtonWithPopupPropsType<P>) {
  const [open, setOpen] = useState(false)

  const handleSuccess = async () => {
    setOpen(false)
    if (onComplete) onComplete()
  }

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
          resolver={yupResolverFlexible<P>(schema as never)}
          formAction={action as (formData: P) => Promise<{ error: boolean; message: string; payload: unknown }>}
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
