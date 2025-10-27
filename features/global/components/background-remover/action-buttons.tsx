import { Loader2, Sparkles } from 'lucide-react'

import { Button } from '@/features/shadcn/components/ui/button'
import { ActionButtonsProps } from '@/features/shared/types'

export function ActionButtons({
    hasProcessedBlob,
    isProcessing,
    isOptimizing,
    canvasInitialized,
    imageFile,
    onClose,
    onRemoveBackground,
    onConfirm
}: ActionButtonsProps) {
    return (
        <div className="flex gap-2 w-full sm:w-auto">
            <Button
                variant="outline"
                onClick={onClose}
                disabled={isProcessing || isOptimizing}
            >
                Cancelar
            </Button>
            {!hasProcessedBlob ? (
                <Button
                    onClick={onRemoveBackground}
                    disabled={isProcessing || !imageFile}
                    className="bg-orange-500 hover:bg-orange-600"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Procesando...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Remover Fondo
                        </>
                    )}
                </Button>
            ) : (
                <Button
                    onClick={onConfirm}
                    disabled={isOptimizing || !canvasInitialized}
                    className="bg-orange-500 hover:bg-orange-600"
                >
                    {isOptimizing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Optimizando...
                        </>
                    ) : (
                        'Usar Esta Imagen'
                    )}
                </Button>
            )}
        </div>
    )
}