type Props = {
    children: React.ReactNode
}

function MainContainer({ children }: Props) {
    return (
        <main className='flex flex-col overflow-y-hidden overflow-x-hidden grow bg-background text-foreground @container'>
            {children}
        </main>
    )
}

export { MainContainer }