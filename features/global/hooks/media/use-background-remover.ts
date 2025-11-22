import { useState, useCallback, useRef } from 'react'

export function useBackgroundRemover() {
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [processedBlob, setProcessedBlob] = useState<Blob | null>(null)
    // Usamos useRef para el timer de la animación
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null) 

    const removeBackground = useCallback(async (imageFile: File) => {
        setIsProcessing(true)
        setError(null)
        setProgress(0)

        // Limpieza de cualquier timer activo al inicio
        if (progressIntervalRef.current) {
            clearTimeout(progressIntervalRef.current)
            progressIntervalRef.current = null
        }

        try {
            // 1. GESTIONAR LA ANIMACIÓN SIMULADA (0% a 90%)
            await new Promise<void>(resolve => {
                let currentProgress = 0
                
                const animateProgress = () => {
                    // Si llegamos a 90%, detenemos la animación y continuamos
                    if (currentProgress >= 90) {
                        setProgress(90); 
                        if (progressIntervalRef.current) {
                            clearTimeout(progressIntervalRef.current);
                            progressIntervalRef.current = null;
                        }
                        resolve(); // 🚀 Resuelve la Promesa para pasar al paso 2
                        return;
                    }
                    
                    // Avanzamos 1% y lo programamos para 100ms
                    currentProgress += 1;
                    setProgress(currentProgress);
                    progressIntervalRef.current = setTimeout(animateProgress, 100);
                }

                animateProgress();
            });

            // 2. FORZAR LA PINTURA DE LA UI (Evita que el spinner se congele)
            // Un setTimeout de 0ms empuja la ejecución a la cola de eventos, 
            // permitiendo que el navegador renderice el 90% y el spinner animado.
            await new Promise(resolve => setTimeout(resolve, 0)); 
            
            // 3. INICIAR EL PROCESO PESADO
            const { removeBackground: removeBackgroundFn } = await import('@imgly/background-removal')
            
            // Este proceso puede bloquear el hilo, pero la UI ya está pintada.
            const blob = await removeBackgroundFn(imageFile) 

            
            // 4. FINALIZACIÓN Y TRANSICIÓN
            
            setProgress(100); // Muestra el 100%
            // Espera 300ms para que el usuario vea el 100% antes de cerrar la ventana
            await new Promise(resolve => setTimeout(resolve, 300)); 

            const url = URL.createObjectURL(blob)
            setPreviewUrl(url)
            setProcessedBlob(blob)

            return { url, blob }
        } catch (err) {
            console.error('❌ Error removing background:', err)
            
            // Asegurarse de limpiar el timer si ocurre un error
            if (progressIntervalRef.current) {
                clearTimeout(progressIntervalRef.current)
                progressIntervalRef.current = null
            }

            const errorMessage = err instanceof Error
                ? err.message
                : 'Error al procesar la imagen. Por favor, intentá de nuevo.'
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            // Oculta el loader (el diálogo de "Procesando")
            setIsProcessing(false)
        }
    }, [])

    // ------------------------------------------------------------------------------------------------

    const cleanup = useCallback(() => {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
            progressIntervalRef.current = null
        }

        setPreviewUrl(null)
        setProcessedBlob(null)
        setProgress(0)
        setError(null)
    }, [previewUrl])

    // ------------------------------------------------------------------------------------------------

    return {
        isProcessing,
        progress,
        error,
        previewUrl,
        processedBlob,
        removeBackground,
        cleanup
    }
}