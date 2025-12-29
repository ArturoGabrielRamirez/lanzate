import { MediaType, RemoveMediaOptions, UPLOAD_TYPES } from "@/features/global/types/media"

export async function removeMedia(
  type: MediaType,
  options?: RemoveMediaOptions
): Promise<void> {
  const { showConfirm = true, onSuccess, onError, storeId, productId } = options || {}

  if (showConfirm) {
    const confirmed = await showRemoveConfirmation(type)
    if (!confirmed) return
  }

  try {
    const body: Record<string, unknown> = { type }

    if (storeId) body.storeId = storeId
    if (productId) body.productId = productId

    const response = await fetch('/api/upload/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    onSuccess?.()
  } catch (error) {
    console.error('Error removing media:', error)
    const err = error instanceof Error ? error : new Error(String(error))
    onError?.(err)
    throw err
  }
}

function showRemoveConfirmation(type: MediaType): Promise<boolean> {
  const messages = {
    [UPLOAD_TYPES.AVATAR]: '¿Eliminar tu avatar actual?',
    [UPLOAD_TYPES.BANNER]: '¿Eliminar tu banner actual?',
    [UPLOAD_TYPES.STORE_LOGO]: '¿Eliminar el logo de la tienda?',
    [UPLOAD_TYPES.STORE_BANNER]: '¿Eliminar el banner de la tienda?',
    [UPLOAD_TYPES.PRODUCT_IMAGE]: '¿Eliminar esta imagen del producto?',
    [UPLOAD_TYPES.PRODUCT_VIDEO]: '¿Eliminar este video del producto?',
  }

  return new Promise((resolve) => {
    const confirmed = window.confirm(messages[type as keyof typeof messages] || '¿Eliminar esta imagen?')
    resolve(confirmed)
  })
}