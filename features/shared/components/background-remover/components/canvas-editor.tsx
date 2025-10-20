import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/features/shadcn/components/ui/alert'
import { CanvasEditorProps } from '../types'

export function CanvasEditor({
    canvasRef,
    canvasInitialized,
    zoom,
    editMode,
    isDrawing,
    onDrawStart,
    onDrawMove,
    onDrawEnd
}: CanvasEditorProps) {
    return (
        <>
            <div className="relative h-96 rounded-lg overflow-hidden border-2 flex items-center justify-center">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                />
                {canvasInitialized && canvasRef.current ? (
                    <canvas
                        width={canvasRef.current.width}
                        height={canvasRef.current.height}
                        ref={(el) => {
                            if (el && canvasRef.current && editMode === 'none') {
                                const ctx = el.getContext('2d')
                                const sourceCtx = canvasRef.current.getContext('2d')
                                if (ctx && sourceCtx) {
                                    el.width = canvasRef.current.width
                                    el.height = canvasRef.current.height
                                    ctx.drawImage(canvasRef.current, 0, 0)
                                }
                            }
                        }}
                        className="relative cursor-crosshair max-w-full max-h-full"
                        style={{
                            transform: `scale(${zoom / 100})`,
                            imageRendering: 'crisp-edges'
                        }}
                        onMouseDown={onDrawStart}
                        onMouseMove={onDrawMove}
                        onMouseUp={onDrawEnd}
                        onMouseLeave={onDrawEnd}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-2">
                            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
                            <p className="text-sm text-muted-foreground">Cargando editor...</p>
                        </div>
                    </div>
                )}
            </div>

            {editMode !== 'none' && canvasInitialized && (
                <Alert>
                    <AlertDescription className="text-sm">
                        {editMode === 'erase'
                            ? '✏️ Haz clic y arrastra para eliminar áreas del fondo'
                            : '✏️ Haz clic y arrastra para restaurar áreas eliminadas'
                        }
                    </AlertDescription>
                </Alert>
            )}
        </>
    )
}