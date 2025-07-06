export const formatErrorResponse = (baseMessage: string, error: any, payload?: any) => {
    const errorResponse = {
        message: baseMessage,
        payload: payload || null,
        error: true
    }

    if (error instanceof Error) {
        return {
            ...errorResponse,
            message: errorResponse.message + " : " + error.message
        }
    }

    return errorResponse
}
