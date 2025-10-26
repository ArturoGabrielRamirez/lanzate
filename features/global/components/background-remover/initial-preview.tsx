import Image from 'next/image'

import { Alert, AlertDescription } from '@/features/shadcn/components/ui/alert'
import { InitialPreviewProps } from '@/features/shared/types'

export function InitialPreview({ originalUrl }: InitialPreviewProps) {
    return (
        <div className="space-y-3">
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
                {originalUrl && (
                    <Image
                        src={originalUrl}
                        alt="Original"
                        className="w-full h-full object-contain"
                    />
                )}
            </div>
            <Alert>
                <AlertDescription className="text-sm">
                    💡 <strong>Tip:</strong> Funciona mejor con fotos donde el sujeto está bien definido.
                    El procesamiento puede tomar 10-30 segundos.
                </AlertDescription>
            </Alert>
        </div>
    )
}