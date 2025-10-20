'use client'
import { Button } from '@/features/shadcn/components/ui/button'
import { Progress } from '@/features/shadcn/components/ui/progress'
import { X, Check, FileImage } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UploadProgressProps } from '../types'

export function UploadProgress({
  progress,
  isUploading,
  fileName,
  fileSize,
  onCancel,
  success = false,
  className
}: UploadProgressProps) {
  const isComplete = progress >= 100 && !isUploading

  return (
    <div className={cn("border rounded-lg p-4 bg-muted/50", className)}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {isComplete && success ? (
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600" />
            </div>
          ) : (
            <FileImage className="w-8 h-8 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="truncate">
              {fileName && (
                <p className="text-sm font-medium truncate">{fileName}</p>
              )}
              {fileSize && (
                <p className="text-xs text-muted-foreground">{fileSize}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {isComplete && success ? 'Completado' : `${Math.round(progress)}%`}
              </span>

              {isUploading && onCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          <Progress
            value={progress}
            className={cn(
              "h-2",
              isComplete && success && "transition-all duration-500"
            )}
          />

          {isUploading && (
            <p className="text-xs text-muted-foreground mt-1">
              Optimizando y subiendo imagen...
            </p>
          )}

          {isComplete && success && (
            <p className="text-xs text-green-600 mt-1">
              Imagen subida exitosamente en formato optimizado
            </p>
          )}
        </div>
      </div>
    </div>
  )
}