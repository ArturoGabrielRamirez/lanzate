export type ResponseType<T> = {
    error: boolean
    message: string
    payload: T
}
