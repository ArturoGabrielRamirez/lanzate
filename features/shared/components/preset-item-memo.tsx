/* import { memo } from "react"
import { PresetOption } from "../types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const PresetItem = memo(({
  option,
  type,
  isLoading,
  onSelect
}: {
  option: PresetOption
  type: "avatar" | "banner"
  isLoading: boolean
  onSelect: (url: string) => void
}) => {
  return (
    <button
      className={`relative rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors group disabled:opacity-50 disabled:cursor-not-allowed ${type === 'avatar' ? 'aspect-square' : 'aspect-[2/1]'
        }`}
      onClick={() => onSelect(option.url)}
      disabled={isLoading}
    >
      {type === "avatar" ? (
        <Avatar className="w-full h-full">
          <AvatarImage
            src={option.url}
            alt={option.name}
            loading="lazy"
          />
          <AvatarFallback className="text-xs">
            {option.icon || option.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <img
          src={option.url}
          alt={option.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
        {option.name}
      </div>
    </button>
  )
})

PresetItem.displayName = 'PresetItem' */