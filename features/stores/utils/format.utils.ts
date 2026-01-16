/**
 * Store Format Utilities
 *
 * Shared formatting functions for store-related components.
 */

/**
 * Format date to localized string (Argentina)
 *
 * @param date - Date to format
 * @param format - 'short' for numeric month (01/15/2026), 'long' for text month (15 de enero de 2026)
 */
export function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
  const options: Intl.DateTimeFormatOptions =
    format === 'long'
      ? { day: '2-digit', month: 'long', year: 'numeric' }
      : { day: '2-digit', month: '2-digit', year: 'numeric' };

  return new Intl.DateTimeFormat('es-AR', options).format(new Date(date));
}

/**
 * Truncate text to specified length with ellipsis
 *
 * @param text - Text to truncate (null returns default message)
 * @param maxLength - Maximum length before truncation
 * @param defaultText - Text to show if input is null/empty
 */
export function truncateText(
  text: string | null,
  maxLength: number,
  defaultText: string = 'Sin descripción'
): string {
  if (!text) return defaultText;
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
