"use client"

import { useState, useEffect, useCallback } from 'react'
import { Sparkles } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ActionButtons, EditorView, InitialPreview, ProcessingView } from '@/features/shared/components/background-remover/components/index'
import {  useBackgroundRemover, useCanvasEditor } from '@/features/shared/components/background-remover/hooks/index'
import { BackgroundRemoverProps } from '../types'
import { createFileFromBlob, optimizeImage } from '../utils/canvas.utils'

export function BackgroundRemover({
    isOpen,
    onClose,
    imageFile,
    onProcessed
}: BackgroundRemoverProps) {
    const [originalUrl, setOriginalUrl] = useState<string | null>(null)
    const [isOptimizing, setIsOptimizing] = useState(false)

    const remover = useBackgroundRemover()
    const editor = useCanvasEditor({
        previewUrl: remover.previewUrl,
        processedBlob: remover.processedBlob,
        isOpen
    })

    useEffect(() => {
        if (imageFile && isOpen) {
            const url = URL.createObjectURL(imageFile)
            setOriginalUrl(url)
            return () => URL.revokeObjectURL(url)
        }
    }, [imageFile, isOpen])

    const handleRemoveBackground = async () => {
        if (!imageFile) return
        await remover.removeBackground(imageFile)
    }

    const handleConfirm = useCallback(async () => {
        if (!editor.canvasRef.current || !imageFile) return

        try {
            setIsOptimizing(true)
            const optimizedBlob = await optimizeImage(editor.canvasRef.current)
            const file = createFileFromBlob(optimizedBlob, imageFile.name)
            onProcessed(file)
            handleClose()
        } catch (err) {
            console.error('Error creating final image:', err)
        } finally {
            setIsOptimizing(false)
        }
    }, [imageFile, onProcessed, editor.canvasRef])

    const handleClose = useCallback(() => {
        if (originalUrl) URL.revokeObjectURL(originalUrl)
        setOriginalUrl(null)
        setIsOptimizing(false)
        remover.cleanup()
        editor.cleanup()
        onClose()
    }, [originalUrl, remover, editor, onClose])

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-orange-500" />
                        Remover Fondo con IA
                    </DialogTitle>
                    <DialogDescription>
                        Remueve automáticamente el fondo y edita los detalles manualmente
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {!remover.isProcessing && !remover.processedBlob && (
                        <InitialPreview originalUrl={originalUrl} />
                    )}

                    {remover.isProcessing && !remover.processedBlob && (
                        <ProcessingView progress={remover.progress} />
                    )}

                    {!remover.isProcessing && remover.processedBlob && (
                        <EditorView
                            originalUrl={originalUrl}
                            editor={editor}
                        />
                    )}

                    {remover.error && (
                        <Alert variant="destructive">
                            <AlertDescription>{remover.error}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter>
                    <ActionButtons
                        hasProcessedBlob={!!remover.processedBlob}
                        isProcessing={remover.isProcessing}
                        isOptimizing={isOptimizing}
                        canvasInitialized={editor.canvasInitialized}
                        imageFile={imageFile}
                        onClose={handleClose}
                        onRemoveBackground={handleRemoveBackground}
                        onConfirm={handleConfirm}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
