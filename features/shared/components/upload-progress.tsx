import React from 'react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { X, Upload, CheckCircle, AlertCircle } from 'lucide-react'

interface UploadProgressProps {
  progress: number
  isUploading: boolean
  fileName?: string
  fileSize?: string
  onCancel?: () => void
  error?: string | null
  success?: boolean
  className?: string
}

export function UploadProgress({
  progress,
  isUploading,
  fileName,
  fileSize,
  onCancel,
  error,
  success = false,
  className = ""
}: UploadProgressProps) {
  if (!isUploading && progress === 0 && !error && !success) {
    return null
  }

  const getStatusColor = () => {
    if (error) return 'text-destructive'
    if (success || progress === 100) return 'text-green-600'
    return 'text-primary'
  }

  const getProgressColor = () => {
    if (error) return 'bg-destructive'
    if (success || progress === 100) return 'bg-green-600'
    return ''
  }

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-4 h-4 text-destructive" />
    if (success || progress === 100) return <CheckCircle className="w-4 h-4 text-green-600" />
    return <Upload className="w-4 h-4 text-primary animate-pulse" />
  }

  const getStatusText = () => {
    if (error) return 'Error al subir archivo'
    if (success || progress === 100) return 'Archivo subido exitosamente'
    if (isUploading) {
      if (progress < 20) return 'Preparando archivo...'
      if (progress < 60) return 'Subiendo archivo...'
      if (progress < 90) return 'Procesando...'
      return 'Finalizando...'
    }
    return 'Listo para subir'
  }

  return (
    <div className={`space-y-3 p-4 bg-muted/30 rounded-lg border ${className}`}>
      {/* Header con información del archivo */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {fileName || 'Archivo seleccionado'}
            </p>
            {fileSize && (
              <p className="text-xs text-muted-foreground">
                {fileSize}
              </p>
            )}
          </div>
        </div>
        
        {/* Botón de cancelar */}
        {isUploading && onCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-6 w-6 p-0 hover:bg-destructive/10"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Barra de progreso */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        
        <Progress 
          value={progress} 
          className="h-2"
          data-error={error ? 'true' : 'false'}
          style={{
            '--progress-background': error ? 'rgb(239 68 68)' : 
                                   (success || progress === 100) ? 'rgb(34 197 94)' : 
                                   undefined
          } as React.CSSProperties}
        />
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded text-sm text-destructive">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{error}</span>
        </div>
      )}

      {/* Mensaje de éxito */}
      {(success || progress === 100) && !error && (
        <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded text-sm text-green-700 dark:text-green-400">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">Archivo subido correctamente</span>
        </div>
      )}
    </div>
  )
}