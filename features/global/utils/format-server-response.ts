import { ServerError } from '@/features/global/types';

/**
 * Formats an error into a standardized server error response
 * 
 * @param message - A descriptive error message
 * @param errorDetails - The error object or details
 * @returns A ServerError response object
 */
export function formatServerResponse(
    message: string, 
    errorDetails: unknown
): ServerError {
    return {
        message,
        payload: null,
        hasError: true,
        errorDetails
    };
}