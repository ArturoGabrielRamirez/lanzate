export type Props = {
    children: React.ReactNode
    params: Promise<{ slug: string }>
}