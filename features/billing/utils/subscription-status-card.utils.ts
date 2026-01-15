/**
 * Utility functions for SubscriptionStatusCard component
 *
 * Contains helper functions for formatting dates, mapping status to UI variants,
 * and translating status codes to user-friendly Spanish text.
 */

/**
 * Formats a date for Argentine locale display
 * 
 * @param date - Date to format or null
 * @returns Formatted date string in Spanish or 'No disponible'
 */
export function formatDateForArgentina(date: Date | null): string {
  if (!date) return 'No disponible';
  
  return new Intl.DateTimeFormat("es-AR", { 
    dateStyle: "long", 
    timeStyle: "short" 
  }).format(date);
}

/**
 * Maps subscription status to Badge variant
 * 
 * @param status - Subscription status string
 * @returns Badge variant for styling
 */
export function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'AUTHORIZED': return 'default';
    case 'PENDING': return 'secondary';
    case 'CANCELLED': return 'destructive';
    case 'PAUSED': return 'outline';
    default: return 'secondary';
  }
}

/**
 * Gets status display text in Spanish
 * 
 * @param status - Subscription status string
 * @returns User-friendly Spanish status text
 */
export function getStatusDisplayText(status: string): string {
  switch (status) {
    case 'AUTHORIZED': return 'Autorizada';
    case 'PENDING': return 'Pendiente';
    case 'CANCELLED': return 'Cancelada';
    case 'PAUSED': return 'Pausada';
    default: return status;
  }
}