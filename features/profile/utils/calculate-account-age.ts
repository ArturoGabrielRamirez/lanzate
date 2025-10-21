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
