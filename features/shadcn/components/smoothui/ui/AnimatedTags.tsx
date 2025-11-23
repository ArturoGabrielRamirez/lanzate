"use client"

import { CircleX, Plus } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

export interface AnimatedTagsProps {
  initialTags?: string[]
  selectedTags?: string[]
  onChange?: (selected: string[]) => void
  className?: string
  title?: string
  emptyMessage?: string
  isRequired?: boolean
}

export default function AnimatedTags({
  initialTags = ["react", "tailwindcss", "javascript"],
  selectedTags: controlledSelectedTags,
  onChange,
  className = "",
  title = "Dias de atencion",
  isRequired = false,
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
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex flex-col items-start justify-center gap-1">
        <p className="text-sm font-medium flex items-center gap-1">
          {title}
          {isRequired && <span className="text-red-500">*</span>}
        </p>
        <AnimatePresence>
          {/* {selectedTag.length > 0 && ( */}
            <motion.div className="bg-background min-h-10 flex w-full flex-wrap items-center gap-1 rounded-md border border-muted-foreground/50 p-1.5"
              initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
              animate={{
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
              }}
              exit={{ y: 20, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.3, bounce: 0, type: "spring" }}
            >
              {selectedTag && selectedTag.length === 0 && (
                <p className="text-muted-foreground text-sm">No hay dias seleccionados</p>
              )}
              {selectedTag?.map((tag) => (
                <motion.div
                  key={tag}
                  layout
                  className="group bg-primary text-primary-foreground group-hover:bg-primary group-hover:text-foreground flex cursor-pointer flex-row items-center justify-center gap-2 rounded-full border px-2 py-1 text-xs"
                  onClick={() => handleDeleteTag(tag)}

                >
                  {tag}{" "}
                  <CircleX
                    size={16}
                    className="flex items-center justify-center rounded-full transition-all duration-300 ease-in-out"
                  />
                </motion.div>
              ))}
            </motion.div>
          {/* )} */}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        <div className="flex flex-wrap items-center gap-1">
          {tags.map((tag, index) => (
            <motion.div
              layout
              key={index}
              className="group bg-background text-foreground flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md border px-2 py-1 text-sm"
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
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}
