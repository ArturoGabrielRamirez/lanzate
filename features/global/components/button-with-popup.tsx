"use client"

import { useState, useRef } from "react"
import { FieldValues, DefaultValues } from "react-hook-form"
import { useHotkeys } from 'react-hotkeys-hook'
import { ObjectSchema } from "yup"

import { yupResolverFlexible } from "@/features/employees/types/yup-resolver-flexible"
import { Form } from "@/features/global/components/form/form"
import { ServerResponse } from "@/features/global/types"
import { ButtonWithPopupPropsType } from "@/features/global/types/button-with-popup-type"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Button } from "@/features/shadcn/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shadcn/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { cn } from "@/lib/utils"

import type { ComponentType, ReactNode } from "react"

function EmptyIcon({ className }: { className?: string }) {
  if (className) {
  }
  return null;
}

function ButtonWithPopup<P extends FieldValues>({
  text,
  children,
  title,
  description,
  action,
  messages,
  disabled = false,
  schema,
  onComplete,
  variant = "default",
  className: _className,
  size = "default",
  formDisabled = false,
  contentButton,
  onlyIcon,
  defaultValues,
  'data-action': dataAction,
}: ButtonWithPopupPropsType<P>) {

  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dialogRef = useRef(null);

  useHotkeys('ctrl+s, cmd+s, enter', (e) => {
    e.preventDefault();

    const submitButton = dialogRef.current
      ? (dialogRef.current as HTMLElement).querySelector('button[type="submit"]') as HTMLButtonElement
      : null;

    if (open && !isSubmitting && submitButton && !submitButton.disabled) {
      submitButton.click();
    }

  }, {
    enabled: open,
    enableOnFormTags: true,
  },
    [open, isSubmitting]);

  const handleSuccess = async () => {
    setOpen(false)
    if (onComplete) onComplete()
  }

  let FinalIconComponent: ComponentType<{ className?: string }>;
  const buttonContent = typeof text === 'string' ? text : null;

  if (typeof text === 'string' || text === null || text === undefined) {
    FinalIconComponent = EmptyIcon;
  } else {
    const IconWrapper: ComponentType<{ className?: string }> = ({ className }) => {
      if (className) { }
      return text as ReactNode as React.ReactElement;
    };

    FinalIconComponent = IconWrapper;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full">
          {onlyIcon ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  data-action={dataAction}
                  disabled={disabled}
                  type="button"
                  className={cn(disabled && "cursor-not-allowed text-muted-foreground", _className)}
                  icon={FinalIconComponent}
                >
                  {buttonContent}
                </IconButton>
              </TooltipTrigger>
              <TooltipContent>{title}</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              data-action={dataAction}
              disabled={disabled}
              variant={variant}
              type="button"
              className={cn(_className)}
              size={size}
            >
              {text}
            </Button>
          )}
        </div>
      </DialogTrigger>

      <DialogContent ref={dialogRef}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form<P>
          resolver={schema ? yupResolverFlexible(schema as ObjectSchema<P>) : undefined}
          formAction={action as (formData: P) => Promise<ServerResponse<unknown>>}
          defaultValues={defaultValues as DefaultValues<P>} 
          contentButton={contentButton || text}
          successMessage={messages.success}
          loadingMessage={messages.loading}
          onSuccess={handleSuccess}
          disabled={formDisabled || isSubmitting}
          onSubmitStart={() => setIsSubmitting(true)}
          onSubmitEnd={() => setIsSubmitting(false)}
        >
          {children}
        </Form>

        {/* Sección visual de ayuda de atajos */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold">⌨️ Atajos de teclado:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <p>• <kbd className="px-1.5 py-0.5 bg-background border rounded">Enter</kbd> Enviar</p>
              <p>• <kbd className="px-1.5 py-0.5 bg-background border rounded">Esc</kbd> Cancelar</p>
              <p className={cn("transition-colors", isSubmitting ? "opacity-50" : "")}>
                • <kbd className="px-1.5 py-0.5 bg-background border rounded">Ctrl+S</kbd> Guardar
                {isSubmitting && <span className="ml-1 text-[10px] text-primary">(Enviando...)</span>}
              </p>
              <p>• <kbd className="px-1.5 py-0.5 bg-background border rounded">Tab</kbd> Siguiente</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ButtonWithPopup }