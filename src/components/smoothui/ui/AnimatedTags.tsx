"use client"

import { useState } from "react"
import { CircleX, Plus } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export interface AnimatedTagsProps {
  initialTags?: string[]
  selectedTags?: string[]
  onChange?: (selected: string[]) => void
  className?: string
  title?: string
  emptyMessage?: string
  hasTooltip?: boolean
  tooltipMessage?: string
  /**
   * Optional: return Tailwind classes to style a selected tag chip based on its label
   */
  getSelectedTagClass?: (tag: string) => string
  /**
   * Optional: return Tailwind classes to style an available tag chip based on its label
   */
  getAvailableTagClass?: (tag: string) => string
}

export default function AnimatedTags({
  initialTags = ["react", "tailwindcss", "javascript"],
  selectedTags: controlledSelectedTags,
  onChange,
  className = "",
  title = "Dias de atencion",
  emptyMessage = "No hay dias de atencion seleccionados",
  hasTooltip = false,
  tooltipMessage = "Haz click para agregar o quitar",
  getSelectedTagClass,
  getAvailableTagClass
}: AnimatedTagsProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>([])
  /* const [internalTags, setInternalTags] = useState<string[]>(initialTags) */

  const selectedTag = controlledSelectedTags ?? internalSelected
  const tags = initialTags.filter((tag) => !selectedTag.includes(tag))

  const handleTagClick = (tag: string) => {
    const newSelected = [...selectedTag, tag]
    if (onChange) {
      onChange(newSelected)
    } else {
      setInternalSelected(newSelected)
    }
  }
  const handleDeleteTag = (tag: string) => {
    const newSelectedTag = selectedTag.filter((selected) => selected !== tag)
    if (onChange) {
      onChange(newSelectedTag)
    } else {
      setInternalSelected(newSelectedTag)
    }
  }
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-col items-start justify-center gap-1">
        <p className="text-sm font-medium">{title}</p>
        <AnimatePresence>
          <div className={cn("bg-background flex min-h-10 w-full flex-wrap items-center gap-1 rounded-md border p-2", selectedTag.length === 0 && "border-dashed text-center")}>
            {selectedTag?.map((tag) => (
              hasTooltip ? (
                <Tooltip key={tag}>
                  <TooltipTrigger asChild>
                    <motion.div
                      layout
                      className={cn(
                        "group flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md border px-2 py-1",
                        getSelectedTagClass ? getSelectedTagClass(tag) : "bg-primary text-primary-foreground"
                      )}
                      onClick={() => handleDeleteTag(tag)}
                      initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                      }}
                      exit={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                      transition={{ duration: 0.3, bounce: 0, type: "spring" }}
                    >
                      {tag}{" "}
                      <CircleX
                        size={16}
                        className="flex items-center justify-center rounded-full transition-all duration-300 ease-in-out"
                      />
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>{tooltipMessage}</TooltipContent>
                </Tooltip>
              ) : (
                <motion.div
                  key={tag}
                  layout
                  className={cn(
                    "group flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md border px-2 py-1",
                    getSelectedTagClass ? getSelectedTagClass(tag) : "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleDeleteTag(tag)}
                  initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                  }}
                  exit={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, bounce: 0, type: "spring" }}
                >
                  {tag}{" "}
                  <CircleX
                    size={16}
                    className="flex items-center justify-center rounded-full transition-all duration-300 ease-in-out"
                  />
                </motion.div>
              )
            ))}
            {selectedTag.length === 0 && (
              <p className="text-sm text-muted-foreground">{emptyMessage}</p>
            )}
          </div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        <div className="flex flex-wrap items-center gap-1">
          {tags.map((tag, index) => (
            hasTooltip ? (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <motion.div
                    layout
                    className={cn(
                      "group flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md border px-2 py-1 text-sm",
                      getAvailableTagClass ? getAvailableTagClass(tag) : "bg-background text-primary-foreground"
                    )}
                    onClick={() => handleTagClick(tag)}
                    initial={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      filter: "blur(0px)",
                    }}
                    exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, bounce: 0, type: "spring" }}
                  >
                    {tag}{" "}
                    <Plus
                      size={16}
                      className="hover:bg-primary group-hover:text-foreground flex items-center justify-center rounded-full transition-all duration-300 ease-in-out"
                    />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>{tooltipMessage}</TooltipContent>
              </Tooltip>
            ) : (
              <motion.div
                layout
                key={index}
                className={cn(
                  "group flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md border px-2 py-1 text-sm",
                  getAvailableTagClass ? getAvailableTagClass(tag) : "bg-background text-primary-foreground"
                )}
                onClick={() => handleTagClick(tag)}
                initial={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                animate={{
                  y: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.3, bounce: 0, type: "spring" }}
              >
                {tag}{" "}
                <Plus
                  size={16}
                  className="hover:bg-primary group-hover:text-foreground flex items-center justify-center rounded-full transition-all duration-300 ease-in-out"
                />
              </motion.div>
            )
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}
