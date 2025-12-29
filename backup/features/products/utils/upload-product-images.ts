export async function uploadProductImages(
  files: File[],
  productId: number,
  primaryIndex: number = 0
): Promise<string[]> {
  if (!files || files.length === 0) {
    return []
  }

  const uploadPromises = files.map(async (file, index) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'product-image')
    formData.append('productId', productId.toString())
    formData.append('isPrimary', (index === primaryIndex).toString())
    formData.append('sortOrder', index.toString())

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Error al subir ${file.name}`)
    }

    const data = await response.json()
    return data.url
  })

  return await Promise.all(uploadPromises)
}