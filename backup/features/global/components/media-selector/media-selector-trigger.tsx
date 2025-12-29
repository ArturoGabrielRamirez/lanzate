'use client'

import Image from "next/image"
import { forwardRef, Ref } from "react"

import { MediaSelectorTriggerProps } from "@/features/global/types/media"
import { Button } from "@/features/shadcn/components/ui/button"

export const MediaSelectorTrigger = forwardRef<HTMLButtonElement, MediaSelectorTriggerProps>(
  ({ triggerButton, defaultTitle, className = '', ...props }, ref) => {
    if (triggerButton) {
      return (
        <div ref={ref as Ref<HTMLDivElement> | undefined} {...props}>
          {triggerButton}
        </div>
      )
    }


    return (
      <Button ref={ref} variant="outline" className={className} {...props}>
        <Image
          className="w-4 h-4 mr-2"
          src="/default-avatar.png"
          alt={"Icono de " + defaultTitle}
          width={16}
          height={16}
          unoptimized={true}
        /*   fill */
        />
        {defaultTitle}
      </Button>
    )
  }
)

MediaSelectorTrigger.displayName = "MediaSelectorTrigger"