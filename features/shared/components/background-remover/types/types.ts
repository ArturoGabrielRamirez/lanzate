import { Dispatch, RefObject, SetStateAction } from "react"

export type EditMode = 'none' | 'erase' | 'restore'

export interface CanvasEditorState {
    editMode: EditMode
    brushSize: number
    opacity: number
    zoom: number
    isDrawing: boolean
    historyStack: ImageData[]
    historyIndex: number
    canvasInitialized: boolean
    canvasRef: RefObject<HTMLCanvasElement>
    compareCanvasRef: RefObject<HTMLCanvasElement>

}

export interface BackgroundRemoverProps {
    isOpen: boolean
    onClose: () => void
    imageFile: File | null
    onProcessed: (file: File) => void
}

export interface UseCanvasEditorProps {
    previewUrl: string | null
    processedBlob: Blob | null
    isOpen: boolean
}

export interface InitialPreviewProps {
    originalUrl: string | null
}

export interface ProcessingViewProps {
    progress: number
}

export interface EditorViewProps {
    originalUrl: string | null
    editor: CanvasEditorReturn
}

export interface ActionButtonsProps {
    hasProcessedBlob: boolean
    isProcessing: boolean
    isOptimizing: boolean
    canvasInitialized: boolean
    imageFile: File | null
    onClose: () => void
    onRemoveBackground: () => void
    onConfirm: () => void
}

export interface CanvasEditorReturn {
    editMode: EditMode
    setEditMode: Dispatch<SetStateAction<EditMode>>
    brushSize: number
    setBrushSize: Dispatch<SetStateAction<number>>
    opacity: number
    setOpacity: Dispatch<SetStateAction<number>>
    zoom: number
    setZoom: Dispatch<SetStateAction<number>>
    isDrawing: boolean
    setIsDrawing: Dispatch<SetStateAction<boolean>>
    historyIndex: number
    historyStack: ImageData[]
    canvasInitialized: boolean
    canvasRef: RefObject<HTMLCanvasElement | null>
    compareCanvasRef: RefObject<HTMLCanvasElement | null>
    drawOnCanvas: (
        e: React.MouseEvent<HTMLCanvasElement>,
        hiddenCanvas: HTMLCanvasElement,
        visibleCanvas: HTMLCanvasElement
    ) => void
    saveToHistory: () => void
    undo: () => void
    redo: () => void
    resetCanvas: () => void
    cleanup: () => void
    previewUrl: string | null
    handleDrawStart: (e: React.MouseEvent<HTMLCanvasElement>) => void
    handleDrawMove: (e: React.MouseEvent<HTMLCanvasElement>) => void
    handleDrawEnd: () => void
}

export interface CanvasEditorProps {
    canvasRef: React.RefObject<HTMLCanvasElement>
    canvasInitialized: boolean
    zoom: number
    editMode: EditMode
    isDrawing: boolean
    onDrawStart: (e: React.MouseEvent<HTMLCanvasElement>) => void
    onDrawMove: (e: React.MouseEvent<HTMLCanvasElement>) => void
    onDrawEnd: () => void
}

export interface CompareViewProps {
    originalUrl: string | null
    editor: CanvasEditorReturn
}

export interface EditViewProps {
    editor: CanvasEditorReturn
}

export interface EditorControlsProps {
    brushSize: number
    onBrushSizeChange: (size: number) => void
    zoom: number
    onZoomChange: (zoom: number) => void
    disabled?: boolean
}

export interface EditorToolbarProps {
    editMode: EditMode
    onEditModeChange: (mode: EditMode) => void
    canUndo: boolean
    canRedo: boolean
    onUndo: () => void
    onRedo: () => void
    onReset: () => void
    disabled?: boolean
}

export interface UseBackgroundRemoverProps {
    onProcessed?: (processedFile: File) => void
}
