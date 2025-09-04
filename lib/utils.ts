import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const protocol =
  process.env.NODE_ENV === 'production' ? 'https' : 'http';
export const rootDomain =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "lanzate.app";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely formats a date that can be either a Date object or ISO string
 * Handles the case where realtime updates might change the format
 */
export function formatDate(date: Date | string): string {
  try {
    // Si es un string, convertirlo a Date
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Verificar que la fecha sea válida
    if (isNaN(dateObj.getTime())) {
      return "Invalid date"
    }
    
    return new Intl.DateTimeFormat("en-US", { 
      dateStyle: "medium", 
      timeStyle: "short" 
    }).format(dateObj)
  } catch (error) {
    console.error('Error formatting date:', error)
    return "Invalid date"
  }
}
