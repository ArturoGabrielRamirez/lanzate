export class DeletionHelpers {
  static getDaysRemaining(scheduledDate: Date | null): number {
    if (!scheduledDate) return 0;
    
    const now = new Date();
    const scheduled = new Date(scheduledDate);
    const diffTime = scheduled.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }

  static canCancelDeletion(scheduledDate: Date | null): boolean {
    return this.getDaysRemaining(scheduledDate) > 0;
  }

  static formatDeletionDate(date: Date | null): string {
    if (!date) return 'No programada';
    
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  static getUrgencyLevel(daysRemaining: number): 'low' | 'medium' | 'high' | 'critical' {
    if (daysRemaining <= 1) return 'critical';
    if (daysRemaining <= 7) return 'high';
    if (daysRemaining <= 14) return 'medium';
    return 'low';
  }

  static getUrgencyColor(urgencyLevel: ReturnType<typeof DeletionHelpers.getUrgencyLevel>): string {
    const colors = {
      low: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      medium: 'text-orange-600 bg-orange-50 border-orange-200',
      high: 'text-red-600 bg-red-50 border-red-200',
      critical: 'text-red-800 bg-red-100 border-red-300',
    };
    
    return colors[urgencyLevel];
  }
}