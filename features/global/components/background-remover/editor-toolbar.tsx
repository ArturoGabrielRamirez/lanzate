import { Eraser, Sparkles, Undo2, Redo2, RotateCcw } from 'lucide-react'

import { EditorToolbarProps } from '@/features/global/types/media'
import { Button } from '@/features/shadcn/components/ui/button'

export function EditorToolbar({
    editMode,
    onEditModeChange,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onReset,
    disabled = false
}: EditorToolbarProps) {
    return (
        <div className="flex flex-wrap gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onEditModeChange(editMode === 'erase' ? 'none' : 'erase')}
                className={editMode === 'erase' ? 'border-orange-500 bg-orange-50 text-orange-600 hover:bg-orange-100' : ''}
                disabled={disabled}
            >
                <Eraser className="w-4 h-4 mr-2" />
                Borrar Fondo
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onEditModeChange(editMode === 'restore' ? 'none' : 'restore')}
                className={editMode === 'restore' ? 'border-orange-500 bg-orange-50 text-orange-600 hover:bg-orange-100' : ''}
                disabled={disabled}
            >
                <Sparkles className="w-4 h-4 mr-2" />
                Restaurar
            </Button>

            <div className="h-6 w-px bg-border" />

            <Button
                variant="outline"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo || disabled}
            >
                <Undo2 className="w-4 h-4" />
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={onRedo}
                disabled={!canRedo || disabled}
            >
                <Redo2 className="w-4 h-4" />
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                disabled={disabled}
            >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
            </Button>
        </div>
    )
}