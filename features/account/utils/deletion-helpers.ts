/**
 * Redondea la fecha de eliminación programada a la próxima hora en punto
 * para sincronizar con el cron job que corre cada hora
 */
export function roundScheduledDateToNextHour(scheduledDate: Date): Date {
  const rounded = new Date(scheduledDate)

  // Si ya está en punto (minutos = 0), no cambiar nada
  if (rounded.getMinutes() === 0 && rounded.getSeconds() === 0) {
    return rounded
  }

  // Redondear a la próxima hora en punto
  rounded.setHours(rounded.getHours() + 1)
  rounded.setMinutes(0)
  rounded.setSeconds(0)
  rounded.setMilliseconds(0)

  return rounded
}

/**
 * Calcula los días restantes usando la fecha redondeada
 */
export function getDaysRemaining(scheduledDate: Date | null): number {
  if (!scheduledDate) return 0

  const now = new Date()
  const roundedScheduled = roundScheduledDateToNextHour(new Date(scheduledDate))
  const diffTime = roundedScheduled.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

/**
 * Calcula los minutos exactos restantes para el countdown
 */
export function getTimeRemaining(scheduledDate: Date | null): number | null {
  if (!scheduledDate) return null

  const now = new Date()
  const roundedScheduled = roundScheduledDateToNextHour(new Date(scheduledDate))
  const diffTime = roundedScheduled.getTime() - now.getTime()

  return Math.max(0, diffTime)
}

/**
 * Obtiene la fecha de eliminación redondeada para mostrar al usuario
 */
export function getDisplayScheduledDate(scheduledDate: Date | null): Date | null {
  if (!scheduledDate) return null
  return roundScheduledDateToNextHour(new Date(scheduledDate))
}

/**
 * Verifica si se puede cancelar la eliminación
 */
export function canCancelDeletion(scheduledDate: Date | null): boolean {
  return getDaysRemaining(scheduledDate) > 0
}

/**
 * Formatea la fecha de eliminación para mostrar al usuario
 */
export function formatDeletionDate(date: Date | null): string {
  if (!date) return 'No programada'

  // Usar la fecha redondeada para el display
  const displayDate = getDisplayScheduledDate(date)
  if (!displayDate) return 'No programada'

  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(displayDate)
}

/**
 * Tipo para los niveles de urgencia
 */
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical'

/**
 * Determina el nivel de urgencia basado en días restantes
 */
export function getUrgencyLevel(daysRemaining: number): UrgencyLevel {
  if (daysRemaining <= 1) return 'critical'
  if (daysRemaining <= 7) return 'high'
  if (daysRemaining <= 14) return 'medium'
  return 'low'
}

/**
 * Tipo para los colores de urgencia
 */
export interface UrgencyColors {
  bg: string
  text: string
  border: string
}

/**
 * Obtiene los colores asociados a un nivel de urgencia
 */
export function getUrgencyColors(urgencyLevel: UrgencyLevel): UrgencyColors {
  const colorMap: Record<UrgencyLevel, UrgencyColors> = {
    low: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      border: 'border-yellow-200',
    },
    medium: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      border: 'border-orange-200',
    },
    high: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200',
    },
    critical: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
    },
  }

  return colorMap[urgencyLevel]
}

/**
 * Obtiene una clase CSS combinada de colores de urgencia
 * @deprecated Usar getUrgencyColors() para mayor flexibilidad
 */
export function getUrgencyColor(urgencyLevel: UrgencyLevel): string {
  const colors = getUrgencyColors(urgencyLevel)
  return `${colors.text} ${colors.bg} ${colors.border}`
}

/**
 * Determina el nivel de urgencia basado en minutos restantes
 * Útil para countdowns y alertas de tiempo
 */
export function getUrgencyLevelFromMinutes(totalMinutes: number): UrgencyLevel {
  const daysRemaining = Math.ceil(totalMinutes / (24 * 60))
  return getUrgencyLevel(daysRemaining)
}

// Export default para mantener compatibilidad con código existente
const DeletionHelpers = {
  roundScheduledDateToNextHour,
  getDaysRemaining,
  getTimeRemaining,
  getDisplayScheduledDate,
  canCancelDeletion,
  formatDeletionDate,
  getUrgencyLevel,
  getUrgencyColors,
  getUrgencyColor,
  getUrgencyLevelFromMinutes,
}

export default DeletionHelpers