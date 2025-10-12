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

export const formatSuccessResponse = (baseMessage: string, payload?: any) => {
    return {
        message: baseMessage,
        payload: payload || null,
        error: false
    }
}

type Action<T> = () => Promise<{
    error: boolean
    message: string
    payload: T
}>

export const actionWrapper = async <T>(action: Action<T>) => {
    try {
        return await action() as {
            error: boolean
            message: string
            payload: T
        }
    } catch (error) {
        return formatErrorResponse("Action Error", error)
    }
}
