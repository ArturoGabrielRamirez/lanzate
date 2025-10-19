import { RefObject } from 'react'
import { EditorToolbar } from './editor-toolbar'
import { EditorControls } from './editor-controls'
import { CanvasEditor } from './canvas-editor'
import { EditViewProps } from '../types'

export function EditView({ editor }: EditViewProps) {
    return (
        <div className="space-y-4">
            <EditorToolbar
                editMode={editor.editMode}
                onEditModeChange={editor.setEditMode}
                canUndo={editor.historyIndex > 0}
                canRedo={editor.historyIndex < editor.historyStack.length - 1}
                onUndo={editor.undo}
                onRedo={editor.redo}
                onReset={editor.resetCanvas}
                disabled={!editor.canvasInitialized}
            />

            <EditorControls
                brushSize={editor.brushSize}
                onBrushSizeChange={editor.setBrushSize}
                zoom={editor.zoom}
                onZoomChange={editor.setZoom}
                disabled={!editor.canvasInitialized}
            />

            <CanvasEditor
                canvasRef={editor.canvasRef as RefObject<HTMLCanvasElement>}
                canvasInitialized={editor.canvasInitialized}
                zoom={editor.zoom}
                editMode={editor.editMode}
                isDrawing={editor.isDrawing}
                onDrawStart={editor.handleDrawStart}
                onDrawMove={editor.handleDrawMove}
                onDrawEnd={editor.handleDrawEnd}
            />
        </div>
    )
}