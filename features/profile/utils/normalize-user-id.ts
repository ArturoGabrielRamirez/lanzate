/**
 * Normaliza un ID a número de forma segura
 * @param id - ID como string, number o undefined
 * @returns Número o undefined si el input es inválido
 */
export function normalizeUserId(id: string | number | undefined | null): number | undefined {
  if (id === undefined || id === null) return undefined
  
  if (typeof id === 'number') {
    return isNaN(id) ? undefined : id
  }
  
  if (typeof id === 'string') {
    const parsed = parseInt(id, 10)
    return isNaN(parsed) ? undefined : parsed
  }
  
  return undefined
}
