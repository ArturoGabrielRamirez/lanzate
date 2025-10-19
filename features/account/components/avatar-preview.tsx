import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarPreviewProps } from "../types"

export function AvatarPreview({ previewUrl, getDefaultAvatar }: AvatarPreviewProps) {
  return (
    <div className="flex justify-center">
      <Avatar className="h-32 w-32 border-2 border-primary bg-chart-4">
        <AvatarImage
          src={previewUrl || undefined}
          alt="Preview avatar"
        />
        <AvatarFallback>
          <img
            src={getDefaultAvatar()}
            alt="Default avatar"
            className="h-full w-full"
          />
        </AvatarFallback>
      </Avatar>
    </div>
  )
}