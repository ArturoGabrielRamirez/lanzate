import { normalizeUserId } from '@/features/profile/utils/normalize-user-id'

/**
 * Valida que un ID sea válido y lo normaliza
 * @param id - ID como string, number o undefined
 * @returns Número válido
 * @throws Error si el ID es inválido
 */
export function assertValidUserId(id: string | number | undefined | null): number {
  const normalized = normalizeUserId(id)
  if (!normalized) {
    throw new Error('ID de usuario inválido')
  }
  return normalized
}
