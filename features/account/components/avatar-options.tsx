/* import { Loader2, Check } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { AvatarOptionsProps } from "@/features/account/types"
import { cn } from "@/lib/utils"

export function AvatarOptions({
  isLoading,
  options,
  selectedOption,
  onOptionSelect
}: AvatarOptionsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (options.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <Label>Avatares disponibles</Label>
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => (
          <div
            key={option.id}
            className={cn(
              "relative cursor-pointer rounded-lg border-2 p-2 transition-all hover:bg-accent",
              selectedOption === option.id
                ? "border-primary bg-accent"
                : "border-muted"
            )}
            onClick={() => onOptionSelect(option.id)}
          >
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-12 w-12 bg-chart-4">
                <AvatarImage src={option.url} alt={`${option.provider} avatar`} />
                <AvatarFallback>{option.provider[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="text-xs font-medium">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.provider}</p>
              </div>
              {selectedOption === option.id && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
 */