import Image from 'next/image'

import { CheckerboardBackground } from '@/features/global/components/background-remover'
import { CompareViewProps } from '@/features/global/types/media'
import { Label } from '@/features/shadcn/components/ui/label'
import { Slider } from '@/features/shadcn/components/ui/slider'

export function CompareView({ originalUrl, editor }: CompareViewProps) {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-center">Original</p>
                    <div className="relative h-64 rounded-lg overflow-hidden bg-muted border-2">
                        {originalUrl && (
                            <Image
                                src={originalUrl}
                                alt="Original"
                                className="w-full h-full object-contain"
                                fill
                            />
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium text-center">Sin Fondo</p>
                    <div className="relative h-64 rounded-lg overflow-hidden border-2 border-orange-500">
                        <CheckerboardBackground />
                        {editor.canvasInitialized && editor.compareCanvasRef.current ? (
                            <canvas
                                width={editor.compareCanvasRef.current.width}
                                height={editor.compareCanvasRef.current.height}
                                ref={(el) => {
                                    if (el && editor.compareCanvasRef.current) {
                                        const ctx = el.getContext('2d')
                                        const sourceCtx = editor.compareCanvasRef.current.getContext('2d')
                                        if (ctx && sourceCtx) {
                                            el.width = editor.compareCanvasRef.current.width
                                            el.height = editor.compareCanvasRef.current.height
                                            ctx.drawImage(editor.compareCanvasRef.current, 0, 0)
                                        }
                                    }
                                }}
                                className="relative w-full h-full object-contain"
                                style={{ opacity: editor.opacity / 100 }}
                            />
                        ) : (
                            editor.previewUrl && (
                                <Image
                                    src={editor.previewUrl}
                                    alt="Procesada"
                                    className="relative w-full h-full object-contain"
                                    style={{ opacity: editor.opacity / 100 }}
                                    fill
                                />
                            )
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Opacidad: {editor.opacity}%</Label>
                <Slider
                    value={[editor.opacity]}
                    onValueChange={([v]) => editor.setOpacity(v)}
                    min={0}
                    max={100}
                    step={1}
                />
            </div>
        </div>
    )
}