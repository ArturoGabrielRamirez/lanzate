import { ImagePreviewProps } from '@/features/profile/types'
import { formatFileSize } from '@/features/profile/utils/format-file-size'

function ImagePreview({ previewUrl, width, height, size, type }: ImagePreviewProps) {
  return (
    <div className="text-center">
      <div className={`relative inline-block rounded-lg overflow-hidden border ${type === 'avatar' ? 'w-24 h-24' : 'w-48 h-24'
        }`}>
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="mt-2 text-sm text-muted-foreground">
        <p>{width} × {height} px</p>
        <p>{formatFileSize(size)}</p>
      </div>
    </div>
  )
}

export { ImagePreview }