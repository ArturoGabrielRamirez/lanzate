export const formatErrorResponse = (baseMessage: string, error: any) => {
    const errorResponse = {
        message: baseMessage,
        payload: null,
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
