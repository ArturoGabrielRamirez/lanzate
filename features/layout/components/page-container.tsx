type PageContainerProps = {
    children: React.ReactNode
}
const PageContainer = ({ children }: PageContainerProps) => {
    return (
        <section className="p-2 flex flex-col pt-13 md:pt-24 relative pb-24 container mx-auto z-10 xs:px-0">
            {children}
        </section>
    )
}
export default PageContainer