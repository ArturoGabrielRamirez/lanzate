'use client'

import { Upload, Camera } from 'lucide-react'

import { UploadTabProps } from '@/features/global/types/media'
import { Button } from '@/features/shadcn/components/ui/button'

export function UploadTab({
    mediaUpload,
    isActionDisabled,
    uploadLimitReached
}: UploadTabProps) {
    return (
        <div className="space-y-3">
            <Button
                variant="outline"
                className="w-full justify-start h-auto p-3"
                onClick={mediaUpload.openFileSelector}
                disabled={isActionDisabled || uploadLimitReached}
            >
                <Upload className="w-5 h-5 mr-3 flex-shrink-0" />
                <div className="text-left flex-1">
                    <div className="font-medium text-sm">Seleccionar Archivo</div>
                    <div className="text-xs text-muted-foreground">Desde tu dispositivo</div>
                </div>
            </Button>

            <Button
                variant="outline"
                className="w-full justify-start h-auto p-3"
                onClick={mediaUpload.openCamera}
                disabled={isActionDisabled || uploadLimitReached}
            >
                <Camera className="w-5 h-5 mr-3 flex-shrink-0" />
                <div className="text-left flex-1">
                    <div className="font-medium text-sm">Tomar Foto</div>
                    <div className="text-xs text-muted-foreground">Usar cámara</div>
                </div>
            </Button>
        </div>
    )
}