import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarPreviewProps } from "../types"

export default function AvatarPreview({ previewUrl, getDefaultAvatar }: AvatarPreviewProps) {
  return (
    <div className="flex justify-center">
      <Avatar className="h-24 w-24">
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