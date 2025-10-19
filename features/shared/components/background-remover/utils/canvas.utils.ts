export async function optimizeImage(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const maxDimension = 2048
        let width = canvas.width
        let height = canvas.height

        if (width > maxDimension || height > maxDimension) {
            const tempCanvas = document.createElement('canvas')
            const tempCtx = tempCanvas.getContext('2d')!

            if (width > height) {
                height = (height / width) * maxDimension
                width = maxDimension
            } else {
                width = (width / height) * maxDimension
                height = maxDimension
            }

            tempCanvas.width = width
            tempCanvas.height = height
            tempCtx.drawImage(canvas, 0, 0, width, height)

            tempCanvas.toBlob(
                (blob) => {
                    if (blob && blob.size > 2 * 1024 * 1024) {
                        tempCanvas.toBlob(
                            (jpegBlob) => resolve(jpegBlob || blob),
                            'image/jpeg',
                            0.85
                        )
                    } else {
                        resolve(blob || new Blob())
                    }
                },
                'image/png',
                0.92
            )
        } else {
            canvas.toBlob(
                (blob) => {
                    if (blob && blob.size > 2 * 1024 * 1024) {
                        canvas.toBlob(
                            (jpegBlob) => resolve(jpegBlob || blob),
                            'image/jpeg',
                            0.85
                        )
                    } else {
                        resolve(blob || new Blob())
                    }
                },
                'image/png',
                0.92
            )
        }
    })
}

export function createFileFromBlob(blob: Blob, originalFileName: string): File {
    const extension = blob.type === 'image/jpeg' ? '.jpg' : '.png'
    const fileName = originalFileName.replace(/\.[^/.]+$/, extension)
    return new File([blob], fileName, { type: blob.type })
}