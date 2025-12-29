export type ServerResponse<T> = {
    message: string;
    payload: T | null;
    hasError: boolean;
}

export type ServerError = ServerResponse<null> & {
    payload: null;
    hasError: true;
}

export type ServerSuccess<T> = ServerResponse<T> & {
    payload: T;
    hasError: false;
}


export type ActionFunction<T> = () => Promise<ServerResponse<T>>;