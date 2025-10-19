'use client'

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { MediaSelectorTriggerProps } from "../types"
import { forwardRef, Ref } from "react"

export const MediaSelectorTrigger = forwardRef<HTMLButtonElement, MediaSelectorTriggerProps>(
  ({ triggerButton, defaultTitle, className = '', ...props }, ref) => {
    // Si hay triggerButton personalizado, clonarlo con las props necesarias
    if (triggerButton) {
      return (
        <div ref={ref as Ref<HTMLDivElement> | undefined} {...props}>
          {triggerButton}
        </div>
      )
    }

    // Botón por defecto
    return (
      <Button ref={ref} variant="outline" className={className} {...props}>
        <Image
          className="w-4 h-4 mr-2"
          src="/default-avatar.png"
          alt={"Icono de " + defaultTitle}
          width={16}
          height={16}
        />
        {defaultTitle}
      </Button>
    )
  }
)

MediaSelectorTrigger.displayName = "MediaSelectorTrigger"