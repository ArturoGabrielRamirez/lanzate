import { ZoomIn, ZoomOut } from 'lucide-react'

import { EditorControlsProps } from '@/features/global/types/media'
import { Button } from '@/features/shadcn/components/ui/button'
import { Label } from '@/features/shadcn/components/ui/label'
import { Slider } from '@/features/shadcn/components/ui/slider'


export function EditorControls({
    brushSize,
    onBrushSizeChange,
    zoom,
    onZoomChange,
    disabled = false
}: EditorControlsProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Tamaño del Pincel: {brushSize}px</Label>
                <Slider
                    value={[brushSize]}
                    onValueChange={([v]) => onBrushSizeChange(v)}
                    min={5}
                    max={100}
                    step={5}
                    disabled={disabled}
                />
            </div>
            <div className="space-y-2">
                <Label>Zoom: {zoom}%</Label>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onZoomChange(Math.max(50, zoom - 10))}
                        disabled={disabled}
                    >
                        <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Slider
                        value={[zoom]}
                        onValueChange={([v]) => onZoomChange(v)}
                        min={50}
                        max={200}
                        step={10}
                        className="flex-1"
                        disabled={disabled}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onZoomChange(Math.min(200, zoom + 10))}
                        disabled={disabled}
                    >
                        <ZoomIn className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}