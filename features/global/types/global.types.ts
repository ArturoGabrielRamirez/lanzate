export interface WithClassName {
    className?: string
}

export interface WithChildren {
    children: React.ReactNode
}

export interface WithParams {
    params: Promise<{
        locale: string;
    }>
}

export interface RootLayoutType {
    children: React.ReactNode
    params: Promise<{
        locale: string;
    }>
}