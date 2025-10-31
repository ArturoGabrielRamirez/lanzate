import { MainContainerProps } from "@/features/layout/types/types"

function MainContainer({ children }: MainContainerProps) {
    return (
        <main className='flex flex-col overflow-y-hidden overflow-x-hidden grow bg-background text-foreground @container'>
            {children}
        </main>
    )
}

export { MainContainer }