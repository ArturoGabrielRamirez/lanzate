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
