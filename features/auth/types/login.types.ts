export interface LoginPageProps {
    searchParams: Promise<{
        error?: string
        message?: string
        subdomain?: string
        next?: string
    }>
}