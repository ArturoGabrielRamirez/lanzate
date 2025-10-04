export default class DeletionHelpers {
  /**
   * Redondea la fecha de eliminación programada a la próxima hora en punto
   * para sincronizar con el cron job que corre cada hora
   */
  static roundScheduledDateToNextHour(scheduledDate: Date): Date {
    const rounded = new Date(scheduledDate);
    
    // Si ya está en punto (minutos = 0), no cambiar nada
    if (rounded.getMinutes() === 0 && rounded.getSeconds() === 0) {
      return rounded;
    }
    
    // Redondear a la próxima hora en punto
    rounded.setHours(rounded.getHours() + 1);
    rounded.setMinutes(0);
    rounded.setSeconds(0);
    rounded.setMilliseconds(0);
    
    return rounded;
  }

  /**
   * Calcula los días restantes usando la fecha redondeada
   */
  static getDaysRemaining(scheduledDate: Date | null): number {
    if (!scheduledDate) return 0;
    
    const now = new Date();
    const roundedScheduled = this.roundScheduledDateToNextHour(new Date(scheduledDate));
    const diffTime = roundedScheduled.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }

  /**
   * Calcula los minutos exactos restantes para el countdown
   */
  static getTimeRemaining(scheduledDate: Date | null): number | null {
    if (!scheduledDate) return null;
    
    const now = new Date();
    const roundedScheduled = this.roundScheduledDateToNextHour(new Date(scheduledDate));
    const diffTime = roundedScheduled.getTime() - now.getTime();
    
    return Math.max(0, diffTime);
  }

  /**
   * Obtiene la fecha de eliminación redondeada para mostrar al usuario
   */
  static getDisplayScheduledDate(scheduledDate: Date | null): Date | null {
    if (!scheduledDate) return null;
    return this.roundScheduledDateToNextHour(new Date(scheduledDate));
  }

  static canCancelDeletion(scheduledDate: Date | null): boolean {
    return this.getDaysRemaining(scheduledDate) > 0;
  }

  static formatDeletionDate(date: Date | null): string {
    if (!date) return 'No programada';
    
    // Usar la fecha redondeada para el display
    const displayDate = this.getDisplayScheduledDate(date);
    if (!displayDate) return 'No programada';
    
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(displayDate);
  }

  static getUrgencyLevel(daysRemaining: number): 'low' | 'medium' | 'high' | 'critical' {
    if (daysRemaining <= 1) return 'critical';
    if (daysRemaining <= 7) return 'high';
    if (daysRemaining <= 14) return 'medium';
    return 'low';
  }

  // ✅ NUEVA VERSION: Retorna objeto estructurado
  static getUrgencyColors(urgencyLevel: ReturnType<typeof DeletionHelpers.getUrgencyLevel>): {
    bg: string;
    text: string;
    border: string;
  } {
    const colorMap = {
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
    };
    
    return colorMap[urgencyLevel];
  }

  // ✅ MANTENER compatibilidad con código existente
  static getUrgencyColor(urgencyLevel: ReturnType<typeof DeletionHelpers.getUrgencyLevel>): string {
    const colors = this.getUrgencyColors(urgencyLevel);
    return `${colors.text} ${colors.bg} ${colors.border}`;
  }

  // ✅ NUEVO: Helper para convertir minutos a días (para ActionCountdown)
  static getUrgencyLevelFromMinutes(totalMinutes: number): 'low' | 'medium' | 'high' | 'critical' {
    const daysRemaining = Math.ceil(totalMinutes / (24 * 60));
    return this.getUrgencyLevel(daysRemaining);
  }
}