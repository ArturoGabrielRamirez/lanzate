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

type Action = () => Promise<{
    error: boolean
    message: string
    payload: any
}>

export const actionWrapper = async (action: Action) => {
    try {
        return await action()
    } catch (error) {
        return formatErrorResponse("Action Error", error)
    }
}
