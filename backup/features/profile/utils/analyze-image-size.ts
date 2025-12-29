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
