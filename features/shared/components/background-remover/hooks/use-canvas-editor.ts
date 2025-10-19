import { useState, useCallback, useRef, useEffect } from 'react'
import { EditMode, UseCanvasEditorProps, CanvasEditorReturn } from '../types'
import { toast } from 'sonner'

export function useCanvasEditor({
    previewUrl,
    processedBlob,
    isOpen
}: UseCanvasEditorProps): CanvasEditorReturn {
    const [editMode, setEditMode] = useState<EditMode>('none')
    const [brushSize, setBrushSize] = useState(20)
    const [opacity, setOpacity] = useState(100)
    const [zoom, setZoom] = useState(100)
    const [isDrawing, setIsDrawing] = useState(false)
    const [historyStack, setHistoryStack] = useState<ImageData[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [canvasInitialized, setCanvasInitialized] = useState(false)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const compareCanvasRef = useRef<HTMLCanvasElement>(null)

    // -------------------- CARGA DE IMAGEN EN CANVAS --------------------
    useEffect(() => {
        if (!previewUrl || !processedBlob || canvasInitialized) return

        const timer = setTimeout(() => {
            if (canvasRef.current && compareCanvasRef.current) {
                loadImageToCanvas()
            }
        }, 200)

        return () => clearTimeout(timer)
    }, [previewUrl, processedBlob, canvasInitialized])

    const loadImageToCanvas = () => {
        if (!previewUrl || !canvasRef.current || !compareCanvasRef.current) {
            toast.error('❌ Faltan elementos para cargar canvas')
            return
        }

        const img = new Image()
        img.crossOrigin = 'anonymous'

        img.onload = () => {
            try {
                const canvas = canvasRef.current
                const ctx = canvas?.getContext('2d', { willReadFrequently: true })

                if (!canvas || !ctx) {
                    toast.error('❌ No se pudo obtener contexto del canvas de edición')
                    return
                }

                canvas.width = img.width
                canvas.height = img.height
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0)

                const compareCanvas = compareCanvasRef.current
                const compareCtx = compareCanvas?.getContext('2d')

                if (!compareCanvas || !compareCtx) {
                    toast.error('❌ No se pudo obtener contexto del canvas de comparación')
                    return
                }

                compareCanvas.width = img.width
                compareCanvas.height = img.height
                compareCtx.clearRect(0, 0, compareCanvas.width, compareCanvas.height)
                compareCtx.drawImage(img, 0, 0)

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                setHistoryStack([imageData])
                setHistoryIndex(0)
                setCanvasInitialized(true)
            } catch (err) {
                console.error('❌ Error al dibujar en canvas:', err)
            }
        }

        img.src = previewUrl
    }

    // -------------------- DIBUJO --------------------
    const drawOnCanvas = useCallback((
        e: React.MouseEvent<HTMLCanvasElement>,
        hiddenCanvas: HTMLCanvasElement,
        visibleCanvas: HTMLCanvasElement
    ) => {
        if (editMode === 'none') return

        const hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true })
        const visibleCtx = visibleCanvas.getContext('2d', { willReadFrequently: true })
        if (!hiddenCtx || !visibleCtx) return

        const rect = visibleCanvas.getBoundingClientRect()
        const scaleX = hiddenCanvas.width / rect.width
        const scaleY = hiddenCanvas.height / rect.height
        const x = (e.clientX - rect.left) * scaleX
        const y = (e.clientY - rect.top) * scaleY

        if (editMode === 'erase') {
            hiddenCtx.globalCompositeOperation = 'destination-out'
            hiddenCtx.fillStyle = 'rgb(47, 43, 72)'
            hiddenCtx.beginPath()
            hiddenCtx.arc(x, y, brushSize, 0, Math.PI * 2)
            hiddenCtx.fill()

            visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height)
            visibleCtx.drawImage(hiddenCanvas, 0, 0)
        } else if (editMode === 'restore') {
            if (historyStack.length > 0) {
                const originalData = historyStack[0]
                const currentData = hiddenCtx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height)
                const radius = brushSize

                for (let dy = -radius; dy <= radius; dy++) {
                    for (let dx = -radius; dx <= radius; dx++) {
                        if (dx * dx + dy * dy <= radius * radius) {
                            const px = Math.floor(x + dx)
                            const py = Math.floor(y + dy)
                            if (px >= 0 && px < hiddenCanvas.width && py >= 0 && py < hiddenCanvas.height) {
                                const i = (py * hiddenCanvas.width + px) * 4
                                currentData.data[i] = originalData.data[i]
                                currentData.data[i + 1] = originalData.data[i + 1]
                                currentData.data[i + 2] = originalData.data[i + 2]
                                currentData.data[i + 3] = originalData.data[i + 3]
                            }
                        }
                    }
                }

                hiddenCtx.putImageData(currentData, 0, 0)
                visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height)
                visibleCtx.drawImage(hiddenCanvas, 0, 0)
            }
        }
    }, [editMode, brushSize, historyStack])

    // -------------------- HISTORIAL --------------------
    const saveToHistory = useCallback(() => {
        if (!canvasRef.current) return
        const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true })
        if (!ctx) return

        const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
        const newStack = historyStack.slice(0, historyIndex + 1)
        newStack.push(imageData)
        if (newStack.length > 20) newStack.shift()
        setHistoryStack(newStack)
        setHistoryIndex(newStack.length - 1)
    }, [historyStack, historyIndex])

    const undo = useCallback(() => {
        if (historyIndex <= 0 || !canvasRef.current) return
        const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true })
        if (!ctx) return
        const newIndex = historyIndex - 1
        ctx.putImageData(historyStack[newIndex], 0, 0)
        setHistoryIndex(newIndex)
    }, [historyIndex, historyStack])

    const redo = useCallback(() => {
        if (historyIndex >= historyStack.length - 1 || !canvasRef.current) return
        const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true })
        if (!ctx) return
        const newIndex = historyIndex + 1
        ctx.putImageData(historyStack[newIndex], 0, 0)
        setHistoryIndex(newIndex)
    }, [historyIndex, historyStack])

    const resetCanvas = useCallback(() => {
        if (historyStack.length === 0 || !canvasRef.current) return
        const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true })
        if (!ctx) return
        ctx.putImageData(historyStack[0], 0, 0)
        setHistoryStack([historyStack[0]])
        setHistoryIndex(0)
        setEditMode('none')
    }, [historyStack])

    // -------------------- EVENTOS DE DIBUJO --------------------
    const handleDrawStart = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true)
    }, [])

    const handleDrawMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !canvasRef.current || !compareCanvasRef.current) return
        drawOnCanvas(e, canvasRef.current, compareCanvasRef.current)
    }, [isDrawing, drawOnCanvas])

    const handleDrawEnd = useCallback(() => {
        if (isDrawing) {
            setIsDrawing(false)
            saveToHistory()
        }
    }, [isDrawing, saveToHistory])

    // -------------------- LIMPIEZA --------------------
    const cleanup = useCallback(() => {
        setEditMode('none')
        setCanvasInitialized(false)
        setHistoryStack([])
        setHistoryIndex(-1)
        setZoom(100)
        setBrushSize(20)
        setOpacity(100)
        setIsDrawing(false)
    }, [])

    // -------------------- RETURN FINAL --------------------
    return {
        editMode,
        setEditMode,
        brushSize,
        setBrushSize,
        opacity,
        setOpacity,
        zoom,
        setZoom,
        isDrawing,
        setIsDrawing,
        historyStack,
        historyIndex,
        canvasInitialized,
        canvasRef,
        compareCanvasRef,
        drawOnCanvas,
        saveToHistory,
        undo,
        redo,
        resetCanvas,
        cleanup,
        previewUrl,
        handleDrawStart,
        handleDrawMove,
        handleDrawEnd
    }
}
