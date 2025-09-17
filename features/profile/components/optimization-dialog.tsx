'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crop, Minimize2, Image, Info, Zap, Check, ImageIcon } from 'lucide-react'

interface OptimizationDialogProps {
    isOpen: boolean
    onDecision: (decision: 'crop' | 'resize' | 'keep') => void
    imageFile: File | null
    onClose: () => void
    type: 'avatar' | 'banner'
    maxWidth?: number
    maxHeight?: number
}

export function OptimizationDialog({
    isOpen,
    onDecision,
    imageFile,
    onClose,
    type,
    maxWidth = 1920,
    maxHeight = 1080
}: OptimizationDialogProps) {
    const [imageInfo, setImageInfo] = useState<{
        width: number
        height: number
        size: number
        previewUrl: string
    } | null>(null)

    useEffect(() => {
        if (isOpen && imageFile) {
            const img = new window.Image()
            const previewUrl = URL.createObjectURL(imageFile)

            img.onload = () => {
                setImageInfo({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    size: imageFile.size,
                    previewUrl
                })
            }

            img.src = previewUrl

            return () => {
                URL.revokeObjectURL(previewUrl)
            }
        } else {
            setImageInfo(null)
        }
    }, [isOpen, imageFile])

    const formatFileSize = (bytes: number) => {
        const mb = bytes / (1024 * 1024)
        return `${mb.toFixed(1)} MB`
    }

    const getRecommendedSize = () => {
        if (type === 'avatar') {
            return { width: 400, height: 400 }
        }
        return { width: Math.min(maxWidth, 1200), height: Math.min(maxHeight, 400) }
    }

    const recommended = getRecommendedSize()
    const isLargeFile = imageInfo && imageInfo.size > 2 * 1024 * 1024 // > 2MB
    const isMuchLarger = imageInfo && (
        imageInfo.width > recommended.width * 2 ||
        imageInfo.height > recommended.height * 2
    )

    if (!isOpen || !imageFile || !imageInfo) {
        return null
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Optimizar Imagen
                    </DialogTitle>
                    <DialogDescription>
                        Tu imagen es más grande que el tamaño recomendado. ¿Cómo te gustaría procesarla?
                        <br />
                        <span className="text-xs text-muted-foreground">También puedes cerrar este diálogo para usar la imagen tal como está.</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Vista previa de la imagen */}
                    <div className="text-center">
                        <div className={`relative inline-block rounded-lg overflow-hidden border ${type === 'avatar' ? 'w-24 h-24' : 'w-48 h-24'
                            }`}>
                            <img
                                src={imageInfo.previewUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                            <p>{imageInfo.width} × {imageInfo.height} px</p>
                            <p>{formatFileSize(imageInfo.size)}</p>
                        </div>
                    </div>

                    {/* Información y recomendación */}
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                                    Tamaño recomendado para {type === 'avatar' ? 'avatar' : 'banner'}
                                </p>
                                <p className="text-blue-700 dark:text-blue-200">
                                    {recommended.width} × {recommended.height} px o menor
                                </p>
                                {isLargeFile && (
                                    <p className="text-blue-700 dark:text-blue-200 mt-1">
                                        Los archivos más pequeños cargan más rápido y mejoran la experiencia del usuario.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Opciones */}
                    <div className="grid gap-4">
                        {/* Opción: Recortar */}
                        <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-2 hover:border-primary/50">
                            <CardContent className="p-4" onClick={() => onDecision('crop')}>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Crop className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold">Recortar manualmente</h3>
                                            <Badge variant="secondary">Recomendado</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Elige exactamente qué parte de la imagen usar. Te dará control total sobre el resultado final.
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Check className="w-3 h-3" />
                                            <span>Mejor calidad</span>
                                            <span>•</span>
                                            <Check className="w-3 h-3" />
                                            <span>Control total</span>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Seleccionar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Opción: Redimensionar automáticamente */}
                        <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-2 hover:border-primary/50">
                            <CardContent className="p-4" onClick={() => onDecision('resize')}>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                                        <Minimize2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold">Redimensionar automáticamente</h3>
                                            <Badge variant="outline">
                                                <Zap className="w-3 h-3 mr-1" />
                                                Rápido
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Reduce el tamaño automáticamente manteniendo las proporciones originales. Proceso instantáneo.
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Check className="w-3 h-3" />
                                            <span>Automático</span>
                                            <span>•</span>
                                            <Check className="w-3 h-3" />
                                            <span>Mantiene proporciones</span>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Seleccionar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Opción: Mantener original (solo si no es excesivamente grande) */}
                        {!isMuchLarger && (
                            <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-2 hover:border-primary/50">
                                <CardContent className="p-4" onClick={() => onDecision('keep')}>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                            <ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold">Mantener tamaño original</h3>
                                                {isLargeFile && (
                                                    <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                                                        Archivo grande
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Usar la imagen tal como está. {isLargeFile ? 'Puede afectar la velocidad de carga.' : 'Buena opción si la calidad es prioritaria.'}
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Check className="w-3 h-3" />
                                                <span>Máxima calidad</span>
                                                <span>•</span>
                                                <Check className="w-3 h-3" />
                                                <span>Sin procesamiento</span>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Seleccionar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {isMuchLarger && (
                        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-sm">
                            <p className="text-yellow-800 dark:text-yellow-200">
                                <strong>Nota:</strong> Tu imagen es considerablemente más grande que lo recomendado.
                                Te sugerimos recortar o redimensionar para obtener el mejor rendimiento.
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}