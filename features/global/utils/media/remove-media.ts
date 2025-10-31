import { MediaType } from "@/features/global/types/media"

export async function removeMedia(
  type: MediaType,
  options?: {
    onSuccess?: () => void
    onError?: (error: Error) => void
    showConfirm?: boolean
  }
): Promise<void> {
  try {

    const response = await fetch('/api/upload/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    })


    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Error data:', errorData)
      throw new Error(
        errorData.error || `Error ${response.status}: ${response.statusText}`
      )
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    options?.onSuccess?.()
  } catch (error) {
    console.error('💥 Error in removeMedia:', error)
    const err = error instanceof Error ? error : new Error(String(error))
    options?.onError?.(err)
    throw err
  }
}