export function formatServerResponse(message: string, error: any) {
    return {
        message,
        error,
        payload: null
    }
}