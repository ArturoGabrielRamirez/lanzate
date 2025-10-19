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

/**
 * Calcula la edad de la cuenta en días
 * @param createdAt - Fecha de creación como string ISO o Date
 * @returns Número de días desde la creación
 */
export function calculateAccountAge(createdAt: string | Date): number {
  const created = typeof createdAt === 'string' ? new Date(createdAt) : createdAt
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - created.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Obtiene el nombre de visualización del usuario
 * @param firstName - Nombre
 * @param lastName - Apellido
 * @param username - Nombre de usuario
 * @returns Nombre completo o username como fallback
 */
export function getDisplayName(
  firstName?: string | null,
  lastName?: string | null,
  username?: string
): string {
  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(' ')
  }
  return username || 'Usuario'
}