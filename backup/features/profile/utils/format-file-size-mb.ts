//TODO : Esta funcion cambio el nombre de formatFileSize a formatFileSizeMB, habria que revisar en donde se llamaba y actualizar
export function formatFileSizeMB(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(1)} MB`
}
