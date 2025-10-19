export function formatFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(1)} MB`
}

export function getRecommendedSize(
  type: 'avatar' | 'banner',
  maxWidth: number = 1920,
  maxHeight: number = 1080
) {
  if (type === 'avatar') {
    return { width: 400, height: 400 }
  }
  return { width: Math.min(maxWidth, 1200), height: Math.min(maxHeight, 400) }
}

export function analyzeImageSize(
  imageInfo: { width: number; height: number; size: number },
  recommendedSize: { width: number; height: number }
) {
  const isLargeFile = imageInfo.size > 2 * 1024 * 1024 // > 2MB
  const isMuchLarger =
    imageInfo.width > recommendedSize.width * 2 ||
    imageInfo.height > recommendedSize.height * 2

  return { isLargeFile, isMuchLarger }
}