export function extractFilePathFromUrl(url: string, bucket: string): string | null {
  const urlParts = url.split('/')
  const bucketIndex = urlParts.findIndex(part => part === bucket)

  if (bucketIndex !== -1 && bucketIndex + 1 < urlParts.length) {
    return urlParts.slice(bucketIndex + 1).join('/')
  }

  return null
}