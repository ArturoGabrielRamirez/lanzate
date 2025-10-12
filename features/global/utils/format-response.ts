import { ServerError, ServerResponse, ServerSuccess } from "@/features/global/types";

export function formatResponse<T>(message: string, payload: T, error: boolean): ServerResponse<T> {
    return {
        message,
        payload,
        hasError: error
    }
}

export function formatErrorResponse(message: string): ServerError {
    return formatResponse(message, null, true) as ServerError;
}

export function formatSuccessResponse<T>(message: string, payload: T): ServerSuccess<T> {
    return formatResponse(message, payload, false) as ServerSuccess<T>;
}