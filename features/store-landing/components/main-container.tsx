type Props = {
    children: React.ReactNode
}

const MainContainer = ({ children }: Props) => {
    return (
        <main className='flex flex-col overflow-y-hidden overflow-x-hidden grow bg-background text-foreground @container pt-[var(--section-padding-top)]'>
            {children}
        </main>
    )
}

export default MainContainer