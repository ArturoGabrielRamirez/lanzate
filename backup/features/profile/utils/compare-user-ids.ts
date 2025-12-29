import { normalizeUserId } from '@/features/profile/utils/normalize-user-id'

/**
 * Compara dos IDs de forma segura, normalizándolos primero
 * @param id1 - Primer ID
 * @param id2 - Segundo ID
 * @returns true si son iguales, false si no
 */
export function compareUserIds(
  id1: string | number | undefined | null,
  id2: string | number | undefined | null
): boolean {
  const normalized1 = normalizeUserId(id1)
  const normalized2 = normalizeUserId(id2)
  
  if (normalized1 === undefined || normalized2 === undefined) {
    return false
  }
  
  return normalized1 === normalized2
}
