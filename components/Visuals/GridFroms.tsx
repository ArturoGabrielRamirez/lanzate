
export default function GridForms({ children, className }: { children?: React.ReactNode, className?: string }) {

    return (
        <div className={`grid grid-rows-[1fr_1fr] grid-cols-[1fr] sm:grid-rows-[40px_1fr] sm:grid-cols-[1fr_1px_1fr] justify-center bg-white dark:bg-gray-800 sm:gap-x-20 sm:p-8 ${className}`}>
            {children}
        </div>
    )

}